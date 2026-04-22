# Changelog

All notable changes to JigTree Operations Hub are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.1.0] — 2026-04-22

### Added

**BU/PS Tickets — URL-Driven Filtering, Sorting & Presets (Phase 15)**
- `app/(dashboard)/bu-tickets/page.tsx` rewritten as async Server Component — all filter/sort/page state in URL query string; URL is the single source of truth
- `lib/bu-tickets-list-filters.ts` — pure isomorphic helpers: `parseBuTicketsSearchParams`, `serializeBuTicketsParams`, `buTicketsSortHref`, `buTicketsPageHref`, `countActiveFilters`, `buTicketsFilterSignature`, `urlSearchParamsToRecord`
- `lib/bu-tickets-list-query.ts` — server-only Prisma queries: `buildBuTicketsWhere`, `orderByBuTickets`, `fetchBuTicketsPage`, `fetchAllBuTickets` (for CSV), `fetchBuTicketsFilterOptions`
- `app/actions/bu-ticket-filter-presets.actions.ts` — Server Actions: `fetchPresetsForUser`, `createBuTicketFilterPreset`, `deleteBuTicketFilterPreset`, `setDefaultBuTicketFilterPreset`, `clearDefaultBuTicketFilterPreset`, `updateBuTicketFilterPresetFilters`, `toggleBuTicketFilterPresetVisibility`
- `GET /api/bu-tickets/export` — returns all filtered rows (no pagination) for CSV download
- `filter_presets` table in Prisma schema + `FilterPresetVisibility` enum (`PERSONAL` / `SHARED`)
- RLS policy for `filter_presets` applied in Supabase

**BUTicketsFilters component** — new client component:
- Search bar always-visible, debounced 350 ms, stale-closure-safe
- NProgress integration: `navigate()` helper with `NProgress.start()` + `router.push()`; `useEffect` fires `NProgress.done()` on URL change
- Collapsible filter panel with `ScrollableCheckboxGroup` sub-component (`max-h-36 overflow-y-auto`, "All · None" buttons)
- Draft state synced via `useEffect([paramsSig])` — no `key` remount (preserves in-progress selections during debounced search)
- Preset pills: active = blue, ★ default prefix, "Shared" badge for others' shared presets
- **Update preset button**: shown when current draft differs from active own preset's saved filters
- **Visibility toggle**: PERSONAL ↔ SHARED per preset (eye/badge button)
- Inline delete confirmation (no modal); `useTransition` + `loadingId` for per-item spinners

**BUTicketsTable updates** — refactored client component:
- URL sort headers (`<Link href={buTicketsSortHref(...)}>`); no click handlers
- Pagination footer with prev/next, page numbers (ellipsis), page size selector; all `<Link>` elements
- **Column visibility dropdown**: all visible by default, `id` always-visible, click-outside close, "Reset to defaults"
- **CSV export**: fetches `GET /api/bu-tickets/export` (ALL filtered rows, not current page); BOM-prefixed for Excel; respects visible columns

**BUTicketsToolbar** — extracted client component for sync + delete-all + last-synced

**Admin Section (Phase 17.1)**
- `app/(dashboard)/admin/page.tsx` — admin-gated Server Component (redirects non-admins to `/`)
- `components/AdminPresetsTable.tsx` — all filter presets grouped by user; admin can delete any
- `app/actions/admin.actions.ts` — `adminDeleteFilterPreset` Server Action
- Sidebar shows "Administration" nav item for admin users only; HubPage shows "Administration" tile section

**Ticket Markdown Export**
- `POST /api/export` — generates + caches a full `.md` file per user per ticket
- `generateTicketMarkdown()` in `lib/anthropic/client.ts` — programmatic markdown (all metadata, posts, AI sections) + Claude Haiku-written Overview section (max 400 tokens)
- `ticket_exports` table: cached per user per ticket; `status` lifecycle; `runType='download'` in `analysis_runs`
- "⬇ Download .md" button on both Ticket Analyser and BU/PS detail pages
- Stale-aware: re-runs analysis first if `Math.max(lastSyncedAt, postsLastSyncedAt) > analysis.created_at`
- "↻ Regenerate" link shown when an export already exists

**API Usage History**
- `analysis_runs.runType` field (`"analysis"` | `"download"`) — distinguishes analysis calls from export calls
- `AnalysisHistory` component updated: renamed to "API Usage History"; new Type column with badge (Analysis/Download)
- `AnalysisHistory` now shown on both Ticket Analyser and BU/PS detail pages
- `/api/ticket` and `GET /api/bu-tickets/[id]` include `analysisRuns[]` and `export?` in responses

