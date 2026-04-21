# API Routes

All routes are Next.js Route Handlers in `app/api/`. They run as Vercel serverless functions. Every route:
1. Verifies the Supabase session (`supabase.auth.getUser()`) — returns 401 if not authenticated
2. Loads per-user settings from Prisma
3. Decrypts credentials as needed
4. Calls Kayako or Anthropic (or reads from DB)
5. Returns JSON

There is no persistent state between invocations. KayakoClient authenticates fresh on every live request.

---

## `GET /api/credentials`

Returns boolean flags indicating whether the current user has credentials configured. Used by `CredentialsBanner` to show a warning when Kayako or Anthropic credentials are missing.

**Response:**
```json
{ "hasKayako": true, "hasAnthropic": false }
```

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
- `kayakoUrl` and `kayakoEmail` are always updated
- `kayakoPassword` and `anthropicKey` are only updated if a non-empty value is provided
- Values are AES-256-GCM encrypted before storage
- Uses Prisma `upsert` — creates the `UserSettings` row on first save

**Response (success):** `{ "ok": true }`

---

## `GET /api/settings`

Return the non-sensitive settings for the signed-in user (used by the Settings page to pre-fill the form).

**Response:**
```json
{ "kayakoUrl": "https://...", "kayakoEmail": "user@example.com" }
```

Encrypted fields are never returned to the client.

---

## `POST /api/ticket`

Fetch a Kayako ticket and its posts. **DB-first**: returns cached data if available, otherwise fetches from Kayako and persists.

`maxDuration = 60` seconds.

**Request body:**
```json
{
  "ticketInput":  "https://central-supportdesk.kayako.com/agent/conversations/12345",
  "forceRefresh": false
}
```

`ticketInput` may be a full URL or a plain numeric ID.

**Steps:**
1. `extractCaseId(ticketInput)` — parse URL or plain ID
2. **DB-first check**: if `forceRefresh=false`, look up `tickets` by `(kayakoTicketId, kayakoUrl)` with `postsStatus='done'` — if found, return immediately with `fromCache: true`
3. Decrypt `kayakoPasswordEnc`
4. `KayakoClient.authenticate(email, password)`
5. `fetchAndPersistTicket(caseId, client, kayakoUrl)` — runs `getCase` + `getAllPosts` + `resolveUsers` in parallel, upserts ticket and posts to DB, returns DB-fresh data

**Response (success):**
```json
{
  "ticket":       { ...TicketRow },
  "posts":        [ ...UnifiedPost[] ],
  "fromCache":    false,
  "lastSyncedAt": "2024-01-16T10:30:00.000Z",
  "warning":      ""
}
```

`warning` is non-empty if posts were cut short (e.g. timeout, max 500 posts limit).

**Error responses:**
- `400` — invalid ticket input, or Kayako credentials not configured
- `500` — decryption failure
- `502` — Kayako authentication or fetch failure

---

## `POST /api/analysis`

Run AI analysis on a ticket, or return a cached result. **Reads ticket and posts from DB** — the ticket must have been fetched first via `/api/ticket`.

`maxDuration = 120` seconds.

**Request body:**
```json
{
  "caseId":       12345,
  "kayakoUrl":    "https://central-supportdesk.kayako.com",
  "forceRefresh": false
}
```

`kayakoUrl` is optional — falls back to the user's saved `kayakoUrl` setting.

**Steps:**
1. Look up `tickets` in DB by `(caseId, effectiveKayakoUrl)` — returns 404 if not found
2. Check `ticket_analyses` cache `(ticketId, userId)` unless `forceRefresh=true`
3. If cache hit → return immediately with `fromCache: true`
4. Decrypt `anthropicKeyEnc`
5. Convert DB records to `KayakoCase` + `KayakoPost[]` shapes via `ticketRowToKayakoCase` / `dbPostsToKayakoPosts`
6. `detectModel(caseData, posts)` — pick Haiku or Sonnet
7. `analyseTicket(caseData, posts, apiKey)` — call Anthropic, parse response
8. `prisma.ticketAnalysis.upsert(...)` — save result including `oneLiner`, `blockerType`, `inputTokens`, `outputTokens`
9. `prisma.analysisRun.create(...)` — append to run log with `trigger` (`"manual"` or `"forced"`), duration, token counts, status

**Response (success):**
```json
{
  "sections": {
    "one_liner":          "...",
    "blocker_type":       "...",
    "blocker_detail":     "...",
    "path_to_closure":    "...",
    "case_summary":       "...",
    "customer_sentiment": "...",
    "what_needed":        "...",
    "next_steps":         "..."
  },
  "day_summaries": { "2024-01-15": "...", ... },
  "model_used":    "claude-haiku-4-5-20251001",
  "post_count":    23,
  "input_tokens":  1843,
  "output_tokens": 412,
  "status":        "done",
  "fromCache":     false,
  "created_at":    "2024-01-16T10:30:00.000Z"
}
```

**Error responses:**
- `400` — Anthropic API key not configured
- `404` — ticket not in DB (fetch it first via `/api/ticket`)
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

After a successful note post, `TicketAnalyser` reloads the ticket with `forceRefresh=true` and clears the cached analysis from UI state.

**Error responses:**
- `400` — empty note text, or Kayako credentials not configured
- `500` — decryption failure
- `502` — Kayako authentication or post failure

---

## `GET /api/bu-tickets`

Return all BU/PS tickets (where `isBuPs=true`) for the current user's Kayako URL, ordered by `kayakoUpdatedAt` descending.

