# Claude Working Memory — BU Support Ticket Analyser (Vercel Web App)

## Who I'm Working With
- **Name**: Sahil Goyal
- **Email**: sahil.goyal@aurea.com
- **Login**: Google SSO

---

## What This Is

A multi-user Next.js web app — the **JigTree Operations Hub**. Features:
- **Ticket Analyser** — load any Kayako ticket, AI analysis, timeline, post notes
- **BU/PS Tickets** — table view of Kayako view #64, cached in DB with full post history and per-ticket detail page

Live at **https://jigtree-operations.vercel.app** | GitHub: `goyal-sahil/jigtree-operations`

The Streamlit tool at `C:\Users\sahil\CoWork\Central Kayako Tickets\` is kept as-is and is a separate codebase.

---

## Status

**v1.0.0 live. Phases 1–15 complete + post-launch fixes. Phase 16 planned.**
- Ticket Analyser fully working (DB-first, Refresh button, Force re-run analysis)
- BU/PS Tickets table: URL-driven filter/sort/pagination, server-side queries, filter presets (personal + shared + update + visibility toggle), NProgress loading bar, admin delete; filter panel (search always-visible + debounced, scrollable checkbox groups, All/None per group); BUTicketsTable has column visibility dropdown + CSV export (all filtered rows)
- BU/PS Ticket detail page: shared TicketCard / ConversationThread / Timeline / AddNoteForm / AIAnalysis components
- Unified DB schema (`tickets`, `ticket_posts`, `ticket_analyses`, `ticket_exports`) — no separate BU/PS tables
- Token tracking (`inputTokens` / `outputTokens` stored in `ticket_analyses` and `analysis_runs`)
- **Ticket Markdown Export**: "⬇ Download .md" on both Ticket Analyser and BU/PS detail pages; programmatic markdown generation with Claude-written Overview section; cached per user per ticket in `ticket_exports` table
- **API Usage History**: `analysis_runs` table now tracks both analysis and download runs (`runType` field); `AnalysisHistory` component shows in both Ticket Analyser and BU/PS pages
- `lib/kayako/ticketService.ts` — single fetch+persist service used by both Ticket Analyser and BU/PS refresh
- RLS policies applied in Supabase (all tables, including `filter_presets` added in Phase 15)
- **Admin section** (Phase 17.1): `/admin` page with `AdminPresetsTable.tsx` — all presets grouped by user, admin can delete any; admin nav item + Hub tile (shown only to emails in `ADMIN_EMAILS`)
- **Filter model productised**: `docs/filter-model.md` + `.claude/commands/filter-model.md` skill + `Spec/Filter-Sorting/` templates updated to finalized pattern (NProgress, router.push, draft sync, update preset, visibility, CSV export)
- `CHANGELOG.md` introduced at v1.0.0

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Auth | Supabase Auth — Google OAuth only |
| Database | Supabase PostgreSQL via Prisma 5 |
| Credential storage | AES-256-GCM encrypted columns |
| AI | Anthropic Claude (Haiku default, Sonnet for complex tickets) |
| Styling | Tailwind CSS |
| Hosting | Vercel (serverless functions) |

---

## Running Locally

```bash
npm install
npx prisma generate
# fill in .env.local (copy from .env.example)
npm run db:push        # push schema to Supabase (once)
npm run dev            # → http://localhost:3000
```

### `.env.local` variables

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API |
| `DATABASE_URL` | Supabase → DB → Connection string → Transaction mode (port 6543) + `?pgbouncer=true` |
| `DIRECT_URL` | Supabase → DB → Connection string → Direct (port 5432) |
| `ENCRYPTION_SECRET` | Generate: `openssl rand -hex 32` (must be exactly 64 hex chars) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally, `https://your-app.vercel.app` in prod |
| `ADMIN_EMAILS` | Comma-separated list of emails with admin access (delete all, etc.) |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Same list — used client-side to show admin controls in BU/PS table |

---

