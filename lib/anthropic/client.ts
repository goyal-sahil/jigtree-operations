import Anthropic from '@anthropic-ai/sdk'
import type { KayakoCase, KayakoPost, AnalysisResult, AnalysisSections, TicketRow, UnifiedPost } from '@/types/kayako'
import { getPostText, safeLabel } from '@/lib/utils'

const COMPLEXITY_KEYWORDS = [
  'urgent', 'escalat', 'legal', 'refund', 'cancel', 'chargeback',
  'frustrated', 'angry', 'unacceptable', 'lawsuit', 'terrible',
  'outage', 'critical', 'broken', 'down', 'lost data',
]

export function detectModel(caseData: KayakoCase, posts: KayakoPost[]): string {
  let score = 0
  const n = posts.length
  if (n > 15) score += 2
  if (n > 30) score += 2

  const combined = [
    caseData.subject ?? '',
    ...posts.map(p => getPostText(p)),
  ].join(' ').toLowerCase()

  if (COMPLEXITY_KEYWORDS.some(kw => combined.includes(kw))) score += 1

  if (caseData.created_at) {
    const ageDays = (Date.now() - new Date(caseData.created_at).getTime()) / 86_400_000
    if (ageDays > 7) score += 2
  }

  return score >= 3 ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001'
}

function buildConversationBlock(posts: KayakoPost[]): string {
  return posts.map(post => {
    const ch = typeof post.channel === 'object'
      ? (post.channel.label ?? '')
      : String(post.channel ?? '')
    const isNote = ch.toUpperCase() === 'NOTE'
    const author = post.creator?.full_name ?? post.creator?.name ?? 'Unknown'
    const text = getPostText(post).slice(0, 1500)
    const ts = (post.created_at ?? '').slice(0, 16).replace('T', ' ')
    const vis = isNote ? '[INTERNAL — not visible to customer]' : '[Customer-visible]'
    return `[${ts}] ${vis} ${author}:\n${text}`
  }).join('\n\n---\n\n')
}

function parseSections(raw: string): AnalysisSections & { day_summaries_raw: string } {
  const map: Record<string, string> = {}
  for (const part of raw.split(/^##\s+/m)) {
    if (!part.trim()) continue
    const nl = part.indexOf('\n')
    const heading = part.slice(0, nl < 0 ? undefined : nl).trim()
    const body    = nl < 0 ? '' : part.slice(nl + 1).trim()
    map[heading] = body
  }

  // Parse structured Blocker section
  const blockerRaw = map['Blocker'] ?? ''
  let blocker_type   = ''
  let blocker_detail = ''
  for (const line of blockerRaw.split('\n')) {
    const t = line.trim()
    if (t.startsWith('Type:'))   blocker_type   = t.slice(5).trim()
    if (t.startsWith('Detail:')) blocker_detail = t.slice(7).trim()
  }

  return {
    one_liner:          map['One-liner'] ?? '',
    blocker_type,
    blocker_detail,
    path_to_closure:    map['Path to Closure'] ?? '',
    case_summary:       map['Case Summary'] ?? '',
    customer_sentiment: map['Customer Sentiment'] ?? '',
    what_needed:        map["What's Needed to Close"] ?? '',
    next_steps:         map['Next Steps'] ?? '',
    day_summaries_raw:  map['Timeline'] ?? '',
  }
}

function parseDaySummaries(raw: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const line of raw.split('\n')) {
    const t = line.trim().replace(/^[-•]\s*/, '')
    if (/^\d{4}-\d{2}-\d{2}[:\s]/.test(t)) {
      const i = t.search(/[:\s]/)
      result[t.slice(0, i).trim()] = t.slice(i + 1).trim()
    }
  }
  return result
}

