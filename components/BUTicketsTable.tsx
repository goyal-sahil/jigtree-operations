'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import type { TicketRow } from '@/types/kayako'
import { useTimezone } from '@/components/TimezoneProvider'
import { formatDate, formatDateTime, formatRelative } from '@/lib/tz'
import {
  buTicketsSortHref,
  buTicketsPageHref,
  urlSearchParamsToRecord,
  type BuTicketsListFilters,
  type SortField,
} from '@/lib/bu-tickets-list-filters'

const KAYAKO_BASE = 'https://central-supportdesk.kayako.com/agent/conversations'
const GHI_BASE    = 'https://github.com/trilogy-group/eng-maintenance/issues'

interface Props {
  tickets: TicketRow[]
  total:   number                // filtered row count (for pagination)
  filters: BuTicketsListFilters  // current sort/page state
  isAdmin: boolean
}

interface ColDef {
  key:        string
  label:      string
  sortField?: SortField
  width?:     string
}

const COLUMNS: ColDef[] = [
  { key: 'id',           label: 'ID',            sortField: 'kayakoTicketId',  width: 'w-16' },
  { key: 'esc',          label: 'Esc',            sortField: 'isEscalated',     width: 'w-10' },
  { key: 'team',         label: 'Team',           sortField: 'team',            width: 'w-16' },
  { key: 'title',        label: 'Title',          sortField: 'title' },
  { key: 'oneLiner',     label: 'AI Summary' },
  { key: 'product',      label: 'Product',        sortField: 'product' },
  { key: 'customer',     label: 'Customer',       sortField: 'organization' },
  { key: 'priority',     label: 'Priority',       sortField: 'priority',        width: 'w-24' },
  { key: 'status',       label: 'Status',         sortField: 'status' },
  { key: 'blocker',      label: 'Blocker' },
  { key: 'created',      label: 'Created',        sortField: 'kayakoCreatedAt', width: 'w-24' },
  { key: 'age',          label: 'Age',            sortField: 'kayakoCreatedAt', width: 'w-28' },
  { key: 'updated',      label: 'Updated',        sortField: 'kayakoUpdatedAt', width: 'w-28' },
  { key: 'lastAnalysis', label: 'Last Analysis' },
  { key: 'ghi',          label: 'GHI',            width: 'w-16' },
  { key: 'jira',         label: 'JIRA' },
  { key: 'holdReason',   label: 'Hold Reason' },
]

const DEFAULT_VISIBLE_COLS = new Set(COLUMNS.map(c => c.key))

function priorityStyle(p: string | null): string {
  if (!p) return 'bg-slate-100 text-slate-600'
  const lp = p.toLowerCase()
  if (lp === 'urgent') return 'bg-red-100 text-red-700'
  if (lp === 'high')   return 'bg-orange-100 text-orange-700'
  return 'bg-slate-100 text-slate-600'
}

function ageRiskBadge(createdAt: string | null): { label: string; days: number; cls: string } | null {
  if (!createdAt) return null
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000)
  if (days >= 30) return { label: 'AT RISK', days, cls: 'bg-red-100 text-red-700 border-red-200' }
  if (days >= 20) return { label: 'WATCH',   days, cls: 'bg-amber-100 text-amber-700 border-amber-200' }
  return               { label: 'OK',       days, cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
}

function blockerTypeStyle(type: string): string {
  if (type.startsWith('Action:'))              return 'bg-red-100 text-red-700'
  if (type.startsWith('Waiting: Engineering')) return 'bg-amber-100 text-amber-700'
  if (type.startsWith('Waiting: Customer'))    return 'bg-blue-100 text-blue-700'
  if (type.startsWith('Waiting: 3rd'))         return 'bg-purple-100 text-purple-700'
  if (type === 'Ready to Close')               return 'bg-emerald-100 text-emerald-700'
  return 'bg-slate-100 text-slate-500'
}

function ghiStatusStyle(s: string): string {
  const l = s.toLowerCase()
  if (l === 'completed' || l === 'closed') return 'text-green-600'
  if (l === 'open') return 'text-blue-500'
  return 'text-slate-400'
}

function teamStyle(t: string | null): string {
  if (t === 'PS') return 'bg-blue-100 text-blue-700'
  if (t === 'BU') return 'bg-purple-100 text-purple-700'
  return ''
}

