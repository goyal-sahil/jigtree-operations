# URL-Driven Filter Model

_Introduced in Phase 15. Reference implementation: BU/PS Tickets (`/bu-tickets`). Replicated in Phase 16 for All Tickets (`/all-tickets`)._

This pattern is used for any page that needs server-side filtered/sorted/paginated data with a shareable URL state. It has been replicated twice in this app (BU/PS Tickets and All Tickets).

For project-agnostic templates that can be dropped into other Next.js + Prisma apps, see [`Spec/Filter-Sorting/`](../Spec/Filter-Sorting/).

---

## Principles

1. **URL is the single source of truth** — all filter, sort, and page state lives in the query string. Navigating to a URL reproduces the exact view.
2. **Server renders data** — the page component is an async Server Component that reads `searchParams`, queries Prisma, and passes typed results to Client Components.
3. **No client-side filter state machine** — Client Components hold only local draft state (checkboxes not yet applied) and the debounced search input.
4. **`router.push()` for all navigation** — never `<form method="GET">`. Allows NProgress integration and keeps App Router lifecycle intact.
5. **Mutations call `router.refresh()`** — any write operation (sync, delete, preset save) triggers a Server Component re-render without full page reload.

---

## Architecture

```
URL query string
    ↓ parseBuTicketsSearchParams()
BuTicketsListFilters (typed)
    ↓ fetchBuTicketsPage() [server-only, Prisma]
TicketRow[] + pagination metadata
    ↓ props
BUTicketsFilters (Client) — draft state + debounced search + preset management
BUTicketsTable (Client)  — Link sort headers + Link pagination + column visibility + CSV export
```

---

## File Roles

### `lib/bu-tickets-list-filters.ts`
Pure isomorphic functions — no DB, no server-only imports, safe in both Server and Client Components.

| Export | Description |
|---|---|
| `parseBuTicketsSearchParams(params)` | `Record<string, string \| string[]>` → typed `BuTicketsListFilters` |
| `serializeBuTicketsParams(filters)` | Typed filters → `URLSearchParams` (defaults omitted) |
| `buTicketsSortHref(params, field)` | Builds sort toggle URL from current params |
| `buTicketsPageHref(params, page)` | Builds page navigation URL |
| `countActiveFilters(filters)` | Number of active filter dimensions (0 = nothing applied) |
| `buTicketsFilterSignature(filters)` | Canonical QS with page stripped to 1 — used for preset matching and storage |
| `urlSearchParamsToRecord(params)` | Converts URLSearchParams to Record for round-trip testing |
| `DEFAULT_FILTERS` | Default filter values (sort: `kayakoUpdatedAt desc`, page: 1, pageSize: 25) |

### `lib/bu-tickets-list-query.ts`
Server-only (`import 'server-only'`). Direct Prisma queries.

| Export | Description |
|---|---|
| `buildBuTicketsWhere(filters, userId, kayakoUrl)` | Prisma `WHERE` clause from typed filters; uses `AND: []` array pattern |
| `orderByBuTickets(filters)` | Prisma `ORDER BY` clause |
| `fetchBuTicketsPage(filters, userId, kayakoUrl)` | Paginated Prisma query → `BuTicketsPage` |
| `fetchAllBuTickets(filters, userId, kayakoUrl)` | Same query but no `skip`/`take` — for CSV export |
| `fetchBuTicketsFilterOptions(userId, kayakoUrl)` | Distinct values for each checkbox group |

### `app/actions/bu-ticket-filter-presets.actions.ts`
Server Actions (`'use server'`). Full CRUD for the `filter_presets` table.

