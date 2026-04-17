import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { analyseTicket } from '@/lib/anthropic/client'
import type { KayakoCase, KayakoPost, AnalysisSections } from '@/types/kayako'

export async function POST(request: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { caseId, caseData, posts, forceRefresh = false } = await request.json() as {
    caseId:       number
    caseData:     KayakoCase
    posts:        KayakoPost[]
    forceRefresh?: boolean
  }

  // ── Load settings ─────────────────────────────────────────────────────────
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

  // ── Cache check ───────────────────────────────────────────────────────────
  if (!forceRefresh) {
    const cached = await prisma.ticketAnalysis.findUnique({
      where: {
        userId_ticketId_kayakoUrl: {
          userId:    user.id,
          ticketId:  caseId,
          kayakoUrl: settings.kayakoUrl ?? '',
        },
      },
    })

    if (cached) {
      return NextResponse.json({
        sections:     cached.sections     as unknown as AnalysisSections,
        day_summaries: cached.daySummaries as unknown as Record<string, string>,
        model_used:   cached.modelUsed,
        post_count:   cached.postCount,
        created_at:   cached.createdAt.toISOString(),
        fromCache:    true,
      })
    }
  }

  // ── Decrypt API key ───────────────────────────────────────────────────────
  let apiKey: string
  try {
    apiKey = decrypt(settings.anthropicKeyEnc)
  } catch {
    return NextResponse.json({ error: 'Failed to decrypt Anthropic API key.' }, { status: 500 })
  }

  // ── Run analysis ──────────────────────────────────────────────────────────
  let result
  try {
    result = await analyseTicket(caseData, posts, apiKey)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'AI analysis failed.'
    return NextResponse.json({ error: msg }, { status: 502 })
  }

  // ── Save to cache ─────────────────────────────────────────────────────────
  await prisma.ticketAnalysis.upsert({
    where: {
      userId_ticketId_kayakoUrl: {
        userId:    user.id,
        ticketId:  caseId,
        kayakoUrl: settings.kayakoUrl ?? '',
      },
    },
    update: {
      sections:     result.sections     as object,
      daySummaries: result.day_summaries as object,
      modelUsed:    result.model_used,
      postCount:    result.post_count,
    },
    create: {
      userId:       user.id,
      ticketId:     caseId,
      kayakoUrl:    settings.kayakoUrl ?? '',
      sections:     result.sections     as object,
      daySummaries: result.day_summaries as object,
      modelUsed:    result.model_used,
      postCount:    result.post_count,
    },
  })

  return NextResponse.json({ ...result, fromCache: false })
}
