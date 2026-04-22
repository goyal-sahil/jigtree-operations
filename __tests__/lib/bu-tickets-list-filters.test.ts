import { describe, it, expect } from 'vitest'
import {
  parseBuTicketsSearchParams,
  serializeBuTicketsParams,
  normalizeBuTicketsPresetQS,
  buTicketsFilterSignature,
  countActiveFilters,
  buTicketsSortHref,
  buTicketsPageHref,
  urlSearchParamsToRecord,
  DEFAULT_FILTERS,
  type BuTicketsListFilters,
} from '@/lib/bu-tickets-list-filters'

// ── parseBuTicketsSearchParams ─────────────────────────────────────────────

describe('parseBuTicketsSearchParams', () => {
  it('returns defaults when params are empty', () => {
    const result = parseBuTicketsSearchParams({})
    expect(result).toEqual(DEFAULT_FILTERS)
  })

  it('parses sort field and direction', () => {
    const result = parseBuTicketsSearchParams({ sortField: 'organization', sortDir: 'asc' })
    expect(result.sortField).toBe('organization')
    expect(result.sortDir).toBe('asc')
  })

  it('falls back to default sort field for unknown values', () => {
    const result = parseBuTicketsSearchParams({ sortField: 'INVALID_FIELD' })
    expect(result.sortField).toBe(DEFAULT_FILTERS.sortField)
  })

  it('defaults sortDir to desc when not asc', () => {
    const result = parseBuTicketsSearchParams({ sortDir: 'random' })
    expect(result.sortDir).toBe('desc')
  })

  it('parses page number', () => {
    expect(parseBuTicketsSearchParams({ page: '3' }).page).toBe(3)
  })

  it('clamps page to minimum 1', () => {
    expect(parseBuTicketsSearchParams({ page: '-5' }).page).toBe(1)
    expect(parseBuTicketsSearchParams({ page: 'abc' }).page).toBe(1)
  })

  it('parses valid page sizes', () => {
    expect(parseBuTicketsSearchParams({ pageSize: '50' }).pageSize).toBe(50)
    expect(parseBuTicketsSearchParams({ pageSize: '100' }).pageSize).toBe(100)
  })

  it('falls back to 25 for invalid page size', () => {
    expect(parseBuTicketsSearchParams({ pageSize: '999' }).pageSize).toBe(25)
    expect(parseBuTicketsSearchParams({ pageSize: 'all' }).pageSize).toBe(25)
  })

  it('parses single string array filters', () => {
    const result = parseBuTicketsSearchParams({ status: 'Open', priority: 'High' })
    expect(result.status).toEqual(['Open'])
    expect(result.priority).toEqual(['High'])
  })

  it('parses multi-value array filters', () => {
    const result = parseBuTicketsSearchParams({ status: ['Open', 'Pending'], team: ['PS', 'BU'] })
    expect(result.status).toEqual(['Open', 'Pending'])
    expect(result.team).toEqual(['PS', 'BU'])
  })

  it('parses isEscalated flag', () => {
    expect(parseBuTicketsSearchParams({ isEscalated: 'true' }).isEscalated).toBe(true)
    expect(parseBuTicketsSearchParams({ isEscalated: 'false' }).isEscalated).toBeUndefined()
  })

  it('filters out invalid ageRisk values', () => {
    const result = parseBuTicketsSearchParams({ ageRisk: ['at_risk', 'invalid', 'ok'] })
    expect(result.ageRisk).toEqual(['at_risk', 'ok'])
  })

  it('omits optional fields when not present', () => {
    const result = parseBuTicketsSearchParams({})
    expect(result.search).toBeUndefined()
    expect(result.status).toBeUndefined()
    expect(result.isEscalated).toBeUndefined()
  })

  it('parses search text', () => {
    const result = parseBuTicketsSearchParams({ search: 'hello world' })
    expect(result.search).toBe('hello world')
  })
})

// ── serializeBuTicketsParams ───────────────────────────────────────────────

describe('serializeBuTicketsParams', () => {
  it('serializes defaults (page 1 and pageSize 25 are omitted)', () => {
    const p = serializeBuTicketsParams(DEFAULT_FILTERS)
    expect(p.get('sortField')).toBe('kayakoUpdatedAt')
    expect(p.get('sortDir')).toBe('desc')
    expect(p.has('page')).toBe(false)
    expect(p.has('pageSize')).toBe(false)
  })

  it('includes page when > 1', () => {
    const p = serializeBuTicketsParams({ ...DEFAULT_FILTERS, page: 2 })
    expect(p.get('page')).toBe('2')
  })

  it('includes pageSize when not 25', () => {
    const p = serializeBuTicketsParams({ ...DEFAULT_FILTERS, pageSize: 50 })
    expect(p.get('pageSize')).toBe('50')
  })

  it('serializes multi-value array filters as repeated params', () => {
    const p = serializeBuTicketsParams({ ...DEFAULT_FILTERS, status: ['Open', 'Pending'] })
    expect(p.getAll('status')).toEqual(['Open', 'Pending'])
  })

  it('omits optional fields when undefined', () => {
    const p = serializeBuTicketsParams(DEFAULT_FILTERS)
    expect(p.has('search')).toBe(false)
    expect(p.has('status')).toBe(false)
  })

  it('serializes isEscalated', () => {
    const p = serializeBuTicketsParams({ ...DEFAULT_FILTERS, isEscalated: true })
    expect(p.get('isEscalated')).toBe('true')
  })
})

// ── Round-trip ─────────────────────────────────────────────────────────────

