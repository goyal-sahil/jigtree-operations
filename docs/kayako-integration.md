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
GET /api/v1/me
Authorization: Basic base64(email:api_password)
```

Response contains `session_id` (in JSON body, or in `Set-Cookie` header as fallback) and `X-CSRF-Token` header.

All subsequent requests use:
```
Authorization: Basic base64(email:api_password)
Cookie: session_id=<value>
X-CSRF-Token: <value>
```

**Important**: The password is the **Kayako API password**, not the web login password. Users set this in Kayako at: My Profile → Change Password → API Password.

Node.js 18+ note: `getSetCookie()` returns an array of all `Set-Cookie` headers — used when the session ID comes via cookie rather than JSON body.

---

## KayakoClient (`lib/kayako/client.ts`)

### Constructor

```typescript
new KayakoClient(baseUrl: string, clientSignal?: AbortSignal)
```

`clientSignal` is a caller-provided cancellation signal (e.g. `request.signal` from the route handler). The client combines it with its own per-request 15s timeout using `AbortSignal.any()` (Node 20+) or a manual combiner (Node 18 fallback).

### Methods

#### `authenticate(email, password)`
Calls `GET /api/v1/me` with Basic auth. Stores `sessionId`, `csrfToken`, and `authHeader` as instance properties. Throws `Error` on HTTP error or if no `session_id` is found.

#### `getCase(caseId)`

Runs **four requests in parallel** via `Promise.allSettled`, then resolves N more to expand custom field option labels:

```
[parallel]
  GET /api/v1/cases/{caseId}?include=user,team,organization,brand&fields=+tags
  GET /api/v1/cases/statuses
  GET /api/v1/cases/priorities
  GET /api/v1/cases/fields

[parallel, for each SELECT/RADIO/CASCADINGSELECT field with a numeric option ID value]
  GET /api/v1/cases/fields/{fieldId}?include=field_option,locale_field
    → expands options with translated label inline

[fallback, only if translation was not returned inline]
  GET /api/v1/locale/fields/{localeFieldId}
    → resolves locale_field stub to plain translation string