## npm Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server at http://localhost:3000 |
| `npm run build` | Runs `prisma generate` then Next.js build |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:push` | Push schema to DB (dev) |
| `npm run db:migrate` | Apply migrations (prod) |
| `npm run db:studio` | Prisma Studio GUI |

---

## Kayako API — Key Facts

- **Auth**: Basic HTTP (email + API password → session_id + X-CSRF-Token). Re-authenticated per request (stateless serverless).
- **The Kayako password is the API password**, not the web login. Users set it in Kayako: My Profile → Change Password → API Password.
- **Case fetch** — `getCase()` runs **5 calls in parallel**:
  1. `GET /api/v1/cases/{id}?include=user,team,organization,brand` — case with requester, agent, team, org, brand expanded
  2. `GET /api/v1/cases/statuses` — resolve status ID → label
  3. `GET /api/v1/cases/priorities` — resolve priority ID → label
  4. `GET /api/v1/cases/fields` — all field definitions (type, label, system flag)
  5. `GET /api/v1/cases/{id}/tags` (via `getCaseTags()`) — dedicated tags endpoint, returns clean `string[]`
- **Custom fields**: raw case has `custom_fields` as stubs `{ field: { id }, value }`. Resolved against field defs. System fields and empty values are filtered out.
- **SELECT field option labels**: for SELECT/RADIO/CASCADINGSELECT fields with numeric option IDs, resolved via `GET /api/v1/cases/fields/{fieldId}?include=field_option,locale_field` — returns the field with options expanded including locale translations inline. **Note**: `GET /api/v1/base/field/option/{id}` returns HTTP 400 and does NOT work for external API consumers.
- **Product field**: field ID 16, type SELECT. Resolved the same way as other SELECT fields — option label comes from `include=field_option,locale_field`. Displayed as a badge in the ticket header.
- **Tags**: fetched via `getCaseTags()` (`GET /api/v1/cases/{id}/tags`) — a dedicated endpoint that reliably returns `string[]`. **Do NOT** use `fields=+tags` via `url.searchParams` — `URLSearchParams` encodes `+` as `%2B`, which Kayako does not decode to `+`, causing tags to be silently missing.
- **Posts fetch**: NO `include` param — `include=user` causes silent hangs on large tickets; `include=channel` is **silently ignored** by Kayako (tried and confirmed — returns same data regardless, channel field still null). Channel is resolved from raw fields that are always present in the post JSON without any includes.
- **Post channel resolution**: `resolvePostChannel(post)` in `lib/kayako/ticketService.ts` maps each post to one of four values: `"SIDE_CONVERSATION"` (if `original.resource_type === 'side_conversation'`), `"NOTE"` (if `source_channel.type === 'NOTE'` or `original.resource_type === 'note'`), `"CUSTOMER"` (if `is_requester === true`), or `source_channel.type || "MAIL"` (support reply). This channel value is stored in `ticket_posts.channel` and drives the colour-coding in `ConversationThread`.
- **Side conversations API** (`GET /api/v1/cases/{id}/side_conversations`): returns HTTP 400 — not supported for external API consumers. Side conversation posts appear in the regular posts endpoint with `original.resource_type = 'side_conversation'`; contents are often empty.
- **User resolution**: after fetching posts, resolve creator names via individual `GET /api/v1/users/{id}` calls (parallel, fail-silent)
- **Pagination**: `limit=200` first, then follow `next_url` from response. The `offset` param is unreliable — Kayako frequently ignores it and returns the same first page. Deduplicate by post ID as a safety net.
- **Timeouts**: 15 s per request via `AbortSignal.timeout(15_000)`. On timeout, partial results + warning banner.
- **Max posts**: 500 per ticket load.
- **BU/PS sync** (view #64): `GET /api/v1/views/64/cases?limit=200` — paginated case stubs. Per-case details then fetched with `getCaseRaw` + `getCaseTags` in batches of 5. Shared statuses/priorities/field-defs are pre-fetched once for the whole sync.

---

## Database Models

### `user_settings`
Per-user credentials. `userId` = Supabase `auth.users.id`.
Encrypted fields: `kayakoPasswordEnc`, `anthropicKeyEnc` (AES-256-GCM, base64(iv+authTag+ciphertext)).

### `tickets`
Unified ticket cache used by both Ticket Analyser and BU/PS sync. Unique on `(kayakoTicketId, kayakoUrl)`.

Key fields:
- `requesterKayakoId Int?` — Kayako user ID of the requester; used by ConversationThread / Timeline to colour-code customer posts
- `customFields Json?` — full resolved custom fields array: `[{ id, label, value, type }]`
- `brand String?` — Kayako brand name (used as BU display name, e.g. "Jigsaw")
- `team String?` — `"PS"` or `"BU"` derived from tags (`bu_ps` → PS, `bu_other` → BU)
- `ghiId String?` — GitHub issue number from GHI custom field
- `ghiStatus String?` — GitHub issue status from GHI custom field
- `isBuPs Boolean` — true if ticket is part of BU/PS view #64 sync
- `postsStatus String` — `"none" | "fetching" | "done" | "error"` — tracks background post-fetch state

### `ticket_posts`
Individual posts per ticket. Unique on `(ticketId, kayakoPostId)`.

### `ticket_analyses`
Cached AI results. Unique on `(ticketId, userId)`.

Key fields:
- `oneLiner String?` — extracted from `sections.one_liner`; stored as own column for BU/PS table queries
- `blockerType String?` — extracted from `sections.blocker_type`; stored as own column
- `inputTokens Int?` — Anthropic input token count (stored for cost tracking)
- `outputTokens Int?` — Anthropic output token count
- `status String` — `"pending" | "running" | "done" | "error"`

### `model_pricing`
Anthropic pricing rates per model per time period. `modelPattern` is a substring matched against the full model ID. `effectiveTo = null` means currently active. Managed in DB only — no UI. Seeded via `prisma/seed-pricing.sql`.

### `analysis_runs`
Append-only log. One row per API call to Anthropic — both analysis calls and export (markdown generation) calls. `ticketId` uses `onDelete: SetNull` so rows survive ticket deletion. `kayakoTicketId + kayakoUrl` enables automatic re-linking when the same ticket is re-imported.

Key field: `runType String @default("analysis")` — values: `"analysis"` (AI analysis) | `"download"` (markdown export generation).

### `ticket_exports`
Cached markdown export per user per ticket. Unique on `(ticketId, userId)`. Cascade delete from `tickets`.

Key fields:
- `markdownContent Text` — the full generated `.md` file content
- `modelUsed String?` — which Claude model was used for the overview section
- `inputTokens Int?` / `outputTokens Int?` — token counts for the Claude call
- `status String` — `"pending" | "running" | "done" | "error"`
- `errorMsg String?`

### `filter_presets`
Saved URL-filter presets for the BU/PS Tickets page. Unique per `(userId, name)` is not enforced — names can repeat. Cascade delete from `user_settings`.

Key fields:
- `name String` — display name (user-supplied)
- `filtersJson String` — canonical serialized query string (page stripped to 1, via `buTicketsFilterSignature`)
- `visibility FilterPresetVisibility` — `PERSONAL` or `SHARED`
- `isDefault Boolean` — only one default per user enforced by `setDefaultBuTicketFilterPreset` action (clears others before setting)

---

## Key Architecture: DB-First Fetch

The `/api/ticket` and `/api/bu-tickets/[id]` routes use a **DB-first** pattern:
1. Check DB for cached ticket with `postsStatus = 'done'` — if found, return immediately (`fromCache: true`)
2. If not cached or `forceRefresh=true` — authenticate with Kayako, call `fetchAndPersistTicket()`, return fresh data

### `lib/kayako/ticketService.ts`

Single shared service used by both Ticket Analyser and BU/PS refresh. Key exports:

| Export | Description |
|---|---|
| `fetchAndPersistTicket(caseId, client, kayakoUrl)` | Fetches full ticket from Kayako, persists to DB, returns `{ ticket: TicketRow, posts: UnifiedPost[], warning? }` |
| `resolvePostChannel(post)` | Maps a raw `KayakoPost` to `"NOTE"`, `"CUSTOMER"`, `"SIDE_CONVERSATION"`, or `"MAIL"` — uses `source_channel.type`, `original.resource_type`, `is_requester` |
| `extractSpecialFields(fields)` | Derives `product`, `ghiId`, `holdReason`, `jiraFields` from resolved custom fields |
| `extractTeam(tags)` | Returns `"PS"` / `"BU"` / `null` from tags |
| `ticketRowToKayakoCase(ticket)` | Converts DB ticket row to `KayakoCase` shape for the AI analyser |
| `dbPostsToKayakoPosts(posts)` | Converts DB post rows to `KayakoPost[]` for the AI analyser |
| `dbTicketToRow(t)` | Converts Prisma ticket record to `TicketRow` (API response shape) |
| `dbPostToUnified(p)` | Converts Prisma post record to `UnifiedPost` (API response shape) |

---

## AI Analysis

- **Default model**: `claude-haiku-4-5-20251001`
- **Complex tickets** (score ≥ 3): `claude-sonnet-4-6`
  - Score: >15 posts (+2), >30 posts (+2 more), urgency keywords (+1), >7 days old (+2)
- **Sections** (8): `one_liner` · `blocker_type` · `blocker_detail` · `path_to_closure` · `case_summary` · `customer_sentiment` · `what_needed` · `next_steps` + `day_summaries`
- **`oneLiner` + `blockerType`** — also stored as dedicated DB columns on `ticket_analyses` for efficient querying in the BU/PS table
- **`max_tokens`**: 2500
- **Analysis route reads from DB**: `/api/analysis` does not accept `caseData`/`posts` in the body
- **Cache**: PostgreSQL (persists across sessions). Per-user, unique on `(ticketId, userId)`. Cleared from UI state when a note is posted.
- **Token tracking**: `inputTokens` and `outputTokens` stored in both `ticket_analyses` and `analysis_runs`
- **Run logging**: every analysis or export attempt (success or error) appends a row to `analysis_runs` — never modified, orphan-safe. `runType` field distinguishes `"analysis"` from `"download"` calls.
- **Cost calculation**: `lib/pricing.ts` — `findPricing` matches model pattern + date range against `model_pricing` table; `computeCost` returns USD amounts

### Ticket Markdown Export (`generateTicketMarkdown`)

`lib/anthropic/client.ts` also exports `generateTicketMarkdown(ticket, posts, analysis, apiKey)`:
- **Approach**: fully programmatic markdown — all metadata, posts, and AI analysis sections are built in TypeScript code. Claude is called **only** for a 3-5 bullet "Overview" section (`max_tokens: 400`, `claude-haiku-4-5-20251001`).
- **Why programmatic**: initially tried asking Claude to generate the entire markdown, but output was truncated on large tickets (60+ posts), causing missing posts and the analysis section (which appeared last). Programmatic generation guarantees completeness regardless of ticket size.
- **HTML stripping**: `stripHtml(html)` regex-strips HTML from post contents before including in the markdown.
- **Channel labels**: `postChannelLabel(channel)` maps channel string → emoji prefix (🔒 Internal Note, 👤 Customer, 💬 Support Reply, ↗ Side Conversation).
- **Returns**: `ExportResult { markdown, model_used, input_tokens, output_tokens }`
- The generated markdown is cached in `ticket_exports` (per user per ticket). Re-running via "↻ Regenerate" passes `forceRefresh=true` to `/api/export`.

### `lib/pricing.ts`

| Export | Description |
|---|---|
| `findPricing(modelId, runDate, rows)` | Substring match + date range → `PricingRow \| null` |
| `computeCost(inputTokens, outputTokens, pricing)` | Returns `{ inputCostUsd, outputCostUsd, totalCostUsd }` |
| `formatCostUsd(n)` | Auto-scaling USD display: `$0.0023`, `$0.12`, `$1.50` |

---

## API Routes Summary

| Route | Method | Description |
|---|---|---|
| `POST /api/ticket` | POST | DB-first ticket fetch; calls `fetchAndPersistTicket` on miss; returns `TicketResponse` (includes `cachedAnalysis?`, `analysisRuns[]`, `export?` for auto-load in TicketAnalyser) |
| `POST /api/analysis` | POST | AI analysis — reads ticket+posts from DB; accepts `{ caseId, kayakoUrl?, forceRefresh? }` |
| `POST /api/export` | POST | Generate + cache ticket markdown export; accepts `{ caseId, forceRefresh? }`; returns `{ markdown, fromCache }` |
| `POST /api/note` | POST | Post internal note to Kayako |
| `GET /api/settings` | GET | Return non-sensitive settings for current user |
| `POST /api/settings` | POST | Save/update encrypted Kayako + Anthropic credentials |
| `GET /api/credentials` | GET | Returns `{ hasKayako, hasAnthropic }` booleans — used by UI banners |
| `GET /api/bu-tickets` | GET | List all BU/PS tickets from DB (legacy — BU/PS page now fetches server-side via `fetchBuTicketsPage`) |
| `GET /api/bu-tickets/export` | GET | All filtered rows for CSV export (no pagination); called by BUTicketsTable `exportToCsv()` |
| `DELETE /api/bu-tickets` | DELETE | Admin-only: delete by IDs or all (still used by BUTicketsTable + BUTicketsToolbar) |
| `POST /api/bu-tickets/sync` | POST | Full sync from Kayako view #64 (batched, upserts tickets) |
| `POST /api/bu-tickets/sync-posts` | POST | Background: fetch posts for 10 BU/PS tickets per run |
| `POST /api/bu-tickets/analyse-batch` | POST | Background: run AI analysis on 5 BU/PS tickets per run |
| `GET /api/bu-tickets/[id]` | GET | Single ticket + posts + cached analysis + `analysisRuns[]` (with cost fields + runType) + `export?` from DB |
| `POST /api/bu-tickets/[id]/refresh` | POST | Re-fetch ticket from Kayako, persist, return `TicketResponse` |

---

## Phase 15 — URL-Driven BU/PS Tickets (Filter, Sort, Pagination, Presets)

### Architecture overview

`app/(dashboard)/bu-tickets/page.tsx` is now an **async Server Component**. It:
1. Parses `searchParams` (plain object in Next.js 14 App Router) via `parseBuTicketsSearchParams`
2. Fetches page of tickets + filter options + presets + global lastSyncedAt in `Promise.all`
3. Redirects to default preset on first load (if user has one and no QS is present)
4. Passes data to Client Components via props

### Key library files

| File | Purpose |
|---|---|
| `lib/bu-tickets-list-filters.ts` | Pure functions: parse/serialize URL params, build sort hrefs, count active filters, preset signature |
| `lib/bu-tickets-list-query.ts` | Server-only: `buildBuTicketsWhere`, `orderByBuTickets`, `fetchBuTicketsPage`, `fetchBuTicketsFilterOptions` |
| `app/actions/bu-ticket-filter-presets.actions.ts` | Server Actions: CRUD for `filter_presets` table + `fetchPresetsForUser` |

### Component roles (Phase 15)

| Component | Role |
|---|---|
| `BUTicketsToolbar` | Client. Sync Now (POST /api/bu-tickets/sync), Delete All (DELETE /api/bu-tickets), last-synced display. Calls `router.refresh()` after mutations. |
| `BUTicketsFilters` | Client. Search bar always-visible + debounced 350 ms (live URL update). Collapsible filter panel: scrollable checkbox groups (`max-h-36`), "All · None" per group, draft state → Apply → `router.push`. Preset pills, Save preset dialog, Manage presets. Draft syncs via `useEffect([paramsSig])` — **no `key` remount**. |
| `BUTicketsTable` | Client. URL sort headers (`<Link href={buTicketsSortHref(...)}>`) + pagination footer (`<Link href={buTicketsPageHref(...)}>`) + checkbox selection + delete selected (DELETE /api/bu-tickets, then `router.refresh()`). Uses `useSearchParams()` to build sort/page hrefs. |

### Filter preset notes
- `filtersJson` is the canonical QS (page stripped to 1) produced by `buTicketsFilterSignature(filters)`
- A preset "matches" the current view when `preset.filtersJson === currentQS`
- Only one default per user — `setDefaultBuTicketFilterPreset` clears others in a `$transaction`
- `prisma.filterPreset` accessed via `prisma as any` guard in actions — safe to write before `db:push` but will fail at runtime until the schema is pushed
- **Must run `npm run db:push` after pulling Phase 15** to create the `filter_presets` table

### Tests (Phase 15)
- `__tests__/lib/bu-tickets-list-filters.test.ts` — 37 tests covering all pure filter functions
- `__tests__/lib/bu-tickets-list-query.test.ts` — 16 tests covering `buildBuTicketsWhere` and `orderByBuTickets`
- Run: `npm test` (vitest run)

---

## Important Build Notes

- `next.config.mjs` — Next.js 14 does **not** support `.ts` config files
- `tsconfig.json` has `"target": "ES2017"` — required for `Set`/`Map` spread/iteration
- `tsconfig.json` `exclude` list includes `"Spec"` — the `Spec/` directory contains template files that must not be compiled by TypeScript
- `lib/utils.ts`: `safeName`, `safeLabel`, `extractEmail` accept `object | null | undefined` — pass Kayako objects directly, no cast needed
- Supabase SSR cookie callbacks: use inline type `{ name: string; value: string; options: CookieOptions }[]` — **not** `CookieOptionsWithName` (that type doesn't have a `value` field)
- `KayakoClient` is instantiated fresh per API route call — no shared state between requests
- **Authorization header must be sent on every Kayako request**, not just during auth. Python's `requests.Session` does this automatically; TypeScript stores `authHeader` and includes it in `headers()` on all subsequent calls. Without it, case/post fetches return 401 despite a valid session_id.
- **Two env files**: Prisma reads `.env` (needs `DATABASE_URL` + `DIRECT_URL`). Next.js reads `.env.local` (all other vars). Keep both in sync.
- **Supabase direct connection (port 5432)** is blocked on corporate networks. Use the **session mode pooler** (`pooler.supabase.com:5432`) for `DIRECT_URL` instead.
- **Prisma client must be regenerated** after schema changes: `npm run db:generate` (or `npm run db:push` which runs it). If the dev server is running, stop it first — the DLL is locked on Windows.
- **Stale Prisma client guard**: `/api/bu-tickets/sync` checks `'ticket' in prisma` at startup and returns a helpful error if the client is out of date.
- **`@tailwindcss/typography`** added as a dependency — needed for `prose` styling of Kayako HTML post content rendered via `dangerouslySetInnerHTML`. Remove `.next/` cache if the dev server was running when the package was installed (vendor-chunks error).
- **Post contents are HTML**: Kayako stores post bodies as HTML strings. `ConversationThread` renders them with `dangerouslySetInnerHTML` + `prose prose-sm` classes. Do NOT use `whitespace-pre-wrap` plain text rendering.
- **`mapTicket` in sync/route.ts** sets `requesterKayakoId: caseData.requester?.id ?? null` — needed for `ConversationThread`/`Timeline` to colour-code customer posts. Must be kept in sync with `fetchAndPersistTicket` in `ticketService.ts`.
- **Dual-pull architecture** — TA and BU/PS detail Refresh use `fetchAndPersistTicket` (via `ticketService.ts`). BU/PS bulk Sync has its own `mapTicket`/`resolveCustomFields`/`extractTeam` in `sync/route.ts` (intentionally separate — pre-fetches shared data once for all tickets, necessary for performance). **Do not merge or refactor without Sahil's sign-off**. If field extraction logic is changed in one path, the equivalent change must be made in the other — flag this to Sahil before touching either.
- **`TicketResponse.cachedAnalysis`** — `/api/ticket` now includes `cachedAnalysis?: AnalysisResult | null` in both the DB-first cache hit and live fetch responses. `TicketAnalyser.doFetch()` checks this field and auto-calls `setAnalysis(data.cachedAnalysis)` so the AI tab pre-populates on load for tickets that have been previously analysed.

---

## Supabase Setup Checklist

- [x] Create Supabase project (JigTree Operations, Asia-Pacific)
- [x] Copy `DATABASE_URL` (port 6543, pgbouncer=true) and `DIRECT_URL` (session pooler port 5432) into `.env` and `.env.local`
- [x] Run `npm run db:push` — tables created
- [x] Run RLS policies in Supabase SQL editor (see `docs/setup.md`) — applied for all tables
- [x] Enable Google provider in Supabase Auth → Providers → Google
- [x] Set Google Client ID + Secret in Supabase
- [x] Add `http://localhost:3000/auth/callback` to Supabase redirect URLs
- [x] Add Supabase callback URL to Google Cloud OAuth redirect URIs

