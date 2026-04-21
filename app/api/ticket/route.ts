import { NextResponse, type NextRequest } from 'next/server'

export const maxDuration = 60
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { KayakoClient, extractCaseId } from '@/lib/kayako/client'
import { fetchAndPersistTicket, dbTicketToRow, dbPostToUnified } from '@/lib/kayako/ticketService'

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
      return NextResponse.json({
        ticket:       dbTicketToRow(cached),
        posts:        cached.posts.map(dbPostToUnified),
        fromCache:    true,
        lastSyncedAt: cached.lastSyncedAt.toISOString(),
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
    return NextResponse.json({
      ticket,
      posts,
      fromCache:    false,
      lastSyncedAt: ticket.lastSyncedAt,
      warning,
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch ticket.' },
      { status: 502 }
    )
  }
}
