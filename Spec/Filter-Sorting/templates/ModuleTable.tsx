'use client'

/**
 * ModuleTable — sortable table with column visibility, CSV export, pagination.
 * Replace Module/module with your feature name throughout.
 */

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  moduleSortHref,
  modulePageHref,
  urlSearchParamsToRecord,
  type ModuleListFilters,
  type SortField,
} from '@/lib/module-list-filters'

// TODO: replace with your row type
type Row = Record<string, any>

interface ColDef {
  key:        string
  label:      string
  sortField?: SortField
  width?:     string   // Tailwind width class, e.g. 'w-24'
}

// TODO: define your columns
const COLUMNS: ColDef[] = [
  { key: 'id',        label: 'ID',       sortField: 'numericId', width: 'w-16' },
  { key: 'name',      label: 'Name',     sortField: 'name' },
  { key: 'status',    label: 'Status',   sortField: 'status' },
  { key: 'priority',  label: 'Priority', sortField: 'priority', width: 'w-24' },
  { key: 'createdAt', label: 'Created',  sortField: 'createdAt', width: 'w-28' },
  { key: 'updatedAt', label: 'Updated',  sortField: 'updatedAt', width: 'w-28' },
]

const ALWAYS_VISIBLE_COL = 'id'  // This column cannot be hidden
const DEFAULT_VISIBLE_COLS = new Set(COLUMNS.map(c => c.key))

interface Props {
  rows:    Row[]
  total:   number               // filtered row count
  filters: ModuleListFilters
  isAdmin: boolean
}

