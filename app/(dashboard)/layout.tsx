import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import { TimezoneProvider } from '@/components/TimezoneProvider'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admins = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase())
  const isAdmin = admins.includes(user.email?.toLowerCase() ?? '')

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userEmail={user.email ?? ''} isAdmin={isAdmin} />
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <TimezoneProvider>
          {children}
        </TimezoneProvider>
      </main>
    </div>
  )
}
