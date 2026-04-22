'use client'

/**
 * ModuleFilters — search bar + collapsible filter panel + preset management.
 * Replace Module/module with your feature name throughout.
 *
 * Requires: npm install nprogress @types/nprogress
 * Add NProgress CSS once in your root layout:
 *   import 'nprogress/nprogress.css'
 */

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import {
  type ModuleListFilters,
  type FilterOptions,       // TODO: import from your module-list-filters
  serializeModuleParams,
  countActiveFilters,
  moduleFilterSignature,
  urlSearchParamsToRecord,
} from '@/lib/module-list-filters'
import {
  fetchPresetsForUser,
  createModuleFilterPreset,
  deleteModuleFilterPreset,
  setDefaultModuleFilterPreset,
  clearDefaultModuleFilterPreset,
  updateModuleFilterPresetFilters,
  toggleModuleFilterPresetVisibility,
} from '@/app/actions/module-filter-presets.actions'

// TODO: replace with your actual FilterOptions shape
type FilterOptionsType = {
  statuses:   string[]
  priorities: string[]
}

type Preset = {
  id:         string
  name:       string
  filtersJson: string
  isDefault:  boolean
  visibility: 'PERSONAL' | 'SHARED'
  userId:     string
}

interface Props {
  filters:   ModuleListFilters
  options:   FilterOptionsType
  currentQS: string
  presets:   Preset[]
  userId:    string
}

