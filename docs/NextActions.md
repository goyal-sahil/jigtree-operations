# Next Actions

_Last updated: 2026-04-22_

---

## What's working (v1.0.0 + post-launch fixes + Phases 15 & 17.1)

- Google SSO login, Settings page, Ticket Analyser (DB-first, Refresh, Force re-run, Escape key)
- AI analysis: 8-section prompt, Haiku/Sonnet selection, `max_tokens=2500`, token tracking, retry on Anthropic 500
- Cached analysis auto-loads on ticket fetch (`cachedAnalysis` in `/api/ticket` response)
- Tags reliable (dedicated `/api/v1/cases/{id}/tags` endpoint)
- **Ticket Markdown Export** — "⬇ Download .md" on both Ticket Analyser and BU/PS detail pages; programmatic build + Claude Overview; cached in `ticket_exports`; stale-aware; "↻ Regenerate"
- **API Usage History** — `AnalysisHistory` on both pages; `runType` field distinguishes analysis vs download; total cost footer
- USD cost calculation from `model_pricing` table; per-run costs in API Usage History
- Conversation thread: 4-type filter, HTML rendering, overflow-safe
- Timeline, Add Note, Credentials banner
- **Phase 15 — BU/PS Tickets URL-driven filtering**:
  - Async Server Component page; all filter/sort/page state in URL
  - Server-side Prisma queries (`lib/bu-tickets-list-query.ts`)
  - Filter panel with NProgress (`navigate()` helper), debounced search, scrollable checkbox groups, draft state
  - Filter presets: personal + shared, default preset redirect, save/delete/set-default
  - **Update preset button** — shown when draft differs from active own preset
  - **Visibility toggle** — PERSONAL ↔ SHARED per preset
  - `BUTicketsTable`: URL sort headers, pagination footer, **column visibility dropdown**, **CSV export** (all filtered rows via `GET /api/bu-tickets/export`)
  - `BUTicketsToolbar` extracted: sync + delete-all + last-synced
  - 53 unit tests (37 filter layer + 16 query builder)
- **Phase 17.1 — Admin section**: `/admin` page, `AdminPresetsTable`, admin-gated sidebar + Hub tile
- RLS policies applied in Supabase (all tables including `filter_presets`)
- Filter model documented and productised: `docs/filter-model.md`, `.claude/commands/filter-model.md` skill, `Spec/Filter-Sorting/` templates updated to finalized pattern
- Deployed: https://jigtree-operations.vercel.app | GitHub: `goyal-sahil/jigtree-operations`

---

## What I need from Sahil

### For Phase 16 — Notion Portfolio Integration (planned, not started)

- [ ] **Notion Internal Integration token** — create at https://www.notion.so/my-integrations → New integration → copy the token. Add to Vercel env as `NOTION_API_TOKEN` and to `.env.local`
- [ ] **Share the Notion database with the integration** — in Notion, open the Portfolio database → ··· menu → Add connections → select your integration. Without this the API returns 404 even with a valid token.
- [ ] **Confirm the Notion database ID** — `28485e927d3181c89d6cdd6fd57ea07d` (from PLAN.md) — confirm this is still the right database and hasn't been moved.

---

## What Claude can do next (no input needed)

### Minor improvements (Phase 15 follow-ups)

- [ ] Add `&& prisma generate` to the `db:push` npm script so schema + client are always in sync: `"db:push": "prisma db push && prisma generate"`
- [ ] Add Vitest to `prebuild` CI step: `"prebuild": "npm test"` — will catch filter logic regressions before deploy

### Phase 16 — Notion Portfolio Integration (once Sahil provides token)

Full spec in `PLAN.md § 16`. Blocked on Notion token + database share. Once those are provided, the implementation order is: schema → Notion sync service → API routes → portfolio page → match panel → surface data on BU/PS tickets.
