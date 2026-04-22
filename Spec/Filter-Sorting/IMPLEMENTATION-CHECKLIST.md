# Implementation Checklist

Replace `module` with your feature name (e.g. `orders`). Replace `ModuleItem` with your Prisma model name.

---

## 1) Database

- [ ] Add `FilterPreset` model (see `prisma-filter-presets-model.prisma`)
- [ ] Add `FilterPresetVisibility` enum (`PERSONAL`, `SHARED`)
- [ ] Ensure `userId` FK points to your user table with `onDelete: Cascade`
- [ ] Run `npx prisma db push` (dev) or `npx prisma migrate dev` (prod)
- [ ] Add RLS policy on `filter_presets`: users can only read their own rows + SHARED rows; only write their own

## 2) URL contract — `lib/module-list-filters.ts`

- [ ] Define `SortField` union type (allowed column names)
- [ ] Define `ModuleListFilters` interface with: filter arrays, booleans, `sortField`, `sortDir`, `page`, `pageSize`
- [ ] Define `DEFAULT_FILTERS` constant
- [ ] Export `parseModuleSearchParams(params)` — robust parsing with defaults for all fields
- [ ] Export `serializeModuleParams(filters)` — omit `page=1`, `pageSize=25`, empty arrays, false booleans
- [ ] Export `moduleSortHref(currentParams, field)` — toggles dir on same field; sets `asc` + resets page on new field
- [ ] Export `modulePageHref(currentParams, page)` — sets page, removes `page=1`
- [ ] Export `countActiveFilters(filters)` — count of active filter dimensions (not sort/page)
- [ ] Export `moduleFilterSignature(filters)` — serialize with page stripped to 1 (for preset matching)
- [ ] Export `urlSearchParamsToRecord(params)` — utility for converting `URLSearchParams` to plain object
- [ ] Verify: `parse(serialize(DEFAULT_FILTERS))` deep-equals `DEFAULT_FILTERS`

## 3) Server query layer — `lib/module-list-query.ts`

- [ ] Start with `import 'server-only'`
- [ ] Export `FilterOptions` interface (arrays of distinct values per filter dimension)
- [ ] Export `ModulePage` interface (`{ rows, total, unfilteredTotal }`)
- [ ] Export `buildModuleWhere(filters, userId)` — Prisma `WhereInput` using `AND: []` pattern
- [ ] Export `orderByModule(filters)` — Prisma `OrderByWithRelationInput`
- [ ] Export `fetchModulePage(filters, userId)` — paginated query using `skip` + `take`
- [ ] Export `fetchModuleFilterOptions(userId)` — distinct values for each checkbox group
- [ ] Export `fetchAllModuleRows(filters, userId)` — same as page but without `skip`/`take` (for CSV export)
- [ ] Add deterministic tie-breaker in ORDER BY (e.g. `id` secondary sort) for stable pagination

## 4) Server Actions — `app/actions/module-filter-presets.actions.ts`

- [ ] `'use server'` at the top
- [ ] `fetchPresetsForUser(userId)` — own + all SHARED, default-first
- [ ] `createModuleFilterPreset(name, filtersJson, visibility)` — stores canonical QS via `moduleFilterSignature`
- [ ] `deleteModuleFilterPreset(id)` — verifies ownership; `revalidatePath`
- [ ] `setDefaultModuleFilterPreset(id)` — clears others in `$transaction`; `revalidatePath`
- [ ] `clearDefaultModuleFilterPreset(userId)` — removes default flag from all own presets; `revalidatePath`
- [ ] `updateModuleFilterPresetFilters(id, filtersJson)` — overwrites `filtersJson` on own preset; `revalidatePath`
- [ ] `toggleModuleFilterPresetVisibility(id)` — flips `PERSONAL ↔ SHARED`; verifies ownership; `revalidatePath`

## 5) CSV export API route — `app/api/module/export/route.ts`

- [ ] `GET /api/module/export` — auth check; parse `searchParams`; call `fetchAllModuleRows`; return `{ rows }`
- [ ] No pagination — returns all matching rows

## 6) Filter panel — `components/ModuleFilters.tsx`

