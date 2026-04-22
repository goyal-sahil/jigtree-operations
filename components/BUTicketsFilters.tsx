'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import {
  serializeBuTicketsParams,
  countActiveFilters,
  buTicketsFilterSignature,
  type BuTicketsListFilters,
  type AgeRisk,
} from '@/lib/bu-tickets-list-filters'
import type { FilterOptions } from '@/lib/bu-tickets-list-query'
import type { FilterPresetRow } from '@/app/actions/bu-ticket-filter-presets.actions'
import {
  createBuTicketFilterPreset,
  deleteBuTicketFilterPreset,
  setDefaultBuTicketFilterPreset,
  clearDefaultBuTicketFilterPreset,
  updateBuTicketFilterPresetFilters,
  toggleBuTicketFilterPresetVisibility,
} from '@/app/actions/bu-ticket-filter-presets.actions'

interface Props {
  filters:   BuTicketsListFilters
  options:   FilterOptions
  currentQS: string
  presets:   FilterPresetRow[]
  userId:    string
}

const AGE_RISK_LABELS: Record<AgeRisk, string> = {
  at_risk: 'AT RISK (≥30d)',
  watch:   'WATCH (20–30d)',
  ok:      'OK (<20d)',
}

const SEARCH_DEBOUNCE_MS = 350

