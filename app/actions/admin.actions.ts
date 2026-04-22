'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

async function assertAdmin(): Promise<void> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const admins = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase())
  if (!admins.includes(user.email?.toLowerCase() ?? '')) throw new Error('Forbidden')
}

export async function adminDeleteFilterPreset(id: string): Promise<void> {
  await assertAdmin()
  await prisma.filterPreset.delete({ where: { id } })
  revalidatePath('/bu-tickets')
  revalidatePath('/admin')
}
