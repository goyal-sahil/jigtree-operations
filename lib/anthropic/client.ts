import Anthropic from '@anthropic-ai/sdk'
import type { KayakoCase, KayakoPost, AnalysisResult, AnalysisSections } from '@/types/kayako'
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