**Other**
- Cached analysis auto-loads on ticket fetch: `/api/ticket` returns `cachedAnalysis` in response; `TicketAnalyser` sets AI tab without extra API call
- Tags fix: `getCase()` now calls `getCaseTags()` (dedicated `/api/v1/cases/{id}/tags` endpoint) — fixes `+` URL encoding issue that silently dropped tags
- 53 unit tests (Vitest): 37 `bu-tickets-list-filters.test.ts` + 16 `bu-tickets-list-query.test.ts`

**Filter Model Spec & Tooling**
- `docs/filter-model.md` — full URL-driven filter pattern reference for this app
- `.claude/commands/filter-model.md` — Claude skill invoked with `/filter-model` for implementing new filtered pages
- `Spec/Filter-Sorting/` templates fully rewritten to match finalized pattern (NProgress, `router.push`, Prisma `findMany`, all 7 preset actions, column visibility, CSV export)
- New `Spec/Filter-Sorting/templates/ModuleTable.tsx` template

### Changed

- `app/(dashboard)/bu-tickets/page.tsx` — converted from client-fetch to async Server Component
- `components/BUTicketsTable.tsx` — removed inline filter/sort state; URL-driven; added column visibility + CSV export
- `components/Sidebar.tsx` — added "Support Tickets" collapsible section; admin-only "Administration" link
- `components/HubPage.tsx` — added admin "Administration" tile section (admin-gated)
- `lib/anthropic/client.ts` — added `generateTicketMarkdown()` and `ExportResult` type
- `prisma/schema.prisma` — added `FilterPreset` model + `FilterPresetVisibility` enum; added `TicketExport` model; added `runType` to `AnalysisRun`
- All docs updated: `CLAUDE.md`, `PLAN.md`, `docs/overview.md`, `docs/api-routes.md`, `docs/components.md`, `docs/NextActions.md`

---

## [1.0.0] — 2026-04-21

First complete release. All Phases 1–14 implemented and deployed.

### Added

**Hub & Navigation**
- `HubPage` tile grid linking to Ticket Analyser and BU/PS Tickets
- `Sidebar` collapsible left nav with active route highlight and sign-out
- `CredentialsBanner` shown on both main pages when Kayako or Anthropic credentials are missing
- `TimezoneProvider` context + `lib/tz.ts` — browser timezone propagated app-wide for consistent date display

**BU/PS Tickets Table**
- Full sync from Kayako view #64 (`POST /api/bu-tickets/sync`) — batched 5 at a time with shared status/priority/field lookups
- Background post fetch (`POST /api/bu-tickets/sync-posts`) — 10 tickets per run, `postsStatus` lifecycle
- Background batch AI analysis (`POST /api/bu-tickets/analyse-batch`) — 5 tickets per run
- `BUTicketsTable` — sortable/filterable table with columns: ID, Esc, Team, Title, One-liner (AI), Blocker Type (AI), Product, Customer, Priority, Status, Age Risk, Last Analysed
- Admin controls (via `ADMIN_EMAILS` / `NEXT_PUBLIC_ADMIN_EMAILS`): row selection, Delete selected, Delete All
- `GET /api/bu-tickets` — list all BU/PS tickets; `DELETE /api/bu-tickets` — admin delete

**BU/PS Ticket Detail Page**
- `app/(dashboard)/bu-tickets/[id]/page.tsx` — full detail page sharing all Ticket Analyser components
- `GET /api/bu-tickets/[id]` — single ticket + posts + cached analysis + analysis run history (with cost fields)
- `POST /api/bu-tickets/[id]/refresh` — re-fetch from Kayako via shared `fetchAndPersistTicket()`
- Stale-data banner when `postsStatus !== 'done'`

**Unified DB Schema (Prisma)**
- `tickets` table — unified cache for both Ticket Analyser and BU/PS sync; unique on `(kayakoTicketId, kayakoUrl)`; includes `requesterKayakoId`, `brand`, `team`, `ghiId`, `ghiStatus`, `customFields`, `isBuPs`, `postsStatus`
- `ticket_posts` table — all posts per ticket; `channel` field stores resolved post type
- `ticket_analyses` table — per-user AI results; includes `oneLiner`, `blockerType`, `inputTokens`, `outputTokens`
- `model_pricing` table — Anthropic pricing rates per model per date range; seeded via `prisma/seed-pricing.sql`
- `analysis_runs` table — append-only log of every analysis attempt; `ticketId onDelete: SetNull` for orphan safety; `kayakoTicketId + kayakoUrl` for auto re-linking

