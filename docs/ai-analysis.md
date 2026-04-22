# AI Analysis

## Overview

AI analysis is powered by Anthropic Claude. When a user clicks "Run Analysis", the app reads the ticket and posts from the database, sends the full conversation to Claude, and receives a structured analysis. Results are cached in PostgreSQL so subsequent opens of the same ticket don't re-run Claude.

The implementation is a TypeScript port of `analyse_ticket_with_ai()` in `kayako_tool.py`, updated with a revised prompt format and token tracking.

**Important**: `/api/analysis` reads ticket and post data directly from the `tickets` and `ticket_posts` tables. It does **not** accept `caseData` or `posts` in the request body — the ticket must have been fetched and persisted first via `/api/ticket` or `/api/bu-tickets/[id]/refresh`.

---

## Model Selection

`detectModel(caseData, posts)` in `lib/anthropic/client.ts` computes a complexity score:

| Condition | Score |
|---|---|
| > 15 posts | +2 |
| > 30 posts | +2 |
| Subject or any post contains a complexity keyword | +1 |
| Ticket created > 7 days ago | +2 |

**Score ≥ 3** → `claude-sonnet-4-6`
**Score < 3** → `claude-haiku-4-5-20251001`

Complexity keywords: `urgent`, `escalat`, `legal`, `refund`, `cancel`, `chargeback`, `frustrated`, `angry`, `unacceptable`, `lawsuit`, `terrible`, `outage`, `critical`, `broken`, `down`, `lost data`

The model used is stored in `ticket_analyses.modelUsed` and displayed as a pill in the UI.

---

## Output Sections

Claude returns eight sections (seven analysis sections + one timeline):

| Section key | Description |
|---|---|
| **one_liner** | Single sentence summary of the ticket (shown in BU/PS table) |
| **blocker_type** | Short blocker category label (e.g. "Bug", "Config", "Waiting for Customer") — shown in BU/PS table |
| **blocker_detail** | One-line detail on what's blocking resolution |
| **path_to_closure** | Concise bullet list of what needs to happen to close the ticket |
| **case_summary** | Bullet points: issue, root cause, impact, current state |
| **customer_sentiment** | One-line label + bullets on what's driving it |
| **what_needed** | Bullet list of specific closure conditions |
| **next_steps** | Numbered action list, ordered by priority with owner |
| **day_summaries** | `{ "YYYY-MM-DD": "one sentence per active date" }` — separate field |

`oneLiner` and `blockerType` are also stored as dedicated columns on `ticket_analyses` (extracted from sections) so they can be queried/sorted efficiently in the BU/PS table without parsing JSON.

The `AnalysisSections` type: `{ one_liner, blocker_type, blocker_detail, path_to_closure, case_summary, customer_sentiment, what_needed, next_steps }`.

`max_tokens` is set to `2500`.

---

## Conversation Block Format

Each post is formatted as:
```
[YYYY-MM-DD HH:MM] [INTERNAL — not visible to customer] Agent Name:
<post text, truncated to 1500 chars>

---

[YYYY-MM-DD HH:MM] [Customer-visible] Customer Name:
<post text>
```

Internal notes are labelled `[INTERNAL — not visible to customer]`. The distinction is important so Claude knows what the customer has and hasn't seen.

Post text is truncated at 1500 characters per post to control token usage on large tickets.

---

## Token Tracking and Cost Calculation

The Anthropic SDK returns token counts in `response.usage`. The analysis route stores these:

- `inputTokens` — stored in `ticket_analyses.inputTokens` and `analysis_runs.inputTokens`
- `outputTokens` — stored in `ticket_analyses.outputTokens` and `analysis_runs.outputTokens`

These are also returned in the API response (`input_tokens`, `output_tokens`). They are overwritten in `ticket_analyses` on each re-run; the historical log in `analysis_runs` is never modified.

