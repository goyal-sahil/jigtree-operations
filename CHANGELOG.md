# Changelog

All notable changes to JigTree Operations Hub are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

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
