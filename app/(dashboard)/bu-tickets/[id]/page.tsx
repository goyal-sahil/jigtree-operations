'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import AIAnalysis from '@/components/AIAnalysis'
import TicketCard from '@/components/TicketCard'
import ConversationThread from '@/components/ConversationThread'
import Timeline from '@/components/Timeline'
import AddNoteForm from '@/components/AddNoteForm'
import AnalysisHistory from '@/components/AnalysisHistory'
import type { AnalysisResult, TicketResponse, ExportInfo, AnalysisRunRow } from '@/types/kayako'

type Tab = 'ai' | 'timeline' | 'note'

export default function BuTicketDetailPage() {
  const params   = useParams()
  const router   = useRouter()
  const ticketId = Number(params.id)

  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState<string | null>(null)
  const [ticketData,   setTicketData]   = useState<TicketResponse | null>(null)
  const [refreshing,   setRefreshing]   = useState(false)
  const [analysis,     setAnalysis]     = useState<AnalysisResult | null>(null)
  const [analysisRuns, setAnalysisRuns] = useState<AnalysisRunRow[]>([])
  const [aiLoading,    setAiLoading]    = useState(false)
  const [aiError,      setAiError]      = useState('')
  const [tab,          setTab]          = useState<Tab>('ai')

  const [exportInfo,  setExportInfo]  = useState<ExportInfo | null>(null)
  const [exporting,   setExporting]   = useState(false)
  const [exportPhase, setExportPhase] = useState('')
  const [exportError, setExportError] = useState('')

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/bu-tickets/${ticketId}`)
      if (!res.ok) {
        const body = await res.json() as { error?: string }
        throw new Error(body.error ?? `HTTP ${res.status}`)
      }
      const data = await res.json() as {
        ticket:       TicketResponse['ticket']
        posts:        TicketResponse['posts']
        lastSyncedAt: string
        analysis: {
          status: string; sections: unknown; daySummaries: unknown
          modelUsed: string | null; postCount: number | null
          errorMsg: string | null; updatedAt: string
        } | null
        export:       ExportInfo | null
        analysisRuns: AnalysisRunRow[]
      }
      setTicketData({ ticket: data.ticket, posts: data.posts, fromCache: true, lastSyncedAt: data.lastSyncedAt })
      setExportInfo(data.export ?? null)
      setAnalysisRuns(data.analysisRuns ?? [])
      if (data.analysis?.status === 'done' && data.analysis.sections) {
        setAnalysis({
          sections:      data.analysis.sections as AnalysisResult['sections'],
          day_summaries: (data.analysis.daySummaries ?? {}) as Record<string, string>,
          model_used:    data.analysis.modelUsed ?? '',
          post_count:    data.analysis.postCount ?? 0,
          status:        'done',
          error_msg:     data.analysis.errorMsg ?? undefined,
          created_at:    data.analysis.updatedAt,
        })
      } else if (data.analysis?.status === 'error') {
        setAnalysis({
          sections:      { one_liner: '', blocker_type: '', blocker_detail: '', path_to_closure: '', case_summary: '', customer_sentiment: '', what_needed: '', next_steps: '' },
          day_summaries: {},
          model_used:    '',
          post_count:    0,
          status:        'error',
          error_msg:     data.analysis.errorMsg ?? 'Analysis failed',
        })
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load ticket')
    } finally {
      setLoading(false)
    }
  }, [ticketId])

  useEffect(() => { void load() }, [load])

  async function refreshTicket() {
    setRefreshing(true)
    try {
      const res = await fetch(`/api/bu-tickets/${ticketId}/refresh`, { method: 'POST' })
      if (!res.ok) {
        const body = await res.json() as { error?: string }
        throw new Error(body.error ?? 'Refresh failed')
      }
      const data = await res.json() as TicketResponse
      setTicketData(data)
      setAnalysis(null)
    } catch (err: unknown) {
      console.error('[bu-ticket] refresh failed:', err instanceof Error ? err.message : err)
    } finally {
      setRefreshing(false)
    }
  }

  async function runAnalysis(forceRefresh = false): Promise<AnalysisResult | null> {
    if (!ticketData) return null
    setAiLoading(true)
    setAiError('')
    try {
      const res = await fetch('/api/analysis', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId:    ticketData.ticket.kayakoTicketId,
          kayakoUrl: ticketData.ticket.kayakoUrl,
          forceRefresh,
        }),
      })
      if (!res.ok) {
        const body = await res.json() as { error?: string }
        throw new Error(body.error ?? 'Analysis failed')
      }
      const result = await res.json() as AnalysisResult
      setAnalysis(result)
      // Reload runs log so new entry appears immediately
      const runsRes = await fetch(`/api/bu-tickets/${ticketId}`)
      if (runsRes.ok) {
        const fresh = await runsRes.json() as { analysisRuns?: AnalysisRunRow[] }
        if (fresh.analysisRuns) setAnalysisRuns(fresh.analysisRuns)
      }
      return result
    } catch (err: unknown) {
      setAiError(err instanceof Error ? err.message : 'Analysis failed')
      return null
    } finally {
      setAiLoading(false)
    }
  }

  async function downloadExport(forceRefresh = false) {
    if (!ticketData) return
    setExporting(true)
    setExportError('')
    setExportPhase('')

    // Use the later of lastSyncedAt / postsLastSyncedAt — Sync Now only updates lastSyncedAt
    const fetchMs = Math.max(
      new Date(ticketData.lastSyncedAt).getTime(),
      ticketData.ticket.postsLastSyncedAt ? new Date(ticketData.ticket.postsLastSyncedAt).getTime() : 0,
    )
    const stale = !!analysis?.created_at && fetchMs > new Date(analysis.created_at).getTime()
    let needsForceExport = forceRefresh || stale

    try {
      // Refresh analysis first if stale or when regenerating
      if (stale || forceRefresh) {
        setExportPhase('Refreshing analysis…')
        const freshAnalysis = await runAnalysis(true)
        if (freshAnalysis) needsForceExport = true
      }

      setExportPhase('Generating export…')
      const res = await fetch('/api/export', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId:      ticketData.ticket.kayakoTicketId,
          forceRefresh: needsForceExport,
        }),
      })
      if (!res.ok) {
        const body = await res.json() as { error?: string }
        throw new Error(body.error ?? 'Export failed')
      }
      const { markdown } = await res.json() as { markdown: string; fromCache: boolean }
      setExportInfo({ status: 'done', createdAt: new Date().toISOString() })

      // Trigger browser download
      const blob = new Blob([markdown], { type: 'text/markdown' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `ticket-${ticketData.ticket.kayakoTicketId}.md`
      a.click()
      URL.revokeObjectURL(url)

      // Refresh runs log so Download entry appears
      const runsRes = await fetch(`/api/bu-tickets/${ticketId}`)
      if (runsRes.ok) {
        const fresh = await runsRes.json() as { analysisRuns?: AnalysisRunRow[] }
        if (fresh.analysisRuns) setAnalysisRuns(fresh.analysisRuns)
      }
    } catch (err: unknown) {
      setExportError(err instanceof Error ? err.message : 'Export failed')
    } finally {
      setExporting(false)
      setExportPhase('')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading…
      </div>
    )
  }

  if (error || !ticketData) {
    return (
      <div className="px-6 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          {error ?? 'Ticket not found'}
        </div>
      </div>
    )
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'ai',       label: '🤖 AI Analysis' },
    { id: 'timeline', label: '📅 Timeline' },
    { id: 'note',     label: '📝 Add Note' },
  ]

  return (
    <div className="px-6 py-6 max-w-5xl mx-auto">
      <button
        onClick={() => router.push('/bu-tickets')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to BU/PS Tickets
      </button>

      <TicketCard
        ticket={ticketData.ticket}
        postCount={ticketData.posts.length}
        lastSyncedAt={ticketData.lastSyncedAt}
        onRefresh={refreshTicket}
        refreshing={refreshing}
      />

      {/* Download export button */}
      {ticketData.ticket.postsStatus === 'done' && (
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => void downloadExport(false)}
            disabled={exporting}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-sm"
          >
            {exporting ? (
              <><span className="animate-spin inline-block">⏳</span> {exportPhase || 'Generating…'}</>
            ) : (
              <>⬇ Download .md</>
            )}
          </button>
          {exportInfo?.status === 'done' && !exporting && (
            <button
              onClick={() => void downloadExport(true)}
              className="text-xs text-slate-500 hover:text-slate-700 underline"
            >
              ↻ Regenerate
            </button>
          )}
          {exportError && (
            <span className="text-xs text-red-600">❌ {exportError}</span>
          )}
        </div>
      )}

      {ticketData.ticket.postsStatus !== 'done' && ticketData.posts.length === 0 && (
        <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          <RefreshCw className="w-4 h-4 shrink-0" />
          <span>Posts haven&apos;t been fetched yet for this ticket. Use the <strong>Refresh</strong> button above to load the full conversation.</span>
        </div>
      )}

      <ConversationThread
        posts={ticketData.posts}
        requesterKayakoId={ticketData.ticket.requesterKayakoId ?? null}
      />

      <div className="border-t border-slate-200 my-4" />

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
              tab === t.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: AI Analysis */}
      {tab === 'ai' && (
        <div>
          {aiError && (
            <div className="mb-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {aiError}
            </div>
          )}
          {analysis
            ? <AIAnalysis analysis={analysis} loading={aiLoading} onRerun={() => runAnalysis(true)} createdAt={ticketData.ticket.kayakoCreatedAt ?? undefined} />
            : (
              <div className="text-center py-10">
                <p className="text-slate-500 text-sm mb-4">
                  Run an AI analysis on this ticket&rsquo;s full conversation history.
                </p>
                <button
                  onClick={() => runAnalysis(false)}
                  disabled={aiLoading || ticketData.posts.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition"
                >
                  {aiLoading ? 'Analysing…' : '🤖 Run Analysis'}
                </button>
                {ticketData.posts.length === 0 && (
                  <p className="mt-2 text-xs text-slate-400">No posts available yet.</p>
                )}
              </div>
            )
          }
        </div>
      )}

      {/* Tab: Timeline */}
      {tab === 'timeline' && (
        <Timeline
          posts={ticketData.posts}
          requesterKayakoId={ticketData.ticket.requesterKayakoId ?? null}
          daySummaries={analysis?.day_summaries ?? {}}
        />
      )}

      {/* Tab: Add Note */}
      {tab === 'note' && (
        <AddNoteForm
          caseId={ticketData.ticket.kayakoTicketId}
          onSuccess={() => { void refreshTicket(); setTab('ai') }}
        />
      )}

      {/* Analysis run history — always shown below tabs */}
      {analysisRuns.length > 0 && (
        <div className="mt-6">
          <AnalysisHistory runs={analysisRuns} />
        </div>
      )}
    </div>
  )
}
