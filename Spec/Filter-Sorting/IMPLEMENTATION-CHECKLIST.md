# Implementation Checklist

## 1) Database

- Add `FilterPreset` model (see `prisma-filter-presets-model.prisma`).
- Link preset rows to authenticated user (`userId` FK).
- Add uniqueness:
  - `@@unique([userId, module, name])`
  - one default per user/module (enforced in action transaction logic).

## 2) URL contract and types

- Define one typed filter object (`ModuleListFilters`).
- Include:
  - search (`q`)
  - multi-select arrays (repeated keys)
  - single-value enums
  - `sort`
  - `page`, `pageSize`
  - `view`
- Parse from `searchParams`.
- Serialize back to query string, omitting defaults.

## 3) Server query layer

- Add `buildWhereParts(filters)` for your schema.
- Add `orderByClause(sort)` allowlist.
- Add `fetchModuleIdsPage(...)`.
- Add deterministic tie-breaker sort (`id ASC`).

## 4) Filters UI

- Use `<form method="GET">`.
- Multi-select = repeated `name` checkboxes.
- Include hidden `page=1` when applying filter changes.
- Preserve non-filter values you need (for example `view`) with hidden inputs.

## 5) Preset actions (per-user)

- Use server actions to:
  - create
  - rename
  - delete
  - set default
  - clear default
- Always canonicalize incoming query string before storing.
- Wrap default updates in transaction.

## 6) Canonicalization behavior

- Canonicalization always resets `page=1`.
- Canonicalization includes or drops `view` depending on `includeViewInIdentity`.
- Matching active preset compares canonical current URL vs canonical preset URL.

## 7) Routing + links

- Pagination links must call serializer.
- Sort links must call serializer.
- "Clear filters" resets to route default while respecting view mode policy.

## 8) Validation + safety

- Validate all sort values against allowlist.
- Validate UUID params when relevant.
- Never directly interpolate user input into raw SQL.
- Keep server-only query file out of client imports.
