'use client'

import Link from 'next/link'
import { Settings, AlertTriangle } from 'lucide-react'

interface Props {
  missingKayako:    boolean
  missingAnthropic: boolean
}

export default function CredentialsBanner({ missingKayako, missingAnthropic }: Props) {
  if (!missingKayako && !missingAnthropic) return null

  const items: string[] = []
  if (missingKayako)    items.push('Kayako URL, email, and API password')
  if (missingAnthropic) items.push('Anthropic API key')

  return (
    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 mb-5">
      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-800">
          {items.length === 1 ? 'Credentials not configured' : 'Some credentials not configured'}
        </p>
        <p className="text-sm text-amber-700 mt-0.5">
          Please add your {items.join(' and ')} in Settings before continuing.
        </p>
      </div>
      <Link
        href="/settings"
        className="flex items-center gap-1.5 shrink-0 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-800 text-sm font-medium px-3 py-1.5 rounded-lg transition"
      >
        <Settings className="w-3.5 h-3.5" />
        Go to Settings
      </Link>
    </div>
  )
}