export async function analyseTicket(
  caseData: KayakoCase,
  posts: KayakoPost[],
  apiKey: string,
): Promise<AnalysisResult> {
  const model  = detectModel(caseData, posts)
  const client = new Anthropic({ apiKey })

  const subject      = caseData.subject ?? 'No subject'
  const requester    = caseData.requester?.full_name ?? caseData.requester?.name ?? '—'
  const status       = safeLabel(caseData.status as Record<string, unknown>)
  const tags         = caseData.tags?.join(', ') || '—'
  const createdAt    = (caseData.created_at ?? '').slice(0, 10)
  const ageDays      = caseData.created_at
    ? Math.floor((Date.now() - new Date(caseData.created_at).getTime()) / 86_400_000)
    : null
  const conversation = buildConversationBlock(posts)

  const systemPrompt = `You are a senior customer support analyst. Produce concise, scannable analysis for support managers. Always use bullet points — never long prose paragraphs. Be specific and actionable. Every item must be concrete — no vague statements like "follow up with customer".`

  const userPrompt = `Analyse this support ticket. Return EXACTLY these sections with these headings, in order. Use bullet points throughout.

## One-liner
A single sentence (10–15 words) stating the core issue. Example: "Customer's CSV export fails on all report types since the v3.2 update."

## Blocker
Type: [pick exactly one: Action: Support | Waiting: Engineering | Waiting: Customer | Waiting: 3rd Party | Ready to Close]
Detail: [one sentence — what specifically is blocking closure right now]

## Path to Closure
Numbered steps to close this ticket. Format each step as: "N. [Owner] Action — timing if known"
Owners: Support / Engineering / Customer / Management. Max 5 steps. Be concrete.

## Case Summary
Bullet points covering:
- Issue: what the customer reported
- Root cause: what's causing it (if known)
- Impact: who/what is affected
- Current state: where things stand right now

## Customer Sentiment
Start with a one-line label (e.g. "Frustrated and escalating"). Then bullet points:
- What's driving their sentiment
- Any specific moments that worsened or improved it

## What's Needed to Close
Bullet list of specific actions or conditions required to close this ticket. Each bullet = one concrete action. No vague items.

## Next Steps
Numbered list ordered by priority. Format: "N. [Action] — [Owner]"

## Timeline
One line per active date, chronological. Format exactly:
YYYY-MM-DD: [one sentence of what happened that day]

---

TICKET METADATA
- Subject: ${subject}
- Requester: ${requester}
- Status: ${status}
- Tags: ${tags}
- Created: ${createdAt}${ageDays !== null ? ` (${ageDays} days ago)` : ''}
- Total posts: ${posts.length}

FULL CONVERSATION HISTORY
(Internal notes are [INTERNAL — not visible to customer]. Customer-facing posts are [Customer-visible].)

${conversation}`

  const createParams = {
    model,
    max_tokens: 2500,
    system: systemPrompt,
    messages: [{ role: 'user' as const, content: userPrompt }],
  }

  const response = await client.messages.create(createParams).catch(async (err: unknown) => {
    if ((err as { status?: number }).status === 500) {
      await new Promise(r => setTimeout(r, 2000))
      return client.messages.create(createParams)
    }
    throw err
  })

  const raw    = response.content[0].type === 'text' ? response.content[0].text : ''
  const parsed = parseSections(raw)

  return {
    sections: {
      one_liner:          parsed.one_liner,
      blocker_type:       parsed.blocker_type,
      blocker_detail:     parsed.blocker_detail,
      path_to_closure:    parsed.path_to_closure,
      case_summary:       parsed.case_summary,
      customer_sentiment: parsed.customer_sentiment,
      what_needed:        parsed.what_needed,
      next_steps:         parsed.next_steps,
    },
    day_summaries:  parseDaySummaries(parsed.day_summaries_raw),
    model_used:     model,
    post_count:     posts.length,
    input_tokens:   response.usage.input_tokens,
    output_tokens:  response.usage.output_tokens,
    status:         'done',
  }
}

// ── Ticket Markdown Export ────────────────────────────────────────────────────

export interface ExportResult {
  markdown:      string
  model_used:    string
  input_tokens:  number
  output_tokens: number
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<h[1-6][^>]*>/gi, '### ')
    .replace(/<\/blockquote>/gi, '\n')
    .replace(/<blockquote[^>]*>/gi, '> ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function postChannelLabel(channel: string | null): string {
  switch (channel?.toUpperCase()) {
    case 'NOTE':              return '🔒 Internal Note'
    case 'CUSTOMER':          return '👤 Customer'
    case 'SIDE_CONVERSATION': return '↗ Side Conversation'
    default:                  return '💬 Support Reply'
  }
}