**Note on `DIRECT_URL`**: The direct DB host (`db.xxxx.supabase.co:5432`) is blocked on corporate networks. Use the session mode pooler instead: `postgresql://postgres.xxxx:pass@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres`

---

## Custom Commands

`.claude/commands/document.md` — invoke with `/document` in any Claude Code session in this workspace.
Runs a full documentation pass: updates `CLAUDE.md`, all `docs/` files, `PLAN.md`, and `docs/NextActions.md`.

`.claude/commands/filter-model.md` — invoke with `/filter-model` to get the full URL-driven filter pattern spec when implementing a new filtered/sorted/paginated page. Documents all required exports, component contracts, and test expectations.

---

## Documentation

All docs are in `docs/`. A project-level `CHANGELOG.md` is maintained in the root.

| File | Contents |
|---|---|
| `CHANGELOG.md` | Version history — introduced at v1.0.0 |
| `docs/overview.md` | Architecture diagram, tech stack, full file map |
| `docs/setup.md` | Full install + deploy guide, RLS SQL, troubleshooting |
| `docs/auth.md` | Google OAuth → Supabase flow, middleware, session management |
| `docs/database.md` | Prisma schema, connection strings, RLS, schema change workflow |
| `docs/encryption.md` | AES-256-GCM, blob format, key generation, rotation |
| `docs/kayako-integration.md` | KayakoClient methods, ticketService, pagination strategy, user resolution |
| `docs/ai-analysis.md` | Model selection, prompt, output sections, caching, token tracking, API shapes |
| `docs/api-routes.md` | All routes: request/response shapes, steps, error codes |
| `docs/components.md` | Component tree, props, behaviours, utility functions |
| `docs/filter-model.md` | URL-driven filter pattern (Phase 15) — architecture, file roles, data contracts, replication guide |
| `docs/NextActions.md` | Prioritised next actions — what Claude can do vs what Sahil must provide |

