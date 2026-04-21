import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const settings = await prisma.userSettings.findUnique({
    where:  { userId: user.id },
    select: { kayakoUrl: true, kayakoEmail: true, kayakoPasswordEnc: true, anthropicKeyEnc: true },
  })

  return NextResponse.json({
    hasKayako:    !!(settings?.kayakoUrl && settings.kayakoEmail && settings.kayakoPasswordEnc),
    hasAnthropic: !!settings?.anthropicKeyEnc,
  })
}
