import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import CredentialsBanner from '@/components/CredentialsBanner'
import AllTicketsToolbar from '@/components/AllTicketsToolbar'
import AllTicketsFilters from '@/components/AllTicketsFilters'
import AllTicketsTable from '@/components/AllTicketsTable'
import { parseAllTicketsSearchParams, allTicketsFilterSignature } from '@/lib/all-tickets-list-filters'
import { fetchAllTicketsPage, fetchAllTicketsFilterOptions, fetchAllTicketsProductAnalytics } from '@/lib/all-tickets-list-query'
import { fetchPresetsForUser } from '@/app/actions/all-ticket-filter-presets.actions'
import TicketProductAnalytics from '@/components/TicketProductAnalytics'

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const admins = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase())
  return admins.includes(email.toLowerCase())
}

export default async function AllTicketsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[]>
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const settings = await prisma.userSettings.findUnique({
    where:  { userId: user.id },
    select: { kayakoUrl: true, kayakoEmail: true, kayakoPasswordEnc: true, anthropicKeyEnc: true },
  })

  const kayakoUrl = settings?.kayakoUrl ?? ''
  const filters   = parseAllTicketsSearchParams(searchParams)
  const isAdmin   = isAdminEmail(user.email)

  const hasParams = Object.keys(searchParams).length > 0

  const [pageResult, filterOptions, presets, maxSyncRow, productAnalytics] = await Promise.all([
    fetchAllTicketsPage(filters, user.id, kayakoUrl),
    fetchAllTicketsFilterOptions(user.id, kayakoUrl),
    fetchPresetsForUser(user.id),
    prisma.ticket.aggregate({
      where: { kayakoUrl },
      _max:  { lastSyncedAt: true },
    }),
    fetchAllTicketsProductAnalytics(kayakoUrl),
  ])

  // Redirect to default preset if user lands with no QS
  if (!hasParams) {
    const defaultPreset = presets.find(p => p.isDefault && p.userId === user.id)
    if (defaultPreset) {
      redirect(`/all-tickets?${defaultPreset.filtersJson}`)
    }
  }

  const globalLastSyncedAt = maxSyncRow._max.lastSyncedAt?.toISOString() ?? null
  const missingKayako    = !settings?.kayakoUrl || !settings?.kayakoEmail || !settings?.kayakoPasswordEnc
  const missingAnthropic = !settings?.anthropicKeyEnc
  const currentQS        = allTicketsFilterSignature(filters)

  return (
    <div className="px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">All Tickets</h1>
        <p className="text-slate-500 text-sm mt-1">All support tickets from Kayako view #242</p>
      </div>

      <CredentialsBanner missingKayako={missingKayako} missingAnthropic={missingAnthropic} />

      <TicketProductAnalytics
        products={productAnalytics}
        storageKey="analytics-open-all-tickets"
      />

      <AllTicketsToolbar
        lastSyncedAt={globalLastSyncedAt}
        isAdmin={isAdmin}
        totalCount={pageResult.unfilteredTotal}
      />

      <AllTicketsFilters
        filters={filters}
        options={filterOptions}
        currentQS={currentQS}
        presets={presets}
        userId={user.id}
      />

      <AllTicketsTable
        tickets={pageResult.tickets}
        total={pageResult.total}
        filters={filters}
        isAdmin={isAdmin}
      />
    </div>
  )
}
