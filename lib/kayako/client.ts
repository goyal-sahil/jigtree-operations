/**
 * Kayako REST API client — TypeScript port of KayakoClient from kayako_tool.py
 *
 * Key differences from the Python version:
 * - No requests.Session; session_id + CSRF token are stored as instance props
 *   and manually injected into every request via headers().
 * - resolveUsers runs all missing-user fetches in parallel (Promise.allSettled).
 * - AbortSignal.timeout(15_000) is Node.js 18+ built-in — no extra packages.
 * - A new instance is created per API route invocation (stateless serverless).
 */

import type { KayakoCase, KayakoCaseFieldDef, KayakoCustomField, KayakoPost, KayakoUser } from '@/types/kayako'

export class KayakoClient {
  private baseUrl: string
  private sessionId = ''
  private csrfToken = ''
  private authHeader = ''
  private clientSignal?: AbortSignal

  constructor(baseUrl: string, clientSignal?: AbortSignal) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
    this.clientSignal = clientSignal
  }

  /**
   * Returns a signal that aborts on whichever fires first:
   * the 15 s per-request timeout, or the caller's cancellation signal.
   * Uses AbortSignal.any() on Node 20+; falls back to a manual combiner.
   */
  private makeSignal(): AbortSignal {
    const timeout = AbortSignal.timeout(15_000)
    if (!this.clientSignal) return timeout
    if (typeof (AbortSignal as { any?: unknown }).any === 'function') {
      return (AbortSignal as { any: (s: AbortSignal[]) => AbortSignal }).any([this.clientSignal, timeout])
    }
    // Node 18 fallback — manual combiner
    const controller = new AbortController()
    const abort = () => controller.abort()
    if (this.clientSignal.aborted || (timeout as unknown as { aborted: boolean }).aborted) {
      controller.abort()
    } else {
      this.clientSignal.addEventListener('abort', abort, { once: true })
      timeout.addEventListener('abort', abort, { once: true })
    }
    return controller.signal
  }

  async authenticate(email: string, password: string): Promise<void> {
    const b64 = Buffer.from(`${email}:${password}`).toString('base64')
    this.authHeader = `Basic ${b64}`
    const resp = await fetch(`${this.baseUrl}/api/v1/me`, {
      headers: {
        Authorization: this.authHeader,
        Accept: 'application/json',
      },
      signal: this.makeSignal(),
    })

    if (!resp.ok) {
      throw new Error(`Kayako authentication failed: HTTP ${resp.status}`)
    }

    const body = await resp.json()

    // Priority 1: session_id from JSON body (top-level or nested under data)
    this.sessionId = body.session_id ?? body.data?.session_id ?? ''

    // Priority 2: scan ALL Set-Cookie headers (Node 18+ getSetCookie returns array)
    const allCookies: string[] = typeof (resp.headers as { getSetCookie?: () => string[] }).getSetCookie === 'function'
      ? (resp.headers as { getSetCookie: () => string[] }).getSetCookie()
      : [resp.headers.get('set-cookie') ?? '']

    if (!this.sessionId) {
      for (const cookie of allCookies) {
        const match = cookie.match(/session_id=([^;]+)/)
        if (match) {
          this.sessionId = match[1]
          break
        }
      }
    }

    if (!this.sessionId) {
      throw new Error('Kayako authentication succeeded but no session_id was returned. Check that the API password (not web login password) is saved in Settings.')
    }

    // CSRF token
    this.csrfToken = resp.headers.get('x-csrf-token') ?? ''
  }

  private headers(): HeadersInit {
    const h: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    if (this.authHeader) h['Authorization'] = this.authHeader
    if (this.sessionId) h['Cookie'] = `session_id=${this.sessionId}`
    if (this.csrfToken) h['X-CSRF-Token'] = this.csrfToken
    return h
  }

  async get<T = unknown>(path: string, params?: Record<string, string | number>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`)
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
    }
    const resp = await fetch(url.toString(), {
      headers: this.headers(),
      signal: this.makeSignal(),
    })
    if (!resp.ok) throw new Error(`Kayako GET ${path} failed: HTTP ${resp.status}`)
    return resp.json() as Promise<T>
  }

  async post<T = unknown>(path: string, body: unknown): Promise<T> {
    const resp = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
      signal: this.makeSignal(),
    })
    if (!resp.ok) throw new Error(`Kayako POST ${path} failed: HTTP ${resp.status}`)
    return resp.json() as Promise<T>
  }

  // ── Ticket ────────────────────────────────────────────────────────────────

  /** Fetch a single case without shared lookups — caller supplies pre-fetched statuses/priorities/fieldDefs. */
  async getCaseRaw(caseId: number): Promise<{ data: KayakoCase }> {
    return this.get(`/api/v1/cases/${caseId}`, { include: 'user,team,organization,brand' })
  }

  /** Fetch organisation name by ID. Returns null on failure (fail-silent). */
  async getOrganizationName(orgId: number): Promise<string | null> {
    try {
      const resp = await this.get<{ data: { id: number; name?: string; title?: string; titles?: Array<{ translation?: string }> } }>(
        `/api/v1/organizations/${orgId}`,
      )
      return resp.data?.name ?? resp.data?.title ?? resp.data?.titles?.[0]?.translation ?? null
    } catch {
      return null
    }
  }

  /** Fetch tags for a case. Returns empty array on failure. */
  async getCaseTags(caseId: number): Promise<string[]> {
    try {
      const resp = await this.get<{ data: Array<{ name?: string }> }>(`/api/v1/cases/${caseId}/tags`)
      return (resp.data ?? []).map(t => t.name ?? '').filter(Boolean)
    } catch {
      return []
    }
  }

  async getCase(caseId: number): Promise<{ data: KayakoCase }> {
    const [caseResp, statuses, priorities, fieldDefs, tagsResp] = await Promise.allSettled([
      this.get<{ data: KayakoCase }>(`/api/v1/cases/${caseId}`, { include: 'user,team,organization,brand' }),
      this.get<{ data: Array<{ id: number; label?: string; name?: string }> }>('/api/v1/cases/statuses'),
      this.get<{ data: Array<{ id: number; label?: string; name?: string }> }>('/api/v1/cases/priorities'),
      this.get<{ data: KayakoCaseFieldDef[] }>('/api/v1/cases/fields'),
      this.getCaseTags(caseId),
    ])

    if (caseResp.status === 'rejected') throw caseResp.reason

    const caseData = caseResp.value.data

    // Use dedicated tags endpoint result (avoids URLSearchParams encoding + as %2B)
    caseData.tags = tagsResp.status === 'fulfilled' ? tagsResp.value : (caseData.tags ?? [])

    if (statuses.status === 'fulfilled') {
      const match = statuses.value.data?.find(s => s.id === caseData.status?.id)
      if (match) caseData.status = { ...caseData.status, label: match.label ?? match.name }
    }

    if (priorities.status === 'fulfilled') {
      const match = priorities.value.data?.find(p => p.id === caseData.priority?.id)
      if (match) caseData.priority = { ...caseData.priority, label: match.label ?? match.name }
    }

    if (fieldDefs.status === 'fulfilled') {
      const defMap = new Map<number, KayakoCaseFieldDef>(
        fieldDefs.value.data?.map(d => [d.id, d]) ?? []
      )
      const rawFields = (caseData as unknown as Record<string, unknown>).custom_fields as
        Array<{ field: { id: number }; value: unknown }> | undefined

      const SELECT_TYPES = new Set(['SELECT', 'RADIO', 'CASCADINGSELECT'])

      // Collect SELECT fields that have a numeric option ID value
      const selectFieldsWithValues = new Map<number, number>() // fieldId → optionId
      for (const cf of rawFields ?? []) {
        const def = defMap.get(cf.field.id)
        if (!def || def.is_system) continue
        const rawVal = cf.value
        if (rawVal === null || rawVal === undefined || rawVal === '') continue
        const value = String(rawVal)
        if (SELECT_TYPES.has(def.type) && /^\d+$/.test(value)) {
          selectFieldsWithValues.set(cf.field.id, Number(value))
        }
      }

      // Try to resolve option labels via include=field_option,locale_field.
      // If that returns full translations inline, we get them in one call.
      // If values are still locale_field stubs, resolve each locale translation separately.
      const optionLabelMap = new Map<number, string>() // optionId → label
      const localeStubs = new Map<number, number>()    // optionId → localeFieldId

      await Promise.allSettled(
        Array.from(selectFieldsWithValues.entries()).map(async ([fieldId, optionId]) => {
          try {
            const resp = await this.get<{ data: { options?: Array<{ id: number; values?: Array<{ id?: number; locale?: string; translation?: string }> }> } }>(
              `/api/v1/cases/fields/${fieldId}`, { include: 'field_option,locale_field' }
            )
            const opts = resp.data?.options ?? []
            const opt = opts.find(o => o.id === optionId)
            if (!opt) return
            const v = opt.values?.[0]
            if (v?.translation) {
              optionLabelMap.set(optionId, v.translation)
            } else if (v?.id) {
              localeStubs.set(optionId, v.id)
            }
          } catch {
            // silently skip
          }
        })
      )

      // Resolve any remaining locale_field stubs
      await Promise.allSettled(
        Array.from(localeStubs.entries()).map(async ([optionId, localeId]) => {
          try {
            const resp = await this.get<unknown>(`/api/v1/locale/fields/${localeId}`)
            const r = (resp as Record<string, unknown>)
            const t = ((r.data ?? r) as { translation?: string }).translation
            if (t) optionLabelMap.set(optionId, t)
          } catch {
            // silently skip
          }
        })
      )

      caseData.custom_fields = (rawFields ?? [])
        .map(cf => {
          const def = defMap.get(cf.field.id)
          if (!def || def.is_system) return null
          const rawVal = cf.value
          if (rawVal === null || rawVal === undefined || rawVal === '') return null
          const value = String(rawVal)
          let displayValue = value
          if (SELECT_TYPES.has(def.type) && /^\d+$/.test(value)) {
            const label = optionLabelMap.get(Number(value))
            if (!label) return null
            displayValue = label
          }
          return { id: def.id, label: def.title, value: displayValue, type: def.type }
        })
        .filter((f): f is KayakoCustomField => f !== null)
    }

    if (fieldDefs.status !== 'fulfilled') {
      // Field defs unavailable — drop raw stubs to prevent rendering objects
      caseData.custom_fields = []
    }

    return { data: caseData }
  }

  /**
   * Fetch all posts via pagination.
   * Strategy (mirrors Python get_all_posts):
   * 1. Use limit=200 to load most tickets in one request.
   * 2. Follow response.next_url if present (Kayako's own cursor).
   * 3. Fall back to manual offset if next_url absent.
   * 4. Deduplicate by post ID — Kayako's offset param is unreliable.
   */
  async getAllPosts(
    caseId: number,
    pageSize = 200,
    maxPosts = 500,
  ): Promise<{ posts: KayakoPost[]; warning: string }> {
    const allPosts: KayakoPost[] = []
    const seenIds = new Set<number>()
    let warning = ''
    let url: string | null = `${this.baseUrl}/api/v1/cases/${caseId}/posts`
    let params: Record<string, string> | null = { limit: String(pageSize), offset: '0' }

    while (allPosts.length < maxPosts && url) {
      const fullUrl = params ? `${url}?${new URLSearchParams(params)}` : url

      let data: { data: KayakoPost[]; next_url?: string }
      try {
        const resp = await fetch(fullUrl, {
          headers: this.headers(),
          signal: this.makeSignal(),
        })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        data = await resp.json()
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        warning = `Posts fetch stopped after ${allPosts.length} posts: ${msg}`
        break
      }

      const batch = data.data ?? []
      const newPosts = batch.filter(p => !seenIds.has(p.id))
      newPosts.forEach(p => seenIds.add(p.id))
      allPosts.push(...newPosts)

      if (data.next_url) {
        url = data.next_url.startsWith('http')
          ? data.next_url
          : `${this.baseUrl}${data.next_url}`
        params = null
      } else if (batch.length < pageSize || newPosts.length === 0) {
        break
      } else {
        params = { limit: String(pageSize), offset: String(allPosts.length) }
      }
    }

    if (allPosts.length >= maxPosts && !warning) {
      warning = `Only the first ${maxPosts} posts are shown — this ticket has more.`
    }

    return { posts: allPosts.slice(0, maxPosts), warning }
  }

  /**
   * Resolve creator names for posts that arrived as stubs.
   * Runs all missing-user fetches in parallel.
   * Seeds the cache with known users from the case (requester, assigned_agent)
   * so no extra requests are needed for them.
   */
  async resolveUsers(
    posts: KayakoPost[],
    seedUsers: (KayakoUser | null)[] = [],
  ): Promise<KayakoPost[]> {
    const cache = new Map<number, KayakoUser>()
    seedUsers.forEach(u => {
      if (u?.id && u?.full_name) cache.set(u.id, u)
    })

    const missing = new Set<number>()
    posts.forEach(p => {
      const uid = p.creator?.id
      if (uid && !p.creator?.full_name && !cache.has(uid)) missing.add(uid)
    })

    await Promise.allSettled(
      Array.from(missing).map(async uid => {
        try {
          const resp = await this.get<{ data: KayakoUser }>(`/api/v1/users/${uid}`)
          if (resp.data?.id) cache.set(uid, resp.data)
        } catch {
          // Silently skip — post will show ID instead of name
        }
      })
    )

    return posts.map(post => ({
      ...post,
      creator: cache.get(post.creator?.id) ?? post.creator,
    }))
  }

  // ── View / BU-PS Tickets ─────────────────────────────────────────────────

  /**
   * Fetch all case stubs in a Kayako view via GET /api/v1/views/{viewId}/cases.
   * Follows next_url pagination until exhausted.
   */
  async getViewCases(viewId: number): Promise<KayakoCase[]> {
    const allCases: KayakoCase[] = []
    const seenIds = new Set<number>()
    let url: string | null = `${this.baseUrl}/api/v1/views/${viewId}/cases?limit=200`
    let page = 1

    while (url) {
      const resp = await fetch(url, { headers: this.headers(), signal: this.makeSignal() })
      if (!resp.ok) throw new Error(`View cases fetch failed: HTTP ${resp.status}`)
      const data = await resp.json() as { data: KayakoCase[]; next_url?: string }
      const batch = data.data ?? []
      const newCases = batch.filter(c => !seenIds.has(c.id))
      newCases.forEach(c => { seenIds.add(c.id); allCases.push(c) })
      console.log(`[getViewCases] Page ${page}: ${batch.length} cases (${newCases.length} new), next_url=${data.next_url ? 'yes' : 'no'}`)
      if (!data.next_url || newCases.length === 0) break
      url = data.next_url.startsWith('http') ? data.next_url : `${this.baseUrl}${data.next_url}`
      page++
    }

    console.log(`[getViewCases] Total unique cases: ${allCases.length}`)
    return allCases
  }

  // ── Note ──────────────────────────────────────────────────────────────────

  async addNote(caseId: number, htmlContent: string): Promise<unknown> {
    return this.post(`/api/v1/cases/${caseId}/reply`, {
      contents: htmlContent,
      channel: 'NOTE',
      channel_options: { html: true },
    })
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────

export function extractCaseId(input: string): number | null {
  const trimmed = input.trim()
  const match = trimmed.match(/\/conversations\/(\d+)/)
  if (match) return parseInt(match[1], 10)
  if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10)
  return null
}

/** Convert plain text to HTML paragraphs for Kayako notes. */
export function textToHtml(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .split('\n\n')
    .filter(p => p.trim())
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('')
}
