import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'
import { KayakoClient, extractCaseId } from '@/lib/kayako/client'
import type { KayakoUser } from '@/types/kayako'

export async function POST(request: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // ── Load settings ─────────────────────────────────────────────────────────
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

  // ── Parse ticket input ────────────────────────────────────────────────────
  const { ticketInput } = await request.json() as { ticketInput: string }
  const caseId = extractCaseId(ticketInput)
  if (!caseId) {
    return NextResponse.json({ error: 'Invalid ticket URL or ID.' }, { status: 400 })
  }

  // ── Decrypt + authenticate ────────────────────────────────────────────────
  let password: string
  try {
    password = decrypt(settings.kayakoPasswordEnc)
  } catch {
    return NextResponse.json({ error: 'Failed to decrypt credentials.' }, { status: 500 })
  }

  const client = new KayakoClient(settings.kayakoUrl)
  try {
    await client.authenticate(settings.kayakoEmail, password)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Kayako authentication failed.'
    return NextResponse.json({ error: msg }, { status: 502 })
  }

  // ── Fetch ticket + posts ──────────────────────────────────────────────────
  try {
    const caseResp = await client.getCase(caseId)
    const caseData = caseResp.data

    const { posts, warning } = await client.getAllPosts(caseId)

    const seedUsers = [caseData.requester, caseData.assigned_agent].filter(
      (u): u is KayakoUser => u != null
    )
    const enrichedPosts = await client.resolveUsers(posts, seedUsers)

    return NextResponse.json({ caseData, posts: enrichedPosts, warning, caseId })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch ticket.'
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
