'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  normalizeModulePresetQueryString,
  parseModuleListSearchParams,
  serializeModuleListParams,
  urlSearchParamsToRecord,
} from './module-list-filters'
import { createModuleFilterPreset } from './module-filter-presets.actions'

type PresetOption = {
  id: string
  name: string
  queryString: string
  isDefault: boolean
  includeViewInIdentity: boolean
}

type Props = {
  userId: string
  moduleKey: string
  currentQueryString: string
  presets: PresetOption[]
}

export function ModuleFilterPresetsToolbar({
  userId,
  moduleKey,
  currentQueryString,
  presets,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState('')
  const [includeViewInIdentity, setIncludeViewInIdentity] = useState(false)

  const currentCanonicalIgnoringView = useMemo(
    () => normalizeModulePresetQueryString(currentQueryString, false),
    [currentQueryString]
  )
  const currentCanonicalWithView = useMemo(
    () => normalizeModulePresetQueryString(currentQueryString, true),
    [currentQueryString]
  )

  const activePreset = presets.find((p) => {
    const current = p.includeViewInIdentity ? currentCanonicalWithView : currentCanonicalIgnoringView
    return normalizeModulePresetQueryString(p.queryString, p.includeViewInIdentity) === current
  })

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        defaultValue=""
        onChange={(e) => {
          const id = e.target.value
          if (!id) return
          const preset = presets.find((p) => p.id === id)
          if (!preset) return
          router.push(preset.queryString ? `/your-module-route?${preset.queryString}` : '/your-module-route')
        }}
      >
        <option value="">Load preset...</option>
        {presets.map((p) => (
          <option key={p.id} value={p.id}>
            {p.isDefault ? `* ${p.name}` : p.name}
          </option>
        ))}
      </select>

      <input
        placeholder="Preset name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>
        <input
          type="checkbox"
          checked={includeViewInIdentity}
          onChange={(e) => setIncludeViewInIdentity(e.target.checked)}
        />
        Include layout/view in identity
      </label>

      <button
        type="button"
        disabled={isPending || !name.trim()}
        onClick={() => {
          startTransition(async () => {
            await createModuleFilterPreset({
              userId,
              module: moduleKey,
              name: name.trim(),
              queryString: currentQueryString,
              includeViewInIdentity,
            })
            setName('')
            router.refresh()
          })
        }}
      >
        Save current
      </button>

      {activePreset ? <span>Active: {activePreset.name}</span> : null}
    </div>
  )
}

// Optional helper for sort-link generation in your list header:
export function moduleSortHref(
  currentQueryString: string,
  sort: Parameters<typeof serializeModuleListParams>[0]['sort']
): string {
  const raw = urlSearchParamsToRecord(new URLSearchParams(currentQueryString))
  const f = parseModuleListSearchParams(raw)
  const qs = serializeModuleListParams({ ...f, sort, page: 1 })
  return qs ? `/your-module-route?${qs}` : '/your-module-route'
}