| Export | Description |
|---|---|
| `fetchPresetsForUser(userId)` | Returns own + all SHARED presets, default-first |
| `createBuTicketFilterPreset(name, filtersJson, visibility)` | Creates preset with canonical QS; revalidates `/bu-tickets` |
| `deleteBuTicketFilterPreset(id)` | Deletes own preset; revalidates |
| `setDefaultBuTicketFilterPreset(id)` | Sets one default; clears others in `$transaction`; revalidates |
| `clearDefaultBuTicketFilterPreset()` | Removes default flag from all own presets; revalidates |
| `updateBuTicketFilterPresetFilters(id, filtersJson)` | Overwrites preset's saved filters (Update button); revalidates |
| `toggleBuTicketFilterPresetVisibility(id)` | Flips `PERSONAL ↔ SHARED`; revalidates |

### `app/api/bu-tickets/export/route.ts`
`GET /api/bu-tickets/export` — auth check + parse same filter params + call `fetchAllBuTickets` + return `{ tickets }`.

---

## Component Roles

### `BUTicketsFilters` — Client Component

**Search bar** (always visible, outside the collapsible panel):
- Live-updates URL after 350 ms debounce
- Uses `useSearchParams()` inside the timeout callback — avoids stale closure (`filters` prop is stale inside setTimeout)
- Preserves all other params when updating search

**NProgress loading bar:**
- `navigate(url)` helper: calls `NProgress.start()` then `router.push(url)` — gives instant visual feedback on filter Apply, preset click
- `useEffect` on `searchParams.toString()` calls `NProgress.done()` when URL actually changes (navigation completed)
- `nextjs-toploader` only intercepts `<a>` tag clicks — does NOT fire for programmatic `router.push()`, hence the manual NProgress calls

**Collapsible filter panel** (auto-opens when `countActiveFilters > 0`):
- Each dimension uses `ScrollableCheckboxGroup`: bordered, `max-h-36 overflow-y-auto`, **All · None** buttons
- Local draft state — checkboxes update draft but do NOT navigate; Apply button commits
- `useEffect([paramsSig])` syncs draft from `filters` prop when URL changes — no `key` remount on parent

**Preset pills** (inline with filter toggle):
- Active preset = blue background
- `★` prefix for own default preset
- `Shared` badge for other users' SHARED presets
- **Update preset** button: appears when draft differs from active own preset; calls `updateBuTicketFilterPresetFilters`

**Preset management** (inside filter panel, own presets only):
- ★ star: toggles `isDefault` (set/clear in transaction)
- Eye/badge: toggles visibility (PERSONAL ↔ SHARED) — pill shows "Shared" (emerald) or "Private" (slate)
- ✕ delete: inline "Delete? Yes / No" confirmation — no modal

**`useTransition` + `loadingId`**: per-item spinner (star, delete, visibility) + global `isPending` disables all preset buttons during any transition.

### `BUTicketsToolbar` — Client Component
Handles write operations on the list (Sync Now, Delete All). Calls `router.refresh()` after each mutation.

### `BUTicketsTable` — Client Component

**Sort headers** — `<Link href={buTicketsSortHref(searchParams, field)}>` — no click handlers.

**Pagination footer** — `<Link href={buTicketsPageHref(searchParams, page)}>` for prev/next/numbers/size selector.

**Column visibility dropdown:**
- `DEFAULT_VISIBLE_COLS = new Set(COLUMNS.map(c => c.key))` — all visible by default
- `id` column always visible (toggle disabled)
- Click-outside close via `useRef`/`useEffect`
- "Reset to defaults" button

**CSV export:**
- "Export CSV" button (with spinner) placed before "Columns" button
- Fetches `GET /api/bu-tickets/export?${searchParams.toString()}` — all filtered rows, not just current page
- BOM-prefixed for Excel; escapes cells containing commas/quotes/newlines
- Respects `visibleCols` — only exports visible columns
- Shows `disabled` + "Exporting…" while in flight

**Checkbox delete** (admin only) — `DELETE /api/bu-tickets` then `router.refresh()`.

---

## Filter Preset Data Contract

