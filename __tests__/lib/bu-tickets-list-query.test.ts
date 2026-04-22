import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock server-only so the module can be imported in tests
vi.mock('server-only', () => ({}))

// Mock Prisma (import after mock setup)
vi.mock('@/lib/prisma', () => ({
  prisma: {
    ticket: {
      findMany: vi.fn(),
      count:    vi.fn(),
    },
    ticketAnalysis: {
      findMany: vi.fn(),
    },
  },
}))

// Mock ticketService (dbTicketToRow used in fetchBuTicketsPage)
vi.mock('@/lib/kayako/ticketService', () => ({
  dbTicketToRow: vi.fn((t: unknown) => ({ ...t as object, _converted: true })),
}))

import { buildBuTicketsWhere, orderByBuTickets } from '@/lib/bu-tickets-list-query'
import type { BuTicketsListFilters } from '@/lib/bu-tickets-list-filters'
import { DEFAULT_FILTERS } from '@/lib/bu-tickets-list-filters'

const BASE_FILTERS: BuTicketsListFilters = { ...DEFAULT_FILTERS }
const USER_ID   = 'user-abc'
const KAYAKO_URL = 'https://example.kayako.com'

describe('buildBuTicketsWhere', () => {
  it('always includes isBuPs and kayakoUrl', () => {
    const where = buildBuTicketsWhere(BASE_FILTERS, USER_ID, KAYAKO_URL)
    expect(where).toMatchObject({ AND: expect.arrayContaining([{ isBuPs: true, kayakoUrl: KAYAKO_URL }]) })
  })

  it('adds search OR clause for text search', () => {
    const where = buildBuTicketsWhere(
      { ...BASE_FILTERS, search: 'acme' },
      USER_ID, KAYAKO_URL,
    )
    const and = (where as { AND: unknown[] }).AND
    const searchClause = and.find((c: unknown) => typeof c === 'object' && c !== null && 'OR' in c)
    expect(searchClause).toBeDefined()
  })

  it('adds numeric kayakoTicketId to search OR when query is numeric', () => {
    const where = buildBuTicketsWhere(
      { ...BASE_FILTERS, search: '12345' },
      USER_ID, KAYAKO_URL,
    )
    const and = (where as { AND: unknown[] }).AND
    const searchClause = and.find((c: unknown) => typeof c === 'object' && c !== null && 'OR' in c) as { OR: unknown[] }
    const hasNumericId = searchClause?.OR?.some(
      (o: unknown) => typeof o === 'object' && o !== null && 'kayakoTicketId' in o,
    )
    expect(hasNumericId).toBe(true)
  })

  it('adds status IN filter when statuses provided', () => {
    const where = buildBuTicketsWhere(
      { ...BASE_FILTERS, status: ['Open', 'Pending'] },
      USER_ID, KAYAKO_URL,
    )
    const and = (where as { AND: unknown[] }).AND
    expect(and).toContainEqual({ status: { in: ['Open', 'Pending'] } })
  })

  it('adds priority filter', () => {
    const where = buildBuTicketsWhere(
      { ...BASE_FILTERS, priority: ['High'] },
      USER_ID, KAYAKO_URL,
    )
    const and = (where as { AND: unknown[] }).AND
    expect(and).toContainEqual({ priority: { in: ['High'] } })
  })

  it('adds team filter', () => {
    const where = buildBuTicketsWhere(
      { ...BASE_FILTERS, team: ['PS'] },
      USER_ID, KAYAKO_URL,
    )
    const and = (where as { AND: unknown[] }).AND
    expect(and).toContainEqual({ team: { in: ['PS'] } })
  })

  it('adds product filter', () => {
    const where = buildBuTicketsWhere(
      { ...BASE_FILTERS, product: ['SherpaDesk'] },
      USER_ID, KAYAKO_URL,
    )
    const and = (where as { AND: unknown[] }).AND
    expect(and).toContainEqual({ product: { in: ['SherpaDesk'] } })
  })

  it('adds isEscalated filter', () => {
    const where = buildBuTicketsWhere(
      { ...BASE_FILTERS, isEscalated: true },
      USER_ID, KAYAKO_URL,
    )
    const and = (where as { AND: unknown[] }).AND
    expect(and).toContainEqual({ isEscalated: true })
  })

  it('does not add isEscalated filter when not set', () => {
    const where = buildBuTicketsWhere(BASE_FILTERS, USER_ID, KAYAKO_URL)
    const and = (where as { AND: unknown[] }).AND
    expect(and).not.toContainEqual({ isEscalated: true })
  })

  it('adds age risk OR clause for at_risk (gte 30 days)', () => {
    const where = buildBuTicketsWhere(
      { ...BASE_FILTERS, ageRisk: ['at_risk'] },
      USER_ID, KAYAKO_URL,
    )
    const and = (where as { AND: unknown[] }).AND
    const ageClause = and.find(
      (c: unknown) => typeof c === 'object' && c !== null && 'OR' in c,
    ) as { OR: unknown[] } | undefined
    expect(ageClause?.OR?.length).toBe(1)
    const atRisk = ageClause?.OR?.[0] as { kayakoCreatedAt: { lte: Date } }
    expect(atRisk?.kayakoCreatedAt?.lte).toBeInstanceOf(Date)
  })

  it('adds age risk OR with multiple values', () => {
    const where = buildBuTicketsWhere(
      { ...BASE_FILTERS, ageRisk: ['at_risk', 'ok'] },
      USER_ID, KAYAKO_URL,
    )
    const and = (where as { AND: unknown[] }).AND
    const ageClause = and.find(
      (c: unknown) => typeof c === 'object' && c !== null && 'OR' in c,
    ) as { OR: unknown[] } | undefined
    expect(ageClause?.OR?.length).toBe(2)
  })

  it('adds blockerType analysis join filter', () => {
    const where = buildBuTicketsWhere(
      { ...BASE_FILTERS, blockerType: ['Action: Engineering'] },
      USER_ID, KAYAKO_URL,
    )
    const and = (where as { AND: unknown[] }).AND
    expect(and).toContainEqual({
      analyses: {
        some: { userId: USER_ID, blockerType: { in: ['Action: Engineering'] } },
      },
    })
  })

  it('produces no extra clauses with empty filters', () => {
    const where = buildBuTicketsWhere(BASE_FILTERS, USER_ID, KAYAKO_URL)
    const and = (where as { AND: unknown[] }).AND
    // Only the base isBuPs+kayakoUrl clause
    expect(and).toHaveLength(1)
  })
})

// ── orderByBuTickets ───────────────────────────────────────────────────────

describe('orderByBuTickets', () => {
  it('returns correct orderBy for default filters', () => {
    const ob = orderByBuTickets(BASE_FILTERS)
    expect(ob).toEqual({ kayakoUpdatedAt: 'desc' })
  })

  it('respects custom sort field and direction', () => {
    const ob = orderByBuTickets({ ...BASE_FILTERS, sortField: 'organization', sortDir: 'asc' })
    expect(ob).toEqual({ organization: 'asc' })
  })

  it('applies asc direction', () => {
    const ob = orderByBuTickets({ ...BASE_FILTERS, sortField: 'kayakoCreatedAt', sortDir: 'asc' })
    expect(ob).toEqual({ kayakoCreatedAt: 'asc' })
  })
})
