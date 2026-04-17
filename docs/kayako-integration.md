# Kayako Integration

## Overview

The Vercel app talks to Kayako's REST API in exactly the same way as the Streamlit tool — Basic HTTP auth → session_id + CSRF token → subsequent requests. The implementation is a TypeScript port of `KayakoClient` in `kayako_tool.py`.

Key difference: each API route handler creates a new `KayakoClient` instance and calls `authenticate()` at the start of every request. There is no shared session across requests — Vercel serverless functions are stateless.

---

## Critical: Authorization Header on Every Request

**The `Authorization: Basic ...` header must be sent on every Kayako API request**, not only during the initial auth call. Python's `requests.Session` does this automatically by storing the header in the session. The TypeScript client replicates this by storing `authHeader` as an instance property and including it in the `headers()` method used by all subsequent `get()` and `post()` calls.

Without this, case and post fetches return HTTP 401 even when `session_id` is correctly extracted and sent via Cookie.

---

## Authentication

Kayako uses Basic HTTP auth to get a session:

```
POST /api/v1/me
Authorization: Basic base64(email:api_password)
```

Response contains `session_id` (in JSON body, or in `Set-Cookie` header as fallback) and `X-CSRF-Token` header.

All subsequent requests use:
```
Cookie: session_id=<value>
X-CSRF-Token: <value>
```

**Important**: The password is the **Kayako API password**, not the web login password. Users set this in Kayako at: My Profile → Change Password → API Password.

---

## KayakoClient (`lib/kayako/client.ts`)

### Methods

#### `authenticate(email, password)`
Calls `GET /api/v1/me` with Basic auth. Stores `sessionId`, `csrfToken`, and `authHeader` as instance properties. Throws `Error` on HTTP error or if no `session_id` is found.

Session ID is extracted from the JSON body first, then falls back to scanning `Set-Cookie` headers. In Node.js 18+ the `getSetCookie()` method (returns array) is preferred over the single-value `get('set-cookie')`.

#### `getCase(caseId)`

Runs **four requests in parallel** via `Promise.allSettled`, then resolves N more to expand custom field option labels:

```
[parallel]
  GET /api/v1/cases/{caseId}?include=user,team   → case object + requester + team
  GET /api/v1/cases/statuses                      → all status definitions (for label lookup)
  GET /api/v1/cases/priorities                    → all priority definitions (for label lookup)
  GET /api/v1/cases/fields                        → all custom field definitions

[sequential, for each SELECT field with a numeric option ID value]
  GET /api/v1/cases/fields/{fieldId}?include=field_option,locale_field
    → expands options with translated label inline

[fallback, only if translation was not returned inline]
  GET /api/v1/locale/fields/{localeFieldId}
    → resolves locale_field stub to plain translation string
```

**Fields pulled from the case API response:**

| Field | Source | Notes |
|---|---|---|
| `id` | Case object | Ticket ID |
| `subject` | Case object | |
| `status.id` | Case object | |
| `status.label` | Statuses list | Matched by ID, label preferred over name |
| `priority.id` | Case object | |
| `priority.label` | Priorities list | Matched by ID |
| `requester` | Case object (`include=user`) | Full `KayakoUser` with `full_name`, `identities` |
| `assigned_agent` | Case object (`include=user`) | Full `KayakoUser` or `null` |
| `assigned_team` | Case object (`include=team`) | `{ id, title }` or `null` |
| `tags` | Case object | `string[]` |
| `created_at` | Case object | ISO 8601 |
| `updated_at` | Case object | ISO 8601 |
| `custom_fields` | Case object (raw stubs) + fields API (definitions + option labels) | See below |

**Custom fields resolution:**

The case response includes `custom_fields` as raw stubs: `{ field: { id }, value }`. Values are resolved against field definitions into `{ id, label, value, type }`:

1. Non-system fields only (`is_system: false`)
2. Empty values are skipped
3. Text/date fields: `value` is used as-is
4. SELECT/RADIO/CASCADINGSELECT fields: `value` is a numeric option ID — resolved to a human-readable label via `GET /api/v1/cases/fields/{fieldId}?include=field_option,locale_field`
5. If the label cannot be resolved (option not found, locale stub without translation), the field is omitted from output entirely rather than showing a raw ID

