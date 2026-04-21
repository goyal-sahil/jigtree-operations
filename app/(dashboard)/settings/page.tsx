import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import SettingsForm from '@/components/SettingsForm'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const settings = await prisma.userSettings.findUnique({
    where:  { userId: user.id },
    select: { kayakoUrl: true, kayakoEmail: true, timezone: true },
  })

  const isFirstLogin = !settings?.kayakoUrl

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        {isFirstLogin ? '👋 Welcome — set up your credentials' : '⚙ Settings'}
      </h1>
      <p className="text-slate-500 text-sm mb-8">
        Credentials are encrypted with AES-256-GCM before being stored.
      </p>
      <SettingsForm
        initialKayakoUrl={settings?.kayakoUrl ?? ''}
        initialKayakoEmail={settings?.kayakoEmail ?? ''}
        initialTimezone={settings?.timezone ?? 'UTC'}
        isFirstLogin={isFirstLogin}
      />
    </div>
  )
}