**AI Analysis**
- 8-section prompt: `one_liner`, `blocker_type`, `blocker_detail`, `path_to_closure`, `case_summary`, `customer_sentiment`, `what_needed`, `next_steps` + `day_summaries`
- `oneLiner` and `blockerType` stored as dedicated DB columns for efficient BU/PS table queries
- `max_tokens` increased to 2500
- Every analysis attempt (success or error) logged to `analysis_runs` with `trigger` (`manual` / `forced` / `batch`), duration, token counts

**Cost Tracking**
- `lib/pricing.ts` — `findPricing` (date-range + substring model match), `computeCost`, `formatCostUsd`
- Costs computed at query time from `model_pricing`; historical runs use the prices active when they ran
- `AnalysisHistory` component — collapsible table with per-run input/output/total costs + running total footer; orphaned run labels with tooltip

**Kayako Integration**
- `lib/kayako/ticketService.ts` — shared service: `fetchAndPersistTicket`, `resolvePostChannel`, `extractSpecialFields`, `extractTeam`, `dbTicketToRow`, `dbPostToUnified`, `ticketRowToKayakoCase`, `dbPostsToKayakoPosts`
- Post channel resolution: `source_channel.type`, `original.resource_type`, `is_requester` — correct for Customer / Support / Internal Note / Side Conversation
- HTML post rendering via `dangerouslySetInnerHTML` + `@tailwindcss/typography` `prose prose-sm`
- Side conversation posts shown with placeholder when contents are empty
- Custom field resolution including SELECT/RADIO option labels via `include=field_option,locale_field`
- `requesterKayakoId` stored on tickets for customer post colour-coding

**Conversation & Display**
- `ConversationThread` 4-type filter toggles (Customer / Support / Internal Note / Side Conversation) — only shows types present in the ticket
- `Timeline` date-grouped view with AI day summaries, colour-coded by post type
- `TicketCard` — hold reason banner, ESC/Team badges, GHI link, JIRA keys, collapsible custom fields, product badge

**API & Credentials**
- `GET /api/credentials` — `{ hasKayako, hasAnthropic }` booleans for banner display
- `GET /api/settings` — pre-fill settings form
- DB-first pattern across all ticket fetch routes

**Security**
- RLS policies applied for all 6 tables: `user_settings`, `tickets`, `ticket_posts`, `ticket_analyses`, `analysis_runs`, `model_pricing`

### Changed

- `app/(dashboard)/page.tsx` — replaced placeholder with `HubPage` tile grid
- `app/(dashboard)/layout.tsx` — added `Sidebar` + `TimezoneProvider`; removed top `NavBar`
- `POST /api/analysis` — now reads ticket + posts from DB (no longer accepts them in request body); logs to `analysis_runs`
- `POST /api/ticket` — uses shared `fetchAndPersistTicket()` from `ticketService.ts`
- `lib/anthropic/client.ts` — updated to 8-section prompt, `max_tokens=2500`

---

## [0.1.0] — 2026-04-17

Initial scaffold committed to GitHub.

### Added

- Next.js 14 App Router project with TypeScript and Tailwind CSS
- Supabase Auth — Google OAuth only (`/login`, `/auth/callback`)
- Dashboard auth guard (`app/(dashboard)/layout.tsx`) — redirects to `/login` if no session
- `SettingsForm` + `POST /api/settings` / `GET /api/settings` — encrypted Kayako + Anthropic credentials
- `TicketAnalyser` — load any Kayako ticket by URL or ID, fetch full conversation, run AI analysis
- `POST /api/ticket` — fetch ticket + posts from Kayako with user resolution and pagination
- `POST /api/analysis` — AI analysis with Haiku/Sonnet model selection and PostgreSQL caching
- `POST /api/note` — post internal note to Kayako
- `TicketCard`, `ConversationThread`, `AIAnalysis`, `Timeline`, `AddNoteForm` components
- `KayakoClient` TypeScript port — Basic HTTP auth, case/post/user fetch, pagination, 15s timeouts
- AES-256-GCM credential encryption (`lib/encryption.ts`)
- Prisma 5 with initial schema: `UserSettings`, `Ticket`, `TicketPost`, `TicketAnalysis`
- Vercel deployment configuration (`vercel.json`, `prisma generate` in build step)
- `ADMIN_EMAILS` / `NEXT_PUBLIC_ADMIN_EMAILS` env vars for admin access control
- Docs: `docs/` folder with overview, setup, auth, database, encryption, kayako-integration, ai-analysis, api-routes, components
