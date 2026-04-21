import { NextResponse, type NextRequest } from 'next/server'

export const maxDuration = 120
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { analyseTicket } from '@/lib/anthropic/client'
import { ticketRowToKayakoCase, dbPostsToKayakoPosts } from '@/lib/kayako/ticketService'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { caseId, kayakoUrl, forceRefresh = false } = await request.json() as {
    caseId:        number
    kayakoUrl?:    string
    forceRefresh?: boolean
  }

  const settings = await prisma.userSettings.findUnique({
    where:  { userId: user.id },
    select: { kayakoUrl: true, anthropicKeyEnc: true },
  })

  if (!settings?.anthropicKeyEnc) {
    return NextResponse.json(
      { error: 'Anthropic API key not configured. Please visit Settings.' },
      { status: 400 }
    )
  }

  const effectiveKayakoUrl = kayakoUrl ?? settings.kayakoUrl ?? ''

  // Look up ticket + posts from DB
  const ticketRecord = await prisma.ticket.findFirst({
    where:   { kayakoTicketId: caseId, kayakoUrl: effectiveKayakoUrl },
    include: { posts: { orderBy: { postedAt: 'asc' } } },
  })

  if (!ticketRecord) {
    return NextResponse.json(
      { error: 'Ticket not found in database. Please fetch the ticket first.' },
      { status: 404 }
    )
  }

  // ── Cache check ───────────────────────────────────────────────────────────
  if (!forceRefresh) {
    const cached = await prisma.ticketAnalysis.findUnique({
      where: { ticketId_userId: { ticketId: ticketRecord.id, userId: user.id } },
    })
    if (cached?.status === 'done' && cached.sections) {
      return NextResponse.json({
        sections:      cached.sections,
        day_summaries: cached.daySummaries,
        model_used:    cached.modelUsed,
        post_count:    cached.postCount,
        status:        'done',
        created_at:    cached.updatedAt.toISOString(),
        fromCache:     true,
      })
    }
  }

  let apiKey: string
  try {
    apiKey = decrypt(settings.anthropicKeyEnc)
  } catch {
    return NextResponse.json({ error: 'Failed to decrypt Anthropic API key.' }, { status: 500 })
  }

  // Convert DB records to Kayako types for analysis
  const caseData = ticketRowToKayakoCase(ticketRecord)
  const posts    = dbPostsToKayakoPosts(ticketRecord.posts)

  const trigger = forceRefresh ? 'forced' : 'manual'
  const startMs = Date.now()

  let result
  try {
    result = await analyseTicket(caseData, posts, apiKey)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'AI analysis failed.'
    await prisma.analysisRun.create({
      data: {
        ticketId:       ticketRecord.id,
        userId:         user.id,
        kayakoTicketId: ticketRecord.kayakoTicketId,
        kayakoUrl:      ticketRecord.kayakoUrl,
        trigger,
        durationMs:     Date.now() - startMs,
        status:         'error',
        errorMsg:       msg,
      },
    }).catch(() => null)
    return NextResponse.json({ error: msg }, { status: 502 })
  }

  const durationMs = Date.now() - startMs

  // ── Save to ticket_analyses ───────────────────────────────────────────────
  await prisma.ticketAnalysis.upsert({
    where:  { ticketId_userId: { ticketId: ticketRecord.id, userId: user.id } },
    create: {
      ticketId:     ticketRecord.id,
      userId:       user.id,
      sections:     result.sections as object,
      daySummaries: result.day_summaries as object,
      modelUsed:    result.model_used,
      postCount:    result.post_count,
      oneLiner:     result.sections.one_liner || null,
      blockerType:  result.sections.blocker_type || null,
      inputTokens:  result.input_tokens,
      outputTokens: result.output_tokens,
      status:       'done',
    },
    update: {
      sections:     result.sections as object,
      daySummaries: result.day_summaries as object,
      modelUsed:    result.model_used,
      postCount:    result.post_count,
      oneLiner:     result.sections.one_liner || null,
      blockerType:  result.sections.blocker_type || null,
      inputTokens:  result.input_tokens,
      outputTokens: result.output_tokens,
      status:       'done',
      errorMsg:     null,
    },
  })

  // ── Append to analysis_runs log ───────────────────────────────────────────
  await prisma.analysisRun.create({
    data: {
      ticketId:       ticketRecord.id,
      userId:         user.id,
      kayakoTicketId: ticketRecord.kayakoTicketId,
      kayakoUrl:      ticketRecord.kayakoUrl,
      trigger,
      modelUsed:      result.model_used,
      postCount:      result.post_count,
      inputTokens:    result.input_tokens  ?? null,
      outputTokens:   result.output_tokens ?? null,
      durationMs,
      status:         'done',
    },
  }).catch(() => null)

  return NextResponse.json({ ...result, status: 'done', fromCache: false })
}
