'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import type { TicketRow } from '@/types/kayako'
import { useTimezone } from '@/components/TimezoneProvider'
import { formatDate, formatDateTime, formatRelative } from '@/lib/tz'

const KAYAKO_BASE = 'https://central-supportdesk.kayako.com/agent/conversations'
const GHI_BASE = 'https://github.com/trilogy-group/eng-maintenance/issues'

interface Props {
  tickets: TicketRow[]
  lastSyncedAt: string | null
  syncStatus: string | null
  syncElapsed: number
  isAdmin: boolean
  onSync: () => Promise<void>
  onDelete: (ids: string[]) => Promise<void>
  onDeleteAll: () => Promise<void>
}

type SortKey = keyof TicketRow
type PageSize = 25 | 50 | 'all'

const COLUMNS: { key: SortKey; label: string; width?: string }[] = [
  { key: 'kayakoTicketId',  label: 'ID',            width: 'w-16' },
  { key: 'isEscalated',     label: 'Esc',           width: 'w-10' },
  { key: 'team',            label: 'Team',          width: 'w-16' },
  { key: 'title',           label: 'Title' },
  { key: 'oneLiner',        label: 'AI Summary' },
  { key: 'product',         label: 'Product' },
  { key: 'organization',    label: 'Customer' },
  { key: 'priority',        label: 'Priority',      width: 'w-24' },
  { key: 'status',          label: 'Status' },
  { key: 'blockerType',     label: 'Blocker' },
  { key: 'kayakoCreatedAt', label: 'Created',       width: 'w-24' },
  { key: 'kayakoCreatedAt', label: 'Age',           width: 'w-28' },
  { key: 'kayakoUpdatedAt', label: 'Updated',       width: 'w-28' },
  { key: 'lastAnalysedAt',  label: 'Last Analysis', width: 'w-28' },
  { key: 'ghiId',           label: 'GHI',           width: 'w-16' },
  { key: 'jiraFields',      label: 'JIRA' },
  { key: 'holdReason',      label: 'Hold Reason' },
]


