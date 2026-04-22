import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { parseBuTicketsSearchParams, urlSearchParamsToRecord } from '@/lib/bu-tickets-list-filters'
import { fetchAllBuTickets } from '@/lib/bu-tickets-list-query'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const settings = await prisma.userSettings.findUnique({
    where:  { userId: user.id },
    select: { kayakoUrl: true },
  })
  const kayakoUrl = settings?.kayakoUrl ?? ''

  const filters = parseBuTicketsSearchParams(
    urlSearchParamsToRecord(req.nextUrl.searchParams as unknown as URLSearchParams),
  )

  const tickets = await fetchAllBuTickets(filters, user.id, kayakoUrl)
  return NextResponse.json({ tickets })
}
