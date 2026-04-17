import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import TicketAnalyser from '@/components/TicketAnalyser'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const settings = await prisma.userSettings.findUnique({
    where:  { userId: user.id },
    select: { kayakoUrl: true },
  })

  // First login — no credentials saved yet
  if (!settings?.kayakoUrl) redirect('/settings')

  return <TicketAnalyser />
}