**Known API quirk — `/api/v1/base/field/option/{id}` returns HTTP 400**: This endpoint is blocked for external API consumers. Use `GET /api/v1/cases/fields/{fieldId}?include=field_option,locale_field` instead — it expands all options with their locale translations in a single call.

**Product field (ID 16)**: The "Product" custom field is a SELECT field (e.g. `Discover XI`, `CS Escalation`, `Crossover Hiring`). Its option IDs (e.g. `7147`) are resolved to display names via the above mechanism.

#### `getAllPosts(caseId, pageSize=200, maxPosts=500)`
Fetches all posts with pagination. See [Posts Pagination](#posts-pagination) below.

#### `resolveUsers(posts, seedUsers)`
Fills in `creator.full_name` for post stubs that only have `creator.id`. See [User Resolution](#user-resolution) below.

#### `addNote(caseId, htmlContent)`
```
POST /api/v1/cases/{caseId}/reply
{ contents: "<html>", channel: "NOTE", channel_options: { html: true } }
```

### Helper Functions

#### `extractCaseId(input)`
Parses a ticket URL (`/conversations/12345`) or plain numeric string into a case ID integer. Returns `null` if unrecognisable.

#### `textToHtml(text)`
Converts plain text (from the Add Note textarea) to HTML paragraphs for the Kayako API. Double newlines become paragraph breaks; single newlines become `<br>`.

---

## Posts Pagination

The Kayako posts endpoint has a well-documented quirk: **the `offset` parameter is often ignored**. Sending `offset=200` may return the same first page as `offset=0`.

The strategy used (mirrors `get_all_posts` in the Python tool):

1. **First request**: `limit=200&offset=0` — covers most tickets in a single request
2. **If `next_url` is present in the response**: follow it (Kayako's own cursor — reliable)
3. **If `next_url` is absent but the batch was full**: increment offset manually as fallback
4. **Deduplicate by post ID**: safety net in case offset is ignored and the same page comes back
5. **Break if no new posts**: prevents infinite loops when offset is ignored
6. **15-second timeout per request**: on timeout, partial results are returned with a warning banner
7. **Cap at `maxPosts=500`**: prevents runaway fetches for extremely large tickets

```typescript
// Simplified logic
while (allPosts.length < maxPosts && url) {
  const data = await fetch(url)                    // 15s timeout
  const newPosts = batch.filter(p => !seenIds.has(p.id))
  allPosts.push(...newPosts)
  if (data.next_url) {
    url = data.next_url                            // follow cursor
  } else if (batch.length < pageSize || !newPosts.length) {
    break                                          // done or stuck
  } else {
    params.offset = allPosts.length               // fallback increment
  }
}
```

---

## User Resolution

Posts are fetched **without** `include=user` because adding that parameter causes the Kayako API to hang silently for tickets with many posts.

Instead, after fetching posts, creator names are resolved in a separate pass:

1. **Seed the cache** with the requester and assigned_agent from the case object (no extra requests needed for them)
2. **Find missing users** — posts where `creator.full_name` is absent and `creator.id` is not in cache
3. **Fetch in parallel** — `Promise.allSettled` calls `GET /api/v1/users/{id}` for each missing ID
4. **Apply names** — replace each post's `creator` stub with the full user object from cache

Individual user lookups fail silently: if a user can't be resolved, the post shows `ID:<number>` instead of a name.

---

## Request Timeouts

All requests use `AbortSignal.timeout(15_000)` — a Node.js 18+ built-in. No extra timeout packages needed.

If a request times out, an `AbortError` is thrown. In `getAllPosts`, this is caught and converted to a warning string returned alongside partial results.

---

## API Routes That Use KayakoClient

| Route | Method | What it does |
|---|---|---|
| `POST /api/ticket` | `authenticate` + `getCase` + `getAllPosts` + `resolveUsers` | Load ticket + all posts with names |
| `POST /api/note` | `authenticate` + `addNote` | Post internal note |

The analysis route (`/api/analysis`) does not call KayakoClient — it uses post data already in the request body, which was fetched by the ticket route.
