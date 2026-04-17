'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SettingsFormProps {
  initialKayakoUrl:   string
  initialKayakoEmail: string
  isFirstLogin:       boolean
}

export default function SettingsForm({
  initialKayakoUrl,
  initialKayakoEmail,
  isFirstLogin,
}: SettingsFormProps) {
  const router = useRouter()
  const [kayakoUrl,     setKayakoUrl]     = useState(initialKayakoUrl)
  const [kayakoEmail,   setKayakoEmail]   = useState(initialKayakoEmail)
  const [kayakoPass,    setKayakoPass]    = useState('')
  const [anthropicKey,  setAnthropicKey]  = useState('')
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState('')
  const [saved,         setSaved]         = useState(false)

  async function save() {
    setLoading(true)
    setError('')
    setSaved(false)

    const resp = await fetch('/api/settings', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kayako_url:      kayakoUrl.trim(),
        kayako_email:    kayakoEmail.trim(),
        kayako_password: kayakoPass,
        anthropic_key:   anthropicKey,
      }),
    })

    setLoading(false)

    if (!resp.ok) {
      const data = await resp.json()
      setError(data.error ?? 'Failed to save settings.')
      return
    }

    setSaved(true)
    if (isFirstLogin) {
      router.push('/')
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      {isFirstLogin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
          <strong>Welcome!</strong> Enter your Kayako and Anthropic credentials to get started.
          Credentials are encrypted before being stored.
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Kayako URL</label>
          <input
            type="url"
            value={kayakoUrl}
            onChange={e => setKayakoUrl(e.target.value)}
            placeholder="https://central-supportdesk.kayako.com"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Kayako Email</label>
          <input
            type="email"
            value={kayakoEmail}
            onChange={e => setKayakoEmail(e.target.value)}
            placeholder="you@aurea.com"
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Kayako API Password
          </label>
          <input
            type="password"
            value={kayakoPass}
            onChange={e => setKayakoPass(e.target.value)}
            placeholder={initialKayakoEmail ? '(leave blank to keep existing)' : 'Enter API password'}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-400 mt-1">Your Kayako API password — not your Google SSO password.</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Anthropic API Key
          </label>
          <input
            type="password"
            value={anthropicKey}
            onChange={e => setAnthropicKey(e.target.value)}
            placeholder={initialKayakoEmail ? '(leave blank to keep existing)' : 'sk-ant-…'}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-red-600 text-sm">❌ {error}</p>}
        {saved && !isFirstLogin && (
          <p className="text-green-600 text-sm">✅ Settings saved.</p>
        )}

        <button
          onClick={save}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-lg transition"
        >
          {loading ? 'Saving…' : isFirstLogin ? 'Save & Continue →' : 'Save Settings'}
        </button>

        {!isFirstLogin && (
          <button
            onClick={() => router.back()}
            className="w-full text-slate-500 hover:text-slate-700 text-sm py-2 transition"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  )
}
