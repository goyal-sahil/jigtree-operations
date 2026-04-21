import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { dbTicketToRow, dbPostToUnified } from '@/lib/kayako/ticketService'
import { findPricing, computeCost } from '@/lib/pricing'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const kayakoTicketId = parseInt(params.id, 10)
  if (isNaN(kayakoTicketId)) return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 })

  const settings = await prisma.userSettings.findUnique({
    where: { userId: user.id }, select: { kayakoUrl: true },
  })

  const kayakoUrl = settings?.kayakoUrl ?? ''

  const ticket = await prisma.ticket.findFirst({
    where:   { kayakoTicketId, kayakoUrl },
    include: {
      posts:    { orderBy: { postedAt: 'asc' } },
      analyses: { where: { userId: user.id } },
    },
  })

  if (!ticket) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })

  const analysis = ticket.analyses[0] ?? null

  // Re-link any orphaned runs (ticketId was set to null when the ticket was previously deleted)
  await prisma.analysisRun.updateMany({
    where: { kayakoTicketId, kayakoUrl, userId: user.id, ticketId: null },
    data:  { ticketId: ticket.id },
  }).catch(() => null)

  // Fetch all runs for this ticket by Kayako ID (includes re-linked orphans)
  const [runs, pricingRows] = await Promise.all([
    prisma.analysisRun.findMany({
      where:   { kayakoTicketId, kayakoUrl, userId: user.id },
      orderBy: { createdAt: 'desc' },
      take:    20,
    }),
    prisma.modelPricing.findMany(),
  ])

  return NextResponse.json({
    ticket:       dbTicketToRow(ticket),
    posts:        ticket.posts.map(dbPostToUnified),
    lastSyncedAt: ticket.lastSyncedAt.toISOString(),
    analysis: analysis ? {
      status:       analysis.status,
      sections:     analysis.sections,
      daySummaries: analysis.daySummaries,
      modelUsed:    analysis.modelUsed,
      postCount:    analysis.postCount,
      errorMsg:     analysis.errorMsg,
      updatedAt:    analysis.updatedAt.toISOString(),
    } : null,
    analysisRuns: runs.map(r => {
      const pricing = r.modelUsed
        ? findPricing(r.modelUsed, r.createdAt, pricingRows)
        : null
      const cost = computeCost(r.inputTokens, r.outputTokens, pricing)
      return {
        id:            r.id,
        trigger:       r.trigger,
        modelUsed:     r.modelUsed,
        postCount:     r.postCount,
        inputTokens:   r.inputTokens,
        outputTokens:  r.outputTokens,
        durationMs:    r.durationMs,
        status:        r.status,
        errorMsg:      r.errorMsg,
        createdAt:     r.createdAt.toISOString(),
        inputCostUsd:  cost.inputCostUsd,
        outputCostUsd: cost.outputCostUsd,
        totalCostUsd:  cost.totalCostUsd,
        isOrphaned:    r.ticketId == null,
      }
    }),
  })
}
