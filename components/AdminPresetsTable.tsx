'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { adminDeleteFilterPreset } from '@/app/actions/admin.actions'

interface PresetRow {
  id:         string
  userId:     string
  userEmail:  string
  name:       string
  visibility: 'PERSONAL' | 'SHARED'
  isDefault:  boolean
  createdAt:  string
}

export default function AdminPresetsTable({ presets }: { presets: PresetRow[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [loadingId,       setLoadingId]       = useState<string | null>(null)

  function handleDelete(id: string) {
    setLoadingId(id)
    startTransition(async () => {
      await adminDeleteFilterPreset(id)
      setDeleteConfirmId(null)
      setLoadingId(null)
      router.refresh()
    })
  }

  if (presets.length === 0) {
    return <p className="text-sm text-slate-400 py-8 text-center">No presets saved yet.</p>
  }

  // Group by user for readability
  const byUser = presets.reduce<Record<string, PresetRow[]>>((acc, p) => {
    (acc[p.userEmail] ??= []).push(p)
    return acc
  }, {})

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="text-left px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap">User</th>
            <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Preset Name</th>
            <th className="text-left px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap">Visibility</th>
            <th className="text-left px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap">Default</th>
            <th className="text-left px-4 py-2.5 font-semibold text-slate-600 whitespace-nowrap">Created</th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {Object.entries(byUser).flatMap(([email, rows], groupIdx) =>
            rows.map((p, rowIdx) => (
              <tr
                key={p.id}
                className={`border-b border-slate-100 ${(groupIdx + rowIdx) % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-blue-50 transition-colors`}
              >
                <td className="px-4 py-2.5 whitespace-nowrap">
                  {rowIdx === 0 && (
                    <span className="text-xs text-slate-700 font-medium">{email}</span>
                  )}
                </td>
                <td className="px-4 py-2.5 font-medium text-slate-800">{p.name}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium
                    ${p.visibility === 'SHARED'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'}`}
                  >
                    {p.visibility === 'SHARED' ? 'Shared' : 'Personal'}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center">
                  {p.isDefault && <span className="text-amber-500" title="Default preset">★</span>}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-slate-500 text-xs">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2.5 text-right whitespace-nowrap">
                  {deleteConfirmId === p.id ? (
                    <span className="inline-flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Delete?</span>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={isPending}
                        className="text-red-600 hover:text-red-800 font-semibold transition disabled:opacity-50"
                      >
                        {loadingId === p.id ? '…' : 'Yes'}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="text-slate-400 hover:text-slate-600 transition"
                      >
                        No
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      disabled={isPending}
                      className="text-xs text-slate-400 hover:text-red-500 transition disabled:opacity-40 px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
