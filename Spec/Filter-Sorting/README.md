# Filter + Sorting Blueprint (Next.js 14 App Router + Prisma)

This folder is a **drop-in starter pack** to implement URL-driven filtering, server-side sorting/pagination, and per-user saved presets in any Next.js 14 + Prisma app.

> **Reference implementation**: `BU/PS Tickets` page in the JigTree Operations Hub.
> All templates in this folder use `module`/`Module` as placeholders — substitute your feature name (e.g. `orders`, `tickets`, `clients`).

---

## Principles

1. **URL is the single source of truth** — all filter/sort/page state lives in the query string. Any URL is bookmarkable and shareable.
2. **Server renders data** — the page is an async Server Component that reads `searchParams`, queries Prisma, and passes typed results to Client Components via props.
3. **No client-side filter state machine** — Client Components hold only _local draft state_ (checkboxes in-progress) and debounced search input. The applied state is always in the URL.
4. **Mutations call `router.refresh()`** — write operations (sync, delete, preset save) trigger a Server Component re-render without a full page reload.
5. **`router.push()` for navigation** — never `<form method="GET">`. This keeps the App Router navigation lifecycle intact and allows NProgress integration.

---

## Architecture (4 layers)

```
URL query string
    ↓  parseModuleSearchParams()          [lib/module-list-filters.ts]
ModuleListFilters (typed object)
    ↓  fetchModulePage()                  [lib/module-list-query.ts — server-only]
{ rows[], total, unfilteredTotal }
    ↓  props to Client Components
ModuleFilters.tsx  — search + checkboxes + preset pills
ModuleTable.tsx    — sort Link headers + pagination Links + column toggle + CSV export
```

---

## Files in This Folder

| File | Purpose |
|---|---|
| `README.md` | This file |
| `IMPLEMENTATION-CHECKLIST.md` | Step-by-step rollout guide |
| `prisma-filter-presets-model.prisma` | Prisma `FilterPreset` model template |
| `templates/module-list-filters.ts` | Pure URL helpers — parse, serialize, sort href, page href, count, signature |
| `templates/module-list-query.ts` | Server-only Prisma queries — WHERE builder, ORDER BY, paginated fetch, filter options, CSV fetch |
| `templates/module-filter-presets.actions.ts` | Server Actions — full CRUD + default + visibility + update for presets |
| `templates/ModuleFilters.tsx` | Client — search bar + collapsible filter panel + preset management |
| `templates/ModuleTable.tsx` | Client — sortable table with column visibility, CSV export, pagination |

---

## Finalized Feature Set

Every page implementing this pattern gets all of the following out of the box:

### Filtering
- **Search bar** — always visible above the filter panel; live-updates URL after 350 ms debounce; stale-closure-safe (reads from `useSearchParams()` inside the timeout, not `filters` prop)
- **Collapsible filter panel** — auto-opens when `countActiveFilters > 0`; each dimension is a `ScrollableCheckboxGroup` with `max-h-36 overflow-y-auto` and **All · None** mini-buttons
- **Draft state** — checkboxes update local draft; URL only changes on **Apply Filters**; draft synced from URL via `useEffect([paramsSig])` (not `key` remount — avoids losing in-progress selections when debounced search navigates)

### Sorting
- **Column headers are `<Link>` elements** — clicking the active column toggles `asc/desc`; clicking a new column sets `asc` and resets page to 1
- Sort state is serialized into the URL query string

### Pagination
- **Prev/Next and page numbers are `<Link>` elements**
- Page size selector (25 / 50 / 100) also uses Links
- `page=1` and `pageSize=25` are omitted from the URL (clean URLs)

### Saved Presets
- Presets store the canonical query string (page stripped to 1) — see `moduleFilterSignature()`
- Preset "active" check: `preset.filtersJson === currentQS`
- **Default preset**: redirects to it on first load (no QS in URL)
- **Visibility**: `PERSONAL` (own only) or `SHARED` (visible to all users, only deletable by owner)
- **Update preset**: if the current draft differs from the active preset, an **Update 'name'** button appears to overwrite it
- **Delete with confirmation**: inline "Delete? Yes / No" — no modal needed

### Table
- **Column visibility dropdown** — checkboxes to show/hide columns; one column always-visible (the ID); "Reset to defaults" button
- **CSV export** — fetches **all filtered rows** (not just the current page) from a dedicated `GET /api/{module}/export` endpoint; BOM-prefixed for Excel; respects visible columns; shows spinner + "Exporting…" while in flight

### Loading Feedback
- **NProgress bar** — full-page loading bar triggered on `navigate()` (filter Apply, preset pill click); completed in a `useEffect` when `searchParams.toString()` actually changes
- **`useTransition` spinners** — per-item spinner on preset star/delete/visibility actions

---

## Component Responsibilities

### `ModuleFilters` (Client)
All user interaction with filters and presets. Never makes DB calls directly — all reads come from props, all writes go through Server Actions.

### `ModuleTable` (Client)
Purely presentational + URL navigation. The only direct write operations are delete-selected (via API fetch + `router.refresh()`).

### Page Server Component
1. Parse `searchParams` → `ModuleListFilters`
2. `Promise.all` → page data + filter options + presets (+ any other metadata)
3. Redirect to default preset on first visit
4. Render `ModuleFilters` + `ModuleTable` with typed props

---

## Integration Notes

- Replace every `module`/`Module` with your route domain (lowercase / PascalCase).
- Replace `moduleItem` in the query template with your Prisma model name.
- The `filter_presets` table is shared across features via a `module` column — one table handles all pages.
- Keep `lib/module-list-filters.ts` free of any server-only imports (it's used in both Server and Client Components).
- `lib/module-list-query.ts` must start with `import 'server-only'`.
- Parser and serializer must be symmetric: `parse(serialize(DEFAULT_FILTERS))` === `DEFAULT_FILTERS`.
