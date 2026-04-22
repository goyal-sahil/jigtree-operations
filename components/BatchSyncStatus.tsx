'use client'

import { useState } from 'react'

interface Props {
  label:        string
  endpoint:     string   // POST endpoint to trigger the job
  pendingCount: number   // tickets awaiting processing
  recentRuns:   RecentRun[]
}

interface RecentRun {
  id:             string
  status:         string
  processedCount: number
  failedCount:    number
  skippedCount:   number
  durationMs:     number | null
  errorMsg:       string | null
  createdAt:      string
}

export default function BatchSyncStatus({ label, endpoint, pendingCount, recentRuns }: Props) {
  const [running,    setRunning]    = useState(false)
  const [lastResult, setLastResult] = useState<string | null>(null)

  async function handleTrigger() {
    setRunning(true)
    setLastResult(null)
    try {
      const res  = await fetch(endpoint, { method: 'POST' })
      const body = await res.json() as Record<string, unknown>
      if (!res.ok) {
        setLastResult(`Error: ${(body.error as string) ?? `HTTP ${res.status}`}`)
      } else {
        const parts: string[] = []
        if (typeof body.processed === 'number') parts.push(`${body.processed} processed`)
        if (typeof body.failed    === 'number' && body.failed > 0) parts.push(`${body.failed} failed`)
        if (typeof body.skipped   === 'number' && body.skipped > 0) parts.push(`${body.skipped} skipped`)
        setLastResult(parts.length > 0 ? parts.join(', ') : 'Done')
      }
    } catch (err) {
      setLastResult(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {pendingCount > 0
              ? <span className="text-amber-600 font-medium">{pendingCount} ticket{pendingCount !== 1 ? 's' : ''} pending</span>
              : <span className="text-emerald-600">All up to date</span>
            }
          </p>
        </div>
        <button
          onClick={handleTrigger}
          disabled={running}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 disabled:opacity-60 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition"
        >
          {running ? (
            <>
              <SpinnerIcon className="w-3.5 h-3.5 animate-spin" />
              Running…
            </>
          ) : (
            'Run now'
          )}
        </button>
      </div>

      {lastResult && (
        <p className={`text-xs mb-3 ${lastResult.startsWith('Error') ? 'text-red-600' : 'text-emerald-600'}`}>
          {lastResult}
        </p>
      )}

      {recentRuns.length > 0 && (
        <div className="border-t border-slate-100 pt-3">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Recent runs</p>
          <div className="flex flex-col gap-1">
            {recentRuns.map(run => (
              <div key={run.id} className="flex items-center gap-3 text-xs text-slate-600">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  run.status === 'done'    ? 'bg-emerald-500' :
                  run.status === 'error'   ? 'bg-red-500' :
                  run.status === 'running' ? 'bg-blue-500' : 'bg-slate-300'
                }`} />
                <span className="text-slate-400 shrink-0">{new Date(run.createdAt).toLocaleTimeString()}</span>
                <span>
                  {run.processedCount > 0 && <>{run.processedCount} processed</>}
                  {run.failedCount > 0    && <>, {run.failedCount} failed</>}
                  {run.skippedCount > 0   && <>, {run.skippedCount} skipped</>}
                  {run.durationMs != null && <> ({(run.durationMs / 1000).toFixed(1)}s)</>}
                </span>
                {run.errorMsg && <span className="text-red-500 truncate max-w-[200px]" title={run.errorMsg}>{run.errorMsg}</span>}
              </div>
            ))}
          </div>
        </div>
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
