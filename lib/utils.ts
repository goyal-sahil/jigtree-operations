/**
 * Format an ISO timestamp → "DD-MMM-YYYY HH:MM"
 * Matches the Streamlit tool's fmt_dt() output exactly.
 */
export function fmtDt(ts: string | null | undefined): string {
  if (!ts) return '—'
  try {
    const dt = new Date(ts)
    const day   = String(dt.getUTCDate()).padStart(2, '0')
    const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][dt.getUTCMonth()]
    const year  = dt.getUTCFullYear()
    const hh    = String(dt.getUTCHours()).padStart(2, '0')
    const mm    = String(dt.getUTCMinutes()).padStart(2, '0')
    return `${day}-${month}-${year} ${hh}:${mm}`
  } catch {
    return ts.slice(0, 16).replace('T', ' ')
  }
}

/**
 * Format an ISO date string → "DD-MMM-YYYY"
 */
export function fmtDate(ts: string | null | undefined): string {
  if (!ts) return '—'
  try {
    const [y, m, d] = ts.slice(0, 10).split('-').map(Number)
    const month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m - 1]
    return `${String(d).padStart(2, '0')}-${month}-${y}`
  } catch {
    return ts.slice(0, 10)
  }
}

/**
 * Safe label from a Kayako stub or full object.
 */
export function safeLabel(obj: object | null | undefined, fallback = '—'): string {
  if (!obj) return fallback
  const o = obj as Record<string, unknown>
  return String(o.label ?? o.name ?? o.title ?? (o.id ? `ID:${o.id}` : fallback))
}

/**
 * Safe full name from a user object.
 */
export function safeName(obj: object | null | undefined, fallback = '—'): string {
  if (!obj) return fallback
  const o = obj as Record<string, unknown>
  return String(o.full_name ?? o.name ?? (o.id ? `ID:${o.id}` : fallback))
}

/**
 * Extract email from a Kayako user object (checks multiple fields/shapes).
 */
export function extractEmail(user: object | null | undefined): string {
  if (!user) return ''
  const u = user as Record<string, unknown>
  if (typeof u.email === 'string') return u.email
  const identities = u.identities as Array<Record<string, unknown>> | undefined
  if (Array.isArray(identities)) {
    for (const id of identities) {
      if (id.resource_type === 'identity_email') {
        return String(id.email ?? id.value ?? '')
      }
    }
  }
  const emails = u.emails as Array<Record<string, unknown> | string> | undefined
  if (Array.isArray(emails) && emails.length > 0) {
    const first = emails[0]
    if (typeof first === 'string') return first
    if (typeof first === 'object') return String((first as Record<string,unknown>).email ?? (first as Record<string,unknown>).value ?? '')
  }
  return ''
}

/**
 * Extract plain text from a post's contents field (string or array).
 */
export function getPostText(post: { contents?: string | string[] }): string {
  const c = post.contents
  if (!c) return ''
  if (Array.isArray(c)) return c.join(' ')
  return String(c)
}

/**
 * Age in days from an ISO date string to now.
 */
export function ageDays(isoDate: string): number {
  try {
    return (Date.now() - new Date(isoDate).getTime()) / 86_400_000
  } catch {
    return 0
  }
}
