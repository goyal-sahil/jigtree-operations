import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { KayakoClient } from '@/lib/kayako/client'
import { fetchAndPersistTicket } from '@/lib/kayako/ticketService'

export const maxDuration = 60

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const kayakoTicketId = parseInt(params.id, 10)
  if (isNaN(kayakoTicketId)) return NextResponse.json({ error: 'Invalid ticket ID' }, { status: 400 })

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
    const { ticket, posts, warning } = await fetchAndPersistTicket(
      kayakoTicketId, client, settings.kayakoUrl,
    )
    return NextResponse.json({
      ticket,
      posts,
      fromCache:    false,
      lastSyncedAt: ticket.lastSyncedAt,
      warning,
    })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to refresh ticket.' },
      { status: 502 }
    )
  }
}
