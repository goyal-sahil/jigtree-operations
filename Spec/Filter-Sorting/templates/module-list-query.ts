import 'server-only'

/**
 * Server-only Prisma query helpers for the Module list page.
 * Replace `moduleItem` with your actual Prisma model name (e.g. `ticket`, `order`).
 * Replace `ModuleItem` with your TypeScript type for a row (e.g. `TicketRow`, `OrderRow`).
 */

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import type { ModuleListFilters } from './module-list-filters'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Distinct values for each checkbox group in the filter panel */
export interface FilterOptions {
  statuses:   string[]
  priorities: string[]
  // TODO: add your filter dimensions
}

export interface ModulePage {
  rows:             any[]   // TODO: replace with your typed row shape
  total:            number  // filtered row count (drives pagination display)
  unfilteredTotal:  number  // all rows for this user (drives "Delete All N?" dialog)
}

// ---------------------------------------------------------------------------
// WHERE builder
// ---------------------------------------------------------------------------

export function buildModuleWhere(
  filters: ModuleListFilters,
  userId:  string,
  // TODO: add other scope params (e.g. kayakoUrl, workspaceId) as needed
): Prisma.ModuleItemWhereInput {  // TODO: replace with correct Prisma type
  const AND: Prisma.ModuleItemWhereInput[] = [
    // Base scope — always filter to this user's data
    // TODO: replace with your tenant/scope condition, e.g. { userId } or { workspaceId }
    { userId },
  ]

  // Full-text / ID search
  if (filters.search) {
    const q      = filters.search.trim()
    const numId  = parseInt(q, 10)
    const orClauses: Prisma.ModuleItemWhereInput[] = [
      { name:  { contains: q, mode: 'insensitive' } },
      // TODO: add other searchable fields
    ]
    if (!isNaN(numId)) orClauses.push({ numericId: numId }) // TODO: adjust field name
    AND.push({ OR: orClauses })
  }

  // Multi-select arrays
  if (filters.status?.length)   AND.push({ status:   { in: filters.status } })
  if (filters.priority?.length) AND.push({ priority: { in: filters.priority } })
  // TODO: add your dimensions

  // Boolean flags
  if (filters.isFlag) AND.push({ isFlag: true })

  return { AND }
}

// ---------------------------------------------------------------------------
// ORDER BY builder
// ---------------------------------------------------------------------------

export function orderByModule(
  filters: ModuleListFilters,
): Prisma.ModuleItemOrderByWithRelationInput {  // TODO: replace with correct Prisma type
  return { [filters.sortField]: filters.sortDir }
}

// ---------------------------------------------------------------------------
// Paginated fetch
// ---------------------------------------------------------------------------

export async function fetchModulePage(
  filters: ModuleListFilters,
  userId:  string,
): Promise<ModulePage> {
  const where   = buildModuleWhere(filters, userId)
  const orderBy = orderByModule(filters)
  const skip    = (filters.page - 1) * filters.pageSize
  const take    = filters.pageSize

  const [rows, total, unfilteredTotal] = await Promise.all([
    prisma.moduleItem.findMany({   // TODO: replace model name
      where,
      orderBy,
      skip,
      take,
      // include related data as needed
    }),
    prisma.moduleItem.count({ where }),
    prisma.moduleItem.count({ where: { userId } }),  // TODO: scope to your tenant
  ])

  return {
    rows: rows.map(r => r),  // TODO: map DB rows to your row type
    total,
    unfilteredTotal,
  }
}

// ---------------------------------------------------------------------------
// Fetch ALL matching rows — used by the CSV export endpoint (no skip/take)
// ---------------------------------------------------------------------------

export async function fetchAllModuleRows(
  filters: ModuleListFilters,
  userId:  string,
): Promise<any[]> {  // TODO: replace with your typed row shape
  const where   = buildModuleWhere(filters, userId)
  const orderBy = orderByModule(filters)

  const rows = await prisma.moduleItem.findMany({  // TODO: replace model name
    where,
    orderBy,
    // include related data as needed
  })

  return rows.map(r => r)  // TODO: map DB rows to your row type
}

// ---------------------------------------------------------------------------
// Filter options — distinct values for each checkbox group
// ---------------------------------------------------------------------------

export async function fetchModuleFilterOptions(
  userId: string,
): Promise<FilterOptions> {
  const base = { userId } satisfies Prisma.ModuleItemWhereInput  // TODO: adjust scope

  const [statusRows, priorityRows] = await Promise.all([
    prisma.moduleItem.findMany({
      where:   { ...base, status: { not: null } },
      select:  { status: true },
      distinct: ['status'],
      orderBy:  { status: 'asc' },
    }),
    prisma.moduleItem.findMany({
      where:   { ...base, priority: { not: null } },
      select:  { priority: true },
      distinct: ['priority'],
      orderBy:  { priority: 'asc' },
    }),
    // TODO: add your dimensions
  ])

  return {
    statuses:   statusRows.map(r => r.status!),
    priorities: priorityRows.map(r => r.priority!),
    // TODO: add your dimensions
  }
}