function priorityStyle(p: string | null): string {
  if (!p) return 'bg-slate-100 text-slate-600'
  const lp = p.toLowerCase()
  if (lp === 'urgent') return 'bg-red-100 text-red-700'
  if (lp === 'high') return 'bg-orange-100 text-orange-700'
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
  if (type.startsWith('Action:'))             return 'bg-red-100 text-red-700'
  if (type.startsWith('Waiting: Engineering')) return 'bg-amber-100 text-amber-700'
  if (type.startsWith('Waiting: Customer'))    return 'bg-blue-100 text-blue-700'
  if (type.startsWith('Waiting: 3rd'))        return 'bg-purple-100 text-purple-700'
  if (type === 'Ready to Close')              return 'bg-emerald-100 text-emerald-700'
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

function sortRows(rows: TicketRow[], key: SortKey, dir: 'asc' | 'desc'): TicketRow[] {
  return [...rows].sort((a, b) => {
    const av = a[key]
    const bv = b[key]
    let cmp = 0
    if (av === null || av === undefined) cmp = 1
    else if (bv === null || bv === undefined) cmp = -1
    else if (typeof av === 'boolean') cmp = (av === bv ? 0 : av ? -1 : 1)
    else if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv
    else cmp = String(av).localeCompare(String(bv))
    return dir === 'asc' ? cmp : -cmp
  })
}

export default function BUTicketsTable({ tickets, lastSyncedAt, syncStatus, syncElapsed, isAdmin, onSync, onDelete, onDeleteAll }: Props) {
  const tz = useTimezone()
  const [sortKey, setSortKey] = useState<SortKey>('kayakoUpdatedAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [filter, setFilter] = useState('')
  const [pageSize, setPageSize] = useState<PageSize>(25)
  const [syncing, setSyncing] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false)

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    const q = filter.toLowerCase().trim()
    if (!q) return tickets
    return tickets.filter(t =>
      [String(t.kayakoTicketId), t.title, t.requesterName, t.brand, t.organization, t.product]
        .some(v => v?.toLowerCase().includes(q))
    )
  }, [tickets, filter])

  const sorted = useMemo(() => sortRows(filtered, sortKey, sortDir), [filtered, sortKey, sortDir])

  const paged = pageSize === 'all' ? sorted : sorted.slice(0, pageSize)

  function toggleRow(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected(prev => prev.size === paged.length ? new Set() : new Set(paged.map(t => t.id)))
  }

  async function handleDeleteSelected() {
    if (selected.size === 0) return
    setDeleting(true)
    try { await onDelete([...selected]); setSelected(new Set()) } finally { setDeleting(false) }
  }

  async function handleDeleteAll() {
    setDeleting(true)
    try { await onDeleteAll(); setSelected(new Set()); setConfirmDeleteAll(false) } finally { setDeleting(false) }
  }

  async function handleSync() {
    setSyncing(true)
    try { await onSync() } finally { setSyncing(false) }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Filter by ID, title, customer, BU, product…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="flex-1 min-w-[200px] border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSync}
          disabled={syncing}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition flex items-center gap-2 shrink-0"
        >
          {syncing ? (
            <>
              <SpinnerIcon className="w-4 h-4 animate-spin" />
              Syncing…
            </>
          ) : (
            'Sync Now'
          )}
        </button>
        <div className="flex flex-col gap-0.5">
          {syncing && (
            <span className="text-blue-600 text-xs font-medium">
              {syncStatus ?? 'Syncing…'} ({syncElapsed}s elapsed)
            </span>
          )}
          {!syncing && syncStatus && (
            <span className="text-green-600 text-xs">{syncStatus}</span>
          )}
          {lastSyncedAt && (
            <span className="text-slate-400 text-xs" title={formatDateTime(lastSyncedAt, tz)}>
              Last synced {formatRelative(lastSyncedAt)}
            </span>
          )}
        </div>

        {/* Admin delete controls */}
        {isAdmin && (
          <div className="flex items-center gap-2 ml-auto">
            {selected.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                disabled={deleting}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium px-3 py-2 rounded-lg transition"
              >
                {deleting ? <SpinnerIcon className="w-4 h-4 animate-spin" /> : null}
                Delete {selected.size} selected
              </button>
            )}
            {!confirmDeleteAll ? (
              <button
                onClick={() => setConfirmDeleteAll(true)}
                disabled={deleting || tickets.length === 0}
                className="flex items-center gap-1.5 border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-40 text-sm font-medium px-3 py-2 rounded-lg transition"
              >
                Delete All
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                <span className="text-red-700 text-xs font-medium">Delete all {tickets.length} tickets?</span>
                <button onClick={handleDeleteAll} disabled={deleting} className="text-red-700 hover:text-red-900 text-xs font-bold underline">Yes, delete</button>
                <button onClick={() => setConfirmDeleteAll(false)} className="text-slate-500 hover:text-slate-700 text-xs underline">Cancel</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Count + page size */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{filtered.length} ticket{filtered.length !== 1 ? 's' : ''}{filter ? ` matching "${filter}"` : ''}</span>
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          {([25, 50, 'all'] as PageSize[]).map(ps => (
            <button
              key={String(ps)}
              onClick={() => setPageSize(ps)}
              className={`px-2 py-0.5 rounded transition ${pageSize === ps ? 'bg-blue-600 text-white' : 'hover:bg-slate-200'}`}
            >
              {String(ps)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {tickets.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg font-medium mb-2">No tickets yet</p>
          <p className="text-sm">Click <strong>Sync Now</strong> to fetch tickets from Kayako view #64.</p>
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
                      checked={paged.length > 0 && selected.size === paged.length}
                      onChange={toggleAll}
                      className="rounded border-slate-300 cursor-pointer"
                    />
                  </th>
                )}
                {COLUMNS.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={`
                      text-left px-3 py-2.5 font-semibold text-slate-600 cursor-pointer
                      hover:bg-slate-100 select-none whitespace-nowrap
                      ${col.width ?? ''}
                    `}
                  >
                    {col.label}
                    {sortKey === col.key && (
                      <span className="ml-1 text-blue-500">{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((t, i) => (
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

                  {/* ID */}
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

                  {/* Esc */}
                  <td className="px-3 py-2 text-center">
                    {t.isEscalated && (
                      <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-1.5 py-0.5 rounded">ESC</span>
                    )}
                  </td>

                  {/* Team */}
                  <td className="px-3 py-2">
                    {t.team && (
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${teamStyle(t.team)}`}>
                        {t.team}
                      </span>
                    )}
                  </td>

                  {/* Title */}
                  <td className="px-3 py-2 max-w-xs">
                    <span className="block text-sm leading-snug">{t.title}</span>
                  </td>

                  {/* AI Summary */}
                  <td className="px-3 py-2 max-w-xs">
                    {t.oneLiner
                      ? <span className="block text-xs text-slate-500 leading-snug italic">{t.oneLiner}</span>
                      : <span className="text-xs text-slate-300">—</span>}
                  </td>

                  {/* Product */}
                  <td className="px-3 py-2 whitespace-nowrap text-slate-600">{t.product ?? ''}</td>

                  {/* Customer */}
                  <td className="px-3 py-2 max-w-[160px] text-slate-700">
                    <span className="block text-sm leading-snug">{t.organization ?? ''}</span>
                  </td>

                  {/* Priority */}
                  <td className="px-3 py-2">
                    {t.priority && (
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${priorityStyle(t.priority)}`}>
                        {t.priority}
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-3 py-2 whitespace-nowrap text-slate-600">{t.status ?? ''}</td>

                  {/* Blocker */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    {t.blockerType ? (
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${blockerTypeStyle(t.blockerType)}`}>
                        {t.blockerType}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>

                  {/* Created */}
                  <td className="px-3 py-2 whitespace-nowrap text-slate-500">{formatDate(t.kayakoCreatedAt, tz)}</td>

                  {/* Age risk */}
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

                  {/* Updated */}
                  <td className="px-3 py-2 whitespace-nowrap text-slate-500" title={formatDateTime(t.kayakoUpdatedAt, tz)}>
                    {formatRelative(t.kayakoUpdatedAt)}
                  </td>

                  {/* Last Analysis */}
                  <td className="px-3 py-2 whitespace-nowrap text-slate-500" title={t.lastAnalysedAt ? formatDateTime(t.lastAnalysedAt, tz) : ''}>
                    {t.lastAnalysedAt ? formatRelative(t.lastAnalysedAt) : <span className="text-slate-300">—</span>}
                  </td>

                  {/* GHI */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    {t.ghiId ? (
                      <a
                        href={`${GHI_BASE}/${t.ghiId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        #{t.ghiId}
                      </a>
                    ) : null}
                    {t.ghiStatus ? (
                      <div className={`text-xs mt-0.5 ${ghiStatusStyle(t.ghiStatus)}`}>{t.ghiStatus}</div>
                    ) : null}
                  </td>

                  {/* JIRA */}
                  <td className="px-3 py-2 whitespace-nowrap text-slate-600">
                    {t.jiraFields
                      ? Object.values(t.jiraFields).join(', ')
                      : ''}
                  </td>

                  {/* Hold Reason */}
                  <td className="px-3 py-2 text-slate-500 max-w-xs">
                    <span className="block text-xs leading-snug">{t.holdReason ?? ''}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pageSize !== 'all' && sorted.length > pageSize && (
        <p className="text-xs text-slate-400 text-center">
          Showing {pageSize} of {sorted.length} tickets — select "all" to see everything.
        </p>
      )}
    </div>
  )
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l-3 3H4z" />
    </svg>
  )
}
