'use client'

import { useState } from 'react'
import type { UnifiedPost } from '@/types/kayako'
import { useTimezone } from '@/components/TimezoneProvider'
import { formatDateTime } from '@/lib/tz'

interface ConversationThreadProps {
  posts:             UnifiedPost[]
  requesterKayakoId: number | null
}

type PostType = 'customer' | 'support' | 'note' | 'side'

function getPostType(post: UnifiedPost, requesterKayakoId: number | null): PostType {
  const ch = (post.channel ?? '').toUpperCase().trim()
  if (ch === 'NOTE' || post.isPrivate) return 'note'
  if (ch === 'SIDE_CONVERSATION') return 'side'
  if (ch === 'CUSTOMER') return 'customer'
  // Fallback for posts fetched before channel-resolution fix
  if (requesterKayakoId != null && post.creatorId === requesterKayakoId) return 'customer'
  return 'support'
}

const TYPE_STYLES: Record<PostType, { bg: string; badge: string }> = {
  customer: { bg: 'bg-red-50 border-red-200',      badge: 'bg-red-100 text-red-700'       },
  support:  { bg: 'bg-blue-50 border-blue-200',     badge: 'bg-blue-100 text-blue-700'     },
  note:     { bg: 'bg-yellow-50 border-yellow-200', badge: 'bg-violet-100 text-violet-700' },
  side:     { bg: 'bg-slate-50 border-slate-300',   badge: 'bg-slate-100 text-slate-600'   },
}

const TYPE_LABELS: Record<PostType, string> = {
  customer: 'Customer',
  support:  'Support',
  note:     'Internal Note',
  side:     'Side Conversation',
}

export default function ConversationThread({ posts, requesterKayakoId }: ConversationThreadProps) {
  const tz = useTimezone()
  const [expanded,      setExpanded]      = useState(false)
  const [activeFilters, setActiveFilters] = useState<Set<PostType>>(
    new Set(['customer', 'support', 'note', 'side']),
  )

  function toggleFilter(type: PostType) {
    setActiveFilters(prev => {
      const next = new Set(prev)
      if (next.has(type)) {
        if (next.size > 1) next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }

  // Only show filter buttons for types that actually appear in this ticket
  const presentTypes = new Set(posts.map(p => getPostType(p, requesterKayakoId)))
  const filteredPosts = posts.filter(p => activeFilters.has(getPostType(p, requesterKayakoId)))

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
          {/* Filter toggles — only show types present in this ticket */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {(['customer', 'support', 'note', 'side'] as PostType[])
              .filter(type => presentTypes.has(type))
              .map(type => {
                const isActive = activeFilters.has(type)
                return (
                  <button
                    key={type}
                    onClick={() => toggleFilter(type)}
                    className={`text-xs px-3 py-1 rounded-full font-medium border transition ${
                      isActive
                        ? `${TYPE_STYLES[type].badge} border-transparent`
                        : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {TYPE_LABELS[type]}
                  </button>
                )
              })}
          </div>

          <div className="space-y-3">
            {filteredPosts.map(post => {
              const type          = getPostType(post, requesterKayakoId)
              const { bg, badge } = TYPE_STYLES[type]
              const channelLabel  = post.channel ? post.channel.toUpperCase() : null
              const isEmpty       = !post.contents || post.contents.trim() === ''

              return (
                <div key={post.id} className={`rounded-lg border p-3 text-sm ${bg}`}>
                  <div className="flex items-center gap-2 mb-2 flex-wrap text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{post.creatorName ?? '—'}</span>
                    <span>·</span>
                    <span>{formatDateTime(post.postedAt, tz)}</span>
                    <span>·</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>
                      {TYPE_LABELS[type]}
                    </span>
                    {/* Show raw channel label when it differs from the type label — useful for debugging side conversations */}
                    {channelLabel && type === 'side' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-500 font-mono">
                        {channelLabel}
                      </span>
                    )}
                  </div>

                  {isEmpty ? (
                    <p className="text-slate-400 italic text-xs">
                      {type === 'side'
                        ? 'Side conversation — content not available via API'
                        : 'No content'}
                    </p>
                  ) : (
                    <div
                      className="text-slate-700 leading-relaxed prose prose-sm max-w-none
                        prose-a:text-blue-600 prose-a:underline
                        [&_*]:max-w-full [&_pre]:overflow-x-auto [&_img]:max-w-full
                        overflow-wrap-anywhere break-words"
                      dangerouslySetInnerHTML={{ __html: post.contents }}
                    />
                  )}
                </div>
              )
            })}
            {filteredPosts.length === 0 && (
              <p className="text-center text-slate-400 text-sm py-4">
                No posts match the selected filters.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