function buildFullMarkdown(ticket: TicketRow, posts: UnifiedPost[], analysis: AnalysisResult | null, overview: string): string {
  const s: string[] = []

  const created  = ticket.kayakoCreatedAt?.slice(0, 10) ?? '—'
  const exported = new Date().toISOString().slice(0, 10)

  // ── Header ──────────────────────────────────────────────────────────────
  s.push(`# Ticket #${ticket.kayakoTicketId} — ${ticket.title}`)
  s.push('')
  s.push(`> **Exported:** ${exported} | **Posts:** ${posts.length} | **Status:** ${ticket.status ?? '—'} | **Priority:** ${ticket.priority ?? '—'} | **Created:** ${created}`)
  s.push('')

  // ── Overview (Claude-generated) ──────────────────────────────────────────
  if (overview.trim()) {
    s.push('## Overview')
    s.push('')
    s.push(overview.trim())
    s.push('')
  }

  s.push('---')
  s.push('')

  // ── Metadata ─────────────────────────────────────────────────────────────
  s.push('## Metadata')
  s.push('')
  s.push('| Field | Value |')
  s.push('|---|---|')
  s.push(`| Status | ${ticket.status ?? '—'} |`)
  s.push(`| Priority | ${ticket.priority ?? '—'} |`)
  s.push(`| Team | ${ticket.team ?? '—'} |`)
  s.push(`| Brand / BU | ${ticket.brand ?? '—'} |`)
  s.push(`| Product | ${ticket.product ?? '—'} |`)
  s.push(`| Requester | ${ticket.requesterName ?? '—'}${ticket.requesterEmail ? ` <${ticket.requesterEmail}>` : ''} |`)
  s.push(`| Organization | ${ticket.organization ?? '—'} |`)
  s.push(`| Assignee | ${ticket.assignee ?? '—'} |`)
  s.push(`| Escalated | ${ticket.isEscalated ? '⚠️ Yes' : 'No'} |`)
  s.push(`| Created | ${created} |`)
  s.push(`| Updated | ${ticket.kayakoUpdatedAt?.slice(0, 10) ?? '—'} |`)
  if (ticket.ghiId)      s.push(`| GitHub Issue | #${ticket.ghiId}${ticket.ghiStatus ? ` (${ticket.ghiStatus})` : ''} |`)
  if (ticket.holdReason) s.push(`| Hold Reason | ${ticket.holdReason} |`)
  s.push('')

  // ── Tags ──────────────────────────────────────────────────────────────────
  s.push('## Tags')
  s.push('')
  s.push(ticket.tags.length > 0 ? ticket.tags.map(t => `\`${t}\``).join(' ') : '*(none)*')
  s.push('')

  // ── Custom fields ─────────────────────────────────────────────────────────
  if (ticket.customFields && ticket.customFields.length > 0) {
    s.push('## Custom Fields')
    s.push('')
    s.push('| Field | Value |')
    s.push('|---|---|')
    for (const f of ticket.customFields) {
      s.push(`| ${f.label} | ${f.value} |`)
    }
    s.push('')
  }

  // ── Jira references ───────────────────────────────────────────────────────
  if (ticket.jiraFields && Object.keys(ticket.jiraFields).length > 0) {
    s.push('## Jira References')
    s.push('')
    s.push('| Key | Value |')
    s.push('|---|---|')
    for (const [key, val] of Object.entries(ticket.jiraFields)) {
      s.push(`| ${key} | ${val} |`)
    }
    s.push('')
  }

  // ── AI Analysis ───────────────────────────────────────────────────────────
  if (analysis?.status === 'done') {
    const sec = analysis.sections
    s.push('## AI Analysis')
    s.push('')
    s.push(`*Model: ${analysis.model_used} | Posts analysed: ${analysis.post_count}*`)
    s.push('')

    if (sec.one_liner) {
      s.push('### One-liner')
      s.push('')
      s.push(sec.one_liner)
      s.push('')
    }

    if (sec.blocker_type || sec.blocker_detail) {
      s.push('### Blocker')
      s.push('')
      if (sec.blocker_type)   s.push(`**Type:** ${sec.blocker_type}`)
      if (sec.blocker_detail) s.push(`**Detail:** ${sec.blocker_detail}`)
      s.push('')
    }

    if (sec.path_to_closure) {
      s.push('### Path to Closure')
      s.push('')
      s.push(sec.path_to_closure)
      s.push('')
    }

    if (sec.case_summary) {
      s.push('### Case Summary')
      s.push('')
      s.push(sec.case_summary)
      s.push('')
    }

    if (sec.customer_sentiment) {
      s.push('### Customer Sentiment')
      s.push('')
      s.push(sec.customer_sentiment)
      s.push('')
    }

    if (sec.what_needed) {
      s.push("### What's Needed to Close")
      s.push('')
      s.push(sec.what_needed)
      s.push('')
    }

    if (sec.next_steps) {
      s.push('### Next Steps')
      s.push('')
      s.push(sec.next_steps)
      s.push('')
    }

    if (analysis.day_summaries && Object.keys(analysis.day_summaries).length > 0) {
      s.push('### Timeline')
      s.push('')
      for (const [date, summary] of Object.entries(analysis.day_summaries)) {
        s.push(`- **${date}:** ${summary}`)
      }
      s.push('')
    }

    s.push('---')
    s.push('')
  }

  // ── Conversation ──────────────────────────────────────────────────────────
  s.push(`## Conversation (${posts.length} posts)`)
  s.push('')

  if (posts.length === 0) {
    s.push('*(No posts available)*')
    s.push('')
  } else {
    for (const p of posts) {
      const ts   = (p.postedAt ?? '').slice(0, 16).replace('T', ' ')
      const ch   = postChannelLabel(p.channel)
      const auth = p.creatorName ?? 'Unknown'
      const body = stripHtml(p.contents)
      s.push('---')
      s.push('')
      s.push(`### [${ts}] ${ch} — ${auth}`)
      s.push('')
      s.push(body)
      s.push('')
    }
  }

  return s.join('\n')
}

