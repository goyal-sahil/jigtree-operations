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
      module: 'all-tickets',
      OR: [
        { userId },
        { visibility: 'SHARED' },
      ],
    },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  })
  return presets.map(toRow)
}

export async function createAllTicketFilterPreset(
  name:        string,
  filtersJson: string,
  visibility:  'PERSONAL' | 'SHARED' = 'PERSONAL',
): Promise<FilterPresetRow> {
  const userId = await assertUser()
  const preset = await prisma.filterPreset.create({
    data: { userId, module: 'all-tickets', name, filtersJson, visibility },
  })
  revalidatePath('/all-tickets')
  return toRow(preset)
}

export async function renameAllTicketFilterPreset(id: string, name: string): Promise<void> {
  const userId = await assertUser()
  await prisma.filterPreset.updateMany({ where: { id, userId, module: 'all-tickets' }, data: { name } })
  revalidatePath('/all-tickets')
}

export async function deleteAllTicketFilterPreset(id: string): Promise<void> {
  const userId = await assertUser()
  await prisma.filterPreset.deleteMany({ where: { id, userId, module: 'all-tickets' } })
  revalidatePath('/all-tickets')
}

export async function setDefaultAllTicketFilterPreset(id: string): Promise<void> {
  const userId = await assertUser()
  await prisma.$transaction([
    prisma.filterPreset.updateMany({ where: { userId, module: 'all-tickets' },     data: { isDefault: false } }),
    prisma.filterPreset.updateMany({ where: { id, userId, module: 'all-tickets' }, data: { isDefault: true } }),
  ])
  revalidatePath('/all-tickets')
}

export async function clearDefaultAllTicketFilterPreset(): Promise<void> {
  const userId = await assertUser()
  await prisma.filterPreset.updateMany({ where: { userId, module: 'all-tickets' }, data: { isDefault: false } })
  revalidatePath('/all-tickets')
}

export async function updateAllTicketFilterPresetFilters(id: string, filtersJson: string): Promise<void> {
  const userId = await assertUser()
  await prisma.filterPreset.updateMany({ where: { id, userId, module: 'all-tickets' }, data: { filtersJson } })
  revalidatePath('/all-tickets')
}

export async function toggleAllTicketFilterPresetVisibility(id: string): Promise<void> {
  const userId = await assertUser()
  const preset = await prisma.filterPreset.findFirst({ where: { id, userId, module: 'all-tickets' } })
  if (!preset) return
  const next = preset.visibility === 'PERSONAL' ? 'SHARED' : 'PERSONAL'
  await prisma.filterPreset.update({ where: { id }, data: { visibility: next } })
  revalidatePath('/all-tickets')
}
