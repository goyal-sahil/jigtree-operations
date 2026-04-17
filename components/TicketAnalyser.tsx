'use client'

import { useState } from 'react'
import type { TicketData, AnalysisResult } from '@/types/kayako'
import TicketCard from './TicketCard'
import ConversationThread from './ConversationThread'
import AIAnalysis from './AIAnalysis'
import Timeline from './Timeline'
import AddNoteForm from './AddNoteForm'

type Tab = 'ai' | 'timeline' | 'note'

export default function TicketAnalyser() {
  const [input,      setInput]      = useState('')
  const [fetching,   setFetching]   = useState(false)
  const [fetchError, setFetchError] = useState('')

  const [ticketData, setTicketData] = useState<TicketData | null>(null)
  const [analysis,   setAnalysis]   = useState<AnalysisResult | null>(null)
  const [aiLoading,  setAiLoading]  = useState(false)
  const [aiError,    setAiError]    = useState('')

  const [activeTab, setActiveTab] = useState<Tab>('ai')

  // ── Fetch ticket ────────────────────────────────────────────────────────────
  async function fetchTicket() {
    if (!input.trim()) return
    setFetching(true)
    setFetchError('')
    setTicketData(null)
    setAnalysis(null)
    setAiError('')

    const resp = await fetch('/api/ticket', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ticketInput: input.trim() }),
    })

    setFetching(false)

    if (!resp.ok) {
      const data = await resp.json()
      setFetchError(data.error ?? 'Failed to fetch ticket.')
      return
    }

    const data = await resp.json()
    setTicketData(data)
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
        caseId:       ticketData.caseId,
        caseData:     ticketData.caseData,
        posts:        ticketData.posts,
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

  // ── Handle Enter key ────────────────────────────────────────────────────────
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') fetchTicket()
  }

  // ── After note posted — reload ticket to get fresh post list ───────────────
  async function onNotePosted() {
    if (!input.trim()) return
    setAnalysis(null) // invalidate cached analysis
    await fetchTicket()
  }

  const requesterId = ticketData?.caseData?.requester?.id ?? null

  return (
    <div>
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
          onClick={fetchTicket}
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
          {/* Ticket card */}
          <TicketCard
            caseData={ticketData.caseData}
            caseId={ticketData.caseId}
            postCount={ticketData.posts.length}
          />

          {/* Posts warning */}
          {ticketData.warning && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl px-5 py-3 mb-4 text-sm">
              ⚠️ {ticketData.warning}
            </div>
          )}

          {/* Conversation thread */}
          <ConversationThread posts={ticketData.posts} requesterId={requesterId} />

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
              requesterId={requesterId}
              daySummaries={analysis?.day_summaries ?? {}}
            />
          )}

          {/* Tab: Add Note */}
          {activeTab === 'note' && (
            <AddNoteForm caseId={ticketData.caseId} onSuccess={onNotePosted} />
          )}
        </>
      )}
    </div>
  )
}
