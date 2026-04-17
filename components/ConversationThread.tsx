'use client'

import { useState } from 'react'
import type { KayakoPost } from '@/types/kayako'
import { fmtDt, safeName, extractEmail, getPostText } from '@/lib/utils'

interface ConversationThreadProps {
  posts:       KayakoPost[]
  requesterId: number | null
}

function getChannelType(post: KayakoPost): string {
  const ch = post.channel
  if (typeof ch === 'object' && ch !== null) return (ch.label ?? '').toUpperCase()
  return String(ch ?? '').toUpperCase()
}

function getBubbleStyle(post: KayakoPost, requesterId: number | null) {
  const chType = getChannelType(post)
  const isNote = chType === 'NOTE'
  const isCustomer = !isNote && post.creator?.id != null && post.creator.id === requesterId

  if (isNote) {
    return {
      bg:    'bg-yellow-50 border-yellow-200',
      badge: <span className="bg-violet-100 text-violet-700 text-xs px-2 py-0.5 rounded-full font-medium">Internal Note</span>,
    }
  }
  if (isCustomer) {
    return {
      bg:    'bg-red-50 border-red-200',
      badge: <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">Customer</span>,
    }
  }
  return {
    bg:    'bg-blue-50 border-blue-200',
    badge: <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">Support</span>,
  }
}

export default function ConversationThread({ posts, requesterId }: ConversationThreadProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-slate-50 rounded-xl transition"
      >
        <span className="font-semibold text-slate-800 text-sm">
          💬 Full conversation ({posts.length} posts)
        </span>
        <span className="text-slate-400 text-sm">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-5 pb-5">
          {/* Legend */}
          <div className="flex gap-4 mb-4 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-100 border border-red-200 inline-block" />
              Customer
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-100 border border-blue-200 inline-block" />
              Support
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-yellow-50 border border-yellow-200 inline-block" />
              Internal Note
            </span>
          </div>

          <div className="space-y-3">
            {posts.map(post => {
              const { bg, badge } = getBubbleStyle(post, requesterId)
              const authorName  = safeName(post.creator)
              const authorEmail = extractEmail(post.creator)
              const authorLine  = authorEmail ? `${authorName} <${authorEmail}>` : authorName
              const text = getPostText(post)

              return (
                <div key={post.id} className={`rounded-lg border p-3 text-sm ${bg}`}>
                  <div className="flex items-center gap-2 mb-2 flex-wrap text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{authorLine}</span>
                    <span>·</span>
                    <span>{fmtDt(post.created_at)}</span>
                    <span>·</span>
                    {badge}
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {text}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
