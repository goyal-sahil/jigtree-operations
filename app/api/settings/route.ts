import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { encrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as {
    kayako_url:       string
    kayako_email:     string
    kayako_password?: string
    anthropic_key?:   string
    timezone?:        string
  }

  const payload: {
    kayakoUrl:         string | null
    kayakoEmail:       string | null
    timezone:          string
    kayakoPasswordEnc?: string
    anthropicKeyEnc?:   string
  } = {
    kayakoUrl:   body.kayako_url?.trim()   || null,
    kayakoEmail: body.kayako_email?.trim() || null,
    timezone:    body.timezone?.trim()     || 'UTC',
  }

  if (body.kayako_password?.trim()) {
    payload.kayakoPasswordEnc = encrypt(body.kayako_password.trim())
  }
  if (body.anthropic_key?.trim()) {
    payload.anthropicKeyEnc = encrypt(body.anthropic_key.trim())
  }

  await prisma.userSettings.upsert({
    where:  { userId: user.id },
    update: payload,
    create: { userId: user.id, ...payload },
  })

  return NextResponse.json({ ok: true })
}

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const settings = await prisma.userSettings.findUnique({
    where:  { userId: user.id },
    select: { kayakoUrl: true, kayakoEmail: true, timezone: true },
  })

  return NextResponse.json(settings ?? { timezone: 'UTC' })
}