- `filtersJson` = `buTicketsFilterSignature(filters)` — canonical QS with page always stripped to 1
- Preset "active" check: `preset.filtersJson === currentQS`
- Default redirect: if user has a default preset and `searchParams` is empty → redirect to `?${preset.filtersJson}`
- No DB uniqueness on name — duplicate names allowed
- `userId` column = Supabase `auth.users.id`; SHARED presets readable by all users, editable/deletable by owner only

---

## Draft State vs. Live Search

| Mechanism | What it controls | When it navigates |
|---|---|---|
| Debounced search | `search` param only | After 350 ms of no typing |
| Draft checkboxes | All other filter params | Only on "Apply Filters" click |
| Preset pills | All params | Immediately on click |
| Sort headers | `sortField` + `sortDir` | Immediately (Link) |
| Pagination | `page` | Immediately (Link) |

Search and checkbox filters are independent — users can type while composing checkbox selections.

---

## Age Risk Filter (BU/PS specific)

`buildBuTicketsWhere` translates computed age risk values to date ranges:

| Value | Prisma condition |
|---|---|
| `at_risk` | `kayakoCreatedAt: { lte: 30 days ago }` |
| `watch` | `kayakoCreatedAt: { gt: 30 days ago, lte: 20 days ago }` |
| `ok` | `kayakoCreatedAt: { gt: 20 days ago }` |

Multiple values are ORed. Ticket status is not considered.

---

## Tests

| File | Tests |
|---|---|
| `__tests__/lib/bu-tickets-list-filters.test.ts` | 37 tests — parse, serialize, round-trip, sort href, page href, count, signature |
| `__tests__/lib/bu-tickets-list-query.test.ts` | 16 tests — WHERE builder, ORDER BY builder |

Run: `npm test`

---

## All Tickets (`/all-tickets`) — Existing Replica

Phase 16 replicated this pattern for All Tickets. The parallel files are:

| BU/PS | All Tickets |
|---|---|
| `lib/bu-tickets-list-filters.ts` | `lib/all-tickets-list-filters.ts` |
| `lib/bu-tickets-list-query.ts` | `lib/all-tickets-list-query.ts` |
| `app/actions/bu-ticket-filter-presets.actions.ts` | `app/actions/all-ticket-filter-presets.actions.ts` |
| `components/BUTicketsFilters.tsx` | `components/AllTicketsFilters.tsx` |
| `components/BUTicketsTable.tsx` | `components/AllTicketsTable.tsx` |
| `components/BUTicketsToolbar.tsx` | `components/AllTicketsToolbar.tsx` |
| `GET /api/bu-tickets/export` | `GET /api/all-tickets/export` |

**Key differences from BU/PS:**
- `module` on `FilterPreset` is `"all-tickets"` (not `"bu-tickets"`)
- Preset actions are in `all-ticket-filter-presets.actions.ts` (separate file, separate `revalidatePath`)
- WHERE clause uses `isBuPs = false` instead of `isBuPs = true` to scope data to the All Tickets view
- `team` values include `"Support"` in addition to `"PS"` and `"BU"` (non-BU/PS tickets get `"Support"` from sync)
- `openOnly` filter is present in both pages

---

## `openOnly` Filter

Both `BuTicketsListFilters` and `AllTicketsListFilters` include an `openOnly: boolean` field. When `true`, the WHERE builder adds:

```typescript
{ status: { notIn: ['Closed', 'Completed'] } }
```

`openOnly` is toggled via the "Open only" checkbox in the "Options" collapsible box in the filter panel (previously labelled "Escalated").

`TicketProductAnalytics` always sets `openOnly=true` when clicking a product pill — this is intentional since the pill counts already exclude closed/completed.

---

## Replicating for a New Page in This App

Use the `/filter-model` Claude skill (`.claude/commands/filter-model.md`) — it documents all required exports, component contracts, NProgress setup, and CSV export pattern with exact code snippets. Reference the All Tickets implementation as the second worked example.

For a **new project** (outside this app), use the generic templates in [`Spec/Filter-Sorting/templates/`](../Spec/Filter-Sorting/templates/).
