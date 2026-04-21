# Filter + Sorting Blueprint (Next.js + Prisma)

This folder is a drop-in starter pack to implement URL-driven filtering, server sorting, and per-user saved presets in another Next.js + Prisma app.

## Goal

Implement a list page where:

- URL is the source of truth for filters/sort/page/view.
- Filters are shareable/bookmarkable.
- Sorting is validated via allowlist (safe and deterministic).
- Saved presets are scoped per logged-in user.
- Preset identity can include or ignore `view` based on user preference.

## Architecture (4 layers)

1. `lib/<module>-list-filters.ts`
   - Client-safe type definitions + parse/serialize/canonicalize helpers.
2. `lib/<module>-list-query.ts`
   - Server-only query builder (`WHERE`, `ORDER BY`, paging).
3. `app/actions/<module>-filter-presets.ts`
   - CRUD + default preset actions for per-user preset storage.
4. UI components
   - GET-based filter form + presets toolbar.

## Preset identity and user preference

Each preset stores:

- Canonical query string.
- Whether `view` is included in preset identity.

Recommended approach:

- Add `includeViewInIdentity` on the preset row.
- If `true`, normalize with current `view`.
- If `false`, normalize with `view` forced to default before storing/matching.

This allows each user/preset to decide if layout mode should be part of identity.

## File map in this folder

- `IMPLEMENTATION-CHECKLIST.md` - exact rollout steps.
- `prisma-filter-presets-model.prisma` - Prisma model template for per-user presets.
- `templates/module-list-filters.ts` - parser/serializer/signature/canonicalization template.
- `templates/module-list-query.ts` - server query skeleton and safe sort mapping.
- `templates/module-filter-presets.actions.ts` - Next.js server actions for presets.
- `templates/ModuleFilterPresetsToolbar.tsx` - client toolbar for save/load/active preset.
- `templates/ModuleFilters.tsx` - GET filter form template.

## Integration notes

- Replace `<module>` placeholders with your route domain (for example: `orders`, `tickets`, `clients`).
- Keep parser and serializer symmetric.
- Keep query-building server-only.
- Always use serializer for pagination/sort links to avoid dropping existing filters.
