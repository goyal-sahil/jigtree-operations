'use client'

import { useState } from 'react'

interface AddNoteFormProps {
  caseId:    number
  onSuccess: () => void
}

export default function AddNoteForm({ caseId, onSuccess }: AddNoteFormProps) {
  const [text,    setText]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)

  async function submit() {
    if (!text.trim()) return
    setLoading(true)
    setError('')
    setSuccess(false)

    const resp = await fetch('/api/note', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ caseId, noteText: text }),
    })

    setLoading(false)

    if (!resp.ok) {
      const data = await resp.json()
      setError(data.error ?? 'Failed to post note.')
      return
    }

    setText('')
    setSuccess(true)
    onSuccess()
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">
        Posts an internal note to the ticket — <strong>not visible to the customer.</strong>
      </p>
      <textarea
        value={text}
        onChange={e => { setText(e.target.value); setSuccess(false) }}
        rows={6}
        placeholder="Type your internal note here…"
        className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
      />
      {error   && <p className="text-red-600 text-sm">❌ {error}</p>}
      {success && <p className="text-green-600 text-sm">✅ Note posted successfully.</p>}
      <button
        onClick={submit}
        disabled={loading || !text.trim()}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition"
      >
        {loading ? 'Posting…' : 'Post Internal Note'}
      </button>
    </div>
  )
}
