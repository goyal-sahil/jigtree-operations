import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import TicketAnalyser from '@/components/TicketAnalyser'

export default async function AnalyserPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const settings = await prisma.userSettings.findUnique({
    where:  { userId: user.id },
    select: { kayakoUrl: true },
  })

  if (!settings?.kayakoUrl) redirect('/settings')

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <TicketAnalyser />
    </div>
  )
}
