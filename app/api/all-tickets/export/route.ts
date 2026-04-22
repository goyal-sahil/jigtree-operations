import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { parseAllTicketsSearchParams } from '@/lib/all-tickets-list-filters'
import { fetchAllTicketsForExport } from '@/lib/all-tickets-list-query'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const settings = await prisma.userSettings.findUnique({
    where:  { userId: user.id },
    select: { kayakoUrl: true },
  })
  const kayakoUrl = settings?.kayakoUrl ?? ''

  const sp      = request.nextUrl.searchParams
  const record: Record<string, string | string[]> = {}
  for (const key of new Set(sp.keys())) {
    const vals = sp.getAll(key)
    record[key] = vals.length === 1 ? vals[0] : vals
  }

  const filters = parseAllTicketsSearchParams(record)
  const tickets = await fetchAllTicketsForExport(filters, user.id, kayakoUrl)

  return NextResponse.json({ tickets })
}
