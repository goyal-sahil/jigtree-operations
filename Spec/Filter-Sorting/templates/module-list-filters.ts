/**
 * URL-driven filter helpers for the Module list page.
 * CLIENT-SAFE — no server-only imports, no Prisma. Used in both Server and Client Components.
 *
 * Replace: module → your feature name (e.g. orders)
 *          Module → PascalCase (e.g. Orders)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SortField =
  | 'createdAt'
  | 'updatedAt'
  | 'name'
  // TODO: add all sortable column names

export type SortDir  = 'asc' | 'desc'
export type PageSize = 25 | 50 | 100

export interface ModuleListFilters {
  // -- filter dimensions (all optional) --
  search?:   string
  status?:   string[]     // example multi-select
  priority?: string[]     // example multi-select
  isFlag?:   boolean      // example boolean toggle
  // TODO: add your filter dimensions here

  // -- sort + page (required with defaults) --
  sortField: SortField
  sortDir:   SortDir
  page:      number
  pageSize:  PageSize
}

export const DEFAULT_FILTERS: ModuleListFilters = {
  sortField: 'updatedAt',
  sortDir:   'desc',
  page:      1,
  pageSize:  25,
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function first(v: string | string[] | undefined): string {
  if (v === undefined) return ''
  return Array.isArray(v) ? (v[0] ?? '') : v
}

function allStrings(v: string | string[] | undefined): string[] {
  if (!v) return []
  const arr = Array.isArray(v) ? v : [v]
  return arr.map(s => s.trim()).filter(Boolean)
}

// ---------------------------------------------------------------------------
// Parse  (URL params → typed filters)
// ---------------------------------------------------------------------------

export function parseModuleSearchParams(
  params: Record<string, string | string[]>,
): ModuleListFilters {
  const search = first(params.search).trim() || undefined

  // Multi-select arrays — decode repeated params
  const status   = allStrings(params.status)
  const priority = allStrings(params.priority)
  // TODO: add your dimensions

  const isFlag = first(params.isFlag) === 'true' || undefined

  // Sort field — validate against allowlist
  const SORT_FIELDS: SortField[] = ['createdAt', 'updatedAt', 'name'] // TODO: keep in sync with SortField
  const rawSortField = first(params.sortField) as SortField
  const sortField: SortField = SORT_FIELDS.includes(rawSortField)
    ? rawSortField
    : DEFAULT_FILTERS.sortField

  const sortDir: SortDir = first(params.sortDir) === 'asc' ? 'asc' : 'desc'

  const page     = Math.max(1, parseInt(first(params.page) || '1', 10) || 1)
  const pageSizeRaw = parseInt(first(params.pageSize) || '25', 10)
  const pageSize: PageSize = ([25, 50, 100] as PageSize[]).includes(pageSizeRaw as PageSize)
    ? (pageSizeRaw as PageSize)
    : 25

  return {
    ...(search   ? { search }   : {}),
    ...(status.length   ? { status }   : {}),
    ...(priority.length ? { priority } : {}),
    ...(isFlag  ? { isFlag }   : {}),
    sortField,
    sortDir,
    page,
    pageSize,
  }
}

// ---------------------------------------------------------------------------
// Serialize  (typed filters → URLSearchParams)
// Rules: omit page=1, pageSize=25, empty arrays, false/undefined booleans
// ---------------------------------------------------------------------------

export function serializeModuleParams(filters: ModuleListFilters): URLSearchParams {
  const p = new URLSearchParams()

  if (filters.search?.trim()) p.set('search', filters.search.trim())

  // Multi-select: one append per value
  for (const v of filters.status   ?? []) p.append('status',   v)
  for (const v of filters.priority ?? []) p.append('priority', v)
  // TODO: add your dimensions

  if (filters.isFlag) p.set('isFlag', 'true')

  if (filters.sortField !== DEFAULT_FILTERS.sortField) p.set('sortField', filters.sortField)
  if (filters.sortDir   !== DEFAULT_FILTERS.sortDir)   p.set('sortDir',   filters.sortDir)
  if (filters.page      > 1)                           p.set('page',      String(filters.page))
  if (filters.pageSize  !== DEFAULT_FILTERS.pageSize)  p.set('pageSize',  String(filters.pageSize))

  return p
}

// ---------------------------------------------------------------------------
// Utility: URLSearchParams → Record (for parse round-trips and API routes)
// ---------------------------------------------------------------------------

export function urlSearchParamsToRecord(
  params: URLSearchParams,
): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {}
  for (const key of new Set(params.keys())) {
    const all = params.getAll(key)
    out[key] = all.length === 1 ? all[0]! : all
  }
  return out
}

// ---------------------------------------------------------------------------
// Sort href helper
// Clicking the active column toggles dir; clicking a new column → asc, page=1
// ---------------------------------------------------------------------------

export function moduleSortHref(
  currentParams: URLSearchParams,
  field: SortField,
): string {
  const current = parseModuleSearchParams(urlSearchParamsToRecord(currentParams))
  const isSame  = current.sortField === field
  const nextDir: SortDir = isSame && current.sortDir === 'asc' ? 'desc' : 'asc'
  const next = serializeModuleParams({
    ...current,
    sortField: field,
    sortDir:   isSame ? nextDir : 'asc',
    page:      1,
  })
  return `?${next.toString()}`
}

// ---------------------------------------------------------------------------
// Page href helper — preserves all other params
// ---------------------------------------------------------------------------

export function modulePageHref(
  currentParams: URLSearchParams,
  page: number,
): string {
  const current = parseModuleSearchParams(urlSearchParamsToRecord(currentParams))
  const next = serializeModuleParams({ ...current, page })
  return `?${next.toString()}`
}

// ---------------------------------------------------------------------------
// Count active filter dimensions (not sort/page)
// ---------------------------------------------------------------------------

export function countActiveFilters(filters: ModuleListFilters): number {
  let n = 0
  if (filters.search?.trim())    n++
  if (filters.status?.length)    n++
  if (filters.priority?.length)  n++
  if (filters.isFlag)            n++
  // TODO: add your dimensions
  return n
}

// ---------------------------------------------------------------------------
// Filter signature — canonical QS with page always stripped to 1
// Used for preset matching and storing presets.
// ---------------------------------------------------------------------------

export function moduleFilterSignature(filters: ModuleListFilters): string {
  return serializeModuleParams({ ...filters, page: 1 }).toString()
}
