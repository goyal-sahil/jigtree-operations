'use client'

import { ClipboardList, Gauge, CheckCircle2, ListChecks, CalendarDays, RefreshCw, Loader2, Clock, AlertTriangle, ArrowRight } from 'lucide-react'
import type { AnalysisResult } from '@/types/kayako'
import { useTimezone } from '@/components/TimezoneProvider'
import { formatDateTime } from '@/lib/tz'

interface AIAnalysisProps {
  analysis:    AnalysisResult
  loading:     boolean
  onRerun:     () => void
  createdAt?:  string   // ticket kayakoCreatedAt — for age risk badge
}

// ── Utilities ────────────────────────────────────────────────────────────────

function ticketAgeDays(createdAt?: string): number | null {
  if (!createdAt) return null
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000)
}

function ageRisk(days: number | null): { label: string; sublabel: string; cls: string } | null {
  if (days === null) return null
  if (days >= 30) return { label: `${days} days`, sublabel: 'AT RISK', cls: 'bg-red-50 border-red-300 text-red-700' }
  if (days >= 20) return { label: `${days} days`, sublabel: 'WATCH',   cls: 'bg-amber-50 border-amber-300 text-amber-700' }
  return               { label: `${days} days`, sublabel: 'ON TRACK', cls: 'bg-emerald-50 border-emerald-300 text-emerald-700' }
}

function blockerBadgeStyle(type: string): string {
  if (type.startsWith('Action:'))             return 'bg-red-100 text-red-700 border border-red-200'
  if (type.startsWith('Waiting: Engineering')) return 'bg-amber-100 text-amber-700 border border-amber-200'
  if (type.startsWith('Waiting: Customer'))    return 'bg-blue-100 text-blue-700 border border-blue-200'
  if (type.startsWith('Waiting: 3rd'))        return 'bg-purple-100 text-purple-700 border border-purple-200'
  if (type === 'Ready to Close')              return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
  return 'bg-slate-100 text-slate-600 border border-slate-200'
}

// Render markdown-style bullets and numbered lists as HTML
function renderBullets(text: string): string {
  if (!text) return ''
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^[-•]\s+(.+)$/gm, '<li class="flex gap-2"><span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span><span>$1</span></li>')
    .replace(/^(\d+)\.\s+(.+)$/gm, '<li class="flex gap-2.5"><span class="shrink-0 font-semibold text-slate-500 w-5 text-right">$1.</span><span>$2</span></li>')
    .replace(/\n{2,}/g, '</ul><ul class="space-y-1.5 mt-2">')
    .replace(/\n/g, ' ')
}

function wrapList(html: string): string {
  if (!html.includes('<li')) return `<p class="text-slate-600">${html}</p>`
  return `<ul class="space-y-1.5">${html}</ul>`
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface SectionCardProps {
  icon:    React.ReactNode
  title:   string
  content: string
  accent:  string
}

function SectionCard({ icon, title, content, accent }: SectionCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className={`flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 ${accent}`}>
        <span className="shrink-0">{icon}</span>
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{title}</h3>
      </div>
      <div
        className="px-4 py-3 text-sm text-slate-700 leading-relaxed [&_ul]:space-y-1.5 [&_li]:flex [&_li]:gap-2"
        dangerouslySetInnerHTML={{ __html: wrapList(renderBullets(content)) }}
      />
    </div>
  )
}

function TimelineEntry({ date, summary }: { date: string; summary: string }) {
  const d = new Date(date)
  const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  return (
    <div className="flex gap-3 items-start">
      <span className="shrink-0 text-xs font-mono text-slate-400 pt-0.5 w-24">{label}</span>
      <span className="text-sm text-slate-600">{summary}</span>
    </div>
  )
}

// ── Closure Brief ─────────────────────────────────────────────────────────────

