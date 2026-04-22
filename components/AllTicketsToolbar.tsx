'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { formatDateTime, formatRelative } from '@/lib/tz'
import { useTimezone } from '@/components/TimezoneProvider'

interface Props {
  lastSyncedAt: string | null
  isAdmin:      boolean
  totalCount:   number
}

const SYNC_TIMEOUT_MS = 10 * 60 * 1000

export default function AllTicketsToolbar({ lastSyncedAt, isAdmin, totalCount }: Props) {
  const router = useRouter()
  const tz     = useTimezone()

  const [syncing,          setSyncing]          = useState(false)
  const [syncStatus,       setSyncStatus]       = useState<string | null>(null)
  const [syncElapsed,      setSyncElapsed]      = useState(0)
  const [deleting,         setDeleting]         = useState(false)
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false)
  const syncTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function handleSync() {
    setSyncing(true)
    setSyncElapsed(0)
    setSyncStatus('Connecting to Kayako…')
    syncTimerRef.current = setInterval(() => setSyncElapsed(s => s + 1), 1000)
    const controller = new AbortController()
    const timeoutId  = setTimeout(() => controller.abort(), SYNC_TIMEOUT_MS)
    try {
      const res = await fetch('/api/all-tickets/sync', { method: 'POST', signal: controller.signal })
      clearTimeout(timeoutId)
      if (!res.ok) {
        const body = await res.json() as { error?: string }
        throw new Error(body.error ?? `Sync failed: HTTP ${res.status}`)
      }
      const body = await res.json() as {
        synced: number; skipped: number; failed: number; total: number; duration: number; firstError?: string
      }
      if (body.synced === 0 && body.skipped === 0) {
        const detail = body.firstError ? ` — ${body.firstError}` : ''
        setSyncStatus(`Sync completed but all ${body.total} tickets failed${detail}`)
      } else {
        const parts = [`Synced ${body.synced}/${body.total}`]
        if (body.skipped > 0) parts.push(`${body.skipped} skipped (closed)`)
        if (body.failed > 0)  parts.push(`${body.failed} failed`)
        parts.push(`in ${(body.duration / 1000).toFixed(1)}s`)
        setSyncStatus(parts.join(' · ') + ' — fetching posts in background')
        void fetch('/api/all-tickets/sync-posts', { method: 'POST' })
      }
      router.refresh()
    } catch (err: unknown) {
      clearTimeout(timeoutId)
      const msg = err instanceof Error ? err.message : 'Sync failed'
      setSyncStatus(msg)
    } finally {
      if (syncTimerRef.current) { clearInterval(syncTimerRef.current); syncTimerRef.current = null }
      setSyncing(false)
    }
  }

  async function handleDeleteAll() {
    setDeleting(true)
    try {
      const res = await fetch('/api/bu-tickets', {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ all: true }),
      })
      if (!res.ok) {
        const body = await res.json() as { error?: string }
        throw new Error(body.error ?? 'Delete failed')
      }
      setConfirmDeleteAll(false)
      router.refresh()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {/* Sync button */}
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

      {/* Sync status / last synced */}
      <div className="flex flex-col gap-0.5 min-w-0">
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

      {/* Admin: Delete All */}
      {isAdmin && (
        <div className="flex items-center gap-2 ml-auto">
          {!confirmDeleteAll ? (
            <button
              onClick={() => setConfirmDeleteAll(true)}
              disabled={deleting || totalCount === 0}
              className="flex items-center gap-1.5 border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-40 text-sm font-medium px-3 py-2 rounded-lg transition"
            >
              Delete All
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
              <span className="text-red-700 text-xs font-medium">Delete all {totalCount} tickets?</span>
              <button
                onClick={handleDeleteAll}
                disabled={deleting}
                className="text-red-700 hover:text-red-900 text-xs font-bold underline"
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button
                onClick={() => setConfirmDeleteAll(false)}
                className="text-slate-500 hover:text-slate-700 text-xs underline"
              >
                Cancel
              </button>
            </div>
          )}
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
