# Next Actions

_Last updated: 2026-04-17_

---

## What's working

- Google SSO login ✓
- Settings page (save Kayako + Anthropic credentials) ✓
- Ticket fetch (case metadata + all posts + author names) ✓
- Custom fields resolved with human-readable labels (incl. Product) ✓
- AI analysis (Haiku / Sonnet, cached in PostgreSQL) ✓
- Conversation thread, Timeline, Add Note tabs ✓
- Deployed to Vercel: https://jigtree-operations.vercel.app ✓
- GitHub: goyal-sahil/jigtree-operations ✓

---

## Phase 11 — JigTree Operations Hub + Layout (next up)

**Spec:** `docs/bu-ps-tickets-spec.md` §2–3

### What Claude will build
- [ ] `components/Sidebar.tsx` — collapsible left sidebar with icon + label nav, user footer
- [ ] Update `app/(dashboard)/layout.tsx` — sidebar layout, retire NavBar
- [ ] Move Ticket Analyser to `app/(dashboard)/analyser/page.tsx`
- [ ] `components/HubPage.tsx` — tile grid (Ticket Analyser + BU/PS Tickets tiles)
- [ ] Update `app/(dashboard)/page.tsx` — render Hub

---

## Phase 12 — BU/PS Tickets (after Phase 11)

**Spec:** `docs/bu-ps-tickets-spec.md` §4–13  
**Kayako view:** https://central-supportdesk.kayako.com/agent/conversations/view/64

### What Claude will build
- [ ] Extend `prisma/schema.prisma` with `BuPsTicket`, `BuPsTicketPost`, `BuPsTicketCustomField`
- [ ] Extend `types/kayako.ts` with `BuPsTicketRow`, `KayakoOrganization`
- [ ] Add `getViewCases(viewId)` to `KayakoClient`
- [ ] `app/api/bu-tickets/route.ts` — GET from DB
- [ ] `app/api/bu-tickets/sync/route.ts` — POST sync from Kayako
- [ ] `components/BUTicketsTable.tsx` — sortable, filterable, paginated table
- [ ] `app/(dashboard)/bu-tickets/page.tsx`

### What Sahil needs to do after Phase 12
1. **Test sync endpoint** — click "Sync Now" on the live app, confirm tickets load
2. **Verify view API** — if sync fails with 404, the fallback `?view_id=64` will auto-trigger; confirm which works
3. **Run RLS policies** in Supabase SQL editor (see `docs/bu-ps-tickets-spec.md` §9)

---

## Backlog (after Phase 12)

### Claude can do independently
- [ ] **Mobile responsiveness** — `sm:` Tailwind breakpoints on ticket analyser grid
- [ ] **Skeleton loading states** — animated skeletons during ticket fetch and AI analysis
- [ ] **Anthropic retry on 500** — 1 retry after 2s for transient errors
- [ ] **BU/PS ticket drill-down** — click a row to open full post history + run AI analysis
- [ ] **Automated sync** — Vercel cron job to sync BU/PS tickets every N hours
- [ ] **JIRA fields view** — expandable panel per ticket showing all JIRA field details

### Needs input from Sahil
- [ ] **Additional Hub tiles** — what other tools to add (e.g. reporting, escalation tracker)
- [ ] **RLS for BU/PS sync** — confirm whether sync should be restricted to specific users
- [ ] **JIRA column display** — confirm which JIRA field values to show in the table CSV column

---

## Infra checklist

- [ ] **Run RLS policies** in Supabase SQL editor for existing tables (`user_settings`, `ticket_analyses`)
- [ ] **Run RLS policies** for new BU/PS tables after Phase 12 (see spec §9)
