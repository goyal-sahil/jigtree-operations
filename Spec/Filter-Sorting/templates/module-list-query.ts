import 'server-only'

import type { PrismaClient } from '@/app/generated/prisma/client'
import { Prisma } from '@/app/generated/prisma/client'
import type { ModuleListFilters, ModuleSortValue } from './module-list-filters'

function orderByClause(sort: ModuleSortValue): Prisma.Sql {
  switch (sort) {
    case 'created_asc':
      return Prisma.sql`t."created_at" ASC`
    case 'name_asc':
      return Prisma.sql`t."name" ASC NULLS LAST`
    case 'name_desc':
      return Prisma.sql`t."name" DESC NULLS LAST`
    case 'created_desc':
    default:
      return Prisma.sql`t."created_at" DESC`
  }
}

function buildWhereParts(f: ModuleListFilters): Prisma.Sql[] {
  const parts: Prisma.Sql[] = [Prisma.sql`TRUE`]

  if (f.q) {
    const pattern = `%${f.q}%`
    parts.push(Prisma.sql`(t."name" ILIKE ${pattern} OR t."code" ILIKE ${pattern})`)
  }

  if (f.tagIds.length > 0) {
    const tagSql = f.tagIds.map((id) => Prisma.sql`${id}`)
    parts.push(Prisma.sql`t."tag_id" IN (${Prisma.join(tagSql)})`)
  }

  if (f.status === 'active') {
    parts.push(Prisma.sql`t."archived_at" IS NULL`)
  } else if (f.status === 'archived') {
    parts.push(Prisma.sql`t."archived_at" IS NOT NULL`)
  }

  return parts
}

export type ModuleIdPageResult = {
  ids: string[]
  total: number
  effectivePage: number
}

export async function fetchModuleIdsPage(
  prisma: PrismaClient,
  f: ModuleListFilters
): Promise<ModuleIdPageResult> {
  const whereParts = buildWhereParts(f)
  const whereSql = Prisma.join(whereParts, ' AND ')
  const orderSql = orderByClause(f.sort)

  const countRows = await prisma.$queryRaw<{ n: bigint }[]>`
    SELECT COUNT(*)::bigint AS n
    FROM "your_table" t
    WHERE ${whereSql}
  `
  const total = Number(countRows[0]?.n ?? 0)
  const totalPages = Math.max(1, Math.ceil(total / f.pageSize))
  const effectivePage = Math.min(Math.max(1, f.page), totalPages)
  const skip = (effectivePage - 1) * f.pageSize

  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT t."id"
    FROM "your_table" t
    WHERE ${whereSql}
    ORDER BY ${orderSql}, t."id" ASC
    LIMIT ${f.pageSize} OFFSET ${skip}
  `

  return { ids: rows.map((r) => r.id), total, effectivePage }
}
