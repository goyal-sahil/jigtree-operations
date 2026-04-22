'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import type { FilterPreset } from '@prisma/client'

export interface FilterPresetRow {
  id:          string
  userId:      string
  name:        string
  filtersJson: string
  visibility:  'PERSONAL' | 'SHARED'
  isDefault:   boolean
  createdAt:   string
}

async function assertUser(): Promise<string> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return user.id
}

function toRow(p: FilterPreset): FilterPresetRow {
  return {
    id:          p.id,
    userId:      p.userId,
    name:        p.name,
    filtersJson: p.filtersJson,
    visibility:  p.visibility as 'PERSONAL' | 'SHARED',
    isDefault:   p.isDefault,
    createdAt:   p.createdAt.toISOString(),
  }
}

export async function fetchPresetsForUser(userId: string): Promise<FilterPresetRow[]> {
  const presets = await prisma.filterPreset.findMany({
    where: {
      OR: [
        { userId },
        { visibility: 'SHARED' },
      ],
    },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  })
  return presets.map(toRow)
}

export async function createBuTicketFilterPreset(
  name:        string,
  filtersJson: string,
  visibility:  'PERSONAL' | 'SHARED' = 'PERSONAL',
): Promise<FilterPresetRow> {
  const userId = await assertUser()
  const preset = await prisma.filterPreset.create({
    data: { userId, name, filtersJson, visibility },
  })
  revalidatePath('/bu-tickets')
  return toRow(preset)
}

export async function renameBuTicketFilterPreset(id: string, name: string): Promise<void> {
  const userId = await assertUser()
  await prisma.filterPreset.updateMany({ where: { id, userId }, data: { name } })
  revalidatePath('/bu-tickets')
}

export async function deleteBuTicketFilterPreset(id: string): Promise<void> {
  const userId = await assertUser()
  await prisma.filterPreset.deleteMany({ where: { id, userId } })
  revalidatePath('/bu-tickets')
}

export async function setDefaultBuTicketFilterPreset(id: string): Promise<void> {
  const userId = await assertUser()
  await prisma.$transaction([
    prisma.filterPreset.updateMany({ where: { userId },     data: { isDefault: false } }),
    prisma.filterPreset.updateMany({ where: { id, userId }, data: { isDefault: true } }),
  ])
  revalidatePath('/bu-tickets')
}

export async function clearDefaultBuTicketFilterPreset(): Promise<void> {
  const userId = await assertUser()
  await prisma.filterPreset.updateMany({ where: { userId }, data: { isDefault: false } })
  revalidatePath('/bu-tickets')
}

export async function updateBuTicketFilterPresetFilters(id: string, filtersJson: string): Promise<void> {
  const userId = await assertUser()
  await prisma.filterPreset.updateMany({ where: { id, userId }, data: { filtersJson } })
  revalidatePath('/bu-tickets')
}

export async function toggleBuTicketFilterPresetVisibility(id: string): Promise<void> {
  const userId = await assertUser()
  const preset = await prisma.filterPreset.findFirst({ where: { id, userId } })
  if (!preset) return
  const next = preset.visibility === 'PERSONAL' ? 'SHARED' : 'PERSONAL'
  await prisma.filterPreset.update({ where: { id }, data: { visibility: next } })
  revalidatePath('/bu-tickets')
}
