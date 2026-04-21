'use client'

import { useState } from 'react'
import { RefreshCw, Loader2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import type { TicketRow } from '@/types/kayako'
import { useTimezone } from '@/components/TimezoneProvider'
import { formatDate, formatDateTime } from '@/lib/tz'

interface TicketCardProps {
  ticket:       TicketRow
  postCount:    number
  lastSyncedAt: string
  onRefresh:    () => void
  refreshing:   boolean
}

const KAYAKO_BASE = 'https://central-supportdesk.kayako.com/agent/conversations'
const GHI_BASE    = 'https://github.com/trilogy-group/eng-maintenance/issues'

const STATUS_COLORS: Record<string, string> = {
  new:       'bg-green-100 text-green-800',
  open:      'bg-blue-100 text-blue-800',
  pending:   'bg-yellow-100 text-yellow-800',
  closed:    'bg-slate-100 text-slate-600',
  completed: 'bg-slate-100 text-slate-600',
}

function statusBadgeClass(s: string | null): string {
  if (!s) return 'bg-slate-100 text-slate-600'
  const k = s.toLowerCase()
  for (const [key, cls] of Object.entries(STATUS_COLORS)) {
    if (k.includes(key)) return cls
  }
  return 'bg-slate-100 text-slate-600'
}

function priorityBadgeClass(p: string | null): string {
  if (!p) return 'bg-slate-100 text-slate-600'
  const lp = p.toLowerCase()
  if (lp === 'urgent') return 'bg-red-100 text-red-700'
  if (lp === 'high')   return 'bg-orange-100 text-orange-700'
  return 'bg-slate-100 text-slate-600'
}

function teamBadgeClass(t: string | null): string {
  if (t === 'PS') return 'bg-blue-100 text-blue-700'
  if (t === 'BU') return 'bg-purple-100 text-purple-700'
  return 'bg-slate-100 text-slate-600'
}

function statusNote(label: string | null, createdAt: string | null): string {
  if (!label) return ''
  const l = label.toLowerCase()
  if (l.includes('open') || l.includes('hold')) {
    try {
      const days = Math.floor((Date.now() - new Date(createdAt ?? '').getTime()) / 86_400_000)
      return `Open for ${days} day${days !== 1 ? 's' : ''}`
    } catch { return 'Open' }
  }
  if (l.includes('pend')) return 'Pending customer response'
  if (l.includes('clos') || l.includes('complet')) return 'Case closed'
  return ''
}

export default function TicketCard({ ticket, postCount, lastSyncedAt, onRefresh, refreshing }: TicketCardProps) {
  const tz = useTimezone()
  const [tagsExpanded,   setTagsExpanded]   = useState(false)
  const [fieldsExpanded, setFieldsExpanded] = useState(false)

  const kayakoUrl = `${KAYAKO_BASE}/${ticket.kayakoTicketId}`
  const sNote     = statusNote(ticket.status, ticket.kayakoCreatedAt)
  const tags      = ticket.tags ?? []
  const visibleTags = tagsExpanded ? tags : tags.slice(0, 5)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-4">
      {/* Hold reason banner */}
      {ticket.holdReason && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-3 py-2 mb-3">
          <span className="font-semibold">On Hold:</span> {ticket.holdReason}
        </div>
      )}

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <a href={kayakoUrl} target="_blank" rel="noreferrer"
              className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1">
              🔗 #{ticket.kayakoTicketId} <ExternalLink className="w-3 h-3" />
            </a>
            {ticket.isEscalated && (
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">ESC</span>
            )}
            {ticket.team && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${teamBadgeClass(ticket.team)}`}>
                {ticket.team}
              </span>
            )}
          </div>
          <h2 className="text-slate-900 font-semibold text-base mb-3 leading-snug">
            {ticket.title || 'No subject'}
          </h2>

          {/* Meta grid */}
          <div className="flex gap-6 flex-wrap text-sm">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-0.5">Customer</p>
              <p className="text-slate-800 font-medium">{ticket.organization ?? '—'}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-0.5">Requester</p>
              <p className="text-slate-800 font-medium">{ticket.requesterName ?? '—'}</p>
              {ticket.requesterEmail && <p className="text-slate-500 text-xs">{ticket.requesterEmail}</p>}
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-0.5">Assignee</p>
              <p className="text-slate-800 font-medium">{ticket.assignee ?? '—'}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-0.5">Created</p>
              <p className="text-slate-800 font-medium">{formatDate(ticket.kayakoCreatedAt, tz)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-0.5">Messages</p>
              <p className="text-slate-800 font-medium">
                {postCount}
                {sNote && <span className="ml-2 text-xs font-semibold text-amber-600">{sNote}</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Badges + refresh */}
        <div className="text-right shrink-0">
          <div className="flex items-center gap-2 flex-wrap justify-end mb-2">
            {ticket.status && (
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass(ticket.status)}`}>
                {ticket.status}
              </span>
            )}
            {ticket.priority && (
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${priorityBadgeClass(ticket.priority)}`}>
                {ticket.priority}
              </span>
            )}
            {ticket.product && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                {ticket.product}
              </span>
            )}
          </div>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 ml-auto text-xs text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
          >
            {refreshing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            Refresh
          </button>
          <p className="text-xs text-slate-400 mt-1">Last fetched: {formatDateTime(lastSyncedAt, tz)}</p>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1 flex-wrap">
            {visibleTags.map(tag => (
              <span key={tag} className="bg-violet-100 text-violet-700 text-xs px-2 py-0.5 rounded-full font-medium">
                {tag}
              </span>
            ))}
            {tags.length > 5 && (
              <button
                onClick={() => setTagsExpanded(v => !v)}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-0.5"
              >
                {tagsExpanded
                  ? <><ChevronUp className="w-3 h-3" /> less</>
                  : <><ChevronDown className="w-3 h-3" /> +{tags.length - 5} more</>}
              </button>
            )}
          </div>
        </div>
      )}

      {/* GHI / JIRA links */}
      {(ticket.ghiId || ticket.jiraFields) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {ticket.ghiId && (
            <a href={`${GHI_BASE}/${ticket.ghiId}`} target="_blank" rel="noreferrer"
              className="bg-green-50 text-green-700 border border-green-200 text-xs px-2 py-0.5 rounded hover:bg-green-100 transition">
              GHI #{ticket.ghiId}
            </a>
          )}
          {ticket.jiraFields && Object.entries(ticket.jiraFields).map(([, v]) => (
            <span key={v} className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-0.5 rounded">
              {v}
            </span>
          ))}
        </div>
      )}

      {/* Custom fields (collapsible) */}
      {ticket.customFields && ticket.customFields.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => setFieldsExpanded(v => !v)}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 font-semibold uppercase tracking-wide"
          >
            Other Fields {fieldsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {fieldsExpanded && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3 mt-2">
              {ticket.customFields.map(f => (
                <div key={f.id}>
                  <p className="text-slate-400 text-xs">{f.label}</p>
                  <p className="text-slate-800 text-sm font-medium break-words">{String(f.value ?? '') || '—'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