**Cost calculation** (`lib/pricing.ts`):
- `findPricing(modelId, runDate, pricingRows)` — finds the `ModelPricing` row whose `modelPattern` is a substring of the model ID and whose `effectiveFrom`/`effectiveTo` date range covers `runDate`
- `computeCost(inputTokens, outputTokens, pricing)` — returns `{ inputCostUsd, outputCostUsd, totalCostUsd }`
- `formatCostUsd(n)` — auto-scales display: `$0.0023`, `$0.12`, `$1.50`, etc.

Costs are computed at query time (not stored) by the `GET /api/bu-tickets/[id]` route. The `AnalysisHistory` component sums them and shows a running total.

---

## Caching

Results are stored in `ticket_analyses` with a unique key of `(ticketId, userId)` — one cached analysis per user per ticket (scoped to the user's Kayako instance via the ticket FK).

- **Cache hit** (no `forceRefresh`): the stored JSON is returned immediately with `fromCache: true` and the `updatedAt` timestamp shown as `created_at`
- **Cache miss or `forceRefresh=true`**: Claude is called, result is written via `upsert`
- **Invalidation**: the TicketAnalyser client sets `forceRefresh=true` when the user clicks "Re-run". Also cleared from UI state (not DB) when a new note is posted and the ticket is reloaded.

The cache is per-user, so one user's analysis never returns as another user's result.

---

## API Route (`POST /api/analysis`)

Request body:
```json
{
  "caseId":       12345,
  "kayakoUrl":    "https://central-supportdesk.kayako.com",
  "forceRefresh": false
}
```

`kayakoUrl` is optional — falls back to the user's saved kayakoUrl setting.

Response (success):
```json
{
  "sections": {
    "case_summary":       "...",
    "customer_sentiment": "...",
    "what_needed":        "...",
    "next_steps":         "..."
  },
  "day_summaries": { "2024-01-15": "Customer reported...", ... },
  "model_used":    "claude-haiku-4-5-20251001",
  "post_count":    23,
  "input_tokens":  1843,
  "output_tokens": 412,
  "status":        "done",
  "fromCache":     false,
  "created_at":    "2024-01-16T10:30:00.000Z"
}
```

`created_at` is only meaningful when `fromCache: true` — it is the `updatedAt` of the cached row.

---

## Analysis Run Logging

Every analysis attempt (manual, forced, or batch) appends a row to `analysis_runs` via `prisma.analysisRun.create(...)`. This happens for both success and error outcomes. The `AnalysisHistory` component on the BU/PS ticket detail page displays this history in a collapsible table with per-run costs.

**`AnalysisRun` fields recorded per call:**
- `trigger` — `"manual"` (first run), `"forced"` (re-run button), or `"batch"`
- `modelUsed`, `postCount`, `inputTokens`, `outputTokens`
- `durationMs` — wall time from before `analyseTicket()` call to after
- `status` — `"done"` or `"error"` (with `errorMsg` if error)

---

## Background Batch Analysis

`/api/bu-tickets/analyse-batch` runs AI analysis on up to 5 BU/PS tickets per call, processing tickets that have posts synced (`postsStatus='done'`) but no complete analysis with `oneLiner` populated for the current user. It uses the same `analyseTicket()` function and stores all fields including `oneLiner` and `blockerType`.

Status flow: `pending` → `running` (upserted before Claude call) → `done` or `error`.

---

## Transient Error Retry

`analyseTicket()` wraps `client.messages.create()` with a single retry after 2 s if the Anthropic API returns an HTTP 500 error. This handles transient server errors without user action.

---

## Anthropic SDK

Uses `@anthropic-ai/sdk` v0.39+. The API key is stored encrypted in `user_settings.anthropicKeyEnc` and decrypted per-request inside the route handler. It is never logged or returned to the browser.

```typescript
const client = new Anthropic({ apiKey })
const response = await client.messages.create({
  model,
  max_tokens: 2500,
  system: systemPrompt,
  messages: [{ role: 'user', content: userPrompt }],
})
// response.usage.input_tokens / output_tokens are stored in DB
```

---

## Ticket Markdown Export

`POST /api/export` generates a structured `.md` file for a ticket, cached in the `ticket_exports` table.

### Approach: Programmatic with Claude Overview

All ticket content is assembled in TypeScript — metadata, posts, analysis sections. Claude is called **only** for a short "Overview" section (3-5 bullet points), keeping output bounded and guaranteeing completeness regardless of ticket size.

**Why not ask Claude for the full markdown?** The initial approach passed all ticket data to Claude with `max_tokens: 8000`. For large tickets (60+ posts), Claude truncated output mid-conversation, losing posts and the analysis section which appeared last. Programmatic generation guarantees all content is included.

### `generateTicketMarkdown(ticket, posts, analysis, apiKey)`

Exported from `lib/anthropic/client.ts`. Returns `ExportResult`:

```typescript
interface ExportResult {
  markdown:      string
  model_used:    string
  input_tokens:  number
  output_tokens: number
}
```

**Process:**
1. Call Claude Haiku (`claude-haiku-4-5-20251001`) with `max_tokens: 400` — prompt asks for 3-5 overview bullets summarising the ticket (what, why, current state)
2. Call `buildFullMarkdown(ticket, posts, analysis, overview)` — assembles the full document programmatically:
   - `# Ticket #{id} — {title}` header
   - Overview section (Claude's bullets)
   - Metadata table (status, priority, team, brand, org, requester, assignee, product, created, updated)
   - Tags (if any)
   - Custom fields (if any)
   - Jira refs (if any)
   - AI Analysis (all 8 sections, if analysis exists)
   - Full Conversation — **all posts, no truncation**, each prefixed with channel label:
     - `🔒 Internal Note — {author}` (NOTE)
     - `👤 Customer — {author}` (CUSTOMER)
     - `💬 Support Reply — {author}` (MAIL / other)
     - `↗ Side Conversation — {author}` (SIDE_CONVERSATION)
3. Return assembled markdown + token counts

**HTML stripping**: `stripHtml(html)` — regex-based HTML → plain text conversion applied to all post contents before inclusion.

### API Route (`POST /api/export`)

Request body:
```json
{
  "caseId":       12345,
  "forceRefresh": false
}
```

Steps:
1. Auth check
2. Decrypt `anthropicKeyEnc`
3. Fetch ticket + posts from DB (`postsStatus` must be `'done'`)
4. Load existing `TicketExport` for `(ticketId, userId)`
5. If `status='done'` and `!forceRefresh` → return `{ markdown, fromCache: true }`
6. Upsert `TicketExport` with `status='running'`
7. Load current `TicketAnalysis` for `(ticketId, userId)` — passed to `generateTicketMarkdown`
8. Call `generateTicketMarkdown()`
9. Upsert `TicketExport` with `status='done'`, content, and token counts
10. Create `AnalysisRun` row with `runType='download'`, trigger, tokens, duration, status
11. Return `{ markdown, fromCache: false }`

On error: upsert `TicketExport` with `status='error'`, create error `AnalysisRun` row, return 500.

### UI Flow

Both the Ticket Analyser and BU/PS detail page show a "⬇ Download .md" button when `postsStatus='done'`. On click:

1. **Stale check**: if ticket's last fetch (`Math.max(lastSyncedAt, postsLastSyncedAt)`) is newer than `analysis.created_at`, the analysis is re-run first (`forceRefresh=true` to `/api/analysis`)
2. `POST /api/export` — receive `markdown` string
3. Trigger browser download: `Blob` → `URL.createObjectURL` → `<a>` click → `URL.revokeObjectURL`
4. Filename: `ticket-{kayakoTicketId}.md`

A "↻ Regenerate" text link appears next to the button when `exportInfo?.status === 'done'` — clicking it calls `downloadExport(forceRefresh=true)`.

The button shows the current phase during long operations: "Refreshing analysis…" → "Generating export…".

### Run Logging

Every export generation (success or error) appends a row to `analysis_runs` with `runType='download'`. This appears in the `AnalysisHistory` component under the "Download" type badge (emerald). Token counts and costs are tracked the same way as analysis runs.
