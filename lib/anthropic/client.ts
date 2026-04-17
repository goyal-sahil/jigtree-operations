/**
 * Anthropic Claude analysis — TypeScript port of analyse_ticket_with_ai() from kayako_tool.py
 * Prompt, section headings, and model selection logic are identical to the Streamlit tool.
 */

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
  return {
    executive_summary:  map['Executive Summary'] ?? '',
    one_line:           map['One-Line Summary'] ?? '',
    case_summary:       map['Case Summary'] ?? '',
    customer_sentiment: map['Customer Sentiment'] ?? '',
    what_needed:        map["What's Needed to Close This Ticket"] ?? '',
    next_steps:         map['Recommended Next Steps'] ?? '',
    day_summaries_raw:  map['Day-by-Day Summary'] ?? '',
  }
}

function parseDaySummaries(raw: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (/^\d{4}-\d{2}-\d{2}:/.test(t)) {
      const i = t.indexOf(':')
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

  const subject   = caseData.subject ?? 'No subject'
  const requester = caseData.requester?.full_name ?? caseData.requester?.name ?? '—'
  const status    = safeLabel(caseData.status as Record<string, unknown>)
  const tags      = caseData.tags?.join(', ') || '—'
  const createdAt = (caseData.created_at ?? '').slice(0, 10)
  const conversation = buildConversationBlock(posts)

  const systemPrompt = `You are a senior customer support analyst. You read full support ticket histories — including internal notes that the customer cannot see — and produce clear, actionable analysis for support agents. Be concise, specific, and professional. Use markdown formatting.`

  const userPrompt = `Analyse this support ticket and return EXACTLY these seven sections with these headings:

## Executive Summary
One short paragraph (3–4 sentences) a manager could read in 10 seconds to understand the full situation: the issue, current state, and urgency.

## One-Line Summary
A single sentence (max 20 words) describing what this ticket is about.

## Case Summary
A concise 3–5 sentence overview of the issue: what the customer reported, what has been tried, and where things stand now.

## Customer Sentiment
One sentence on the customer's emotional state (e.g. frustrated, patient, confused, angry). Then 1–2 sentences explaining what's driving that sentiment based on the conversation.

## What's Needed to Close This Ticket
A bullet-point list of the specific conditions or actions that must be completed before this ticket can be resolved and closed. Be precise — no vague items.

## Recommended Next Steps
A numbered action plan for the support agent. Order by priority. Include who is responsible for each step where relevant.

## Day-by-Day Summary
For each date that has activity, write exactly one sentence summarising what happened that day.
Format each line exactly as (no extra text, no bullets):
YYYY-MM-DD: [one sentence summary]
List dates in chronological order.

---

TICKET METADATA
- Subject: ${subject}
- Requester: ${requester}
- Status: ${status}
- Tags / Category: ${tags}
- Created: ${createdAt}
- Total posts: ${posts.length}

FULL CONVERSATION HISTORY
(Internal notes are marked [INTERNAL — not visible to customer]. Customer-facing posts are marked [Customer-visible].)

${conversation}`

  const response = await client.messages.create({
    model,
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''
  const parsed = parseSections(raw)

  return {
    sections: {
      executive_summary:  parsed.executive_summary,
      one_line:           parsed.one_line,
      case_summary:       parsed.case_summary,
      customer_sentiment: parsed.customer_sentiment,
      what_needed:        parsed.what_needed,
      next_steps:         parsed.next_steps,
    },
    day_summaries: parseDaySummaries(parsed.day_summaries_raw),
    model_used: model,
    post_count: posts.length,
  }
}
