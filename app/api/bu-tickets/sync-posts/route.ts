import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { KayakoClient } from '@/lib/kayako/client'
import { fetchAndPersistTicket } from '@/lib/kayako/ticketService'
import { prisma } from '@/lib/prisma'

const TICKETS_PER_RUN = 10

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const settings = await prisma.userSettings.findUnique({
    where:  { userId: user.id },
    select: { kayakoUrl: true, kayakoEmail: true, kayakoPasswordEnc: true },
  })

  if (!settings?.kayakoPasswordEnc || !settings.kayakoUrl || !settings.kayakoEmail) {
    return NextResponse.json({ error: 'Kayako credentials not configured.' }, { status: 400 })
  }

  let password: string
  try {
    password = decrypt(settings.kayakoPasswordEnc)
  } catch {
    return NextResponse.json({ error: 'Failed to decrypt credentials.' }, { status: 500 })
  }

  const client = new KayakoClient(settings.kayakoUrl, request.signal)
  try {
    await client.authenticate(settings.kayakoEmail, password)
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Kayako authentication failed' },
      { status: 502 },
    )
  }

  // Find BU/PS tickets that need a full fetch
  const tickets = await prisma.ticket.findMany({
    where:   { isBuPs: true, kayakoUrl: settings.kayakoUrl, postsStatus: { not: 'done' } },
    select:  { id: true, kayakoTicketId: true },
    orderBy: { kayakoUpdatedAt: 'desc' },
    take:    TICKETS_PER_RUN,
  })

  if (tickets.length === 0) {
    return NextResponse.json({ ok: true, processed: 0, message: 'All posts already synced' })
  }

  let processed = 0
  let failed = 0

  for (const ticket of tickets) {
    if (request.signal.aborted) break
    try {
      await prisma.ticket.update({ where: { id: ticket.id }, data: { postsStatus: 'fetching' } })
      // Single shared code path — same as individual Refresh button
      await fetchAndPersistTicket(ticket.kayakoTicketId, client, settings.kayakoUrl)
      processed++
    } catch (err) {
      console.error(`[sync-posts] Failed ticket ${ticket.kayakoTicketId}:`, err instanceof Error ? err.message : err)
      await prisma.ticket.update({ where: { id: ticket.id }, data: { postsStatus: 'error' } }).catch(() => null)
      failed++
    }
  }

  return NextResponse.json({ ok: true, processed, failed, total: tickets.length })
}
