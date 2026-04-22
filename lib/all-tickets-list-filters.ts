// Pure functions for All Tickets URL-driven filter state.
// No side effects, no Prisma, no Next.js imports — safe to import in tests.

export type SortField =
  | 'kayakoTicketId'
  | 'kayakoCreatedAt'
  | 'kayakoUpdatedAt'
  | 'organization'
  | 'priority'
  | 'status'
  | 'team'
  | 'product'
  | 'isEscalated'
  | 'title'

export type SortDir = 'asc' | 'desc'
export type AgeRisk = 'at_risk' | 'watch' | 'ok'

export const VALID_SORT_FIELDS: SortField[] = [
  'kayakoTicketId', 'kayakoCreatedAt', 'kayakoUpdatedAt',
  'organization', 'priority', 'status', 'team', 'product', 'isEscalated', 'title',
]

export const PAGE_SIZES = [25, 50, 100] as const
export type PageSize = typeof PAGE_SIZES[number]

export interface AllTicketsListFilters {
  search?:      string
  status?:      string[]
  priority?:    string[]
  team?:        string[]
  product?:     string[]
  blockerType?: string[]
  isEscalated?: boolean
  openOnly?:    boolean
  ageRisk?:     AgeRisk[]
  sortField:    SortField
  sortDir:      SortDir
  page:         number
  pageSize:     PageSize
}

export const DEFAULT_FILTERS: AllTicketsListFilters = {
  sortField: 'kayakoUpdatedAt',
  sortDir:   'desc',
  page:      1,
  pageSize:  25,
}

function toStrArr(v: string | string[] | undefined): string[] | undefined {
  if (!v) return undefined
  const arr = Array.isArray(v) ? v : [v]
  return arr.length > 0 ? arr : undefined
}

export function parseAllTicketsSearchParams(
  params: Record<string, string | string[]>,
): AllTicketsListFilters {
  const sortField = params.sortField as SortField | undefined
  const validSortField: SortField = VALID_SORT_FIELDS.includes(sortField as SortField)
    ? (sortField as SortField)
    : DEFAULT_FILTERS.sortField

  const sortDir: SortDir = params.sortDir === 'asc' ? 'asc' : 'desc'

  const page = Math.max(1, parseInt(String(params.page ?? '1'), 10) || 1)

  const pageSizeRaw = parseInt(String(params.pageSize ?? '25'), 10)
  const pageSize: PageSize = (PAGE_SIZES as readonly number[]).includes(pageSizeRaw)
    ? (pageSizeRaw as PageSize)
    : 25

  const search      = params.search ? String(params.search) : undefined
  const status      = toStrArr(params.status)
  const priority    = toStrArr(params.priority)
  const team        = toStrArr(params.team)
  const product     = toStrArr(params.product)
  const blockerType = toStrArr(params.blockerType)
  const isEscalated = params.isEscalated === 'true' ? true : undefined
  const openOnly    = params.openOnly === 'true' ? true : undefined
  const ageRisk = toStrArr(params.ageRisk)?.filter(
    (v): v is AgeRisk => ['at_risk', 'watch', 'ok'].includes(v),
  )

  return {
    sortField: validSortField,
    sortDir,
    page,
    pageSize,
    ...(search                    && { search }),
    ...(status?.length            && { status }),
    ...(priority?.length          && { priority }),
    ...(team?.length              && { team }),
    ...(product?.length           && { product }),
    ...(blockerType?.length       && { blockerType }),
    ...(isEscalated               && { isEscalated }),
    ...(openOnly                  && { openOnly }),
    ...(ageRisk?.length           && { ageRisk }),
  }
}

export function serializeAllTicketsParams(filters: AllTicketsListFilters): URLSearchParams {
  const p = new URLSearchParams()
  p.set('sortField', filters.sortField)
  p.set('sortDir',   filters.sortDir)
  if (filters.page > 1)         p.set('page',     String(filters.page))
  if (filters.pageSize !== 25)  p.set('pageSize', String(filters.pageSize))
  if (filters.search)           p.set('search',   filters.search)
  filters.status?.forEach(v      => p.append('status',      v))
  filters.priority?.forEach(v    => p.append('priority',    v))
  filters.team?.forEach(v        => p.append('team',        v))
  filters.product?.forEach(v     => p.append('product',     v))
  filters.blockerType?.forEach(v => p.append('blockerType', v))
  if (filters.isEscalated)      p.set('isEscalated', 'true')
  if (filters.openOnly)         p.set('openOnly',    'true')
  filters.ageRisk?.forEach(v     => p.append('ageRisk',     v))
  return p
}

/** Canonical QS from a parsed filters object (page stripped to 1). */
export function allTicketsFilterSignature(filters: AllTicketsListFilters): string {
  return serializeAllTicketsParams({ ...filters, page: 1 }).toString()
}

/** Count of active non-default filters (excludes sort and pagination). */
export function countActiveFilters(filters: AllTicketsListFilters): number {
  let n = 0
  if (filters.search)           n++
  if (filters.status?.length)   n++
  if (filters.priority?.length) n++
  if (filters.team?.length)     n++
  if (filters.product?.length)  n++
  if (filters.blockerType?.length) n++
  if (filters.isEscalated)      n++
  if (filters.openOnly)         n++
  if (filters.ageRisk?.length)  n++
  return n
}

/** Convert URLSearchParams to a plain record (arrays for repeated keys). */
export function urlSearchParamsToRecord(
  params: URLSearchParams,
): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {}
  for (const key of new Set(params.keys())) {
    const values = params.getAll(key)
    result[key] = values.length === 1 ? values[0] : values
  }
  return result
}

/** Returns a `?...` href that toggles or sets a sort field on the current params. */
export function allTicketsSortHref(
  currentParams: URLSearchParams,
  field:         SortField,
): string {
  const p = new URLSearchParams(currentParams.toString())
  const curField = (p.get('sortField') ?? DEFAULT_FILTERS.sortField) as SortField
  const curDir   = (p.get('sortDir')   ?? DEFAULT_FILTERS.sortDir)   as SortDir
  if (curField === field) {
    p.set('sortDir', curDir === 'asc' ? 'desc' : 'asc')
  } else {
    p.set('sortField', field)
    p.set('sortDir', 'asc')
  }
  p.set('page', '1')
  return `?${p.toString()}`
}

/** Returns a `?...` href that changes only the page number. */
export function allTicketsPageHref(
  currentParams: URLSearchParams,
  page:          number,
): string {
  const p = new URLSearchParams(currentParams.toString())
  if (page <= 1) p.delete('page')
  else           p.set('page', String(page))
  return `?${p.toString()}`
}
