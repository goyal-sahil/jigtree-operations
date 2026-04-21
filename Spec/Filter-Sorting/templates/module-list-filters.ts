/**
 * Client-safe URL filter helpers.
 * Do not import Prisma here.
 */

export const MODULE_PAGE_SIZES = [25, 50, 100] as const

export const MODULE_SORT_OPTIONS = [
  { value: 'created_desc', label: 'Newest first' },
  { value: 'created_asc', label: 'Oldest first' },
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
] as const

export type ModuleSortValue = (typeof MODULE_SORT_OPTIONS)[number]['value']

export type ModuleView = 'table' | 'card'

export type ModuleListFilters = {
  q: string
  tagIds: string[]
  status: 'all' | 'active' | 'archived'
  sort: ModuleSortValue
  page: number
  pageSize: number
  view: ModuleView
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isUuid(v: string): boolean {
  return UUID_RE.test(v)
}

function first(v: string | string[] | undefined): string {
  if (v === undefined) return ''
  return Array.isArray(v) ? (v[0] ?? '') : v
}

function allValues(key: string, raw: Record<string, string | string[] | undefined>): string[] {
  const value = raw[key]
  if (value === undefined) return []
  const arr = Array.isArray(value) ? value : [value]
  return arr.map((s) => String(s).trim()).filter(Boolean)
}

function uniqueSorted(arr: string[]): string[] {
  return [...new Set(arr)].sort((a, b) => a.localeCompare(b))
}

export function parseModuleListSearchParams(
  raw: Record<string, string | string[] | undefined>
): ModuleListFilters {
  const q = first(raw.q).trim()
  const tagIds = uniqueSorted(allValues('tag', raw).filter(isUuid))

  let status: ModuleListFilters['status'] = 'all'
  const statusRaw = first(raw.status).trim()
  if (statusRaw === 'active' || statusRaw === 'archived') status = statusRaw

  const sortRaw = first(raw.sort).trim() as ModuleSortValue
  const sort = MODULE_SORT_OPTIONS.some((o) => o.value === sortRaw) ? sortRaw : 'created_desc'

  const page = Math.max(1, parseInt(first(raw.page) || '1', 10) || 1)
  let pageSize = parseInt(first(raw.per_page) || '50', 10) || 50
  if (!MODULE_PAGE_SIZES.includes(pageSize as (typeof MODULE_PAGE_SIZES)[number])) pageSize = 50

  const viewRaw = first(raw.view).trim().toLowerCase()
  const view: ModuleView = viewRaw === 'card' ? 'card' : 'table'

  return { q, tagIds, status, sort, page, pageSize, view }
}

export function serializeModuleListParams(f: ModuleListFilters): string {
  const u = new URLSearchParams()
  if (f.q) u.set('q', f.q)
  for (const id of f.tagIds) u.append('tag', id)
  if (f.status !== 'all') u.set('status', f.status)
  if (f.sort !== 'created_desc') u.set('sort', f.sort)
  if (f.page > 1) u.set('page', String(f.page))
  if (f.pageSize !== 50) u.set('per_page', String(f.pageSize))
  if (f.view === 'card') u.set('view', 'card')
  return u.toString()
}

export function urlSearchParamsToRecord(
  sp: URLSearchParams
): Record<string, string | string[] | undefined> {
  const raw: Record<string, string | string[]> = {}
  for (const key of new Set(sp.keys())) {
    const all = sp.getAll(key)
    if (all.length === 0) continue
    raw[key] = all.length === 1 ? all[0]! : all
  }
  return raw
}

export function normalizeModulePresetQueryString(
  qs: string,
  includeViewInIdentity: boolean
): string {
  const trimmed = qs.trim().replace(/^\?/, '')
  const sp = new URLSearchParams(trimmed)
  const raw = urlSearchParamsToRecord(sp)
  const f = parseModuleListSearchParams(raw)
  return serializeModuleListParams({
    ...f,
    page: 1,
    view: includeViewInIdentity ? f.view : 'table',
  })
}

export function moduleFilterSignature(
  f: ModuleListFilters,
  includeViewInIdentity: boolean
): string {
  return serializeModuleListParams({
    ...f,
    page: 1,
    view: includeViewInIdentity ? f.view : 'table',
  })
}