export default function ModuleTable({ rows, total, filters, isAdmin }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  const [selected,    setSelected]    = useState<Set<string>>(new Set())
  const [deleting,    setDeleting]    = useState(false)
  const [exporting,   setExporting]   = useState(false)
  const [visibleCols, setVisibleCols] = useState<Set<string>>(DEFAULT_VISIBLE_COLS)
  const [colsOpen,    setColsOpen]    = useState(false)
  const colsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (colsRef.current && !colsRef.current.contains(e.target as Node)) setColsOpen(false)
    }
    if (colsOpen) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [colsOpen])

  const totalPages = Math.ceil(total / filters.pageSize)

  // ---------------------------------------------------------------------------
  // Row selection (admin only)
  // ---------------------------------------------------------------------------
  function toggleRow(id: string) {
    setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  }
  function toggleAll() {
    setSelected(prev => prev.size === rows.length ? new Set() : new Set(rows.map(r => r.id)))
  }

  async function handleDeleteSelected() {
    if (selected.size === 0) return
    setDeleting(true)
    try {
      const res = await fetch('/api/module', {   // TODO: adjust route
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ids: [...selected] }),
      })
      if (!res.ok) throw new Error('Delete failed')
      setSelected(new Set())
      router.refresh()
    } finally {
      setDeleting(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Column visibility
  // ---------------------------------------------------------------------------
  function toggleColVisibility(key: string) {
    if (key === ALWAYS_VISIBLE_COL) return
    setVisibleCols(prev => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next })
  }

  // ---------------------------------------------------------------------------
  // CSV export — fetches ALL filtered rows from the API (not just current page)
  // ---------------------------------------------------------------------------
  async function exportToCsv() {
    setExporting(true)
    try {
      const res = await fetch(`/api/module/export?${searchParams.toString()}`)  // TODO: adjust route
      if (!res.ok) throw new Error('Export failed')
      const { rows: allRows } = await res.json() as { rows: Row[] }

      const cols = COLUMNS.filter(c => visibleCols.has(c.key))

      function cellValue(row: Row, key: string): string {
        // TODO: map each column key to the right display value
        const v = row[key]
        if (v === null || v === undefined) return ''
        if (typeof v === 'boolean') return v ? 'Yes' : 'No'
        return String(v)
      }

      function esc(v: string): string {
        return (v.includes(',') || v.includes('"') || v.includes('\n') || v.includes('\r'))
          ? `"${v.replace(/"/g, '""')}"`
          : v
      }

      const header = cols.map(c => esc(c.label)).join(',')
      const csvRows = allRows.map(r => cols.map(c => esc(cellValue(r, c.key))).join(','))
      // BOM prefix so Excel opens UTF-8 correctly
      const csv = '﻿' + [header, ...csvRows].join('\r\n')

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `module-${new Date().toISOString().slice(0, 10)}.csv`  // TODO: adjust filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Href helpers
  // ---------------------------------------------------------------------------
  function sortHref(field: SortField) {
    return moduleSortHref(searchParams as unknown as URLSearchParams, field)
  }
  function pageHref(page: number) {
    return modulePageHref(searchParams as unknown as URLSearchParams, page)
  }

  const visibleColumnDefs = COLUMNS.filter(c => visibleCols.has(c.key))

  return (
    <div className="flex flex-col gap-4">
      {/* Top bar: count + tools */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {total} item{total !== 1 ? 's' : ''}
          {totalPages > 1 && <span className="ml-1 text-slate-400">(page {filters.page} of {totalPages})</span>}
        </span>

        <div className="flex items-center gap-2">
          {/* Export CSV */}
          <button
            onClick={exportToCsv}
            disabled={exporting}
            title={`Export all ${total} filtered rows to CSV`}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:border-slate-300 bg-white transition disabled:opacity-60 disabled:cursor-wait"
          >
            {exporting
              ? <SpinnerIcon className="w-3.5 h-3.5 animate-spin" />
              : <DownloadIcon className="w-3.5 h-3.5" />}
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>

          {/* Column visibility */}
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
                <p className="px-3 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Visible columns</p>
                <div className="max-h-64 overflow-y-auto">
                  {COLUMNS.map(col => (
                    <label
                      key={col.key}
                      className={`flex items-center gap-2.5 px-3 py-1.5 text-sm transition
                        ${col.key === ALWAYS_VISIBLE_COL ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 cursor-pointer'}`}
                    >
                      <input
                        type="checkbox"
                        checked={visibleCols.has(col.key)}
                        disabled={col.key === ALWAYS_VISIBLE_COL}
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

          {/* Delete selected (admin only) */}
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
      {rows.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg font-medium mb-2">No results found</p>
          <p className="text-sm">Try adjusting your filters.</p>
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
                      checked={rows.length > 0 && selected.size === rows.length}
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
                        <Link href={sortHref(col.sortField)} className="flex items-center gap-1 hover:text-slate-900">
                          {col.label}
                          {isSorted && (
                            <span className="text-blue-500">{filters.sortDir === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </Link>
                      ) : col.label}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-blue-50 transition-colors`}
                >
                  {isAdmin && (
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={() => toggleRow(row.id)}
                        className="rounded border-slate-300 cursor-pointer"
                      />
                    </td>
                  )}

                  {/* TODO: render each column */}
                  {visibleColumnDefs.map(col => (
                    <td key={col.key} className="px-3 py-2 text-slate-700">
                      {String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400 text-xs">
            Showing {(filters.page - 1) * filters.pageSize + 1}–{Math.min(filters.page * filters.pageSize, total)} of {total}
          </span>
          <div className="flex items-center gap-1">
            <PaginationLink href={pageHref(filters.page - 1)} disabled={filters.page <= 1}>← Prev</PaginationLink>
            {buildPageRange(filters.page, totalPages).map((entry, i) =>
              entry === '…' ? (
                <span key={`e${i}`} className="px-2 text-slate-400">…</span>
              ) : (
                <PaginationLink key={entry} href={pageHref(entry as number)} active={entry === filters.page}>
                  {entry}
                </PaginationLink>
              ),
            )}
            <PaginationLink href={pageHref(filters.page + 1)} disabled={filters.page >= totalPages}>Next →</PaginationLink>
          </div>
          {/* Page size */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Per page:</span>
            {([25, 50, 100] as const).map(ps => (
              <Link
                key={ps}
                href={modulePageHref(
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function PaginationLink({ href, children, disabled, active }: { href: string; children: React.ReactNode; disabled?: boolean; active?: boolean }) {
  if (disabled) return <span className="px-2.5 py-1 text-xs text-slate-300 rounded">{children}</span>
  return (
    <Link href={href} className={`px-2.5 py-1 text-xs rounded transition ${active ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'}`}>
      {children}
    </Link>
  )
}

function buildPageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (current > 3)        pages.push('…')
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
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18" />
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
