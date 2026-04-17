'use client'

import { useState } from 'react'
import type { KayakoPost } from '@/types/kayako'
import { fmtDt, fmtDate, safeName, extractEmail, getPostText } from '@/lib/utils'

interface TimelineProps {
  posts:        KayakoPost[]
  requesterId:  number | null
  daySummaries: Record<string, string>
}

interface DayGroup {
  date:  string        // YYYY-MM-DD
  posts: KayakoPost[]
}

function groupByDate(posts: KayakoPost[]): DayGroup[] {
  const map = new Map<string, KayakoPost[]>()
  for (const post of posts) {
    const date = (post.created_at ?? '').slice(0, 10)
    if (!map.has(date)) map.set(date, [])
    map.get(date)!.push(post)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, posts]) => ({ date, posts: posts.sort((a, b) => (a.created_at ?? '').localeCompare(b.created_at ?? '')) }))
}

function getBubbleStyle(post: KayakoPost, requesterId: number | null): string {
  const ch = post.channel
  const chType = (typeof ch === 'object' ? (ch?.label ?? '') : String(ch ?? '')).toUpperCase()
  if (chType === 'NOTE') return 'bg-yellow-50 border-yellow-200'
  if (post.creator?.id != null && post.creator.id === requesterId) return 'bg-red-50 border-red-200'
  return 'bg-blue-50 border-blue-200'
}

function DaySection({ group, requesterId, daySummaries }: {
  group: DayGroup
  requesterId: number | null
  daySummaries: Record<string, string>
}) {
  const [expanded, setExpanded] = useState(false)
  const summary = daySummaries[group.date]

  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-3 mb-1">
        <h3 className="font-bold text-slate-800">{fmtDate(group.date)}</h3>
        <span className="text-slate-400 text-xs">{group.posts.length} message{group.posts.length !== 1 ? 's' : ''}</span>
      </div>
      {summary && (
        <p className="text-sm text-slate-500 italic mb-2">{summary}</p>
      )}
      <button
        onClick={() => setExpanded(v => !v)}
        className="text-xs text-blue-600 hover:underline mb-2"
      >
        {expanded ? '▲ Hide messages' : `▼ Show ${group.posts.length} message${group.posts.length !== 1 ? 's' : ''}`}
      </button>

      {expanded && (
        <div className="space-y-2 pl-2 border-l-2 border-slate-200">
          {group.posts.map(post => {
            const bg = getBubbleStyle(post, requesterId)
            const author     = safeName(post.creator)
            const email      = extractEmail(post.creator)
            const authorLine = email ? `${author} <${email}>` : author
            const text       = getPostText(post)
            return (
              <div key={post.id} className={`rounded-lg border p-3 text-sm ${bg}`}>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 flex-wrap">
                  <span className="font-semibold text-slate-700">{authorLine}</span>
                  <span>·</span>
                  <span>{fmtDt(post.created_at)}</span>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {text}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Timeline({ posts, requesterId, daySummaries }: TimelineProps) {
  const groups = groupByDate(posts)

  if (groups.length === 0) {
    return <p className="text-slate-500 text-sm">No posts to display.</p>
  }

  return (
    <div>
      {groups.map(group => (
        <DaySection
          key={group.date}
          group={group}
          requesterId={requesterId}
          daySummaries={daySummaries}
        />
      ))}
    </div>
  )
}