export default function BUTicketsFilters({ filters, options, currentQS, presets, userId }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  // ── NProgress: stop when the URL actually changes (navigation complete) ─────
  const lastSpRef = useRef(searchParams.toString())
  useEffect(() => {
    const cur = searchParams.toString()
    if (cur !== lastSpRef.current) {
      lastSpRef.current = cur
      NProgress.done()
    }
  }, [searchParams])

  // Wrapper for all filter navigations — starts the progress bar immediately
  function navigate(url: string) {
    NProgress.start()
    router.push(url)
  }

  // ── Search ─────────────────────────────────────────────────────────────────
  const [searchInput, setSearchInput] = useState(filters.search ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSearchChange(value: string) {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const p = new URLSearchParams(searchParams.toString())
      if (value.trim()) p.set('search', value.trim())
      else              p.delete('search')
      p.set('page', '1')
      navigate(`?${p.toString()}`)
    }, SEARCH_DEBOUNCE_MS)
  }

  // ── Draft state ─────────────────────────────────────────────────────────────
  const [draft, setDraft] = useState<BuTicketsListFilters>({ ...filters })
  const paramsSig = serializeBuTicketsParams(filters).toString()
  useEffect(() => {
    setDraft({ ...filters })
    setSearchInput(filters.search ?? '')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsSig])

  // ── Expanded ────────────────────────────────────────────────────────────────
  const [expanded, setExpanded] = useState(() => countActiveFilters(filters) > 0)

  // ── Preset save dialog ──────────────────────────────────────────────────────
  const [saveOpen,   setSaveOpen]   = useState(false)
  const [saveName,   setSaveName]   = useState('')
  const [saveShared, setSaveShared] = useState(false)
  const [isPending,  startTransition] = useTransition()

  // ── Per-item loading state (for spinner on clicked button) ──────────────────
  const [loadingId, setLoadingId] = useState<string | null>(null)

  // ── Preset delete confirmation ──────────────────────────────────────────────
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const activeCount    = countActiveFilters(filters)
  const ownPresets     = presets.filter(p => p.userId === userId)

  // ── Update current preset detection ────────────────────────────────────────
  const draftSig        = buTicketsFilterSignature(draft)
  const activeOwnPreset = ownPresets.find(p => p.filtersJson === currentQS)
  const canUpdatePreset = !!activeOwnPreset && draftSig !== currentQS

  function applyDraft() {
    navigate(`?${serializeBuTicketsParams({ ...draft, page: 1 }).toString()}`)
  }

  function clearAll() {
    setSearchInput('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    navigate('?sortField=kayakoUpdatedAt&sortDir=desc')
  }

  function toggleMulti(key: 'status' | 'priority' | 'team' | 'product' | 'blockerType' | 'ageRisk', value: string) {
    setDraft(prev => {
      const arr  = (prev[key] as string[] | undefined) ?? []
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
      return { ...prev, [key]: next.length > 0 ? next : undefined }
    })
  }

  function selectAll(key: 'status' | 'priority' | 'team' | 'product' | 'blockerType' | 'ageRisk', allValues: string[]) {
    setDraft(prev => ({ ...prev, [key]: [...allValues] }))
  }

  function selectNone(key: 'status' | 'priority' | 'team' | 'product' | 'blockerType' | 'ageRisk') {
    setDraft(prev => ({ ...prev, [key]: undefined }))
  }

  function handleSavePreset() {
    if (!saveName.trim()) return
    startTransition(async () => {
      await createBuTicketFilterPreset(saveName.trim(), currentQS, saveShared ? 'SHARED' : 'PERSONAL')
      setSaveOpen(false)
      setSaveName('')
      router.refresh()
    })
  }

  function handleSetDefault(id: string, isDefault: boolean) {
    setLoadingId(id)
    startTransition(async () => {
      if (isDefault) await clearDefaultBuTicketFilterPreset()
      else           await setDefaultBuTicketFilterPreset(id)
      router.refresh()
      setLoadingId(null)
    })
  }

  function handleDeletePreset(id: string) {
    setLoadingId(id)
    startTransition(async () => {
      await deleteBuTicketFilterPreset(id)
      setDeleteConfirmId(null)
      setLoadingId(null)
      router.refresh()
    })
  }

  function handleToggleVisibility(id: string) {
    setLoadingId(id)
    startTransition(async () => {
      await toggleBuTicketFilterPresetVisibility(id)
      setLoadingId(null)
      router.refresh()
    })
  }

  function handleUpdatePreset() {
    if (!activeOwnPreset) return
    startTransition(async () => {
      await updateBuTicketFilterPresetFilters(activeOwnPreset.id, draftSig)
      navigate(`?${draftSig}`)
    })
  }

  return (
    <div className="mb-4">

      {/* ── Search ── */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Search</label>
        <input
          type="text"
          value={searchInput}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder="ID, title, customer, brand…"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ── Filter toggle + preset pills + clear + save ── */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition shrink-0"
        >
          <span>{expanded ? '▾' : '▸'} Filters</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
              {activeCount} active
            </span>
          )}
        </button>

        {presets.map(preset => {
          const isActive = preset.filtersJson === currentQS
          return (
            <button
              key={preset.id}
              onClick={() => navigate(`?${preset.filtersJson}`)}
              title={preset.visibility === 'SHARED' ? 'Shared preset' : 'Your preset'}
              className={`
                inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition
                ${isActive
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:text-blue-600'}
              `}
            >
              {preset.isDefault && <span title="Default">★</span>}
              {preset.name}
              {preset.visibility === 'SHARED' && preset.userId !== userId && (
                <span className="opacity-50 text-[10px]">shared</span>
              )}
            </button>
          )
        })}

        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs text-slate-400 hover:text-slate-600 transition underline shrink-0">
            Clear all
          </button>
        )}

        {!saveOpen && <span className="text-slate-200 text-xs select-none">|</span>}

        {!saveOpen ? (
          <button
            onClick={() => { setSaveOpen(true); setSaveName('') }}
            className="text-xs text-slate-400 hover:text-blue-500 transition"
            title="Save current filters as a preset"
          >
            + Save preset
          </button>
        ) : (
          <div className="flex items-center gap-1.5 flex-wrap">
            <input
              type="text"
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSavePreset(); if (e.key === 'Escape') setSaveOpen(false) }}
              placeholder="Preset name"
              autoFocus
              className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 w-32"
            />
            <label className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={saveShared}
                onChange={e => setSaveShared(e.target.checked)}
                className="rounded border-slate-300"
              />
              Share
            </label>
            <button
              onClick={handleSavePreset}
              disabled={isPending || !saveName.trim()}
              className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded hover:bg-blue-700 disabled:opacity-50 transition"
            >
              Save
            </button>
            <button onClick={() => setSaveOpen(false)} className="text-xs text-slate-400 hover:text-slate-600 transition">✕</button>
          </div>
        )}
      </div>

      {/* ── Collapsible filter panel ── */}
      {expanded && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

            {options.statuses.length > 0 && (
              <ScrollableCheckboxGroup
                label="Status" options={options.statuses} selected={draft.status ?? []}
                onToggle={v => toggleMulti('status', v)}
                onAll={() => selectAll('status', options.statuses)}
                onNone={() => selectNone('status')}
              />
            )}

            {options.priorities.length > 0 && (
              <ScrollableCheckboxGroup
                label="Priority" options={options.priorities} selected={draft.priority ?? []}
                onToggle={v => toggleMulti('priority', v)}
                onAll={() => selectAll('priority', options.priorities)}
                onNone={() => selectNone('priority')}
              />
            )}

            {options.teams.length > 0 && (
              <ScrollableCheckboxGroup
                label="Team" options={options.teams} selected={draft.team ?? []}
                onToggle={v => toggleMulti('team', v)}
                onAll={() => selectAll('team', options.teams)}
                onNone={() => selectNone('team')}
              />
            )}

            {options.products.length > 0 && (
              <ScrollableCheckboxGroup
                label="Product" options={options.products} selected={draft.product ?? []}
                onToggle={v => toggleMulti('product', v)}
                onAll={() => selectAll('product', options.products)}
                onNone={() => selectNone('product')}
              />
            )}

            {options.blockerTypes.length > 0 && (
              <ScrollableCheckboxGroup
                label="Blocker Type" options={options.blockerTypes} selected={draft.blockerType ?? []}
                onToggle={v => toggleMulti('blockerType', v)}
                onAll={() => selectAll('blockerType', options.blockerTypes)}
                onNone={() => selectNone('blockerType')}
              />
            )}

            <ScrollableCheckboxGroup
              label="Age Risk"
              options={['at_risk', 'watch', 'ok'] as AgeRisk[]}
              selected={draft.ageRisk ?? []}
              onToggle={v => toggleMulti('ageRisk', v)}
              onAll={() => selectAll('ageRisk', ['at_risk', 'watch', 'ok'])}
              onNone={() => selectNone('ageRisk')}
              labelFn={v => AGE_RISK_LABELS[v as AgeRisk] ?? v}
            />

            <div className="border border-slate-200 rounded-lg bg-white p-3">
              <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Escalated</p>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!draft.isEscalated}
                  onChange={e => setDraft(d => ({ ...d, isEscalated: e.target.checked || undefined }))}
                  className="rounded border-slate-300"
                />
                Escalated only
              </label>
            </div>
          </div>

          {/* Apply / Update preset / Clear */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200 flex-wrap">
            <button
              onClick={applyDraft}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Apply Filters
            </button>
            {canUpdatePreset && (
              <button
                onClick={handleUpdatePreset}
                disabled={isPending}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                title={`Overwrite "${activeOwnPreset!.name}" with the current draft`}
              >
                Update &ldquo;{activeOwnPreset!.name}&rdquo;
              </button>
            )}
            {activeCount > 0 && (
              <button onClick={clearAll} className="text-sm text-slate-500 hover:text-slate-700 transition underline">
                Clear all
              </button>
            )}
          </div>

          {/* Manage own presets */}
          {ownPresets.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Manage presets</p>
              <div className="flex flex-wrap gap-2">
                {ownPresets.map(p => {
                  const isLoading = loadingId === p.id
                  return (
                    <div
                      key={p.id}
                      className="flex items-center gap-1.5 text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                    >
                      <span className="font-medium text-slate-700">{p.name}</span>

                      {/* Visibility toggle */}
                      <button
                        onClick={() => handleToggleVisibility(p.id)}
                        disabled={isPending}
                        title={p.visibility === 'SHARED' ? 'Click to make private' : 'Click to share with team'}
                        className={`text-[10px] px-1.5 py-0.5 rounded border transition
                          ${p.visibility === 'SHARED'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-slate-50 hover:text-slate-500 hover:border-slate-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
                          }`}
                      >
                        {isLoading && loadingId === p.id ? (
                          <MiniSpinner />
                        ) : (
                          p.visibility === 'SHARED' ? 'Shared' : 'Private'
                        )}
                      </button>

                      {/* Set default star */}
                      <button
                        onClick={() => handleSetDefault(p.id, p.isDefault)}
                        disabled={isPending}
                        title={p.isDefault ? 'Remove default' : 'Set as default'}
                        className={`transition ml-0.5 ${p.isDefault ? 'text-amber-500 hover:text-slate-400' : 'text-slate-300 hover:text-amber-500'}`}
                      >
                        {isLoading ? <MiniSpinner /> : '★'}
                      </button>

                      {/* Delete with inline confirmation */}
                      {deleteConfirmId === p.id ? (
                        <span className="flex items-center gap-1 ml-0.5">
                          <span className="text-slate-500">Delete?</span>
                          <button
                            onClick={() => handleDeletePreset(p.id)}
                            disabled={isPending}
                            className="text-red-500 hover:text-red-700 font-medium transition"
                          >
                            {isLoading ? <MiniSpinner /> : 'Yes'}
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
                          className="text-slate-300 hover:text-red-500 transition ml-0.5"
                          title="Delete preset"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Scrollable checkbox group ─────────────────────────────────────────────────

function ScrollableCheckboxGroup({
  label, options, selected, onToggle, onAll, onNone, labelFn,
}: {
  label:    string
  options:  string[]
  selected: string[]
  onToggle: (v: string) => void
  onAll:    () => void
  onNone:   () => void
  labelFn?: (v: string) => string
}) {
  return (
    <div className="border border-slate-200 rounded-lg bg-white p-3">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <button onClick={onAll} className="hover:text-blue-600 transition" title={`Select all ${label}`}>All</button>
          <span>·</span>
          <button onClick={onNone} className="hover:text-blue-600 transition" title={`Clear ${label}`}>None</button>
        </div>
      </div>
      <div className="max-h-36 overflow-y-auto flex flex-col gap-1 pr-1
                      scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
              className="rounded border-slate-300 shrink-0"
            />
            <span className="truncate">{labelFn ? labelFn(opt) : opt}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

function MiniSpinner() {
  return (
    <svg className="w-3 h-3 animate-spin inline" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l-3 3H4z" />
    </svg>
  )
}