---

## Stale Analysis Detection (Export + Download)

When "Download .md" is clicked, both the Ticket Analyser and BU/PS detail page check whether the current AI analysis is stale relative to the ticket's last fetch. The stale check uses:

```typescript
const fetchMs = Math.max(
  new Date(ticket.lastSyncedAt).getTime(),
  ticket.postsLastSyncedAt ? new Date(ticket.postsLastSyncedAt).getTime() : 0,
)
const stale = !!analysis?.created_at && fetchMs > new Date(analysis.created_at).getTime()
```

**Why `Math.max`**: The BU/PS `Sync Now` route only updates `lastSyncedAt` (ticket metadata). The `sync-posts` route and individual Refresh button update `postsLastSyncedAt` (via `fetchAndPersistTicket`). Taking `Math.max` means either sync path correctly triggers the stale condition.

If stale (or `forceRefresh=true`): analysis is re-run first (with `forceRefresh=true`), then the export is regenerated. The "⬇ Download .md" button shows the current phase ("Refreshing analysis…" / "Generating export…") while this happens.

---

## Important Notes

- The sandbox **cannot** reach `central-supportdesk.kayako.com`. All Kayako calls must run on Sahil's machine.
- `.env.local` must never be committed to version control.
- The Streamlit tool (`C:\Users\sahil\CoWork\Central Kayako Tickets\`) is a separate codebase — do not modify it from this workspace.