**Response:**
```json
{
  "tickets":     [ ...TicketRow[] ],
  "lastSyncedAt": "2024-01-16T10:30:00.000Z"
}
```

`lastSyncedAt` is the max `lastSyncedAt` across all returned rows (null if no tickets).

---

## `DELETE /api/bu-tickets`

Admin-only (email must be in `ADMIN_EMAILS` env var). Delete BU/PS tickets by ID or all.

**Request body:**
```json
{ "ids": ["uuid1", "uuid2"] }
// or
{ "all": true }
```

**Response:** `{ "ok": true, "deleted": 5 }`

---

## `POST /api/bu-tickets/sync`

Full sync from Kayako view #64. Fetches all case stubs from the view, then enriches each with full case data and tags in batches of 5.

`maxDuration = 300` seconds (set by Vercel function timeout; no explicit `export const maxDuration` — relies on default).

**Steps:**
1. Pre-fetch shared data once: statuses, priorities, field definitions, SELECT option labels
2. `client.getViewCases(64)` — paginated, returns all case stubs
3. For each stub (batched 5 at a time): `getCaseRaw(id)` + `getCaseTags(id)` in parallel
4. Map to ticket data using shared lookups (custom field resolution, team extraction, brand extraction)
5. `prisma.ticket.upsert(...)` for each case — `isBuPs` is always `true`, `postsStatus` is preserved

**Response:**
```json
{
  "ok": true,
  "synced": 87,
  "failed": 2,
  "total": 89,
  "duration": 45230,
  "firstError": "Case 12345: HTTP 404"
}
```

After the sync completes, the UI fires two background POST requests (fire-and-forget):
- `/api/bu-tickets/sync-posts` — starts fetching posts for tickets that don't have them
- `/api/bu-tickets/analyse-batch` — starts AI analysis for tickets that have posts but no analysis

**Error responses:**
- `400` — Kayako credentials not configured
- `500` — Prisma client stale (run `npm run db:generate`)
- `502` — Kayako auth or view fetch failure

---

## `POST /api/bu-tickets/sync-posts`

Background job: fetch and persist posts for up to 10 BU/PS tickets per run (those with `postsStatus != 'done'`), ordered by `kayakoUpdatedAt` desc.

**Response:**
```json
{ "ok": true, "processed": 10, "failed": 0, "total": 10 }
```

If all posts are already synced: `{ "ok": true, "processed": 0, "message": "All posts already synced" }`

---

## `POST /api/bu-tickets/analyse-batch`

Background job: run AI analysis for up to 5 BU/PS tickets per run (those with `postsStatus='done'` and no `done` analysis with `oneLiner` set for the current user). Appends to `analysis_runs` log on every attempt.

**Response:**
```json
{ "ok": true, "processed": 5, "failed": 0, "total": 5 }
```

---

## `GET /api/bu-tickets/[id]`

Fetch a single BU/PS ticket from DB by Kayako ticket ID (not UUID), including posts, the current user's cached analysis, and the full analysis run history.

**Steps:**
1. Look up ticket + posts + analyses by `(kayakoTicketId, kayakoUrl)` with user filter
2. Auto-relink any orphaned `analysis_runs` rows (where `ticketId = null` for this `kayakoTicketId + kayakoUrl + userId`) — sets `ticketId` back to current ticket's UUID
3. Fetch all `analysis_runs` for this ticket (by `kayakoTicketId + kayakoUrl + userId`)
4. Fetch all `model_pricing` rows; compute costs per run via `findPricing` + `computeCost`

**Response:**
```json
{
  "ticket":       { ...TicketRow },
  "posts":        [ ...UnifiedPost[] ],
  "lastSyncedAt": "2024-01-16T10:30:00.000Z",
  "analysis": {
    "status":       "done",
    "sections":     { "one_liner": "...", "blocker_type": "...", ... },
    "daySummaries": { ... },
    "modelUsed":    "claude-haiku-4-5-20251001",
    "postCount":    23,
    "errorMsg":     null,
    "updatedAt":    "2024-01-16T10:30:00.000Z"
  },
  "analysisRuns": [
    {
      "id":            "uuid",
      "trigger":       "manual",
      "modelUsed":     "claude-haiku-4-5-20251001",
      "postCount":     23,
      "inputTokens":   1843,
      "outputTokens":  412,
      "durationMs":    3200,
      "status":        "done",
      "errorMsg":      null,
      "createdAt":     "2024-01-16T10:30:00.000Z",
      "inputCostUsd":  0.0015,
      "outputCostUsd": 0.0016,
      "totalCostUsd":  0.0031,
      "isOrphaned":    false
    }
  ]
}
```

`analysis` is `null` if no analysis has been run for this user. `analysisRuns` is an empty array if no runs exist. `isOrphaned: true` indicates the run survived a previous ticket deletion and was re-linked.

**Error responses:**
- `400` — invalid ticket ID
- `404` — ticket not found in DB

---

## `POST /api/bu-tickets/[id]/refresh`

Re-fetch a single ticket from Kayako and persist it (and its posts) to DB. Uses `fetchAndPersistTicket` — the same code path as `/api/ticket`.

`maxDuration = 60` seconds.

**Response:**
```json
{
  "ticket":       { ...TicketRow },
  "posts":        [ ...UnifiedPost[] ],
  "fromCache":    false,
  "lastSyncedAt": "2024-01-16T10:30:00.000Z",
  "warning":      ""
}
```

**Error responses:**
- `400` — invalid ticket ID or Kayako credentials not configured
- `500` — decryption failure
- `502` — Kayako auth or fetch failure