- [ ] `'use client'`
- [ ] Import `NProgress from 'nprogress'`; add `import 'nprogress/nprogress.css'` (or configure in layout)
- [ ] Implement `navigate(url)` helper: `NProgress.start()` then `router.push(url)`
- [ ] Implement `useEffect` on `searchParams.toString()` to call `NProgress.done()` when URL changes
- [ ] Debounced search: 350 ms, uses `useSearchParams()` inside timeout (stale-closure-safe)
- [ ] Draft state for checkboxes: `useState<Partial<ModuleListFilters>>`
- [ ] `useEffect([paramsSig])` to sync draft from `filters` prop — **no `key` remount**
- [ ] Collapsible panel: `panelOpen` state; auto-opens when `countActiveFilters > 0`
- [ ] `ScrollableCheckboxGroup` sub-component: `max-h-36 overflow-y-auto`, **All · None** buttons
- [ ] **Apply Filters** button → `navigate('?' + serializeModuleParams({ ...draft, page: 1 }))`
- [ ] **Clear all** button (shown when `countActiveFilters > 0`) → navigate to default sort URL
- [ ] Preset pills: active = blue; default = ★ prefix; shared (other user's) = "Shared" badge; click → `navigate('?' + preset.filtersJson)`
- [ ] **Update preset** button: shown when `draftSig !== activeOwnPreset?.filtersJson`; calls `updateModuleFilterPresetFilters`
- [ ] **Save preset** dialog: name input + visibility toggle; calls `createModuleFilterPreset`
- [ ] **Manage presets**: star (setDefault/clearDefault), eye (toggleVisibility), delete (with inline "Delete? Yes / No" confirm)
- [ ] `useTransition` + `loadingId` state for per-item spinners on preset actions

## 7) Table component — `components/ModuleTable.tsx`

- [ ] `'use client'`
- [ ] Define `COLUMNS: ColDef[]` with `key`, `label`, `sortField?`, `width?`
- [ ] `DEFAULT_VISIBLE_COLS = new Set(COLUMNS.map(c => c.key))`
- [ ] `visibleCols` state + `toggleColVisibility(key)` (one column always-visible)
- [ ] **Column visibility dropdown**: `colsOpen` state; close on click-outside via `useRef`/`useEffect`; "Reset to defaults" button
- [ ] Sort headers: `<Link href={moduleSortHref(searchParams, col.sortField)}>` — no click handlers
- [ ] Active sort indicator: direction arrow when `col.sortField === filters.sortField`
- [ ] Pagination footer: `<Link>` for prev/next/page numbers; page size selector
- [ ] **CSV export** button: `async exportToCsv()` → `setExporting(true)` → `fetch('/api/module/export?${searchParams}')` → generate CSV → download; spinner + "Exporting…" while in flight
- [ ] CSV format: BOM prefix (`﻿`) for Excel; escape cells with commas/quotes/newlines; respects `visibleCols`
- [ ] Checkbox row selection (admin-only gate)
- [ ] Delete selected: `DELETE /api/module` then `router.refresh()`

## 8) Page Server Component — `app/(dashboard)/module/page.tsx`

- [ ] `async` Server Component (no `'use client'`)
- [ ] Auth check → redirect to `/login` if not authenticated
- [ ] Parse `searchParams` via `parseModuleSearchParams()`
- [ ] `Promise.all` for page data + filter options + presets (+ `lastSyncedAt` or similar)
- [ ] Redirect to default preset when `Object.keys(searchParams).length === 0` and user has one
- [ ] Compute `currentQS = moduleFilterSignature(filters)`
- [ ] Compute `isAdmin` from `ADMIN_EMAILS` env (or equivalent)
- [ ] **Do NOT** put `key={currentQS}` on `ModuleFilters` — it manages its own sync via `useEffect`

## 9) Tests

- [ ] `__tests__/lib/module-list-filters.test.ts`:
  - [ ] `parseModuleSearchParams`: defaults, each field, arrays (single + multi), booleans, invalid values fall back to defaults
  - [ ] `serializeModuleParams`: defaults omitted, arrays append, booleans only when true
  - [ ] Round-trip: `parse(serialize(DEFAULT_FILTERS))` deep-equals `DEFAULT_FILTERS`
  - [ ] `moduleSortHref`: toggles dir on active field, sets `asc` + resets page on new field
  - [ ] `modulePageHref`: sets page, drops `page=1`, preserves other params
  - [ ] `countActiveFilters`: 0 for defaults, increments per active dimension, empty array = 0
  - [ ] `moduleFilterSignature`: page stripped to 1, matches `urlSearchParamsToRecord` round-trip
- [ ] `__tests__/lib/module-list-query.test.ts`:
  - [ ] Mock `server-only`: `vi.mock('server-only', () => ({}))`
  - [ ] Mock `prisma`
  - [ ] `buildModuleWhere`: no filters = minimal clause; search; each array filter; boolean flags
  - [ ] `orderByModule`: each `SortField` × `asc`/`desc`
