import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { KayakoClient } from '@/lib/kayako/client'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import type { KayakoCase, KayakoCaseFieldDef } from '@/types/kayako'
import { extractOrganizationName } from '@/lib/kayako/ticketService'

const KAYAKO_VIEW_ID = 64
const BATCH_SIZE = 5

// ── Tag-based field extraction ────────────────────────────────────────────

function extractTeam(tags: string[]): string | null {
  if (tags.includes('bu_ps')) return 'PS'
  if (tags.includes('bu_other')) return 'BU'
  return null
}

// ── Shared-data resolution (pre-fetched once for all tickets) ─────────────

interface SharedData {
  statusMap:    Map<number, string>
  priorityMap:  Map<number, string>
  fieldDefs:    KayakoCaseFieldDef[]
  optionLabels: Map<string, string>   // `${fieldId}:${optionId}` → label
}

function resolveStatus(id: number, map: Map<number, string>): string | null {
  return map.get(id) ?? null
}

function resolveCustomFields(
  rawCase: KayakoCase,
  shared: SharedData,
): { product: string | null; ghiId: string | null; ghiStatus: string | null; holdReason: string | null; jiraFields: Record<string, string> | null } {
  const rawFields = (rawCase as unknown as Record<string, unknown>).custom_fields as
    Array<{ field: { id: number }; value: unknown }> | undefined

  if (!rawFields?.length) return { product: null, ghiId: null, ghiStatus: null, holdReason: null, jiraFields: null }

  const SELECT_TYPES = new Set(['SELECT', 'RADIO', 'CASCADINGSELECT'])
  const JIRA_KEY = /^[A-Z]+-\d+$/
  const GHI_URL = /\/issues\/(\d+)/

  let product: string | null = null
  let ghiId: string | null = null
  let ghiStatus: string | null = null
  let holdReason: string | null = null
  const jiraFields: Record<string, string> = {}

  for (const cf of rawFields) {
    const def = shared.fieldDefs.find(d => d.id === cf.field.id)
    if (!def || def.is_system) continue
    const rawVal = cf.value
    if (rawVal === null || rawVal === undefined || rawVal === '') continue
    let value = String(rawVal).trim()

    // Resolve SELECT option label from pre-fetched option labels
    if (SELECT_TYPES.has(def.type) && /^\d+$/.test(value)) {
      const label = shared.optionLabels.get(`${def.id}:${value}`)
      if (label) value = label
      else continue // skip unresolved SELECT values
    }

    if (/product/i.test(def.title)) {
      product = value
    } else if (/ghi.*status|status.*ghi/i.test(def.title)) {
      ghiStatus = value
    } else if (/ghi|github|escalated.*issue/i.test(def.title)) {
      // Field value may be a full GitHub URL — extract the issue number
      const urlMatch = value.match(GHI_URL)
      if (urlMatch) {
        ghiId = urlMatch[1]
      } else if (/^\d+$/.test(value.trim())) {
        ghiId = value.trim()
      }
    } else if (/hold.*reason|on.hold.*reason/i.test(def.title)) {
      holdReason = value
    } else if (/jira|jia/i.test(def.title) && JIRA_KEY.test(value)) {
      jiraFields[def.title] = value
    }
  }

  return {
    product,
    ghiId,
    ghiStatus,
    holdReason,
    jiraFields: Object.keys(jiraFields).length > 0 ? jiraFields : null,
  }
}

function mapTicket(caseData: KayakoCase, shared: SharedData, kayakoUrl: string) {
  const tags = caseData.tags ?? []
  const { product, ghiId, ghiStatus, holdReason, jiraFields } = resolveCustomFields(caseData, shared)

  // Brand name is the BU (e.g. "Jigsaw", "Coppertree")
  const brand = caseData.brand?.name
    ?? caseData.brand?.titles?.[0]?.translation
    ?? null

  return {
    kayakoUrl,
    title:           caseData.subject ?? '',
    status:          resolveStatus(caseData.status?.id, shared.statusMap) ?? caseData.status?.label ?? caseData.status?.name ?? null,
    priority:        resolveStatus(caseData.priority?.id, shared.priorityMap) ?? caseData.priority?.label ?? caseData.priority?.name ?? null,
    product,
    brand,
    requesterName:      caseData.requester?.full_name ?? caseData.requester?.name ?? null,
    requesterEmail:     caseData.requester?.identities?.[0]?.email ?? caseData.requester?.email ?? null,
    requesterKayakoId:  caseData.requester?.id ?? null,
    organization:       extractOrganizationName(caseData),
    team:            extractTeam(tags),
    isEscalated:     tags.includes('cust-escalate'),
    ghiId,
    ghiStatus,
    jiraFields:      jiraFields ?? Prisma.JsonNull,
    holdReason,
    tags,
    assignee:        caseData.assigned_agent?.full_name ?? caseData.assigned_agent?.name ?? null,
    isBuPs:          true,
    kayakoCreatedAt: caseData.created_at ? new Date(caseData.created_at) : null,
    kayakoUpdatedAt: caseData.updated_at ? new Date(caseData.updated_at) : null,
    lastSyncedAt:    new Date(),
  }
}