```

Tags are returned as objects when using `fields=+tags` — normalised to plain strings in `getCase`.

**Custom fields resolution:**
1. Non-system fields only (`is_system: false`)
2. Empty values are skipped
3. Text/date fields: `value` is used as-is
4. SELECT/RADIO/CASCADINGSELECT fields: `value` is a numeric option ID — resolved to human-readable label
5. If label cannot be resolved (option not found, locale stub without translation), the field is omitted entirely rather than showing a raw ID

**Known API quirk — `/api/v1/base/field/option/{id}` returns HTTP 400**: This endpoint is blocked for external API consumers. Use `GET /api/v1/cases/fields/{fieldId}?include=field_option,locale_field` instead.

#### `getCaseRaw(caseId)`
Fetches `GET /api/v1/cases/{caseId}?include=user,team,organization,brand` without running the status/priority/field-def parallel lookups. Used by the BU/PS sync where shared lookups are pre-fetched once for all tickets.

#### `getCaseTags(caseId)`
Fetches `GET /api/v1/cases/{caseId}/tags`. Returns `string[]`, empty on failure (fail-silent).

#### `getAllPosts(caseId, pageSize=200, maxPosts=500)`
Fetches all posts with pagination. See [Posts Pagination](#posts-pagination) below.

#### `resolveUsers(posts, seedUsers)`
Fills in `creator.full_name` for post stubs that only have `creator.id`. See [User Resolution](#user-resolution) below.

#### `getViewCases(viewId)`
Fetches all case stubs from a Kayako view via pagination:
```
GET /api/v1/views/{viewId}/cases?limit=200
```
Follows `next_url` until exhausted. Returns `KayakoCase[]`. Used by the BU/PS sync for view #64.

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

## `lib/kayako/ticketService.ts` — Shared Fetch Service

This module is the single code path for fetching a full ticket (case + posts + user resolution) and persisting it to the DB. It is used by both the Ticket Analyser (`/api/ticket`) and the BU/PS refresh (`/api/bu-tickets/[id]/refresh`).

### `fetchAndPersistTicket(caseId, client, kayakoUrl)`

```typescript
async function fetchAndPersistTicket(
  caseId:    number,
  client:    KayakoClient,
  kayakoUrl: string,
): Promise<{ ticket: TicketRow; posts: UnifiedPost[]; warning?: string }>
```

Steps:
1. Run `client.getCase(caseId)` and `client.getAllPosts(caseId)` in parallel via `Promise.allSettled`
2. Resolve creator names via `client.resolveUsers(rawPosts)`
3. Extract metadata: `extractSpecialFields(customFields)` for product/GHI/holdReason/jiraFields, `extractTeam(tags)` for PS/BU, brand name from `caseData.brand`
4. Upsert ticket to `tickets` table — `isBuPs` is only set to `true` in `create`; in `update` it is omitted so a BU/PS-synced ticket retains its `isBuPs=true` flag after an Analyser refresh
5. Upsert each post to `ticket_posts` table
6. Read back from DB and return `TicketRow` + `UnifiedPost[]`

### `extractSpecialFields(fields)`

Parses resolved custom fields to extract:
- `product` — field whose label matches `/product/i`
- `ghiId` — GitHub issue number (field matching `/ghi|github|escalated.*issue/i`; URL parsed to extract number)
- `holdReason` — field matching `/hold.*reason|on.hold.*reason/i`
- `jiraFields` — `Record<string, string>` of fields matching `/jira|jia/i` with values matching JIRA key format (`[A-Z]+-\d+`)

### `extractTeam(tags)`

Returns `"PS"` if `tags.includes('bu_ps')`, `"BU"` if `tags.includes('bu_other')`, otherwise `null`.

### Shape Converters

| Function | Description |
|---|---|
| `dbTicketToRow(t)` | Prisma Ticket record → `TicketRow` (API response shape) |
| `dbPostToUnified(p)` | Prisma TicketPost record → `UnifiedPost` (API response shape) |
| `ticketRowToKayakoCase(ticket)` | `TicketRow` → `KayakoCase` for AI analyser |
| `dbPostsToKayakoPosts(posts)` | Prisma TicketPost[] → `KayakoPost[]` for AI analyser |

---

## Posts Pagination

The Kayako posts endpoint has a well-documented quirk: **the `offset` parameter is often ignored**. Sending `offset=200` may return the same first page as `offset=0`.

The strategy used (mirrors `get_all_posts` in the Python tool):

1. **First request**: `limit=200&offset=0` — covers most tickets in a single request
2. **If `next_url` is present in the response**: follow it (Kayako's own cursor — reliable)
3. **If `next_url` is absent but the batch was full**: increment offset manually as fallback
4. **Deduplicate by post ID**: safety net in case offset is ignored and the same page comes back
5. **Break if no new posts**: prevents infinite loops when offset is ignored
6. **15-second timeout per request**: on timeout, partial results are returned with a warning string
7. **Cap at `maxPosts=500`**: prevents runaway fetches for extremely large tickets

---

## Post Channel Resolution

`resolvePostChannel(post: KayakoPost): string` — exported from `lib/kayako/ticketService.ts`. Called for every post in `fetchAndPersistTicket` to determine the channel value stored in `ticket_posts.channel`.

**Why not `include=channel`?** Adding `include=channel` to the posts endpoint is silently ignored by Kayako — the channel field is always null regardless. The raw post JSON already contains all necessary fields without any includes:

| Priority | Check | Result |
|---|---|---|
| 1 | `original.resource_type === 'side_conversation'` | `"SIDE_CONVERSATION"` |
| 2 | `source_channel.type === 'NOTE'` or `original.resource_type === 'note'` | `"NOTE"` |
| 3 | `is_requester === true` | `"CUSTOMER"` |
| 4 | fallback | `source_channel.type \|\| "MAIL"` |

These stored channel values drive the colour-coding in `ConversationThread`:
- `"NOTE"` → yellow (internal note)
- `"CUSTOMER"` → red (customer-visible)
- `"SIDE_CONVERSATION"` → grey (side conversation, contents often empty)
- anything else → blue (support reply)

---

## User Resolution

Posts are fetched **without** `include=user` because adding that parameter causes the Kayako API to hang silently for tickets with many posts.

Instead, after fetching posts, creator names are resolved in a separate pass:

1. **Seed the cache** with the requester and assigned_agent from the case object (no extra requests needed for them)
2. **Find missing users** — posts where `creator.full_name` is absent and `creator.id` is not in cache
3. **Fetch in parallel** — `Promise.allSettled` calls `GET /api/v1/users/{id}` for each missing ID
4. **Apply names** — replace each post's `creator` stub with the full user object from cache

Individual user lookups fail silently: if a user can't be resolved, the post shows `—` instead of a name.

---

## BU/PS Sync Strategy

The sync (`/api/bu-tickets/sync`) uses a different approach from `fetchAndPersistTicket` to avoid redundant API calls when syncing many tickets:

1. **Pre-fetch shared data once** for all tickets: statuses, priorities, field definitions, and all SELECT option labels
2. **Fetch case stubs** from view #64 via `getViewCases(64)`
3. **Per-case enrichment** (batched 5 at a time): `getCaseRaw(id)` + `getCaseTags(id)` — lightweight, avoids the per-case status/priority/field-def lookups since those are already in the shared maps
4. **No post fetch** — posts are synced separately via the background `sync-posts` job

This means the sync is fast for large views (view #64 has ~90 tickets) and doesn't hit the rate limit from duplicate lookups.

The post-fetch background job (`sync-posts`) uses **the same code path as individual ticket Refresh** — it calls `fetchAndPersistTicket()` directly. This guarantees that bulk sync and manual refresh always produce identical results. Any future changes to field mapping or post processing only need to be made in one place (`ticketService.ts`).

---

## Request Timeouts

All requests use `AbortSignal.timeout(15_000)` — a Node.js 18+ built-in. No extra timeout packages needed.

The `KayakoClient` constructor accepts a `clientSignal` (the route handler's `request.signal`). These are combined: the request aborts on whichever fires first — the 15s per-request timeout or the client disconnect.

For `fetchAndPersistTicket`, the outer timeout is set to 45s (`AbortSignal.timeout(45_000)`) when constructing the client, to allow time for case + posts + user resolution.

---

## API Routes That Use KayakoClient

| Route | KayakoClient usage |
|---|---|
| `POST /api/ticket` | `authenticate` → `fetchAndPersistTicket` (via ticketService) |
| `POST /api/bu-tickets/sync` | `authenticate` → `getViewCases` → `getCaseRaw` + `getCaseTags` per ticket |
| `POST /api/bu-tickets/sync-posts` | `authenticate` → `fetchAndPersistTicket` per ticket (same code path as Refresh) |
| `POST /api/bu-tickets/[id]/refresh` | `authenticate` → `fetchAndPersistTicket` (via ticketService) |
| `POST /api/note` | `authenticate` → `addNote` |

The analysis route (`/api/analysis`) does **not** call KayakoClient — it reads from the DB.