export async function generateTicketMarkdown(
  ticket: TicketRow,
  posts: UnifiedPost[],
  analysis: AnalysisResult | null,
  apiKey: string,
): Promise<ExportResult> {
  const model  = 'claude-haiku-4-5-20251001'
  const client = new Anthropic({ apiKey })

  // Build a compact context for the overview (small prompt → small output)
  const ctxLines: string[] = [
    `Ticket: #${ticket.kayakoTicketId} — ${ticket.title}`,
    `Status: ${ticket.status ?? '—'} | Priority: ${ticket.priority ?? '—'} | Team: ${ticket.team ?? '—'}`,
    `Posts: ${posts.length} | Tags: ${ticket.tags.join(', ') || '—'}`,
  ]
  if (analysis?.status === 'done') {
    const sec = analysis.sections
    if (sec.one_liner)    ctxLines.push(`One-liner: ${sec.one_liner}`)
    if (sec.blocker_type) ctxLines.push(`Blocker: ${sec.blocker_type}`)
    if (sec.case_summary) ctxLines.push(`Summary: ${sec.case_summary.slice(0, 400)}`)
  }

  const response = await client.messages.create({
    model,
    max_tokens: 400,
    messages: [{
      role: 'user' as const,
      content: `Write a 3–5 bullet "Overview" for this support ticket export. Each bullet is one sentence. Cover the core issue, current blocker/state, and what is needed to close. Use "- " bullets, no heading.

${ctxLines.join('\n')}`,
    }],
  })

  const overview = response.content[0].type === 'text' ? response.content[0].text : ''

  return {
    markdown:      buildFullMarkdown(ticket, posts, analysis, overview),
    model_used:    model,
    input_tokens:  response.usage.input_tokens,
    output_tokens: response.usage.output_tokens,
  }
}
