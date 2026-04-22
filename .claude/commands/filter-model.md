You are implementing a **URL-driven filter panel** following the established pattern in this app. Read this document carefully before starting — it defines all required contracts, component behaviours, and gotchas to replicate exactly.

The reference implementation is **BU/PS Tickets** (`/bu-tickets`). Read those files first to see the finished product, then adapt for the new feature.

---

## Pattern Overview

All filter/sort/pagination state lives in the **URL query string**. Server Components read `searchParams`, run DB queries, and pass typed data to Client Components. Client Components hold only:
1. Local draft state (checkboxes in-progress, not yet applied)
2. Debounced search input

All navigation uses `router.push()` — never `<form method="GET">`.

---

## Files to Create

| File | Type | Purpose |
|---|---|---|
| `lib/{feature}-list-filters.ts` | Pure / isomorphic | Parse URL → typed filters; serialize → URLSearchParams; sort/page href helpers; count; signature |
| `lib/{feature}-list-query.ts` | Server-only | `import 'server-only'`; Prisma WHERE builder; ORDER BY; paginated fetch; filter options; all-rows fetch |
| `app/actions/{feature}-filter-presets.actions.ts` | Server Action | Full CRUD for `filter_presets` table + visibility + update |
| `app/api/{feature}/export/route.ts` | API Route | `GET` → auth + fetch all filtered rows → return JSON for CSV |
| `components/{Feature}Filters.tsx` | Client | Search bar + collapsible panel + preset management |
| `components/{Feature}Table.tsx` | Client | Sort Links + pagination Links + column visibility + CSV export |
| `app/(dashboard)/{feature}/page.tsx` | Server Component | Parse params; Promise.all; redirect to default preset |
| `__tests__/lib/{feature}-list-filters.test.ts` | Vitest | Round-trip, sort href, page href, count, signature |
| `__tests__/lib/{feature}-list-query.test.ts` | Vitest | WHERE builder, ORDER BY builder |

Use `Spec/Filter-Sorting/templates/` as copy-paste starters. Replace `module`/`Module` with your feature name.

---

## `lib/{feature}-list-filters.ts` — Required Exports

```typescript
export type SortField = '...'  // union of allowed column names
export type SortDir   = 'asc' | 'desc'
export type PageSize  = 25 | 50 | 100
export interface {Feature}ListFilters {
  // filter dimensions (all optional)
  search?:     string
  status?:     string[]
  priority?:   string[]
  isEscalated?: boolean
  // ... add your dimensions
  // sort + page (required)
  sortField:   SortField
  sortDir:     SortDir
  page:        number
  pageSize:    PageSize
}
export const DEFAULT_FILTERS: {Feature}ListFilters

export function parse{Feature}SearchParams(params: Record<string, string | string[]>): {Feature}ListFilters
export function serialize{Feature}Params(filters: {Feature}ListFilters): URLSearchParams
export function {feature}SortHref(currentParams: URLSearchParams, field: SortField): string
export function {feature}PageHref(currentParams: URLSearchParams, page: number): string
export function countActiveFilters(filters: {Feature}ListFilters): number
export function {feature}FilterSignature(filters: {Feature}ListFilters): string  // page stripped to 1
export function urlSearchParamsToRecord(params: URLSearchParams): Record<string, string | string[]>
```

**Serialization rules:**
- `page=1` → omit; `pageSize=25` → omit; empty arrays → omit key; false/undefined booleans → omit
- Multi-value arrays → `params.append(key, value)` once per item (not comma-joined)
- sortField/sortDir only included when not equal to `DEFAULT_FILTERS` values

**Sort href rule:** clicking active column toggles direction; clicking new column → `asc` + resets `page=1`.

---

## `lib/{feature}-list-query.ts` — Required Exports

```typescript
import 'server-only'
export interface FilterOptions { statuses: string[]; priorities: string[]; /* ... */ }
export interface {Feature}Page {
  tickets:         TicketRow[]
  total:           number         // filtered count (for pagination)
  unfilteredTotal: number         // all rows (for "Delete All N?" dialog)
}
export function build{Feature}Where(filters, userId, kayakoUrl): Prisma.TicketWhereInput
export function orderBy{Feature}(filters): Prisma.TicketOrderByWithRelationInput
export async function fetch{Feature}Page(filters, userId, kayakoUrl): Promise<{Feature}Page>
export async function fetchAll{Feature}(filters, userId, kayakoUrl): Promise<TicketRow[]>  // for CSV
export async function fetch{Feature}FilterOptions(userId, kayakoUrl): Promise<FilterOptions>
```

