import 'server-only'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { dbTicketToRow } from '@/lib/kayako/ticketService'
import type { TicketRow } from '@/types/kayako'
import type { AllTicketsListFilters, AgeRisk } from './all-tickets-list-filters'

export interface FilterOptions {
  statuses:     string[]
  priorities:   string[]
  teams:        string[]
  products:     string[]
  blockerTypes: string[]
}

export interface AllTicketsPage {
  tickets:         TicketRow[]
  total:           number   // filtered count (for pagination display)
  unfilteredTotal: number   // all tickets (for "Delete All N?" dialog)
}

export interface ProductAnalyticsRow {
  product: string
  count:   number
}

const CLOSED_STATUSES = [
  { status: { contains: 'closed',    mode: 'insensitive' as const } },
  { status: { contains: 'completed', mode: 'insensitive' as const } },
]

export async function fetchAllTicketsProductAnalytics(
  kayakoUrl: string,
): Promise<ProductAnalyticsRow[]> {
  const rows = await prisma.ticket.groupBy({
    by:       ['product'],
    where: {
      kayakoUrl,
      product: { not: null },
      NOT:     { OR: CLOSED_STATUSES },
    },
    _count:   { id: true },
    orderBy:  { _count: { id: 'desc' } },
  })
  return rows.map(r => ({ product: r.product!, count: r._count.id }))
}

export function buildAllTicketsWhere(
  filters:   AllTicketsListFilters,
  userId:    string,
  kayakoUrl: string,
): Prisma.TicketWhereInput {
  // All Tickets includes every ticket for this kayakoUrl — no isBuPs filter
  const AND: Prisma.TicketWhereInput[] = [{ kayakoUrl }]

  if (filters.search) {
    const q = filters.search.trim()
    const numId = parseInt(q, 10)
    const orClauses: Prisma.TicketWhereInput[] = [
      { title:        { contains: q, mode: 'insensitive' } },
      { organization: { contains: q, mode: 'insensitive' } },
      { brand:        { contains: q, mode: 'insensitive' } },
    ]
    if (!isNaN(numId)) orClauses.push({ kayakoTicketId: numId })
    AND.push({ OR: orClauses })
  }

  if (filters.status?.length)   AND.push({ status:    { in: filters.status } })
  if (filters.priority?.length) AND.push({ priority:  { in: filters.priority } })
  if (filters.team?.length)     AND.push({ team:      { in: filters.team } })
  if (filters.product?.length)  AND.push({ product:   { in: filters.product } })
  if (filters.isEscalated)      AND.push({ isEscalated: true })
  if (filters.openOnly)         AND.push({ NOT: { OR: CLOSED_STATUSES } })

  if (filters.ageRisk?.length) {
    const now  = Date.now()
    const d30  = new Date(now - 30 * 86_400_000)
    const d20  = new Date(now - 20 * 86_400_000)
    const ageOr: Prisma.TicketWhereInput[] = filters.ageRisk.map((r: AgeRisk) => {
      if (r === 'at_risk') return { kayakoCreatedAt: { lte: d30 } }
      if (r === 'watch')   return { kayakoCreatedAt: { gt: d30, lte: d20 } }
      return                      { kayakoCreatedAt: { gt: d20 } }
    })
    AND.push({ OR: ageOr })
  }

  if (filters.blockerType?.length) {
    AND.push({
      analyses: {
        some: { userId, blockerType: { in: filters.blockerType } },
      },
    })
  }

  return { AND }
}

export function orderByAllTickets(
  filters: AllTicketsListFilters,
): Prisma.TicketOrderByWithRelationInput {
  return { [filters.sortField]: filters.sortDir }
}

export async function fetchAllTicketsPage(
  filters:   AllTicketsListFilters,
  userId:    string,
  kayakoUrl: string,
): Promise<AllTicketsPage> {
  const where   = buildAllTicketsWhere(filters, userId, kayakoUrl)
  const orderBy = orderByAllTickets(filters)
  const skip    = (filters.page - 1) * filters.pageSize
  const take    = filters.pageSize

  const [rows, total, unfilteredTotal] = await Promise.all([
    prisma.ticket.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        analyses: {
          where:  { userId },
          select: { blockerType: true, oneLiner: true, updatedAt: true },
        },
      },
    }),
    prisma.ticket.count({ where }),
    prisma.ticket.count({ where: { kayakoUrl } }),
  ])

  return {
    tickets: rows.map(r => {
      const a = r.analyses[0]
      return dbTicketToRow(r, {
        blockerType:    a?.blockerType,
        oneLiner:       a?.oneLiner,
        lastAnalysedAt: a?.updatedAt,
      })
    }),
    total,
    unfilteredTotal,
  }
}

export async function fetchAllTicketsForExport(
  filters:   AllTicketsListFilters,
  userId:    string,
  kayakoUrl: string,
): Promise<TicketRow[]> {
  const where   = buildAllTicketsWhere(filters, userId, kayakoUrl)
  const orderBy = orderByAllTickets(filters)

  const rows = await prisma.ticket.findMany({
    where,
    orderBy,
    include: {
      analyses: {
        where:  { userId },
        select: { blockerType: true, oneLiner: true, updatedAt: true },
      },
    },
  })

  return rows.map(r => {
    const a = r.analyses[0]
    return dbTicketToRow(r, {
      blockerType:    a?.blockerType,
      oneLiner:       a?.oneLiner,
      lastAnalysedAt: a?.updatedAt,
    })
  })
}

export async function fetchAllTicketsFilterOptions(
  userId:    string,
  kayakoUrl: string,
): Promise<FilterOptions> {
  const base = { kayakoUrl } satisfies Prisma.TicketWhereInput

  const [statusRows, priorityRows, teamRows, productRows, blockerRows] = await Promise.all([
    prisma.ticket.findMany({
      where: { ...base, status: { not: null } },
      select:  { status: true },
      distinct: ['status'],
      orderBy:  { status: 'asc' },
    }),
    prisma.ticket.findMany({
      where: { ...base, priority: { not: null } },
      select:  { priority: true },
      distinct: ['priority'],
      orderBy:  { priority: 'asc' },
    }),
    prisma.ticket.findMany({
      where: { ...base, team: { not: null } },
      select:  { team: true },
      distinct: ['team'],
      orderBy:  { team: 'asc' },
    }),
    prisma.ticket.findMany({
      where: { ...base, product: { not: null } },
      select:  { product: true },
      distinct: ['product'],
      orderBy:  { product: 'asc' },
    }),
    prisma.ticketAnalysis.findMany({
      where: {
        userId,
        blockerType: { not: null },
        ticket: { kayakoUrl },
      },
      select:   { blockerType: true },
      distinct: ['blockerType'],
    }),
  ])

  return {
    statuses:     statusRows.map(r => r.status!),
    priorities:   priorityRows.map(r => r.priority!),
    teams:        teamRows.map(r => r.team!),
    products:     productRows.map(r => r.product!),
    blockerTypes: blockerRows.map(r => r.blockerType!).sort(),
  }
}
