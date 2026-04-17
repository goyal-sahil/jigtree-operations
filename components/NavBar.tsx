'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NavBarProps {
  userEmail: string
}

export default function NavBar({ userEmail }: NavBarProps) {
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="bg-slate-900 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xl">🎫</span>
        <div>
          <h1 className="text-white font-bold text-sm leading-none">BU Support Analyser</h1>
          <p className="text-slate-400 text-xs mt-0.5">AI-powered Analysis</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/settings')}
          className="text-slate-400 hover:text-white text-sm transition"
        >
          ⚙ Settings
        </button>
        <span className="text-slate-500 text-sm">{userEmail}</span>
        <button
          onClick={signOut}
          className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-3 py-1.5 rounded-lg transition"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