Use `AND: []` pattern in WHERE builder — see `lib/bu-tickets-list-query.ts` for the exact shape.

---

## `components/{Feature}Filters.tsx` — Required Behaviour

### NProgress setup
```typescript
import NProgress from 'nprogress'

const lastSpRef = useRef(searchParams.toString())
useEffect(() => {
  const cur = searchParams.toString()
  if (cur !== lastSpRef.current) { lastSpRef.current = cur; NProgress.done() }
}, [searchParams])

function navigate(url: string) { NProgress.start(); router.push(url) }
```
Use `navigate()` instead of `router.push()` everywhere in this component.

### Debounced search (stale-closure-safe)
```typescript
const [searchInput, setSearchInput] = useState(filters.search ?? '')
const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

function handleSearchChange(value: string) {
  setSearchInput(value)
  if (debounceRef.current) clearTimeout(debounceRef.current)
  debounceRef.current = setTimeout(() => {
    const sp = new URLSearchParams(searchParams.toString())  // ← searchParams not filters
    if (value.trim()) sp.set('search', value.trim())
    else              sp.delete('search')
    sp.set('page', '1')
    navigate(`?${sp.toString()}`)
  }, 350)
}
```
**Why `useSearchParams()` not `filters`**: `filters` is stale inside the timeout; `searchParams` is always current.

### Draft state sync (no `key` remount)
```typescript
const paramsSig = serialize{Feature}Params(filters).toString()
useEffect(() => {
  setDraft({ ...filters })
  setSearchInput(filters.search ?? '')
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [paramsSig])
```
**Never add `key={currentQS}` to this component in the parent** — that remounts it and loses in-progress checkbox selections when debounced search navigates.

### Apply / Clear
- **Apply** → `navigate('?' + serialize{Feature}Params({ ...filters, ...draft, page: 1 }))`
- **Clear all** → `navigate('?sortField=...&sortDir=desc')` (default sort only)
- Clear button only shown when `countActiveFilters(filters) > 0`

### Preset pills
```typescript
const activeOwnPreset = presets.find(p => p.userId === userId && p.filtersJson === currentQS)
const draftSig        = {feature}FilterSignature({ ...filters, ...draft })
const canUpdatePreset = !!activeOwnPreset && draftSig !== activeOwnPreset.filtersJson
```
- Active preset = blue background
- `★` prefix for default; `Shared` badge for other users' shared presets
- **Update preset** button shown when `canUpdatePreset` — calls `update{Feature}FilterPresetFilters(id, draftSig)`

### Preset management (own presets)
- Star: `setDefault` / `clearDefault` toggle
- Visibility: `toggle{Feature}FilterPresetVisibility(id)` — pill shows "Shared" (emerald) / "Private" (slate)
- Delete: `deleteConfirmId` state — inline "Delete? Yes / No" (no modal)
- All preset actions use `useTransition` + `loadingId` state for per-item spinners

### `ScrollableCheckboxGroup` sub-component
- Wrapper: `border border-slate-200 rounded-lg bg-white p-3`
- Scrollable list: `max-h-36 overflow-y-auto`
- **All · None** mini-buttons in the header row

---

## `components/{Feature}Table.tsx` — Required Behaviour

### Column visibility
```typescript
const DEFAULT_VISIBLE_COLS = new Set(COLUMNS.map(c => c.key))
const [visibleCols, setVisibleCols] = useState<Set<string>>(DEFAULT_VISIBLE_COLS)
```
One column (`id`) is always visible — its toggle is `disabled`. Dropdown closes on click-outside via `useRef`/`useEffect`. "Reset to defaults" button.

### CSV export — ALL filtered rows (not just current page)
```typescript
async function exportToCsv() {
  setExporting(true)
  try {
    const res = await fetch(`/api/{feature}/export?${searchParams.toString()}`)
    const { rows: allRows } = await res.json()
    // build CSV from allRows (not the `rows` prop which is current page only)
    // BOM prefix '﻿' for Excel; escape cells containing commas/quotes/newlines
  } finally {
    setExporting(false)
  }
}
```
Button disabled + spinner + "Exporting…" while `exporting` is true.

### Sort headers and pagination
- Sort headers: `<Link href={sortHref(col.sortField)}>` — no click handlers
- Pagination: `<Link href={pageHref(n)}>` for prev/next/page numbers
- Page size selector: `<Link href={...new URLSearchParams({ ...record, pageSize: String(ps) })...}>`

---

## Server Component Page — Required Structure

