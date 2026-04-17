# API Routes

All routes are Next.js Route Handlers in `app/api/`. They run as Vercel serverless functions. Every route:
1. Verifies the Supabase session (`supabase.auth.getUser()`) — returns 401 if not authenticated
2. Loads per-user settings from Prisma
3. Decrypts credentials as needed
4. Calls Kayako or Anthropic
5. Returns JSON

There is no persistent state between invocations. KayakoClient authenticates fresh on every request.

---

## `POST /api/settings`

Save or update Kayako and Anthropic credentials for the signed-in user.

**Request body:**
```json
{
  "kayako_url":      "https://central-supportdesk.kayako.com",
  "kayako_email":    "user@example.com",
  "kayako_password": "api-password-here",   // optional — omit to keep existing
  "anthropic_key":   "sk-ant-..."           // optional — omit to keep existing
}
```

**Behaviour:**
- `kayakoUrl` and `kayakoEmail` are always updated (even to empty string)
- `kayakoPassword` and `anthropicKey` are only updated if a non-empty value is provided. This allows updating the URL without having to re-enter the password.
- Values are AES-256-GCM encrypted before storage
- Uses Prisma `upsert` — creates the `UserSettings` row on first save

**Response (success):** `{ "ok": true }`

---

## `GET /api/settings`

Return the non-sensitive settings for the signed-in user (used by the Settings page to pre-fill the form).

**Response:**
```json
{
  "kayakoUrl":   "https://central-supportdesk.kayako.com",
  "kayakoEmail": "user@example.com"
}
```

Encrypted fields (`kayakoPasswordEnc`, `anthropicKeyEnc`) are never returned to the client.

---

## `POST /api/ticket`

Fetch a Kayako ticket, all its posts, and resolve author names.

**Request body:**
```json
{
  "ticketInput": "https://central-supportdesk.kayako.com/agent/conversations/12345"
  // or just "12345"
}
```

**Steps:**
1. `extractCaseId(ticketInput)` — parse URL or plain ID
2. Decrypt `kayakoPasswordEnc`
3. `KayakoClient.authenticate(email, password)`
4. `client.getCase(caseId)` — runs 4 parallel Kayako calls:
   - `GET /api/v1/cases/{id}?include=user,team` — case object + requester + team
   - `GET /api/v1/cases/statuses` — status label lookup
   - `GET /api/v1/cases/priorities` — priority label lookup
   - `GET /api/v1/cases/fields` — custom field definitions
   - Then N more calls per SELECT custom field to resolve option labels via `?include=field_option,locale_field`
5. `client.getAllPosts(caseId)` — paginated, 15s timeout per page, max 500 posts
6. `client.resolveUsers(posts, [requester, agent])` — fill in creator names

**Response (success):**
```json
{
  "caseData": { ...KayakoCase },
  "posts":    [ ...KayakoPost[] ],   // with creator.full_name populated
  "warning":  "",                    // non-empty if posts were cut short
  "caseId":   12345
}
```

**Error responses:**
- `400` — invalid ticket input, or Kayako credentials not configured
- `500` — decryption failure
- `502` — Kayako authentication or fetch failure

---

## `POST /api/analysis`

Run AI analysis on a ticket, or return a cached result.

**Request body:**
```json
{
  "caseId":       12345,
  "caseData":     { ...KayakoCase },
  "posts":        [ ...KayakoPost[] ],
  "forceRefresh": false
}
```

`caseData` and `posts` are passed from the browser (already fetched by `/api/ticket`) — this avoids re-authenticating with Kayako.

**Steps:**
1. Check `ticket_analyses` cache (`userId + ticketId + kayakoUrl`) unless `forceRefresh=true`
2. If cache hit → return immediately with `fromCache: true`
3. Decrypt `anthropicKeyEnc`
4. `detectModel(caseData, posts)` — pick Haiku or Sonnet
5. `analyseTicket(caseData, posts, apiKey)` — call Anthropic, parse response
6. `prisma.ticketAnalysis.upsert(...)` — save result to cache

**Response (success):**
```json
{
  "sections": {
    "executive_summary": "...",
    "one_line": "...",
    "case_summary": "...",
    "customer_sentiment": "...",
    "what_needed": "...",
    "next_steps": "..."
  },
  "day_summaries": { "2024-01-15": "...", ... },
  "model_used":  "claude-haiku-4-5-20251001",
  "post_count":  23,
  "fromCache":   false
}
```

**Error responses:**
- `400` — Anthropic API key not configured
- `500` — decryption failure
- `502` — Anthropic API error

---

## `POST /api/note`

Post an internal note to a Kayako ticket.

**Request body:**
```json
{
  "caseId":   12345,
  "noteText": "Plain text note content.\n\nCan include blank lines."
}
```

`noteText` is plain text. The route calls `textToHtml()` before sending to Kayako (double newlines → `<p>` paragraphs, single newlines → `<br>`).

**Steps:**
1. Validate `noteText` is non-empty
2. Decrypt `kayakoPasswordEnc`
3. `KayakoClient.authenticate(email, password)`
4. `client.addNote(caseId, html)` — `POST /api/v1/cases/{id}/reply` with `channel: "NOTE"`

**Response (success):** `{ "ok": true }`

After a successful note post, the `TicketAnalyser` component reloads the ticket (to pick up the new post in the thread) and clears the cached analysis from UI state (the next AI run will start fresh).

**Error responses:**
- `400` — empty note text, or Kayako credentials not configured
- `500` — decryption failure
- `502` — Kayako authentication or post failure
