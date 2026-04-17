'use client'

import type { AnalysisResult } from '@/types/kayako'

interface AIAnalysisProps {
  analysis:  AnalysisResult
  loading:   boolean
  onRerun:   () => void
}

interface SectionCardProps {
  title:    string
  content:  string
  accent:   string
}

function SectionCard({ title, content, accent }: SectionCardProps) {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-4 border-l-4 ${accent}`}>
      <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">{title}</h3>
      <div
        className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{
          __html: content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/^(\d+)\. (.+)$/gm, '<li><strong>$1.</strong> $2</li>'),
        }}
      />
    </div>
  )
}

export default function AIAnalysis({ analysis, loading, onRerun }: AIAnalysisProps) {
  const { sections, model_used, fromCache, created_at } = analysis
  const isSonnet = model_used?.includes('sonnet')

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              isSonnet
                ? 'bg-violet-100 text-violet-700 border-violet-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {model_used}
          </span>
          {fromCache && (
            <span className="text-xs text-slate-400">
              Cached{created_at ? ` · ${new Date(created_at).toLocaleDateString()}` : ''}
            </span>
          )}
        </div>
        <button
          onClick={onRerun}
          disabled={loading}
          className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Analysing…' : '↺ Re-run'}
        </button>
      </div>

      {/* Full-width: Executive Summary */}
      <SectionCard
        title="Executive Summary"
        content={sections.executive_summary}
        accent="border-l-blue-500"
      />

      {/* Full-width: One-Line Summary */}
      <SectionCard
        title="One-Line Summary"
        content={sections.one_line}
        accent="border-l-amber-500"
      />

      {/* 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard
          title="Case Summary"
          content={sections.case_summary}
          accent="border-l-blue-500"
        />
        <SectionCard
          title="Customer Sentiment"
          content={sections.customer_sentiment}
          accent="border-l-amber-500"
        />
        <SectionCard
          title="What's Needed to Close"
          content={sections.what_needed}
          accent="border-l-emerald-500"
        />
        <SectionCard
          title="Recommended Next Steps"
          content={sections.next_steps}
          accent="border-l-violet-500"
        />
      </div>
    </div>
  )
}
