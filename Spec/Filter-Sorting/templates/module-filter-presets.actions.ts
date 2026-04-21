'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { normalizeModulePresetQueryString } from './module-list-filters'

type ActionResult = {
  success: boolean
  error?: string
}

const createSchema = z.object({
  userId: z.string().min(1),
  module: z.string().min(1),
  name: z.string().trim().min(1).max(120),
  queryString: z.string().max(12000),
  includeViewInIdentity: z.boolean().optional(),
  setAsDefault: z.boolean().optional(),
})

export async function createModuleFilterPreset(input: unknown): Promise<ActionResult> {
  const parsed = createSchema.safeParse(input)
  if (!parsed.success) return { success: false, error: 'Invalid input' }

  const includeViewInIdentity = Boolean(parsed.data.includeViewInIdentity)
  const canonical = normalizeModulePresetQueryString(
    parsed.data.queryString,
    includeViewInIdentity
  )

  try {
    await prisma.$transaction(async (tx) => {
      if (parsed.data.setAsDefault) {
        await tx.filterPreset.updateMany({
          where: { userId: parsed.data.userId, module: parsed.data.module },
          data: { isDefault: false },
        })
      }

      await tx.filterPreset.create({
        data: {
          userId: parsed.data.userId,
          module: parsed.data.module,
          name: parsed.data.name,
          queryString: canonical,
          includeViewInIdentity,
          isDefault: Boolean(parsed.data.setAsDefault),
          visibility: 'PRIVATE',
        },
      })
    })

    revalidatePath('/your-module-route')
    return { success: true }
  } catch {
    return { success: false, error: 'Could not save preset' }
  }
}

export async function setDefaultModuleFilterPreset(
  userId: string,
  module: string,
  id: string
): Promise<ActionResult> {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.filterPreset.updateMany({
        where: { userId, module },
        data: { isDefault: false },
      })
      await tx.filterPreset.update({
        where: { id },
        data: { isDefault: true },
      })
    })
    revalidatePath('/your-module-route')
    return { success: true }
  } catch {
    return { success: false, error: 'Could not set default preset' }
  }
}
