# Next Actions

_Last updated: 2026-04-21_

---

## What's working

- Google SSO login, Settings page, Ticket Analyser (DB-first, Refresh, Force re-run, Escape key)
- AI analysis: 8-section prompt, Haiku/Sonnet selection, `max_tokens=2500`, token tracking, retry on Anthropic 500
- Analysis run history (`analysis_runs`): append-only, orphan-safe, auto-relink on re-import
- USD cost calculation from `model_pricing` table; `AnalysisHistory` component shows per-run and total costs
- Conversation thread: 4-type filter, HTML rendering, overflow-safe
- Timeline, Add Note, Credentials banner
- BU/PS Tickets table: sync, filter, sort, pagination, last-synced, admin delete
- BU/PS Ticket detail page: shared components, Refresh, AI analysis, stale-data banner, analysis run history
- `TimezoneProvider` + `lib/tz.ts`: browser timezone used for all date display
- Deployed: https://jigtree-operations.vercel.app | GitHub: `goyal-sahil/jigtree-operations`

---

## What Claude can do next (no input needed from Sahil)

- [ ] **Implement Phase 15: URL-Driven Filtering, Sorting & Saved Presets** (full plan in PLAN.md § 15)
  - 15.1 Add `FilterPreset` model + `FilterPresetVisibility` enum → `db:push` + `db:generate`
  - 15.2 Create `lib/bu-tickets-list-filters.ts` (filter type + parse/serialize/canonicalize)
  - 15.3 Create `lib/bu-tickets-list-query.ts` (Prisma WHERE + ORDER BY + pagination)
  - 15.4 Create `app/actions/bu-ticket-filter-presets.actions.ts` (CRUD server actions)
  - 15.5 Rewrite `app/(dashboard)/bu-tickets/page.tsx` as Server Component with searchParams
  - 15.6 Create `BUTicketsFilters.tsx`, `BUTicketsFilterPresetsToolbar.tsx`, `BUTicketsToolbar.tsx`
  - 15.7 Refactor `BUTicketsTable.tsx` (remove client-side filter/sort, URL-linked sort headers, pagination)
  - 15.8–15.10 Shared presets, validation, cleanup + deploy

- [ ] **Write RLS SQL** for `tickets`, `ticket_posts`, `ticket_analyses`, `analysis_runs`, `model_pricing` tables — scoped so users only see data matching their `userId` / `kayakoUrl`. Ready to paste into Supabase SQL editor.

- [ ] **Automated BU/PS sync via Vercel cron** — add a `GET` handler to `/api/bu-tickets/sync` and a `vercel.json` cron entry. Crons call GET, not POST.

---

## What I need from Sahil

- [ ] **Stop dev server + run `npm run db:generate`** — the Prisma client must be regenerated to pick up the `ModelPricing` and `AnalysisRun` models added in Phase 14. On Windows the DLL is locked while the dev server runs. Steps:
  1. Stop the dev server (`Ctrl+C`)
  2. `npm run db:generate`
  3. Restart: `npm run dev`

- [ ] **Run RLS policies in Supabase** — application-level filtering is in place but DB-level isolation is missing. Claude can write the SQL — Sahil pastes it into the Supabase SQL editor (Project → SQL Editor).

- [ ] **Deploy latest changes** — `git push origin main` to deploy Phase 14 changes (analysis run history, cost tracking, 8-section AI prompt, TimezoneProvider) to Vercel. Confirm when done.

- [ ] **Confirm `model_pricing` seed ran successfully** — the seed SQL (`prisma/seed-pricing.sql`) should have been run via `npx prisma db execute`. If costs still show "—" in the `AnalysisHistory` table, run it again:
  ```bash
  npx prisma db execute --file prisma/seed-pricing.sql
  ```