function ClosureBrief({
  sections,
  ageDays,
}: {
  sections: AnalysisResult['sections']
  ageDays:  number | null
}) {
  const risk        = ageRisk(ageDays)
  const blockerType = sections.blocker_type ?? ''
  const hasContent  = sections.one_liner || blockerType || sections.path_to_closure

  if (!hasContent && !risk) return null

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Closure Brief</h3>
        </div>
        {risk && (
          <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${risk.cls}`}>
            {risk.sublabel === 'AT RISK' && <AlertTriangle className="w-3 h-3 shrink-0" />}
            {risk.sublabel} · {risk.label}
          </span>
        )}
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* One-liner */}
        {sections.one_liner && (
          <p className="text-base font-medium text-slate-800 leading-snug">
            {sections.one_liner}
          </p>
        )}

        {/* Blocker */}
        {(blockerType || sections.blocker_detail) && (
          <div className="flex flex-wrap items-start gap-2">
            {blockerType && (
              <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${blockerBadgeStyle(blockerType)}`}>
                {blockerType}
              </span>
            )}
            {sections.blocker_detail && (
              <span className="text-sm text-slate-600 leading-snug pt-0.5">{sections.blocker_detail}</span>
            )}
          </div>
        )}

        {/* Path to Closure */}
        {sections.path_to_closure && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Path to Closure</p>
            <div
              className="text-sm text-slate-700 leading-relaxed [&_ul]:space-y-2 [&_li]:flex [&_li]:gap-2"
              dangerouslySetInnerHTML={{ __html: wrapList(renderBullets(sections.path_to_closure)) }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AIAnalysis({ analysis, loading, onRerun, createdAt }: AIAnalysisProps) {
  const { sections, day_summaries, model_used, status, created_at } = analysis
  const tz       = useTimezone()
  const isSonnet = model_used?.includes('sonnet')
  const ageDays  = ticketAgeDays(createdAt)

  if (status === 'pending' || status === 'running') {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-sm font-medium">Analysis {status === 'running' ? 'in progress' : 'queued'}…</p>
        <p className="text-xs text-slate-400">This runs in the background — refresh in a moment.</p>
        <button
          onClick={onRerun}
          disabled={loading}
          className="mt-1 text-xs text-blue-600 hover:underline disabled:opacity-50"
        >
          Force re-run
        </button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-4 text-sm text-red-700">
        <p className="font-medium mb-1">Analysis failed</p>
        <p className="text-xs text-red-500">{analysis.error_msg ?? 'Unknown error'}</p>
        <button onClick={onRerun} disabled={loading} className="mt-3 text-xs text-red-600 hover:underline">
          Retry
        </button>
      </div>
    )
  }

  if (!sections) return null

  const timelineEntries = Object.entries(day_summaries ?? {}).sort(([a], [b]) => a.localeCompare(b))

  return (
    <div className="space-y-3">
      {/* Meta bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
            isSonnet
              ? 'bg-violet-50 text-violet-700 border-violet-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            {model_used}
          </span>
          {created_at && (
            <span className="flex items-center gap-1 text-xs text-slate-400" title="Last analysis run">
              <Clock className="w-3 h-3" />
              {formatDateTime(created_at, tz)}
            </span>
          )}
        </div>
        <button
          onClick={onRerun}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Re-run
        </button>
      </div>

      {/* Closure Brief — full width, top */}
      <ClosureBrief sections={sections} ageDays={ageDays} />

      {/* 2-column grid for core sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionCard
          icon={<ClipboardList className="w-4 h-4 text-blue-500" />}
          title="Case Summary"
          content={sections.case_summary}
          accent="bg-blue-50"
        />
        <SectionCard
          icon={<Gauge className="w-4 h-4 text-amber-500" />}
          title="Customer Sentiment"
          content={sections.customer_sentiment}
          accent="bg-amber-50"
        />
        <SectionCard
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          title="What's Needed to Close"
          content={sections.what_needed}
          accent="bg-emerald-50"
        />
        <SectionCard
          icon={<ListChecks className="w-4 h-4 text-violet-500" />}
          title="Next Steps"
          content={sections.next_steps}
          accent="bg-violet-50"
        />
      </div>

      {/* Timeline — full width */}
      {timelineEntries.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 bg-slate-50">
            <CalendarDays className="w-4 h-4 text-slate-500 shrink-0" />
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Timeline</h3>
          </div>
          <div className="px-4 py-3 space-y-2">
            {timelineEntries.map(([date, summary]) => (
              <TimelineEntry key={date} date={date} summary={summary} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
