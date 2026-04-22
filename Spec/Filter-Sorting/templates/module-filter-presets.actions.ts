'use server'

/**
 * Server Actions for Module filter presets.
 * Replace `module`/`Module` with your feature name.
 * Replace `/module` with your route path (e.g. `/orders`).
 *
 * Assumes `prisma.filterPreset` model with fields:
 *   id, userId, module, name, filtersJson, isDefault, visibility, createdAt, updatedAt
 */

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

const MODULE_KEY  = 'module'   // TODO: replace with your feature key, e.g. 'orders'
const MODULE_PATH = '/module'  // TODO: replace with your route, e.g. '/orders'

// ---------------------------------------------------------------------------
// Guard: ensure the caller owns the preset
// ---------------------------------------------------------------------------

async function assertOwns(presetId: string, userId: string): Promise<void> {
  const preset = await (prisma as any).filterPreset.findUnique({ where: { id: presetId } })
  if (!preset || preset.userId !== userId) throw new Error('Not found or forbidden')
}

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export async function fetchPresetsForUser(userId: string) {
  return (prisma as any).filterPreset.findMany({
    where: {
      OR: [
        { userId },
        { visibility: 'SHARED' },
      ],
      module: MODULE_KEY,
    },
    orderBy: [
      { isDefault: 'desc' },
      { createdAt: 'asc' },
    ],
  })
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export async function createModuleFilterPreset(
  name:        string,
  filtersJson: string,
  visibility:  'PERSONAL' | 'SHARED',
): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await (prisma as any).filterPreset.create({
    data: {
      userId:     user.id,
      module:     MODULE_KEY,
      name:       name.trim(),
      filtersJson,
      visibility,
      isDefault:  false,
    },
  })

  revalidatePath(MODULE_PATH)
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

export async function deleteModuleFilterPreset(id: string): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await assertOwns(id, user.id)
  await (prisma as any).filterPreset.delete({ where: { id } })
  revalidatePath(MODULE_PATH)
}

// ---------------------------------------------------------------------------
// Set default (clears all others in a transaction)
// ---------------------------------------------------------------------------

export async function setDefaultModuleFilterPreset(id: string): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await assertOwns(id, user.id)

  await (prisma as any).$transaction([
    (prisma as any).filterPreset.updateMany({
      where: { userId: user.id, module: MODULE_KEY },
      data:  { isDefault: false },
    }),
    (prisma as any).filterPreset.update({
      where: { id },
      data:  { isDefault: true },
    }),
  ])

  revalidatePath(MODULE_PATH)
}

// ---------------------------------------------------------------------------
// Clear default
// ---------------------------------------------------------------------------

export async function clearDefaultModuleFilterPreset(): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await (prisma as any).filterPreset.updateMany({
    where: { userId: user.id, module: MODULE_KEY, isDefault: true },
    data:  { isDefault: false },
  })

  revalidatePath(MODULE_PATH)
}

// ---------------------------------------------------------------------------
// Update saved filters (overwrite preset's filtersJson)
// ---------------------------------------------------------------------------

export async function updateModuleFilterPresetFilters(
  id:          string,
  filtersJson: string,
): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await assertOwns(id, user.id)
  await (prisma as any).filterPreset.update({
    where: { id },
    data:  { filtersJson },
  })

  revalidatePath(MODULE_PATH)
}

// ---------------------------------------------------------------------------
// Toggle visibility (PERSONAL ↔ SHARED)
// ---------------------------------------------------------------------------

export async function toggleModuleFilterPresetVisibility(id: string): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await assertOwns(id, user.id)

  const preset = await (prisma as any).filterPreset.findUnique({ where: { id } })
  const next   = preset?.visibility === 'SHARED' ? 'PERSONAL' : 'SHARED'

  await (prisma as any).filterPreset.update({
    where: { id },
    data:  { visibility: next },
  })

  revalidatePath(MODULE_PATH)
}
