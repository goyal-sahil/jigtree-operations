import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import CredentialsBanner from '@/components/CredentialsBanner'
import BUTicketsToolbar from '@/components/BUTicketsToolbar'
import BUTicketsFilters from '@/components/BUTicketsFilters'
import BUTicketsTable from '@/components/BUTicketsTable'
import { parseBuTicketsSearchParams, buTicketsFilterSignature } from '@/lib/bu-tickets-list-filters'
import { fetchBuTicketsPage, fetchBuTicketsFilterOptions } from '@/lib/bu-tickets-list-query'
import { fetchPresetsForUser } from '@/app/actions/bu-ticket-filter-presets.actions'

function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const admins = (process.env.ADMIN_EMAILS ?? '').split(',').map(e => e.trim().toLowerCase())
  return admins.includes(email.toLowerCase())
}

// In Next.js 14 App Router, searchParams is a plain synchronous object (not a Promise).
export default async function BuTicketsPage({
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
  const filters   = parseBuTicketsSearchParams(searchParams)
  const isAdmin   = isAdminEmail(user.email)

  // Redirect to default preset when landing with no filter params
  const hasParams = Object.keys(searchParams).length > 0

  const [pageResult, filterOptions, presets, maxSyncRow] = await Promise.all([
    fetchBuTicketsPage(filters, user.id, kayakoUrl),
    fetchBuTicketsFilterOptions(user.id, kayakoUrl),
    fetchPresetsForUser(user.id),
    prisma.ticket.aggregate({
      where: { isBuPs: true, kayakoUrl },
      _max:  { lastSyncedAt: true },
    }),
  ])

  // Redirect to default preset if user lands with no QS
  if (!hasParams) {
    const defaultPreset = presets.find(p => p.isDefault && p.userId === user.id)
    if (defaultPreset) {
      redirect(`/bu-tickets?${defaultPreset.filtersJson}`)
    }
  }

  const globalLastSyncedAt = maxSyncRow._max.lastSyncedAt?.toISOString() ?? null
  const missingKayako    = !settings?.kayakoUrl || !settings?.kayakoEmail || !settings?.kayakoPasswordEnc
  const missingAnthropic = !settings?.anthropicKeyEnc
  const currentQS        = buTicketsFilterSignature(filters)

  return (
    <div className="px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">BU/PS Tickets</h1>
        <p className="text-slate-500 text-sm mt-1">JigTree BU &amp; PS tickets from Kayako view #64</p>
      </div>

      <CredentialsBanner missingKayako={missingKayako} missingAnthropic={missingAnthropic} />

      <BUTicketsToolbar
        lastSyncedAt={globalLastSyncedAt}
        isAdmin={isAdmin}
        totalCount={pageResult.unfilteredTotal}
      />

      <BUTicketsFilters
        filters={filters}
        options={filterOptions}
        currentQS={currentQS}
        presets={presets}
        userId={user.id}
      />

      <BUTicketsTable
        tickets={pageResult.tickets}
        total={pageResult.total}
        filters={filters}
        isAdmin={isAdmin}
      />
    </div>
  )
}