```typescript
export default async function {Feature}Page({ searchParams }) {
  // 1. Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Parse
  const filters = parse{Feature}SearchParams(searchParams)

  // 3. Settings
  const settings = await prisma.userSettings.findUnique(...)
  const kayakoUrl = settings?.kayakoUrl ?? ''

  // 4. Fetch all in parallel
  const [pageResult, filterOptions, presets] = await Promise.all([
    fetch{Feature}Page(filters, user.id, kayakoUrl),
    fetch{Feature}FilterOptions(user.id, kayakoUrl),
    fetchPresetsForUser(user.id),
  ])

  // 5. Default preset redirect (first visit only)
  if (Object.keys(searchParams).length === 0) {
    const defaultPreset = presets.find(p => p.isDefault && p.userId === user.id)
    if (defaultPreset) redirect(`/{feature}?${defaultPreset.filtersJson}`)
  }

  const currentQS = {feature}FilterSignature(filters)
  const isAdmin   = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).includes(user.email ?? '')

  return (
    <>
      <{Feature}Filters filters={filters} options={filterOptions} currentQS={currentQS} presets={presets} userId={user.id} />
      <{Feature}Table   rows={pageResult.tickets} total={pageResult.total} filters={filters} isAdmin={isAdmin} />
    </>
  )
}
```

---

## Filter Preset Data Contract

- `filtersJson` = `{feature}FilterSignature(filters)` — canonical QS with page always stripped to 1
- A preset "matches" the current view: `preset.filtersJson === currentQS`
- Visibility: `'PERSONAL'` (own) | `'SHARED'` (all users can see + use, only owner can edit/delete)
- Only one `isDefault=true` per user — `setDefault...` clears others in `$transaction`
- No DB-level uniqueness on `(userId, name)` — allow duplicate names

---

## CSV Export API Route

```typescript
// app/api/{feature}/export/route.ts
export async function GET(req: NextRequest) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const settings  = await prisma.userSettings.findUnique(...)
  const kayakoUrl = settings?.kayakoUrl ?? ''
  const filters   = parse{Feature}SearchParams(urlSearchParamsToRecord(req.nextUrl.searchParams as unknown as URLSearchParams))
  const rows      = await fetchAll{Feature}(filters, user.id, kayakoUrl)
  return NextResponse.json({ tickets: rows })
}
```

---

## Tests — Minimum Coverage

**`{feature}-list-filters.test.ts`:**
- `parse{Feature}SearchParams`: defaults, each field, arrays (single + multi), booleans, invalid → defaults
- `serialize{Feature}Params`: defaults omitted (`page=1`, `pageSize=25`, empty arrays, false booleans)
- Round-trip: `parse(serialize(DEFAULT_FILTERS))` deep-equals `DEFAULT_FILTERS`
- `{feature}SortHref`: toggles dir on active field; new field → asc + page reset
- `{feature}PageHref`: sets page, drops `page=1`, preserves other params
- `countActiveFilters`: 0 for defaults, increments per active dimension, empty array = 0
- `{feature}FilterSignature`: page stripped to 1

**`{feature}-list-query.test.ts`:**
- Mock `server-only`: `vi.mock('server-only', () => ({}))`
- `build{Feature}Where`: no filters = minimal clause; search contains; each array (in: []); booleans; date ranges
- `orderBy{Feature}`: each SortField × asc/desc

---

## Reference Implementation

All of the above is fully implemented for BU/PS Tickets. Read before you write:

- [`lib/bu-tickets-list-filters.ts`](lib/bu-tickets-list-filters.ts)
- [`lib/bu-tickets-list-query.ts`](lib/bu-tickets-list-query.ts)
- [`app/actions/bu-ticket-filter-presets.actions.ts`](app/actions/bu-ticket-filter-presets.actions.ts)
- [`app/api/bu-tickets/export/route.ts`](app/api/bu-tickets/export/route.ts)
- [`components/BUTicketsFilters.tsx`](components/BUTicketsFilters.tsx)
- [`components/BUTicketsTable.tsx`](components/BUTicketsTable.tsx)
- [`app/(dashboard)/bu-tickets/page.tsx`](app/(dashboard)/bu-tickets/page.tsx)
- [`__tests__/lib/bu-tickets-list-filters.test.ts`](__tests__/lib/bu-tickets-list-filters.test.ts)
- [`__tests__/lib/bu-tickets-list-query.test.ts`](__tests__/lib/bu-tickets-list-query.test.ts)

The project-agnostic templates (for use in other projects) are in [`Spec/Filter-Sorting/templates/`](Spec/Filter-Sorting/templates/).