export default function ModuleFilters({ filters, options, currentQS, presets, userId }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  // NProgress — complete bar when URL actually changes
  const lastSpRef = useRef(searchParams.toString())
  useEffect(() => {
    const cur = searchParams.toString()
    if (cur !== lastSpRef.current) {
      lastSpRef.current = cur
      NProgress.done()
    }
  }, [searchParams])

  function navigate(url: string) {
    NProgress.start()
    router.push(url)
  }

  // ---------------------------------------------------------------------------
  // Search (debounced, stale-closure-safe)
  // ---------------------------------------------------------------------------
  const [searchInput, setSearchInput]  = useState(filters.search ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleSearchChange(value: string) {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const sp = new URLSearchParams(searchParams.toString())
      if (value.trim()) sp.set('search', value.trim())
      else              sp.delete('search')
      sp.set('page', '1')
      navigate(`?${sp.toString()}`)
    }, 350)
  }

  // ---------------------------------------------------------------------------
  // Draft state (checkboxes don't navigate until Apply)
  // ---------------------------------------------------------------------------
  const [draft, setDraft] = useState<Partial<ModuleListFilters>>({ ...filters })

  const paramsSig = serializeModuleParams(filters).toString()
  useEffect(() => {
    setDraft({ ...filters })
    setSearchInput(filters.search ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsSig])

  function toggleDraftArray(key: keyof ModuleListFilters, value: string) {
    setDraft(prev => {
      const arr = (prev[key] as string[] | undefined) ?? []
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      }
    })
  }

  // ---------------------------------------------------------------------------
  // Panel open state
  // ---------------------------------------------------------------------------
  const activeFilterCount = countActiveFilters(filters)
  const [panelOpen, setPanelOpen] = useState(activeFilterCount > 0)

  // ---------------------------------------------------------------------------
  // Preset actions
  // ---------------------------------------------------------------------------
  const [isPending, startTransition] = useTransition()
  const [loadingId,  setLoadingId]   = useState<string | null>(null)

  // Save new preset
  const [saveOpen,      setSaveOpen]      = useState(false)
  const [presetName,    setPresetName]    = useState('')
  const [presetVis,     setPresetVis]     = useState<'PERSONAL' | 'SHARED'>('PERSONAL')

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  function withLoading(id: string, fn: () => Promise<void>) {
    setLoadingId(id)
    startTransition(async () => {
      await fn()
      setLoadingId(null)
    })
  }

  // Active own preset (for "Update" button)
  const draftSig        = moduleFilterSignature({ ...filters, ...draft } as ModuleListFilters)
  const activeOwnPreset = presets.find(p => p.userId === userId && p.filtersJson === currentQS)
  const canUpdatePreset = !!activeOwnPreset && draftSig !== activeOwnPreset.filtersJson

  // Default sort URL for "Clear all"
  const defaultUrl = '?sortField=updatedAt&sortDir=desc'

  return (
    <div className="space-y-2">
      {/* Search bar — always visible */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchInput}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder="Search…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          {searchInput && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >×</button>
          )}
        </div>

        {/* Toggle filter panel */}
        <button
          onClick={() => setPanelOpen(o => !o)}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border transition
            ${panelOpen
              ? 'bg-blue-600 text-white border-blue-600'
              : activeFilterCount > 0
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
        >
          Filters
          {activeFilterCount > 0 && (
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full
              ${panelOpen ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}`}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Preset pills */}
      {presets.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {presets.map(preset => {
            const isActive = preset.filtersJson === currentQS
            const isOwn    = preset.userId === userId
            const isShared = preset.visibility === 'SHARED'
            return (
              <button
                key={preset.id}
                onClick={() => navigate(`?${preset.filtersJson}`)}
                disabled={isPending}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full border transition text-xs
                  ${isActive
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
              >
                {preset.isDefault && isOwn && <span>★</span>}
                {preset.name}
                {!isOwn && isShared && (
                  <span className={`text-[10px] px-1 rounded ${isActive ? 'bg-blue-500' : 'bg-slate-100 text-slate-500'}`}>
                    Shared
                  </span>
                )}
              </button>
            )
          })}

          {/* Clear all (inline with presets) */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => navigate(defaultUrl)}
              className="text-xs text-slate-400 hover:text-red-500 transition px-1"
            >
              Clear all ✕
            </button>
          )}
        </div>
      )}

      {/* Collapsible filter panel */}
      {panelOpen && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {/* Status */}
            <ScrollableCheckboxGroup
              label="Status"
              options={options.statuses}
              selected={draft.status ?? []}
              onToggle={v => toggleDraftArray('status', v)}
              onAll={()  => setDraft(p => ({ ...p, status: options.statuses }))}
              onNone={()  => setDraft(p => ({ ...p, status: [] }))}
            />

            {/* Priority */}
            <ScrollableCheckboxGroup
              label="Priority"
              options={options.priorities}
              selected={draft.priority ?? []}
              onToggle={v => toggleDraftArray('priority', v)}
              onAll={()  => setDraft(p => ({ ...p, priority: options.priorities }))}
              onNone={()  => setDraft(p => ({ ...p, priority: [] }))}
            />

            {/* TODO: add more filter groups here */}
          </div>

          {/* Apply / Clear row */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('?' + serializeModuleParams({ ...filters, ...draft as ModuleListFilters, page: 1 }).toString())}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition"
              >
                Apply Filters
              </button>
              {canUpdatePreset && (
                <button
                  onClick={() => withLoading(activeOwnPreset.id, () =>
                    updateModuleFilterPresetFilters(activeOwnPreset.id, draftSig)
                  )}
                  disabled={isPending}
                  className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition disabled:opacity-60"
                >
                  {loadingId === activeOwnPreset.id ? <MiniSpinner /> : <>Update &apos;{activeOwnPreset.name}&apos;</>}
                </button>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={() => navigate(defaultUrl)}
                className="text-xs text-slate-400 hover:text-red-500 transition"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Save + Manage presets */}
          <div className="pt-2 border-t border-slate-200 space-y-2">
            {/* Save preset */}
            {saveOpen ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={presetName}
                  onChange={e => setPresetName(e.target.value)}
                  placeholder="Preset name"
                  className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={presetVis === 'SHARED'}
                    onChange={e => setPresetVis(e.target.checked ? 'SHARED' : 'PERSONAL')}
                    className="rounded border-slate-300"
                  />
                  Shared
                </label>
                <button
                  onClick={() => {
                    if (!presetName.trim()) return
                    startTransition(async () => {
                      await createModuleFilterPreset(presetName.trim(), currentQS, presetVis)
                      setPresetName('')
                      setSaveOpen(false)
                    })
                  }}
                  disabled={isPending || !presetName.trim()}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition disabled:opacity-60"
                >
                  Save
                </button>
                <button onClick={() => setSaveOpen(false)} className="text-xs text-slate-400 hover:text-slate-600 transition">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => setSaveOpen(true)}
                className="text-xs text-blue-600 hover:text-blue-700 transition"
              >
                + Save current filters as preset
              </button>
            )}

            {/* Manage own presets */}
            {presets.filter(p => p.userId === userId).length > 0 && (
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Your presets</p>
                {presets.filter(p => p.userId === userId).map(preset => (
                  <div key={preset.id} className="flex items-center gap-2 text-xs">
                    <span className="flex-1 truncate text-slate-700">{preset.name}</span>

                    {/* Star default */}
                    <button
                      onClick={() => withLoading(`star-${preset.id}`,
                        () => preset.isDefault
                          ? clearDefaultModuleFilterPreset()
                          : setDefaultModuleFilterPreset(preset.id)
                      )}
                      disabled={isPending}
                      title={preset.isDefault ? 'Remove default' : 'Set as default'}
                      className={`transition ${preset.isDefault ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'}`}
                    >
                      {loadingId === `star-${preset.id}` ? <MiniSpinner /> : '★'}
                    </button>

                    {/* Visibility toggle */}
                    <button
                      onClick={() => withLoading(`vis-${preset.id}`, () => toggleModuleFilterPresetVisibility(preset.id))}
                      disabled={isPending}
                      title={preset.visibility === 'SHARED' ? 'Make private' : 'Share with everyone'}
                      className={`text-[11px] px-1.5 py-0.5 rounded border transition
                        ${preset.visibility === 'SHARED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      {loadingId === `vis-${preset.id}` ? <MiniSpinner /> : preset.visibility === 'SHARED' ? 'Shared' : 'Private'}
                    </button>

                    {/* Delete */}
                    {deleteConfirmId === preset.id ? (
                      <span className="flex items-center gap-1">
                        <span className="text-slate-500">Delete?</span>
                        <button
                          onClick={() => {
                            setDeleteConfirmId(null)
                            withLoading(`del-${preset.id}`, () => deleteModuleFilterPreset(preset.id))
                          }}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >Yes</button>
                        <span className="text-slate-300">/</span>
                        <button onClick={() => setDeleteConfirmId(null)} className="text-slate-500 hover:text-slate-700">No</button>
                      </span>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(preset.id)}
                        disabled={isPending}
                        className="text-slate-300 hover:text-red-500 transition disabled:opacity-40"
                      >
                        {loadingId === `del-${preset.id}` ? <MiniSpinner /> : '✕'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

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
          <button onClick={onAll}  className="hover:text-blue-600 transition">All</button>
          <span>·</span>
          <button onClick={onNone} className="hover:text-blue-600 transition">None</button>
        </div>
      </div>
      <div className="max-h-36 overflow-y-auto flex flex-col gap-1 pr-0.5">
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
    <svg className="w-3 h-3 animate-spin inline-block" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l-3 3H4z" />
    </svg>
  )
}