describe('parse/serialize round-trip', () => {
  it('round-trips default filters', () => {
    const serialized = serializeBuTicketsParams(DEFAULT_FILTERS)
    const reparsed = parseBuTicketsSearchParams(urlSearchParamsToRecord(serialized))
    expect(reparsed).toEqual(DEFAULT_FILTERS)
  })

  it('round-trips complex filters', () => {
    const original: BuTicketsListFilters = {
      ...DEFAULT_FILTERS,
      search:      'acme',
      status:      ['Open', 'Pending'],
      priority:    ['High'],
      team:        ['PS'],
      product:     ['SherpaDesk'],
      blockerType: ['Action: Engineering'],
      isEscalated: true,
      ageRisk:     ['at_risk', 'watch'],
      page:        3,
      pageSize:    50,
      sortField:   'organization',
      sortDir:     'asc',
    }
    const serialized = serializeBuTicketsParams(original)
    const reparsed = parseBuTicketsSearchParams(urlSearchParamsToRecord(serialized))
    expect(reparsed).toEqual(original)
  })
})

// ── normalizeBuTicketsPresetQS ─────────────────────────────────────────────

describe('normalizeBuTicketsPresetQS', () => {
  it('resets page to 1', () => {
    const qs = normalizeBuTicketsPresetQS({ page: '5', sortField: 'organization', sortDir: 'asc' })
    expect(qs).not.toContain('page=')
  })

  it('two calls with same filters but different page produce same string', () => {
    const a = normalizeBuTicketsPresetQS({ status: 'Open', page: '1' })
    const b = normalizeBuTicketsPresetQS({ status: 'Open', page: '99' })
    expect(a).toBe(b)
  })
})

// ── buTicketsFilterSignature ───────────────────────────────────────────────

describe('buTicketsFilterSignature', () => {
  it('matches normalizeBuTicketsPresetQS for same filter set', () => {
    const filters: BuTicketsListFilters = { ...DEFAULT_FILTERS, status: ['Open'], page: 7 }
    const fromFilters = buTicketsFilterSignature(filters)
    const fromParams = normalizeBuTicketsPresetQS({
      sortField: filters.sortField,
      sortDir:   filters.sortDir,
      status:    filters.status!,  // known to be defined in this test case
      page:      '7',
    })
    expect(fromFilters).toBe(fromParams)
  })
})

// ── countActiveFilters ─────────────────────────────────────────────────────

describe('countActiveFilters', () => {
  it('returns 0 for default filters', () => {
    expect(countActiveFilters(DEFAULT_FILTERS)).toBe(0)
  })

  it('counts each active filter dimension as 1', () => {
    const f: BuTicketsListFilters = {
      ...DEFAULT_FILTERS,
      search:      'x',
      status:      ['Open'],
      priority:    ['High'],
      team:        ['PS'],
      product:     ['P1'],
      blockerType: ['B1'],
      isEscalated: true,
      ageRisk:     ['at_risk'],
    }
    expect(countActiveFilters(f)).toBe(8)
  })

  it('treats empty arrays as inactive', () => {
    expect(countActiveFilters({ ...DEFAULT_FILTERS, status: [] })).toBe(0)
  })
})

// ── buTicketsSortHref ──────────────────────────────────────────────────────

describe('buTicketsSortHref', () => {
  it('toggles direction when clicking the same field', () => {
    const params = new URLSearchParams('sortField=organization&sortDir=asc')
    const href = buTicketsSortHref(params, 'organization')
    expect(href).toContain('sortDir=desc')
    expect(href).toContain('sortField=organization')
  })

  it('sets new field with asc direction', () => {
    const params = new URLSearchParams('sortField=organization&sortDir=desc')
    const href = buTicketsSortHref(params, 'priority')
    expect(href).toContain('sortField=priority')
    expect(href).toContain('sortDir=asc')
  })

  it('resets page to 1', () => {
    const params = new URLSearchParams('page=5&sortField=organization')
    const href = buTicketsSortHref(params, 'priority')
    expect(href).toContain('page=1')
  })

  it('preserves other params', () => {
    const params = new URLSearchParams('status=Open&sortField=organization&sortDir=asc')
    const href = buTicketsSortHref(params, 'organization')
    expect(href).toContain('status=Open')
  })
})

// ── buTicketsPageHref ──────────────────────────────────────────────────────

describe('buTicketsPageHref', () => {
  it('sets page number', () => {
    const params = new URLSearchParams('sortField=organization')
    expect(buTicketsPageHref(params, 3)).toContain('page=3')
  })

  it('removes page param for page 1', () => {
    const params = new URLSearchParams('page=3&sortField=organization')
    const href = buTicketsPageHref(params, 1)
    expect(href).not.toContain('page=')
  })

  it('preserves other params', () => {
    const params = new URLSearchParams('status=Open&sortField=organization')
    expect(buTicketsPageHref(params, 2)).toContain('status=Open')
  })
})

// ── urlSearchParamsToRecord ────────────────────────────────────────────────

describe('urlSearchParamsToRecord', () => {
  it('converts single values to strings', () => {
    const p = new URLSearchParams('sortField=organization&page=2')
    const rec = urlSearchParamsToRecord(p)
    expect(rec.sortField).toBe('organization')
    expect(rec.page).toBe('2')
  })

  it('converts repeated keys to arrays', () => {
    const p = new URLSearchParams('status=Open&status=Pending')
    const rec = urlSearchParamsToRecord(p)
    expect(rec.status).toEqual(['Open', 'Pending'])
  })
})
