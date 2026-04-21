'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import BUTicketsTable from '@/components/BUTicketsTable'
import CredentialsBanner from '@/components/CredentialsBanner'
import { createClient } from '@/lib/supabase/client'
import type { TicketRow } from '@/types/kayako'

const SYNC_TIMEOUT_MS = 5 * 60 * 1000

export default function BuTicketsPage() {
  const [tickets, setTickets] = useState<TicketRow[]>([])
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncStatus, setSyncStatus] = useState<string | null>(null)
  const [syncElapsed, setSyncElapsed] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [missingKayako, setMissingKayako] = useState(false)
  const [missingAnthropic, setMissingAnthropic] = useState(false)
  const syncTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      const admins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase())
      if (user?.email && admins.includes(user.email.toLowerCase())) setIsAdmin(true)
    })
    fetch('/api/credentials')
      .then(r => r.json() as Promise<{ hasKayako: boolean; hasAnthropic: boolean }>)
      .then(d => { setMissingKayako(!d.hasKayako); setMissingAnthropic(!d.hasAnthropic) })
      .catch(() => null)
  }, [])

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch('/api/bu-tickets')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json() as { tickets: TicketRow[]; lastSyncedAt: string | null }
      setTickets(data.tickets)
      setLastSyncedAt(data.lastSyncedAt)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void fetchTickets() }, [fetchTickets])

  async function handleSync() {
    setSyncElapsed(0)
    setSyncStatus('Connecting to Kayako…')
    syncTimerRef.current = setInterval(() => setSyncElapsed(s => s + 1), 1000)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), SYNC_TIMEOUT_MS)
    try {
      const res = await fetch('/api/bu-tickets/sync', { method: 'POST', signal: controller.signal })
      clearTimeout(timeoutId)
      if (!res.ok) {
        const body = await res.json() as { error?: string }
        throw new Error(body.error ?? `Sync failed: HTTP ${res.status}`)
      }
      const body = await res.json() as { synced: number; failed: number; total: number; duration: number; firstError?: string }
      await fetchTickets()

      if (body.synced === 0) {
        const detail = body.firstError ? ` — ${body.firstError}` : ''
        setSyncStatus(`Sync completed but all ${body.total} tickets failed${detail}`)
        return
      }

      const base = `Synced ${body.synced}/${body.total} tickets in ${(body.duration / 1000).toFixed(1)}s`
      const suffix = body.failed > 0 ? ` (${body.failed} failed)` : ''
      setSyncStatus(`${base}${suffix} — fetching posts & queuing analysis`)

      // Only fire background jobs when tickets were actually synced
      void fetch('/api/bu-tickets/sync-posts',    { method: 'POST' })
      void fetch('/api/bu-tickets/analyse-batch', { method: 'POST' })
    } catch (err: unknown) {
      clearTimeout(timeoutId)
      if (err instanceof Error && err.name === 'AbortError') throw new Error('Sync timed out after 5 minutes.')
      throw err
    } finally {
      if (syncTimerRef.current) { clearInterval(syncTimerRef.current); syncTimerRef.current = null }
    }
  }

  async function handleDelete(ids: string[]) {
    const res = await fetch('/api/bu-tickets', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })
    if (!res.ok) {
      const body = await res.json() as { error?: string }
      throw new Error(body.error ?? 'Delete failed')
    }
    await fetchTickets()
  }

  async function handleDeleteAll() {
    const res = await fetch('/api/bu-tickets', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    })
    if (!res.ok) {
      const body = await res.json() as { error?: string }
      throw new Error(body.error ?? 'Delete failed')
    }
    await fetchTickets()
  }

  return (
    <div className="px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">BU/PS Tickets</h1>
        <p className="text-slate-500 text-sm mt-1">JigTree BU &amp; PS tickets from Kayako view #64</p>
      </div>

      <CredentialsBanner missingKayako={missingKayako} missingAnthropic={missingAnthropic} />

      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading…</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
      ) : (
        <BUTicketsTable
          tickets={tickets}
          lastSyncedAt={lastSyncedAt}
          syncStatus={syncStatus}
          syncElapsed={syncElapsed}
          isAdmin={isAdmin}
          onSync={handleSync}
          onDelete={handleDelete}
          onDeleteAll={handleDeleteAll}
        />
      )}
    </div>
  )
}
