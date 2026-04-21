import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import type { KayakoCase, KayakoCustomField, KayakoPost, TicketRow, UnifiedPost } from '@/types/kayako'
import type { KayakoClient } from './client'

// ── Post channel resolution (shared by fetchAndPersistTicket + sync-posts) ──

export function resolvePostChannel(post: KayakoPost): string {
  const sourceType   = post.source_channel?.type ?? ''
  const originalType = post.original?.resource_type ?? ''
  if (originalType === 'side_conversation') return 'SIDE_CONVERSATION'
  if (sourceType === 'NOTE' || originalType === 'note') return 'NOTE'
  if (post.is_requester === true) return 'CUSTOMER'
  return sourceType || 'MAIL'
}

// ── Custom-field extraction (shared by TA + BU/PS sync) ──────────────────

const JIRA_KEY_RE = /^[A-Z]+-\d+$/
const GHI_URL_RE  = /\/issues\/(\d+)/

export function extractSpecialFields(fields: KayakoCustomField[]) {
  let product: string | null = null
  let ghiId: string | null = null
  let ghiStatus: string | null = null
  let holdReason: string | null = null
  const jiraFields: Record<string, string> = {}

  for (const f of fields) {
    const v = (f.value ?? '').trim()
    if (!v) continue
    if (/product/i.test(f.label)) {
      product = v
    } else if (/ghi.*status|status.*ghi/i.test(f.label)) {
      ghiStatus = v
    } else if (/ghi|github|escalated.*issue/i.test(f.label)) {
      const m = v.match(GHI_URL_RE)
      if (m) {
        ghiId = m[1]
      } else if (/^\d+$/.test(v.trim())) {
        ghiId = v.trim()
      }
    } else if (/hold.*reason|on.hold.*reason/i.test(f.label)) {
      holdReason = v
    } else if (/jira|jia/i.test(f.label) && JIRA_KEY_RE.test(v)) {
      jiraFields[f.label] = v
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

// ── Team extraction (same logic as BU/PS sync) ────────────────────────────

function extractTeam(tags: string[]): string | null {
  if (tags.includes('bu_ps')) return 'PS'
  if (tags.includes('bu_other')) return 'BU'
  return null
}

// ── Organization name extraction ──────────────────────────────────────────
// Priority: case.organization → requester.organization → null
// In Kayako, the sidebar shows the *requester's* organization, not a case-level
// field. Many cases have organization=null at case level but the requester user
// has their org set. We check both.

export function extractOrganizationName(caseData: KayakoCase): string | null {
  // 1. Case-level organization (directly assigned to the ticket)
  const caseOrg = caseData.organization
  if (caseOrg) {
    const n = caseOrg.name ?? caseOrg.title ?? caseOrg.titles?.[0]?.translation
    if (n) return n
  }
  // 2. Requester's organization (shown in Kayako sidebar — most common for BU/PS tickets)
  const reqOrg = caseData.requester?.organization
  if (reqOrg) {
    const n = reqOrg.name ?? reqOrg.title ?? reqOrg.titles?.[0]?.translation
    if (n) return n
  }
  return null
}

// ── Shape converters for AI analysis (DB → Kayako types) ─────────────────

export function ticketRowToKayakoCase(ticket: {
  kayakoTicketId: number; title: string
  status: string | null; priority: string | null
  requesterKayakoId: number | null; requesterName: string | null
  assignee: string | null; tags: string[]
  kayakoCreatedAt: Date | null; kayakoUpdatedAt: Date | null
}): KayakoCase {
  return {
    id:       ticket.kayakoTicketId,
    subject:  ticket.title,
    status:   { id: 0, label: ticket.status ?? undefined },
    priority: { id: 0, label: ticket.priority ?? undefined },
    requester: { id: ticket.requesterKayakoId ?? 0, full_name: ticket.requesterName ?? undefined },
    assigned_agent: ticket.assignee ? { id: 0, full_name: ticket.assignee } : null,
    assigned_team: null,
    tags:       ticket.tags,
    created_at: ticket.kayakoCreatedAt?.toISOString() ?? '',
    updated_at: ticket.kayakoUpdatedAt?.toISOString() ?? '',
  }
}

export function dbPostsToKayakoPosts(posts: {
  kayakoPostId: number; channel: string | null; isPrivate: boolean
  creatorId: number | null; creatorName: string | null
  contents: string; postedAt: Date | null
}[]): KayakoPost[] {
  return posts.map(p => ({
    id:         p.kayakoPostId,
    channel:    p.channel ?? '',
    is_private: p.isPrivate,
    creator:    { id: p.creatorId ?? 0, full_name: p.creatorName ?? undefined },
    contents:   p.contents,
    created_at: p.postedAt?.toISOString() ?? '',
  }))
}

// ── DB row → API response shape ───────────────────────────────────────────

export function dbTicketToRow(
  t: {
    id: string; kayakoTicketId: number; kayakoUrl: string; title: string
    status: string | null; priority: string | null; product: string | null
    brand: string | null; requesterName: string | null; requesterEmail: string | null
    requesterKayakoId: number | null; organization: string | null; team: string | null
    isEscalated: boolean; ghiId: string | null; ghiStatus: string | null; jiraFields: Prisma.JsonValue
    holdReason: string | null; tags: string[]; assignee: string | null; isBuPs: boolean
    customFields: Prisma.JsonValue; postsStatus: string; postsLastSyncedAt: Date | null
    kayakoCreatedAt: Date | null; kayakoUpdatedAt: Date | null; lastSyncedAt: Date
  },
  analysisExtras?: { blockerType?: string | null; oneLiner?: string | null; lastAnalysedAt?: Date | null },
): TicketRow {
  return {
    id: t.id, kayakoTicketId: t.kayakoTicketId, kayakoUrl: t.kayakoUrl,
    title: t.title, status: t.status, priority: t.priority, product: t.product,
    brand: t.brand, requesterName: t.requesterName, requesterEmail: t.requesterEmail,
    requesterKayakoId: t.requesterKayakoId, organization: t.organization, team: t.team,
    isEscalated: t.isEscalated, ghiId: t.ghiId, ghiStatus: t.ghiStatus,
    jiraFields:   (t.jiraFields  as Record<string, string> | null) ?? null,
    holdReason:   t.holdReason, tags: t.tags, assignee: t.assignee, isBuPs: t.isBuPs,
    customFields: (t.customFields as KayakoCustomField[] | null) ?? null,
    postsStatus: t.postsStatus,
    postsLastSyncedAt: t.postsLastSyncedAt?.toISOString() ?? null,
    kayakoCreatedAt:   t.kayakoCreatedAt?.toISOString() ?? null,
    kayakoUpdatedAt:   t.kayakoUpdatedAt?.toISOString() ?? null,
    lastSyncedAt:      t.lastSyncedAt.toISOString(),
    blockerType:       analysisExtras?.blockerType    ?? null,
    oneLiner:          analysisExtras?.oneLiner       ?? null,
    lastAnalysedAt:    analysisExtras?.lastAnalysedAt?.toISOString() ?? null,
  }
}

export function dbPostToUnified(p: {
  id: string; kayakoPostId: number; contents: string; channel: string | null
  isPrivate: boolean; creatorId: number | null; creatorName: string | null
  postedAt: Date | null
}): UnifiedPost {
  return {
    id: p.id, kayakoPostId: p.kayakoPostId, contents: p.contents,
    channel: p.channel, isPrivate: p.isPrivate,
    creatorId: p.creatorId, creatorName: p.creatorName,
    postedAt: p.postedAt?.toISOString() ?? null,
  }
}

// ── Core service ──────────────────────────────────────────────────────────

export interface FetchResult {
  ticket:   TicketRow
  posts:    UnifiedPost[]
  warning?: string
}

/**
 * Fetches a full ticket from Kayako (case + custom fields + posts + users),
 * persists everything to the DB, and returns the DB-fresh data.
 * This is the single code path used by both Ticket Analyser and BU/PS refresh.
 */
export async function fetchAndPersistTicket(
  caseId:     number,
  client:     KayakoClient,
  kayakoUrl:  string,
): Promise<FetchResult> {
  // ── 1. Fetch case (with resolved custom fields) + posts in parallel ───────
  const [caseResp, postsResp] = await Promise.allSettled([
    client.getCase(caseId),
    client.getAllPosts(caseId),
  ])

  if (caseResp.status === 'rejected') throw caseResp.reason

  const caseData = caseResp.value.data
  const { posts: rawPosts, warning } = postsResp.status === 'fulfilled'
    ? postsResp.value
    : { posts: [] as typeof caseResp.value.data extends never ? never : Parameters<typeof client.resolveUsers>[0], warning: 'Posts could not be fetched.' }

  const enrichedPosts = await client.resolveUsers(rawPosts as Parameters<typeof client.resolveUsers>[0])

  // ── 2. Resolve all field-derived metadata ─────────────────────────────────
  const customFields = caseData.custom_fields ?? []
  const { product, ghiId, ghiStatus, holdReason, jiraFields } = extractSpecialFields(customFields)
  const tags  = caseData.tags ?? []
  const brand = caseData.brand?.name ?? caseData.brand?.titles?.[0]?.translation ?? null

  // Organization: try case-level, then requester's org, then API fallback
  let organization = extractOrganizationName(caseData)
  if (!organization) {
    const orgId = caseData.organization?.id ?? caseData.requester?.organization?.id ?? null
    if (orgId) organization = await client.getOrganizationName(orgId)
  }

  // ── 3. Upsert ticket ──────────────────────────────────────────────────────
  const ticketRecord = await prisma.ticket.upsert({
    where:  { kayakoTicketId_kayakoUrl: { kayakoTicketId: caseId, kayakoUrl } },
    create: {
      kayakoTicketId:    caseId,
      kayakoUrl,
      title:             caseData.subject ?? '',
      status:            caseData.status?.label ?? caseData.status?.name ?? null,
      priority:          caseData.priority?.label ?? caseData.priority?.name ?? null,
      product,
      brand,
      requesterName:     caseData.requester?.full_name ?? caseData.requester?.name ?? null,
      requesterEmail:    caseData.requester?.identities?.[0]?.email ?? caseData.requester?.email ?? null,
      requesterKayakoId: caseData.requester?.id ?? null,
      organization,
      team:              extractTeam(tags),
      isEscalated:       tags.includes('cust-escalate'),
      ghiId,
      ghiStatus,
      jiraFields:        jiraFields ?? Prisma.JsonNull,
      holdReason,
      tags,
      assignee:          caseData.assigned_agent?.full_name ?? caseData.assigned_agent?.name ?? null,
      isBuPs:            extractTeam(tags) !== null,
      customFields:      customFields.length > 0 ? (customFields as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
      postsStatus:       'done',
      postsLastSyncedAt: new Date(),
      kayakoCreatedAt:   caseData.created_at ? new Date(caseData.created_at) : null,
      kayakoUpdatedAt:   caseData.updated_at ? new Date(caseData.updated_at) : null,
      lastSyncedAt:      new Date(),
    },
    update: {
      title:             caseData.subject ?? '',
      status:            caseData.status?.label ?? caseData.status?.name ?? null,
      priority:          caseData.priority?.label ?? caseData.priority?.name ?? null,
      product,
      brand,
      requesterName:     caseData.requester?.full_name ?? caseData.requester?.name ?? null,
      requesterEmail:    caseData.requester?.identities?.[0]?.email ?? caseData.requester?.email ?? null,
      requesterKayakoId: caseData.requester?.id ?? null,
      organization,
      team:              extractTeam(tags),
      isEscalated:       tags.includes('cust-escalate'),
      ghiId,
      ghiStatus,
      jiraFields:        jiraFields ?? Prisma.JsonNull,
      holdReason,
      tags,
      assignee:          caseData.assigned_agent?.full_name ?? caseData.assigned_agent?.name ?? null,
      // isBuPs intentionally omitted — preserves true if BU/PS sync set it
      customFields:      customFields.length > 0 ? (customFields as unknown as Prisma.InputJsonValue) : Prisma.JsonNull,
      postsStatus:       'done',
      postsLastSyncedAt: new Date(),
      kayakoCreatedAt:   caseData.created_at ? new Date(caseData.created_at) : null,
      kayakoUpdatedAt:   caseData.updated_at ? new Date(caseData.updated_at) : null,
      lastSyncedAt:      new Date(),
    },
  })

  // ── 4. Upsert posts ───────────────────────────────────────────────────────
  for (const post of enrichedPosts) {
    const channel = resolvePostChannel(post)

    const contents = Array.isArray(post.contents) ? post.contents.join('\n') : String(post.contents ?? '')
    await prisma.ticketPost.upsert({
      where:  { ticketId_kayakoPostId: { ticketId: ticketRecord.id, kayakoPostId: post.id } },
      create: {
        ticketId:    ticketRecord.id,
        kayakoPostId: post.id,
        contents,
        channel,
        isPrivate:   channel === 'NOTE',
        creatorId:   post.creator?.id ?? null,
        creatorName: post.creator?.full_name ?? post.creator?.name ?? null,
        postedAt:    post.created_at ? new Date(post.created_at) : null,
      },
      update: {
        contents,
        channel,
        isPrivate:   channel === 'NOTE',
        creatorId:   post.creator?.id ?? null,
        creatorName: post.creator?.full_name ?? post.creator?.name ?? null,
      },
    })
  }

  // ── 5. Read back from DB and return ──────────────────────────────────────
  const saved = await prisma.ticket.findUniqueOrThrow({
    where:   { id: ticketRecord.id },
    include: { posts: { orderBy: { postedAt: 'asc' } } },
  })

  return {
    ticket:  dbTicketToRow(saved),
    posts:   saved.posts.map(dbPostToUnified),
    warning: warning || undefined,
  }
}
