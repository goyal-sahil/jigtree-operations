import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { KayakoClient, textToHtml } from '@/lib/kayako/client'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { caseId, noteText } = await request.json() as { caseId: number; noteText: string }

  if (!noteText?.trim()) {
    return NextResponse.json({ error: 'Note text is required.' }, { status: 400 })
  }

  const settings = await prisma.userSettings.findUnique({
    where:  { userId: user.id },
    select: { kayakoUrl: true, kayakoEmail: true, kayakoPasswordEnc: true },
  })

  if (!settings?.kayakoPasswordEnc || !settings.kayakoUrl || !settings.kayakoEmail) {
    return NextResponse.json(
      { error: 'Kayako credentials not configured.' },
      { status: 400 }
    )
  }

  let password: string
  try {
    password = decrypt(settings.kayakoPasswordEnc)
  } catch {
    return NextResponse.json({ error: 'Failed to decrypt credentials.' }, { status: 500 })
  }

  const client = new KayakoClient(settings.kayakoUrl)
  try {
    await client.authenticate(settings.kayakoEmail, password)
    await client.addNote(caseId, textToHtml(noteText))
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to post note.'
    return NextResponse.json({ error: msg }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
