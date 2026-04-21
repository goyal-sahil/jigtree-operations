'use client'

import { useState, useEffect } from 'react'
import type { TicketResponse, AnalysisResult } from '@/types/kayako'
import TicketCard from './TicketCard'
import ConversationThread from './ConversationThread'
import AIAnalysis from './AIAnalysis'
import Timeline from './Timeline'
import AddNoteForm from './AddNoteForm'
import CredentialsBanner from './CredentialsBanner'

type Tab = 'ai' | 'timeline' | 'note'

export default function TicketAnalyser() {
  const [input,      setInput]      = useState('')
  const [fetching,   setFetching]   = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const [ticketData, setTicketData] = useState<TicketResponse | null>(null)
  const [analysis,   setAnalysis]   = useState<AnalysisResult | null>(null)
  const [aiLoading,  setAiLoading]  = useState(false)
  const [aiError,    setAiError]    = useState('')

  const [activeTab,        setActiveTab]        = useState<Tab>('ai')
  const [missingKayako,    setMissingKayako]    = useState(false)
  const [missingAnthropic, setMissingAnthropic] = useState(false)

  useEffect(() => {
    fetch('/api/credentials')
      .then(r => r.json() as Promise<{ hasKayako: boolean; hasAnthropic: boolean }>)
      .then(d => { setMissingKayako(!d.hasKayako); setMissingAnthropic(!d.hasAnthropic) })
      .catch(() => null)
  }, [])

  // ── Fetch ticket ────────────────────────────────────────────────────────────
  async function doFetch(forceRefresh = false) {
    if (!input.trim()) return
    setFetchError('')

    if (forceRefresh) {
      setRefreshing(true)
    } else {
      setFetching(true)
      setTicketData(null)
      setAnalysis(null)
      setAiError('')
    }

    const resp = await fetch('/api/ticket', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ticketInput: input.trim(), forceRefresh }),
    })

    setFetching(false)
    setRefreshing(false)

    if (!resp.ok) {
      const data = await resp.json()
      setFetchError(data.error ?? 'Failed to fetch ticket.')
      return
    }

    const data = await resp.json() as TicketResponse
    setTicketData(data)
    if (forceRefresh) setAnalysis(null)
  }

  // ── Run AI analysis ─────────────────────────────────────────────────────────
  async function runAnalysis(forceRefresh = false) {
    if (!ticketData) return
    setAiLoading(true)
    setAiError('')

    const resp = await fetch('/api/analysis', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caseId:    ticketData.ticket.kayakoTicketId,
        kayakoUrl: ticketData.ticket.kayakoUrl,
        forceRefresh,
      }),
    })

    setAiLoading(false)

    if (!resp.ok) {
      const data = await resp.json()
      setAiError(data.error ?? 'AI analysis failed.')
      return
    }

    setAnalysis(await resp.json())
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') void doFetch(false)
    if (e.key === 'Escape') {
      setInput('')
      setTicketData(null)
      setAnalysis(null)
      setFetchError('')
      setAiError('')
    }
  }

  async function onNotePosted() {
    setAnalysis(null)
    await doFetch(true)
  }

  const requesterKayakoId = ticketData?.ticket.requesterKayakoId ?? null

  return (
    <div>
      <CredentialsBanner missingKayako={missingKayako} missingAnthropic={missingAnthropic} />

      {/* Search bar */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Paste ticket URL or enter ticket ID…"
          className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
        />
        <button
          onClick={() => void doFetch(false)}
          disabled={fetching || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition shadow-sm"
        >
          {fetching ? 'Loading…' : 'Fetch Ticket'}
        </button>
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-4 text-sm">
          ❌ {fetchError}
        </div>
      )}

      {!ticketData && !fetching && !fetchError && (
        <div className="text-center text-slate-400 mt-20 text-sm">
          Enter a Kayako ticket URL or ID above to get started.
        </div>
      )}

      {ticketData && (
        <>
          <TicketCard
            ticket={ticketData.ticket}
            postCount={ticketData.posts.length}
            lastSyncedAt={ticketData.lastSyncedAt}
            onRefresh={() => void doFetch(true)}
            refreshing={refreshing}
          />

          {ticketData.warning && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl px-5 py-3 mb-4 text-sm">
              ⚠️ {ticketData.warning}
            </div>
          )}

          <ConversationThread posts={ticketData.posts} requesterKayakoId={requesterKayakoId} />

          <div className="border-t border-slate-200 my-4" />

          {/* Tabs */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 w-fit">
            {([
              { key: 'ai',       label: '🤖 AI Analysis' },
              { key: 'timeline', label: '📅 Timeline' },
              { key: 'note',     label: '📝 Add Note' },
            ] as { key: Tab; label: string }[]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: AI Analysis */}
          {activeTab === 'ai' && (
            <div>
              {!analysis && !aiLoading && (
                <div className="text-center py-10">
                  <p className="text-slate-500 text-sm mb-4">
                    Run an AI analysis on this ticket&rsquo;s full conversation history.
                  </p>
                  <button
                    onClick={() => runAnalysis(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
                  >
                    🤖 Run Analysis
                  </button>
                </div>
              )}

              {aiLoading && (
                <div className="text-center py-10 text-slate-500 text-sm animate-pulse">
                  Analysing {ticketData.posts.length} posts…
                </div>
              )}

              {aiError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
                  ❌ {aiError}
                </div>
              )}

              {analysis && (
                <AIAnalysis
                  analysis={analysis}
                  loading={aiLoading}
                  onRerun={() => runAnalysis(true)}
                />
              )}
            </div>
          )}

          {/* Tab: Timeline */}
          {activeTab === 'timeline' && (
            <Timeline
              posts={ticketData.posts}
              requesterKayakoId={requesterKayakoId}
              daySummaries={analysis?.day_summaries ?? {}}
            />
          )}

          {/* Tab: Add Note */}
          {activeTab === 'note' && (
            <AddNoteForm
              caseId={ticketData.ticket.kayakoTicketId}
              onSuccess={onNotePosted}
            />
          )}
        </>
      )}
    </div>
  )
}