export async function POST(request: NextRequest) {
  const signal = request.signal

  // Guard: detect stale Prisma client (happens when schema was reset but `prisma generate` not re-run)
  if (!('ticket' in prisma)) {
    return NextResponse.json(
      { error: 'Database client is out of date. Stop the dev server, run `npx prisma generate`, then restart.' },
      { status: 500 },
    )
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const settings = await prisma.userSettings.findUnique({
    where:  { userId: user.id },
    select: { kayakoUrl: true, kayakoEmail: true, kayakoPasswordEnc: true },
  })

  if (!settings?.kayakoPasswordEnc || !settings.kayakoUrl || !settings.kayakoEmail) {
    return NextResponse.json({ error: 'Kayako credentials not configured.' }, { status: 400 })
  }

  let password: string
  try {
    password = decrypt(settings.kayakoPasswordEnc)
  } catch {
    return NextResponse.json({ error: 'Failed to decrypt Kayako credentials.' }, { status: 500 })
  }

  const client = new KayakoClient(settings.kayakoUrl, signal)
  try {
    await client.authenticate(settings.kayakoEmail, password)
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Kayako authentication failed' },
      { status: 502 },
    )
  }

  const started = Date.now()

  if (signal.aborted) return NextResponse.json({ error: 'Cancelled' }, { status: 499 })

  // ── 1. Pre-fetch shared data ONCE ────────────────────────────────────────
  const [statusesRes, prioritiesRes, fieldDefsRes] = await Promise.allSettled([
    client.get<{ data: Array<{ id: number; label?: string; name?: string }> }>('/api/v1/cases/statuses'),
    client.get<{ data: Array<{ id: number; label?: string; name?: string }> }>('/api/v1/cases/priorities'),
    client.get<{ data: KayakoCaseFieldDef[] }>('/api/v1/cases/fields'),
  ])

  const statusMap = new Map<number, string>()
  if (statusesRes.status === 'fulfilled') {
    statusesRes.value.data?.forEach(s => statusMap.set(s.id, s.label ?? s.name ?? ''))
  }

  const priorityMap = new Map<number, string>()
  if (prioritiesRes.status === 'fulfilled') {
    prioritiesRes.value.data?.forEach(p => priorityMap.set(p.id, p.label ?? p.name ?? ''))
  }

  const fieldDefs: KayakoCaseFieldDef[] = fieldDefsRes.status === 'fulfilled'
    ? (fieldDefsRes.value.data ?? [])
    : []

  // ── 2. Pre-fetch SELECT field option labels ───────────────────────────────
  const SELECT_TYPES = new Set(['SELECT', 'RADIO', 'CASCADINGSELECT'])
  const selectDefs = fieldDefs.filter(d => !d.is_system && SELECT_TYPES.has(d.type))
  const optionLabels = new Map<string, string>()

  await Promise.allSettled(
    selectDefs.map(async (def) => {
      try {
        const resp = await client.get<{
          data: { options?: Array<{ id: number; values?: Array<{ translation?: string }> }> }
        }>(`/api/v1/cases/fields/${def.id}`, { include: 'field_option,locale_field' })
        for (const opt of resp.data?.options ?? []) {
          const label = opt.values?.[0]?.translation
          if (label) optionLabels.set(`${def.id}:${opt.id}`, label)
        }
      } catch { /* silently skip */ }
    })
  )

  const shared: SharedData = { statusMap, priorityMap, fieldDefs, optionLabels }

  // ── 3. Fetch case stubs from view ─────────────────────────────────────────
  let viewCases: KayakoCase[]
  try {
    viewCases = await client.getViewCases(KAYAKO_VIEW_ID)
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch view cases' },
      { status: 502 },
    )
  }

  console.log(`[bu-sync] View returned ${viewCases.length} case stubs`)

  // ── 4. Upsert each case into tickets table ────────────────────────────────
  let synced = 0
  let failed = 0
  let firstError: string | null = null

  for (let i = 0; i < viewCases.length; i += BATCH_SIZE) {
    if (signal.aborted) {
      console.log('[bu-sync] Client disconnected — stopping')
      break
    }
    const batch = viewCases.slice(i, i + BATCH_SIZE)
    console.log(`[bu-sync] Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(viewCases.length / BATCH_SIZE)} — cases ${i + 1}–${Math.min(i + BATCH_SIZE, viewCases.length)}`)
    await Promise.allSettled(
      batch.map(async (stub) => {
        try {
          const [{ data: caseData }, tags] = await Promise.all([
            client.getCaseRaw(stub.id),
            client.getCaseTags(stub.id),
          ])
          caseData.tags = tags

          // API fallback: org name not inline — fetch via org ID from case or requester
          if (!extractOrganizationName(caseData)) {
            const orgId = caseData.organization?.id ?? caseData.requester?.organization?.id ?? null
            if (orgId) {
              const orgName = await client.getOrganizationName(orgId)
              if (orgName) {
                if (caseData.organization) {
                  caseData.organization.name = orgName
                } else {
                  caseData.organization = { id: orgId, name: orgName }
                }
              }
            }
          }

          const ticketData = mapTicket(caseData, shared, settings.kayakoUrl!)
          await prisma.ticket.upsert({
            where:  { kayakoTicketId_kayakoUrl: { kayakoTicketId: stub.id, kayakoUrl: settings.kayakoUrl! } },
            create: { kayakoTicketId: stub.id, ...ticketData },
            update: ticketData,
          })
          synced++
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          console.error(`[bu-sync] Failed case ${stub.id}:`, msg)
          if (!firstError) firstError = `Case ${stub.id}: ${msg}`
          failed++
        }
      })
    )
  }

  const duration = Date.now() - started
  return NextResponse.json({ ok: true, synced, failed, total: viewCases.length, duration, firstError })
}
