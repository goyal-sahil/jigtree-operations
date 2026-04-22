import { NextResponse, type NextRequest } from 'next/server'

export const maxDuration = 60

import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { dbTicketToRow, dbPostToUnified } from '@/lib/kayako/ticketService'
import { generateTicketMarkdown } from '@/lib/anthropic/client'
import type { AnalysisResult } from '@/types/kayako'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { caseId, forceRefresh = false } = await request.json() as {
    caseId:        number
    forceRefresh?: boolean
  }

  const settings = await prisma.userSettings.findUnique({
    where:  { userId: user.id },
    select: { kayakoUrl: true, anthropicKeyEnc: true },
  })

  if (!settings?.anthropicKeyEnc) {
    return NextResponse.json(
      { error: 'Anthropic API key not configured. Please visit Settings.' },
      { status: 400 },
    )
  }

  let apiKey: string
  try {
    apiKey = decrypt(settings.anthropicKeyEnc)
  } catch {
    return NextResponse.json({ error: 'Failed to decrypt Anthropic key.' }, { status: 500 })
  }

  const kayakoUrl = settings.kayakoUrl ?? ''

  const ticket = await prisma.ticket.findFirst({
    where:   { kayakoTicketId: caseId, kayakoUrl },
    include: {
      posts:    { orderBy: { postedAt: 'asc' } },
      analyses: { where: { userId: user.id } },
      exports:  { where: { userId: user.id } },
    },
  })

  if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })

  if (ticket.postsStatus !== 'done') {
    return NextResponse.json(
      { error: 'Posts have not been fetched yet. Please refresh the ticket first.' },
      { status: 400 },
    )
  }

  // Cache check — return stored markdown if fresh
  const existing = ticket.exports[0] ?? null
  if (existing?.status === 'done' && existing.markdownContent && !forceRefresh) {
    return NextResponse.json({ markdown: existing.markdownContent, fromCache: true })
  }

  // Mark as running
  await prisma.ticketExport.upsert({
    where:  { ticketId_userId: { ticketId: ticket.id, userId: user.id } },
    update: { status: 'running', errorMsg: null },
    create: { ticketId: ticket.id, userId: user.id, status: 'running' },
  })

  const startMs = Date.now()

  // Build analysis object if available
  const dbAnalysis = ticket.analyses[0] ?? null
  const analysis: AnalysisResult | null = dbAnalysis?.status === 'done' ? {
    sections:      dbAnalysis.sections as unknown as AnalysisResult['sections'],
    day_summaries: (dbAnalysis.daySummaries ?? {}) as Record<string, string>,
    model_used:    dbAnalysis.modelUsed ?? '',
    post_count:    dbAnalysis.postCount ?? 0,
    status:        'done',
  } : null

  const ticketRow = dbTicketToRow(ticket)
  const posts     = ticket.posts.map(dbPostToUnified)

  try {
    const result     = await generateTicketMarkdown(ticketRow, posts, analysis, apiKey)
    const durationMs = Date.now() - startMs

    await prisma.ticketExport.upsert({
      where:  { ticketId_userId: { ticketId: ticket.id, userId: user.id } },
      update: {
        status:          'done',
        markdownContent: result.markdown,
        modelUsed:       result.model_used,
        inputTokens:     result.input_tokens,
        outputTokens:    result.output_tokens,
        errorMsg:        null,
      },
      create: {
        ticketId:        ticket.id,
        userId:          user.id,
        status:          'done',
        markdownContent: result.markdown,
        modelUsed:       result.model_used,
        inputTokens:     result.input_tokens,
        outputTokens:    result.output_tokens,
      },
    })

    await prisma.analysisRun.create({
      data: {
        ticketId:       ticket.id,
        userId:         user.id,
        kayakoTicketId: ticket.kayakoTicketId,
        kayakoUrl:      ticket.kayakoUrl,
        trigger:        forceRefresh ? 'forced' : 'manual',
        runType:        'download',
        modelUsed:      result.model_used,
        postCount:      posts.length,
        inputTokens:    result.input_tokens,
        outputTokens:   result.output_tokens,
        durationMs,
        status:         'done',
      },
    })

    return NextResponse.json({ markdown: result.markdown, fromCache: false })
  } catch (err: unknown) {
    const durationMs = Date.now() - startMs
    const errorMsg   = err instanceof Error ? err.message : 'Export generation failed'

    await prisma.ticketExport.upsert({
      where:  { ticketId_userId: { ticketId: ticket.id, userId: user.id } },
      update: { status: 'error', errorMsg },
      create: { ticketId: ticket.id, userId: user.id, status: 'error', errorMsg },
    }).catch(() => null)

    await prisma.analysisRun.create({
      data: {
        ticketId:       ticket.id,
        userId:         user.id,
        kayakoTicketId: ticket.kayakoTicketId,
        kayakoUrl:      ticket.kayakoUrl,
        trigger:        forceRefresh ? 'forced' : 'manual',
        runType:        'download',
        durationMs,
        status:         'error',
        errorMsg,
      },
    }).catch(() => null)

    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
