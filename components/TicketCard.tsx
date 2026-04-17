import type { KayakoCase, KayakoCustomField } from '@/types/kayako'
import { fmtDt, safeLabel, safeName, extractEmail } from '@/lib/utils'

interface TicketCardProps {
  caseData: KayakoCase
  caseId:   number
  postCount: number
}

const STATUS_BADGE: Record<string, string> = {
  new:     'bg-green-100 text-green-800',
  open:    'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  closed:  'bg-slate-100 text-slate-600',
  completed: 'bg-slate-100 text-slate-600',
}

function statusBadgeClass(label: string): string {
  const key = label.toLowerCase()
  for (const [k, v] of Object.entries(STATUS_BADGE)) {
    if (key.includes(k)) return v
  }
  return 'bg-slate-100 text-slate-600'
}

function statusNote(label: string, createdAt: string): { text: string; color: string } {
  const l = label.toLowerCase()
  if (l.includes('open') || l.includes('hold')) {
    try {
      const days = (Date.now() - new Date(createdAt).getTime()) / 86_400_000
      return { text: `Open for ${days.toFixed(1)} days`, color: 'text-amber-600' }
    } catch {
      return { text: 'Open', color: 'text-amber-600' }
    }
  }
  if (l.includes('pend')) return { text: 'Pending customer response', color: 'text-blue-600' }
  if (l.includes('clos') || l.includes('complet')) return { text: 'Case closed', color: 'text-green-600' }
  return { text: '', color: '' }
}

export default function TicketCard({ caseData, caseId, postCount }: TicketCardProps) {
  const ticketUrl  = `https://central-supportdesk.kayako.com/agent/conversations/${caseId}`
  const statusLabel = safeLabel(caseData.status)
  const badgeClass  = statusBadgeClass(statusLabel)
  const { text: statusText, color: statusColor } = statusNote(statusLabel, caseData.created_at)
  const priority    = safeLabel(caseData.priority, '—')
  const reqName     = safeName(caseData.requester)
  const reqEmail    = extractEmail(caseData.requester)
  const agentName   = caseData.assigned_agent
    ? safeName(caseData.assigned_agent, 'Unassigned')
    : 'Unassigned'
  const teamName    = caseData.assigned_team?.title ?? caseData.assigned_team?.name ?? '—'
  const product     = (caseData.custom_fields ?? []).find(f => f.label === 'Product')?.value ?? null
  const tags        = caseData.tags ?? []

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <a
            href={ticketUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 text-xs font-semibold hover:underline"
          >
            🔗 TICKET #{caseId} ↗
          </a>
          <h2 className="text-slate-900 font-semibold text-base mt-1 mb-3 leading-snug">
            {caseData.subject || 'No subject'}
          </h2>
          <div className="flex gap-6 flex-wrap text-sm">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-0.5">Requester</p>
              <p className="text-slate-800 font-medium">{reqName}</p>
              {reqEmail && <p className="text-slate-500 text-xs">{reqEmail}</p>}
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-0.5">Agent</p>
              <p className="text-slate-800 font-medium">{agentName}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-0.5">Team</p>
              <p className="text-slate-800 font-medium">{teamName}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-0.5">Created</p>
              <p className="text-slate-800 font-medium">{fmtDt(caseData.created_at)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-0.5">Messages</p>
              <p className="text-slate-800 font-medium">
                {postCount}
                {statusText && (
                  <span className={`ml-2 text-xs font-semibold ${statusColor}`}>{statusText}</span>
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
              {statusLabel}
            </span>
            {product && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                {product}
              </span>
            )}
          </div>
          <p className="text-slate-500 text-xs mt-2">Priority: {priority}</p>
          {tags.length > 0 && (
            <div className="flex gap-1 flex-wrap justify-end mt-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="bg-violet-100 text-violet-700 text-xs px-2 py-0.5 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {(caseData.custom_fields ?? []).length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">Other Fields</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3">
            {(caseData.custom_fields as KayakoCustomField[]).map(f => (
              <div key={f.id}>
                <p className="text-slate-400 text-xs">{f.label}</p>
                <p className="text-slate-800 text-sm font-medium break-words">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
