'use client'

import { useState } from 'react'
import { useTimezone } from '@/components/TimezoneProvider'
import { formatDateTime } from '@/lib/tz'
import { formatCostUsd } from '@/lib/pricing'

export interface AnalysisRunRow {
  id:            string
  trigger:       string
  modelUsed:     string | null
  postCount:     number | null
  inputTokens:   number | null
  outputTokens:  number | null
  durationMs:    number | null
  status:        string
  errorMsg:      string | null
  createdAt:     string
  inputCostUsd:  number | null
  outputCostUsd: number | null
  totalCostUsd:  number | null
  isOrphaned?:   boolean
}

interface Props {
  runs: AnalysisRunRow[]
}

const TRIGGER_LABELS: Record<string, string> = {
  manual:  'Manual',
  forced:  'Force re-run',
  batch:   'Batch',
}

const STATUS_STYLES: Record<string, string> = {
  done:  'bg-green-100 text-green-700',
  error: 'bg-red-100 text-red-700',
}

function fmt(n: number | null | undefined): string {
  if (n == null) return '—'
  return n.toLocaleString()
}

function fmtDuration(ms: number | null | undefined): string {
  if (ms == null) return '—'
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function sumCosts(runs: AnalysisRunRow[]): number | null {
  const vals = runs.map(r => r.totalCostUsd).filter((v): v is number => v != null)
  if (vals.length === 0) return null
  return vals.reduce((a, b) => a + b, 0)
}

export default function AnalysisHistory({ runs }: Props) {
  const tz = useTimezone()
  const [expanded, setExpanded] = useState(false)

  if (runs.length === 0) return null

  const totalCost = sumCosts(runs)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-slate-50 rounded-xl transition"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-800 text-sm">
            📋 Analysis Run History ({runs.length})
          </span>
          {totalCost != null && (
            <span className="text-xs text-slate-500">
              Total cost: <span className="font-semibold text-slate-700">{formatCostUsd(totalCost)}</span>
            </span>
          )}
        </div>
        <span className="text-slate-400 text-sm">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 overflow-x-auto">
          <table className="w-full text-xs min-w-[800px]">
            <thead>
              <tr className="text-slate-500 border-b border-slate-100">
                <th className="text-left py-2 pr-3 font-semibold">When</th>
                <th className="text-left py-2 pr-3 font-semibold">Trigger</th>
                <th className="text-left py-2 pr-3 font-semibold">Status</th>
                <th className="text-left py-2 pr-3 font-semibold">Model</th>
                <th className="text-right py-2 pr-3 font-semibold">Posts</th>
                <th className="text-right py-2 pr-3 font-semibold">In tokens</th>
                <th className="text-right py-2 pr-3 font-semibold">Out tokens</th>
                <th className="text-right py-2 pr-3 font-semibold">In cost</th>
                <th className="text-right py-2 pr-3 font-semibold">Out cost</th>
                <th className="text-right py-2 pr-3 font-semibold">Total cost</th>
                <th className="text-right py-2 font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody>
              {runs.map(r => (
                <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-2 pr-3 text-slate-600 whitespace-nowrap">
                    {formatDateTime(r.createdAt, tz)}
                    {r.isOrphaned && (
                      <span className="ml-1.5 text-xs text-amber-500" title="Run from a previous import of this ticket">orphaned</span>
                    )}
                  </td>
                  <td className="py-2 pr-3 text-slate-700">
                    {TRIGGER_LABELS[r.trigger] ?? r.trigger}
                  </td>
                  <td className="py-2 pr-3">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[r.status] ?? 'bg-slate-100 text-slate-600'}`}>
                      {r.status}
                    </span>
                    {r.errorMsg && (
                      <span className="ml-2 text-red-500 italic">{r.errorMsg}</span>
                    )}
                  </td>
                  <td className="py-2 pr-3 text-slate-600 font-mono whitespace-nowrap">
                    {r.modelUsed
                      ? r.modelUsed.replace('claude-', '').replace(/-\d{8}$/, '')
                      : '—'}
                  </td>
                  <td className="py-2 pr-3 text-right text-slate-700">{fmt(r.postCount)}</td>
                  <td className="py-2 pr-3 text-right text-slate-700">{fmt(r.inputTokens)}</td>
                  <td className="py-2 pr-3 text-right text-slate-700">{fmt(r.outputTokens)}</td>
                  <td className="py-2 pr-3 text-right text-slate-500">{formatCostUsd(r.inputCostUsd)}</td>
                  <td className="py-2 pr-3 text-right text-slate-500">{formatCostUsd(r.outputCostUsd)}</td>
                  <td className="py-2 pr-3 text-right font-semibold text-slate-700">{formatCostUsd(r.totalCostUsd)}</td>
                  <td className="py-2 text-right text-slate-700">{fmtDuration(r.durationMs)}</td>
                </tr>
              ))}
            </tbody>
            {totalCost != null && (
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td colSpan={9} className="py-2 pr-3 text-right text-slate-500 font-semibold">
                    Total ({runs.length} run{runs.length !== 1 ? 's' : ''})
                  </td>
                  <td className="py-2 pr-3 text-right font-bold text-slate-800">
                    {formatCostUsd(totalCost)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
          <p className="mt-3 text-xs text-slate-400">
            Costs computed from the <code>model_pricing</code> table using Anthropic list prices.
            Update pricing in Prisma Studio if rates change.
          </p>
        </div>
      )}
    </div>
  )
}
