import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import AdminPresetsTable from '@/components/AdminPresetsTable'
import BatchSyncStatus from '@/components/BatchSyncStatus'

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

  const settings = await prisma.userSettings.findUnique({
    where:  { userId: user.id },
    select: { kayakoUrl: true },
  })
  const kayakoUrl = settings?.kayakoUrl ?? ''

  const [presets, allTicketsPending, buPsPostsPending, buPsAnalysisPending] = await Promise.all([
    prisma.filterPreset.findMany({
      include: { settings: { select: { kayakoEmail: true } } },
      orderBy: [{ userId: 'asc' }, { isDefault: 'desc' }, { createdAt: 'asc' }],
    }),
    // Pending post sync for non-BU/PS tickets
    prisma.ticket.count({
      where: { kayakoUrl, isBuPs: false, postsStatus: { not: 'done' } },
    }),
    // Pending post sync for BU/PS tickets
    prisma.ticket.count({
      where: { kayakoUrl, isBuPs: true, postsStatus: { not: 'done' } },
    }),
    // Pending AI analysis for BU/PS tickets (no cached analysis for this user)
    prisma.ticket.count({
      where: {
        kayakoUrl,
        isBuPs:      true,
        postsStatus: 'done',
        analyses:    { none: { userId: user.id } },
      },
    }),
  ])

  const rows = presets.map(p => ({
    id:          p.id,
    userId:      p.userId,
    userEmail:   p.settings?.kayakoEmail ?? p.userId.slice(0, 8) + '…',
    name:        p.name,
    module:      p.module,
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

      {/* Batch Sync Status */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-slate-800 mb-1">Batch Sync</h2>
        <p className="text-xs text-slate-500 mb-4">Manually trigger background sync jobs and view pending queues.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BatchSyncStatus
            label="Post Sync — All Tickets"
            endpoint="/api/all-tickets/sync-posts"
            pendingCount={allTicketsPending}
            recentRuns={[]}
          />
          <BatchSyncStatus
            label="Post Sync — BU/PS"
            endpoint="/api/bu-tickets/sync-posts"
            pendingCount={buPsPostsPending}
            recentRuns={[]}
          />
          <BatchSyncStatus
            label="AI Analysis — BU/PS"
            endpoint="/api/bu-tickets/analyse-batch"
            pendingCount={buPsAnalysisPending}
            recentRuns={[]}
          />
        </div>
      </section>

      {/* Filter Presets */}
      <section>
        <h2 className="text-base font-semibold text-slate-800 mb-1">Filter Presets</h2>
        <p className="text-xs text-slate-500 mb-4">{rows.length} preset{rows.length !== 1 ? 's' : ''} across all users</p>
        <AdminPresetsTable presets={rows} />
      </section>
    </div>
  )
}
