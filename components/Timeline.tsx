'use client'

import { useState } from 'react'
import type { UnifiedPost } from '@/types/kayako'
import { useTimezone } from '@/components/TimezoneProvider'
import { formatDate, formatDateTime } from '@/lib/tz'

interface TimelineProps {
  posts:             UnifiedPost[]
  requesterKayakoId: number | null
  daySummaries:      Record<string, string>
}

interface DayGroup {
  date:  string
  posts: UnifiedPost[]
}

function groupByDate(posts: UnifiedPost[]): DayGroup[] {
  const map = new Map<string, UnifiedPost[]>()
  for (const post of posts) {
    const date = (post.postedAt ?? '').slice(0, 10)
    if (!map.has(date)) map.set(date, [])
    map.get(date)!.push(post)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, posts]) => ({
      date,
      posts: posts.sort((a, b) => (a.postedAt ?? '').localeCompare(b.postedAt ?? '')),
    }))
}

function getBubbleStyle(post: UnifiedPost, requesterKayakoId: number | null): string {
  const ch = (post.channel ?? '').toUpperCase()
  if (ch === 'NOTE' || post.isPrivate) return 'bg-yellow-50 border-yellow-200'
  if (requesterKayakoId != null && post.creatorId === requesterKayakoId) return 'bg-red-50 border-red-200'
  return 'bg-blue-50 border-blue-200'
}

function DaySection({ group, requesterKayakoId, daySummaries }: {
  group:             DayGroup
  requesterKayakoId: number | null
  daySummaries:      Record<string, string>
}) {
  const tz = useTimezone()
  const [expanded, setExpanded] = useState(false)
  const summary = daySummaries[group.date]

  return (
    <div className="mb-6">
      <div className="flex items-baseline gap-3 mb-1">
        <h3 className="font-bold text-slate-800">{formatDate(group.date, tz)}</h3>
        <span className="text-slate-400 text-xs">
          {group.posts.length} message{group.posts.length !== 1 ? 's' : ''}
        </span>
      </div>
      {summary && <p className="text-sm text-slate-500 italic mb-2">{summary}</p>}
      <button
        onClick={() => setExpanded(v => !v)}
        className="text-xs text-blue-600 hover:underline mb-2"
      >
        {expanded
          ? '▲ Hide messages'
          : `▼ Show ${group.posts.length} message${group.posts.length !== 1 ? 's' : ''}`}
      </button>

      {expanded && (
        <div className="space-y-2 pl-2 border-l-2 border-slate-200">
          {group.posts.map(post => (
            <div key={post.id} className={`rounded-lg border p-3 text-sm ${getBubbleStyle(post, requesterKayakoId)}`}>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 flex-wrap">
                <span className="font-semibold text-slate-700">{post.creatorName ?? '—'}</span>
                <span>·</span>
                <span>{formatDateTime(post.postedAt, tz)}</span>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{post.contents}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Timeline({ posts, requesterKayakoId, daySummaries }: TimelineProps) {
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
          requesterKayakoId={requesterKayakoId}
          daySummaries={daySummaries}
        />
      ))}
    </div>
  )
}
