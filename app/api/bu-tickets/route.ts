import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { dbTicketToRow } from '@/lib/kayako/ticketService'

function isAdmin(email: string | undefined): boolean {
  if (!email) return false
  const admins = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase())
  return admins.includes(email.toLowerCase())
}

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const settings = await prisma.userSettings.findUnique({
    where: { userId: user.id }, select: { kayakoUrl: true },
  })

  const rows = await prisma.ticket.findMany({
    where:   { isBuPs: true, kayakoUrl: settings?.kayakoUrl ?? '' },
    orderBy: { kayakoUpdatedAt: 'desc' },
    include: {
      analyses: {
        where:  { userId: user.id },
        select: { blockerType: true, oneLiner: true, updatedAt: true },
      },
    },
  })

  const lastSyncedAt = rows.length > 0
    ? rows.reduce((max, r) => r.lastSyncedAt > max ? r.lastSyncedAt : max, rows[0].lastSyncedAt).toISOString()
    : null

  return NextResponse.json({
    tickets: rows.map(r => {
      const a = r.analyses[0]
      return dbTicketToRow(r, { blockerType: a?.blockerType, oneLiner: a?.oneLiner, lastAnalysedAt: a?.updatedAt })
    }),
    lastSyncedAt,
  })
}

export async function DELETE(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!isAdmin(user.email)) return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 })

  const settings = await prisma.userSettings.findUnique({
    where: { userId: user.id }, select: { kayakoUrl: true },
  })

  const body = await request.json() as { ids?: string[]; all?: boolean }

  if (body.all) {
    const result = await prisma.ticket.deleteMany({
      where: { isBuPs: true, kayakoUrl: settings?.kayakoUrl ?? '' },
    })
    return NextResponse.json({ ok: true, deleted: result.count })
  }

  if (Array.isArray(body.ids) && body.ids.length > 0) {
    const result = await prisma.ticket.deleteMany({
      where: { id: { in: body.ids }, isBuPs: true },
    })
    return NextResponse.json({ ok: true, deleted: result.count })
  }

  return NextResponse.json({ error: 'Provide ids[] or all:true' }, { status: 400 })
}
