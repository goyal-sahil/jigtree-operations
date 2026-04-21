'use client'

import type { ModuleListFilters } from './module-list-filters'

type Option = { id: string; label: string }

type Props = {
  filters: ModuleListFilters
  tagOptions: Option[]
}

export function ModuleFilters({ filters, tagOptions }: Props) {
  return (
    <form method="GET" className="space-y-3">
      <input type="hidden" name="page" value="1" />
      {filters.view === 'card' ? <input type="hidden" name="view" value="card" /> : null}

      <div>
        <label htmlFor="module-q">Search</label>
        <input id="module-q" name="q" defaultValue={filters.q} />
      </div>

      <fieldset>
        <legend>Tags (multi-select)</legend>
        {tagOptions.map((t) => (
          <label key={t.id} style={{ display: 'block' }}>
            <input
              type="checkbox"
              name="tag"
              value={t.id}
              defaultChecked={filters.tagIds.includes(t.id)}
            />
            {t.label}
          </label>
        ))}
      </fieldset>

      <div>
        <label htmlFor="module-status">Status</label>
        <select id="module-status" name="status" defaultValue={filters.status}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div>
        <label htmlFor="module-sort">Sort</label>
        <select id="module-sort" name="sort" defaultValue={filters.sort}>
          <option value="created_desc">Newest first</option>
          <option value="created_asc">Oldest first</option>
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
        </select>
      </div>

      <div>
        <label htmlFor="module-per-page">Rows</label>
        <select id="module-per-page" name="per_page" defaultValue={String(filters.pageSize)}>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>

      <button type="submit">Apply filters</button>
    </form>
  )
}
