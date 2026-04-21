import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { analyseTicket } from '@/lib/anthropic/client'
import type { KayakoCase, KayakoPost } from '@/types/kayako'

const TICKETS_PER_RUN = 5

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const settings = await prisma.userSettings.findUnique({
    where:  { userId: user.id },
    select: { kayakoUrl: true, anthropicKeyEnc: true },
  })

  if (!settings?.anthropicKeyEnc) {
    return NextResponse.json({ error: 'Anthropic API key not configured.' }, { status: 400 })
  }

  let apiKey: string
  try {
    apiKey = decrypt(settings.anthropicKeyEnc)
  } catch {
    return NextResponse.json({ error: 'Failed to decrypt Anthropic key.' }, { status: 500 })
  }

  // Skip tickets that already have a complete analysis with the new fields populated
  const existingAnalysisIds = await prisma.ticketAnalysis.findMany({
    where:  { userId: user.id, status: 'done', oneLiner: { not: null } },
    select: { ticketId: true },
  })
  const doneSet = new Set(existingAnalysisIds.map(a => a.ticketId))

  const tickets = await prisma.ticket.findMany({
    where:   {
      isBuPs:      true,
      kayakoUrl:   settings.kayakoUrl ?? '',
      postsStatus: 'done',
      id:          { notIn: doneSet.size > 0 ? [...doneSet] : ['__none__'] },
    },
    include: { posts: { orderBy: { postedAt: 'asc' } } },
    orderBy: { kayakoUpdatedAt: 'desc' },
    take:    TICKETS_PER_RUN,
  })

  if (tickets.length === 0) {
    return NextResponse.json({ ok: true, processed: 0, message: 'All analyses up to date' })
  }

  let processed = 0
  let failed = 0

  for (const ticket of tickets) {
    if (request.signal.aborted) break
    const startMs = Date.now()
    try {
      // Mark as running
      await prisma.ticketAnalysis.upsert({
        where:  { ticketId_userId: { ticketId: ticket.id, userId: user.id } },
        create: { ticketId: ticket.id, userId: user.id, status: 'running' },
        update: { status: 'running', errorMsg: null },
      })

      // Build minimal KayakoCase + KayakoPost shapes for the analyser
      const caseData: KayakoCase = {
        id:             ticket.kayakoTicketId,
        subject:        ticket.title,
        status:         { id: 0, label: ticket.status ?? undefined },
        priority:       { id: 0, label: ticket.priority ?? undefined },
        requester:      { id: 0, full_name: ticket.requesterName ?? undefined },
        assigned_agent: ticket.assignee ? { id: 0, full_name: ticket.assignee } : null,
        assigned_team:  null,
        tags:           ticket.tags,
        created_at:     ticket.kayakoCreatedAt?.toISOString() ?? '',
        updated_at:     ticket.kayakoUpdatedAt?.toISOString() ?? '',
      }

      const posts: KayakoPost[] = ticket.posts.map(p => ({
        id:         p.kayakoPostId,
        channel:    p.channel ?? '',
        creator:    { id: p.creatorId ?? 0, full_name: p.creatorName ?? undefined },
        contents:   p.contents,
        created_at: p.postedAt?.toISOString() ?? p.createdAt.toISOString(),
        is_private: p.isPrivate,
      }))

      const result = await analyseTicket(caseData, posts, apiKey)
      const durationMs = Date.now() - startMs

      await prisma.ticketAnalysis.update({
        where: { ticketId_userId: { ticketId: ticket.id, userId: user.id } },
        data:  {
          sections:     result.sections as object,
          daySummaries: result.day_summaries as object,
          modelUsed:    result.model_used,
          postCount:    result.post_count,
          oneLiner:     result.sections.one_liner    || null,
          blockerType:  result.sections.blocker_type || null,
          inputTokens:  result.input_tokens  ?? null,
          outputTokens: result.output_tokens ?? null,
          status:       'done',
          errorMsg:     null,
        },
      })

      await prisma.analysisRun.create({
        data: {
          ticketId:       ticket.id,
          userId:         user.id,
          kayakoTicketId: ticket.kayakoTicketId,
          kayakoUrl:      ticket.kayakoUrl,
          trigger:        'batch',
          modelUsed:      result.model_used,
          postCount:      result.post_count,
          inputTokens:    result.input_tokens  ?? null,
          outputTokens:   result.output_tokens ?? null,
          durationMs,
          status:         'done',
        },
      }).catch(() => null)

      processed++
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[analyse-batch] Failed ticket ${ticket.kayakoTicketId}:`, msg)
      await Promise.all([
        prisma.ticketAnalysis.upsert({
          where:  { ticketId_userId: { ticketId: ticket.id, userId: user.id } },
          create: { ticketId: ticket.id, userId: user.id, status: 'error', errorMsg: msg },
          update: { status: 'error', errorMsg: msg },
        }).catch(() => null),
        prisma.analysisRun.create({
          data: {
            ticketId:       ticket.id,
            userId:         user.id,
            kayakoTicketId: ticket.kayakoTicketId,
            kayakoUrl:      ticket.kayakoUrl,
            trigger:        'batch',
            durationMs:     Date.now() - startMs,
            status:         'error',
            errorMsg:       msg,
          },
        }).catch(() => null),
      ])
      failed++
    }
  }

  return NextResponse.json({ ok: true, processed, failed, total: tickets.length })
}