export default function BUTicketsTable({ tickets, total, filters, isAdmin }: Props) {
  const tz           = useTimezone()
  const router       = useRouter()
  const searchParams = useSearchParams()

  const [selected,    setSelected]    = useState<Set<string>>(new Set())
  const [deleting,    setDeleting]    = useState(false)
  const [exporting,   setExporting]   = useState(false)
  const [visibleCols, setVisibleCols] = useState<Set<string>>(DEFAULT_VISIBLE_COLS)
  const [colsOpen,    setColsOpen]    = useState(false)
  const colsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (colsRef.current && !colsRef.current.contains(e.target as Node)) {
        setColsOpen(false)
      }
    }
    if (colsOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [colsOpen])

  const totalPages = Math.ceil(total / filters.pageSize)
  const curPage    = filters.page

  function toggleRow(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected(prev => prev.size === tickets.length ? new Set() : new Set(tickets.map(t => t.id)))
  }

  async function handleDeleteSelected() {
    if (selected.size === 0) return
    setDeleting(true)
    try {
      const res = await fetch('/api/bu-tickets', {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ids: [...selected] }),
      })
      if (!res.ok) {
        const body = await res.json() as { error?: string }
        throw new Error(body.error ?? 'Delete failed')
      }
      setSelected(new Set())
      router.refresh()
    } finally {
      setDeleting(false)
    }
  }

  function toggleColVisibility(key: string) {
    if (key === 'id') return
    setVisibleCols(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  async function exportToCsv() {
    setExporting(true)
    try {
      const res = await fetch(`/api/bu-tickets/export?${searchParams.toString()}`)
      if (!res.ok) throw new Error('Export failed')
      const { tickets: allTickets } = await res.json() as { tickets: TicketRow[] }

      const cols = COLUMNS.filter(c => visibleCols.has(c.key))

      function cellValue(t: TicketRow, key: string): string {
        switch (key) {
          case 'id':           return String(t.kayakoTicketId ?? '')
          case 'esc':          return t.isEscalated ? 'Yes' : ''
          case 'team':         return t.team ?? ''
          case 'title':        return t.title ?? ''
          case 'oneLiner':     return t.oneLiner ?? ''
          case 'product':      return t.product ?? ''
          case 'customer':     return t.organization ?? ''
          case 'priority':     return t.priority ?? ''
          case 'status':       return t.status ?? ''
          case 'blocker':      return t.blockerType ?? ''
          case 'created':      return formatDate(t.kayakoCreatedAt, tz)
          case 'age': {
            const r = ageRiskBadge(t.kayakoCreatedAt)
            return r ? `${r.label} (${r.days}d)` : ''
          }
          case 'updated':      return formatDate(t.kayakoUpdatedAt, tz)
          case 'lastAnalysis': return t.lastAnalysedAt ? formatDate(t.lastAnalysedAt, tz) : ''
          case 'ghi':          return t.ghiId ? `#${t.ghiId}${t.ghiStatus ? ` (${t.ghiStatus})` : ''}` : ''
          case 'jira':         return t.jiraFields ? Object.values(t.jiraFields as Record<string, string>).join('; ') : ''
          case 'holdReason':   return t.holdReason ?? ''
          default:             return ''
        }
      }

      function esc(v: string): string {
        if (v.includes(',') || v.includes('"') || v.includes('\n') || v.includes('\r')) {
          return `"${v.replace(/"/g, '""')}"`
        }
        return v
      }

      const header = cols.map(c => esc(c.label)).join(',')
      const rows   = allTickets.map(t => cols.map(c => esc(cellValue(t, c.key))).join(','))
      // BOM prefix so Excel opens UTF-8 correctly
      const csv    = '﻿' + [header, ...rows].join('\r\n')

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `bu-tickets-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  function sortHref(field: SortField): string {
    return buTicketsSortHref(searchParams as unknown as URLSearchParams, field)
  }

  function pageHref(page: number): string {
    return buTicketsPageHref(searchParams as unknown as URLSearchParams, page)
  }

  const visibleColumnDefs = COLUMNS.filter(c => visibleCols.has(c.key))

  return (
    <div className="flex flex-col gap-4">
      {/* Count + column selector + selection controls */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {total} ticket{total !== 1 ? 's' : ''}
          {totalPages > 1 && (
            <span className="ml-1 text-slate-400">
              (page {curPage} of {totalPages})
            </span>
          )}
        </span>

        <div className="flex items-center gap-2">
          {/* Export CSV */}
          <button
            onClick={exportToCsv}
            disabled={exporting}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:border-slate-300 bg-white transition disabled:opacity-60 disabled:cursor-wait"
            title={`Export all ${total} filtered ticket${total !== 1 ? 's' : ''} to CSV`}
          >
            {exporting
              ? <SpinnerIcon className="w-3.5 h-3.5 animate-spin" />
              : <DownloadIcon className="w-3.5 h-3.5" />}
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>

          {/* Column visibility selector */}
          <div className="relative" ref={colsRef}>
            <button
              onClick={() => setColsOpen(o => !o)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:border-slate-300 bg-white transition"
            >
              <TableIcon className="w-3.5 h-3.5" />
              Columns
            </button>
            {colsOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-20 bg-white border border-slate-200 rounded-xl shadow-lg w-52 py-2">
                <p className="px-3 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  Visible columns
                </p>
                <div className="max-h-64 overflow-y-auto">
                  {COLUMNS.map(col => (
                    <label
                      key={col.key}
                      className={`flex items-center gap-2.5 px-3 py-1.5 text-sm transition
                        ${col.key === 'id' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'}`}
                    >
                      <input
                        type="checkbox"
                        checked={visibleCols.has(col.key)}
                        disabled={col.key === 'id'}
                        onChange={() => toggleColVisibility(col.key)}
                        className="rounded border-slate-300"
                      />
                      <span className="text-slate-700">{col.label}</span>
                    </label>
                  ))}
                </div>
                <div className="px-3 pt-2 border-t border-slate-100 mt-1">
                  <button
                    onClick={() => setVisibleCols(DEFAULT_VISIBLE_COLS)}
                    className="text-xs text-slate-400 hover:text-slate-600 transition"
                  >
                    Reset to defaults
                  </button>
                </div>
              </div>
            )}
          </div>

          {isAdmin && selected.size > 0 && (
            <button
              onClick={handleDeleteSelected}
              disabled={deleting}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
            >
              {deleting && <SpinnerIcon className="w-3.5 h-3.5 animate-spin" />}
              Delete {selected.size} selected
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {tickets.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg font-medium mb-2">No tickets found</p>
          <p className="text-sm">Try adjusting your filters, or click <strong>Sync Now</strong> to fetch from Kayako.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {isAdmin && (
                  <th className="px-3 py-2.5 w-8">
                    <input
                      type="checkbox"
                      checked={tickets.length > 0 && selected.size === tickets.length}
                      onChange={toggleAll}
                      className="rounded border-slate-300 cursor-pointer"
                    />
                  </th>
                )}
                {visibleColumnDefs.map(col => {
                  const isSorted = col.sortField === filters.sortField
                  return (
                    <th
                      key={col.key}
                      className={`text-left px-3 py-2.5 font-semibold text-slate-600 whitespace-nowrap ${col.width ?? ''} ${col.sortField ? 'cursor-pointer hover:bg-slate-100 select-none' : ''}`}
                    >
                      {col.sortField ? (
                        <Link
                          href={sortHref(col.sortField)}
                          className="flex items-center gap-1 hover:text-slate-900"
                        >
                          {col.label}
                          {isSorted && (
                            <span className="text-blue-500">
                              {filters.sortDir === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </Link>
                      ) : (
                        col.label
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {tickets.map((t, i) => (
                <tr
                  key={t.id}
                  className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-blue-50 transition-colors`}
                >
                  {isAdmin && (
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selected.has(t.id)}
                        onChange={() => toggleRow(t.id)}
                        className="rounded border-slate-300 cursor-pointer"
                      />
                    </td>
                  )}

                  {/* ID — always visible */}
                  {visibleCols.has('id') && (
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/bu-tickets/${t.kayakoTicketId}`}
                          className="text-blue-600 hover:underline font-mono font-medium"
                        >
                          {t.kayakoTicketId}
                        </Link>
                        <a
                          href={`${KAYAKO_BASE}/${t.kayakoTicketId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-blue-500 transition-colors"
                          title="Open in Kayako"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  )}

                  {visibleCols.has('esc') && (
                    <td className="px-3 py-2 text-center">
                      {t.isEscalated && (
                        <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-1.5 py-0.5 rounded">ESC</span>
                      )}
                    </td>
                  )}

                  {visibleCols.has('team') && (
                    <td className="px-3 py-2">
                      {t.team && (
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${teamStyle(t.team)}`}>
                          {t.team}
                        </span>
                      )}
                    </td>
                  )}

                  {visibleCols.has('title') && (
                    <td className="px-3 py-2 max-w-xs">
                      <span className="block text-sm leading-snug">{t.title}</span>
                    </td>
                  )}

                  {visibleCols.has('oneLiner') && (
                    <td className="px-3 py-2 max-w-xs">
                      {t.oneLiner
                        ? <span className="block text-xs text-slate-500 leading-snug italic">{t.oneLiner}</span>
                        : <span className="text-xs text-slate-300">—</span>}
                    </td>
                  )}

                  {visibleCols.has('product') && (
                    <td className="px-3 py-2 whitespace-nowrap text-slate-600">{t.product ?? ''}</td>
                  )}

                  {visibleCols.has('customer') && (
                    <td className="px-3 py-2 max-w-[160px] text-slate-700">
                      <span className="block text-sm leading-snug">{t.organization ?? ''}</span>
                    </td>
                  )}

                  {visibleCols.has('priority') && (
                    <td className="px-3 py-2">
                      {t.priority && (
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${priorityStyle(t.priority)}`}>
                          {t.priority}
                        </span>
                      )}
                    </td>
                  )}

                  {visibleCols.has('status') && (
                    <td className="px-3 py-2 whitespace-nowrap text-slate-600">{t.status ?? ''}</td>
                  )}

                  {visibleCols.has('blocker') && (
                    <td className="px-3 py-2 whitespace-nowrap">
                      {t.blockerType ? (
                        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${blockerTypeStyle(t.blockerType)}`}>
                          {t.blockerType}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                  )}

                  {visibleCols.has('created') && (
                    <td className="px-3 py-2 whitespace-nowrap text-slate-500">{formatDate(t.kayakoCreatedAt, tz)}</td>
                  )}

                  {visibleCols.has('age') && (
                    <td className="px-3 py-2 whitespace-nowrap">
                      {(() => {
                        const r = ageRiskBadge(t.kayakoCreatedAt)
                        if (!r) return null
                        return (
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${r.cls}`}>
                            {r.label !== 'OK' && <span>⚠</span>}
                            {r.label} · {r.days}d
                          </span>
                        )
                      })()}
                    </td>
                  )}

                  {visibleCols.has('updated') && (
                    <td className="px-3 py-2 whitespace-nowrap text-slate-500" title={formatDateTime(t.kayakoUpdatedAt, tz)}>
                      {formatRelative(t.kayakoUpdatedAt)}
                    </td>
                  )}

                  {visibleCols.has('lastAnalysis') && (
                    <td className="px-3 py-2 whitespace-nowrap text-slate-500" title={t.lastAnalysedAt ? formatDateTime(t.lastAnalysedAt, tz) : ''}>
                      {t.lastAnalysedAt ? formatRelative(t.lastAnalysedAt) : <span className="text-slate-300">—</span>}
                    </td>
                  )}

                  {visibleCols.has('ghi') && (
                    <td className="px-3 py-2 whitespace-nowrap">
                      {t.ghiId ? (
                        <a href={`${GHI_BASE}/${t.ghiId}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          #{t.ghiId}
                        </a>
                      ) : null}
                      {t.ghiStatus ? (
                        <div className={`text-xs mt-0.5 ${ghiStatusStyle(t.ghiStatus)}`}>{t.ghiStatus}</div>
                      ) : null}
                    </td>
                  )}

                  {visibleCols.has('jira') && (
                    <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                      {t.jiraFields ? Object.values(t.jiraFields).join(', ') : ''}
                    </td>
                  )}

                  {visibleCols.has('holdReason') && (
                    <td className="px-3 py-2 text-slate-500 max-w-xs">
                      <span className="block text-xs leading-snug">{t.holdReason ?? ''}</span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400 text-xs">
            Showing {(curPage - 1) * filters.pageSize + 1}–{Math.min(curPage * filters.pageSize, total)} of {total}
          </span>
          <div className="flex items-center gap-1">
            <PaginationLink href={pageHref(curPage - 1)} disabled={curPage <= 1}>← Prev</PaginationLink>

            {buildPageRange(curPage, totalPages).map((entry, i) =>
              entry === '…' ? (
                <span key={`ellipsis-${i}`} className="px-2 text-slate-400">…</span>
              ) : (
                <PaginationLink key={entry} href={pageHref(entry as number)} active={entry === curPage}>
                  {entry}
                </PaginationLink>
              ),
            )}

            <PaginationLink href={pageHref(curPage + 1)} disabled={curPage >= totalPages}>Next →</PaginationLink>
          </div>
          {/* Page size selector */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Per page:</span>
            {([25, 50, 100] as const).map(ps => (
              <Link
                key={ps}
                href={buTicketsPageHref(
                  new URLSearchParams({ ...urlSearchParamsToRecord(searchParams as unknown as URLSearchParams), pageSize: String(ps) }),
                  1,
                )}
                className={`px-2 py-0.5 rounded transition ${filters.pageSize === ps ? 'bg-blue-600 text-white' : 'hover:bg-slate-200'}`}
              >
                {ps}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PaginationLink({
  href,
  children,
  disabled,
  active,
}: {
  href:      string
  children:  React.ReactNode
  disabled?: boolean
  active?:   boolean
}) {
  if (disabled) {
    return <span className="px-2.5 py-1 text-xs text-slate-300 rounded">{children}</span>
  }
  return (
    <Link
      href={href}
      className={`px-2.5 py-1 text-xs rounded transition ${
        active
          ? 'bg-blue-600 text-white'
          : 'hover:bg-slate-100 text-slate-600'
      }`}
    >
      {children}
    </Link>
  )
}

function buildPageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (current > 3)       pages.push('…')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p)
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l-3 3H4z" />
    </svg>
  )
}

function TableIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18" />
    </svg>
  )
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
    </svg>
  )
}
