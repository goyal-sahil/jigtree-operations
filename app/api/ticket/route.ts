import { NextResponse, type NextRequest } from 'next/server'

export const maxDuration = 60
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { KayakoClient, extractCaseId } from '@/lib/kayako/client'
import { fetchAndPersistTicket, dbTicketToRow, dbPostToUnified } from '@/lib/kayako/ticketService'
import { findPricing, computeCost } from '@/lib/pricing'
import type { AnalysisResult, AnalysisSections } from '@/types/kayako'

function analysisToResult(a: {
  sections:     Prisma.JsonValue
  daySummaries: Prisma.JsonValue
  modelUsed:    string | null
  postCount:    number | null
  inputTokens:  number | null
  outputTokens: number | null
  status:       string
  errorMsg:     string | null
  createdAt:    Date
}): AnalysisResult {
  return {
    sections:      (a.sections as unknown as AnalysisSections) ?? {} as AnalysisSections,
    day_summaries: (a.daySummaries as unknown as Record<string, string>) ?? {},
    model_used:    a.modelUsed ?? '',
    post_count:    a.postCount ?? 0,
    input_tokens:  a.inputTokens ?? undefined,
    output_tokens: a.outputTokens ?? undefined,
    status:        a.status as AnalysisResult['status'],
    error_msg:     a.errorMsg ?? undefined,
    fromCache:     true,
    created_at:    a.createdAt.toISOString(),
  }
}

async function fetchRunsWithCost(kayakoTicketId: number, kayakoUrl: string, userId: string) {
  const [runs, pricingRows] = await Promise.all([
    prisma.analysisRun.findMany({
      where:   { kayakoTicketId, kayakoUrl, userId },
      orderBy: { createdAt: 'desc' },
      take:    20,
    }),
    prisma.modelPricing.findMany(),
  ])
  return runs.map(r => {
    const pricing = r.modelUsed ? findPricing(r.modelUsed, r.createdAt, pricingRows) : null
    const cost    = computeCost(r.inputTokens, r.outputTokens, pricing)
    return {
      id:            r.id,
      trigger:       r.trigger,
      runType:       r.runType ?? 'analysis',
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
  })
}

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const settings = await prisma.userSettings.findUnique({
    where:  { userId: user.id },
    select: { kayakoUrl: true, kayakoEmail: true, kayakoPasswordEnc: true },
  })

  if (!settings?.kayakoPasswordEnc || !settings.kayakoUrl || !settings.kayakoEmail) {
    return NextResponse.json(
      { error: 'Kayako credentials not configured. Please visit Settings.' },
      { status: 400 }
    )
  }

  const { ticketInput, forceRefresh = false } = await request.json() as {
    ticketInput:   string
    forceRefresh?: boolean
  }

  const caseId = extractCaseId(ticketInput)
  if (!caseId) {
    return NextResponse.json({ error: 'Invalid ticket URL or ID.' }, { status: 400 })
  }

  // ── DB-first: return cached data if available ─────────────────────────────
  if (!forceRefresh) {
    const cached = await prisma.ticket.findUnique({
      where:   { kayakoTicketId_kayakoUrl: { kayakoTicketId: caseId, kayakoUrl: settings.kayakoUrl } },
      include: { posts: { orderBy: { postedAt: 'asc' } } },
    })
    if (cached && cached.postsStatus === 'done') {
      const [analysis, exportRecord, analysisRuns] = await Promise.all([
        prisma.ticketAnalysis.findUnique({
          where: { ticketId_userId: { ticketId: cached.id, userId: user.id } },
        }),
        prisma.ticketExport.findUnique({
          where: { ticketId_userId: { ticketId: cached.id, userId: user.id } },
        }),
        fetchRunsWithCost(caseId, settings.kayakoUrl, user.id),
      ])
      return NextResponse.json({
        ticket:          dbTicketToRow(cached),
        posts:           cached.posts.map(dbPostToUnified),
        fromCache:       true,
        lastSyncedAt:    cached.lastSyncedAt.toISOString(),
        cachedAnalysis:  analysis?.status === 'done' ? analysisToResult(analysis) : null,
        export:          exportRecord ? { status: exportRecord.status, createdAt: exportRecord.updatedAt.toISOString() } : null,
        analysisRuns,
      })
    }
  }

  // ── Live fetch ────────────────────────────────────────────────────────────
  let password: string
  try {
    password = decrypt(settings.kayakoPasswordEnc)
  } catch {
    return NextResponse.json({ error: 'Failed to decrypt credentials.' }, { status: 500 })
  }

  const client = new KayakoClient(settings.kayakoUrl, AbortSignal.timeout(45_000))
  try {
    await client.authenticate(settings.kayakoEmail, password)
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Kayako authentication failed.' },
      { status: 502 }
    )
  }

  try {
    const { ticket, posts, warning } = await fetchAndPersistTicket(caseId, client, settings.kayakoUrl)
    const [analysis, exportRecord, analysisRuns] = await Promise.all([
      prisma.ticketAnalysis.findUnique({
        where: { ticketId_userId: { ticketId: ticket.id, userId: user.id } },
      }),
      prisma.ticketExport.findUnique({
        where: { ticketId_userId: { ticketId: ticket.id, userId: user.id } },
      }),
      fetchRunsWithCost(caseId, settings.kayakoUrl, user.id),
    ])
    return NextResponse.json({
      ticket,
      posts,
      fromCache:       false,
      lastSyncedAt:    ticket.lastSyncedAt,
      warning,
      cachedAnalysis:  analysis?.status === 'done' ? analysisToResult(analysis) : null,
      export:          exportRecord ? { status: exportRecord.status, createdAt: exportRecord.updatedAt.toISOString() } : null,
      analysisRuns,
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch ticket.' },
      { status: 502 }
    )
  }
}
