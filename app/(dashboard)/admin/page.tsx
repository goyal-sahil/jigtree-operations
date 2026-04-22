import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import AdminPresetsTable from '@/components/AdminPresetsTable'

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const admins = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase())
  return admins.includes(email.toLowerCase())
}

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if (!isAdminEmail(user.email)) redirect('/')

  const presets = await prisma.filterPreset.findMany({
    include: { settings: { select: { kayakoEmail: true } } },
    orderBy: [{ userId: 'asc' }, { isDefault: 'desc' }, { createdAt: 'asc' }],
  })

  const rows = presets.map(p => ({
    id:          p.id,
    userId:      p.userId,
    userEmail:   p.settings?.kayakoEmail ?? p.userId.slice(0, 8) + '…',
    name:        p.name,
    visibility:  p.visibility as 'PERSONAL' | 'SHARED',
    isDefault:   p.isDefault,
    createdAt:   p.createdAt.toISOString(),
  }))

  return (
    <div className="px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin</h1>
        <p className="text-slate-500 text-sm mt-1">Manage resources across all users.</p>
      </div>

      {/* Filter Presets */}
      <section>
        <h2 className="text-base font-semibold text-slate-800 mb-1">Filter Presets</h2>
        <p className="text-xs text-slate-500 mb-4">{rows.length} preset{rows.length !== 1 ? 's' : ''} across all users</p>
        <AdminPresetsTable presets={rows} />
      </section>
    </div>
  )
}
