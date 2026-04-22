# JigTree Operations Hub — Vercel/Supabase App Plan

## Status: v1.0.0 live — Phases 1–17.1 complete + Phase 16 (All Tickets page). Notion Portfolio integration and Phase 17.2–17.3 planned.

Full feature set working end-to-end:
- Ticket Analyser (DB-first, Refresh, Force re-run analysis)
- BU/PS Tickets table (sync, filter, sort, admin delete)
- BU/PS Ticket detail page (shared components, Refresh, AI analysis)
- **Markdown Export** — "⬇ Download .md" on both Ticket Analyser and BU/PS detail page; programmatic build + Claude Overview; cached in `ticket_exports`; stale-aware (auto re-runs analysis if fetch date > analysis date)
- Unified DB schema (`tickets`, `ticket_posts`, `ticket_analyses`, `ticket_exports`, `model_pricing`, `analysis_runs`)
- Token tracking (`inputTokens` / `outputTokens`) + USD cost calculation from `model_pricing`
- **API Usage History** (`analysis_runs`) — append-only, orphan-safe, with cost columns in UI; `runType` distinguishes analysis vs download; shown in both Ticket Analyser and BU/PS pages

App is live at **https://jigtree-operations.vercel.app** (GitHub: `goyal-sahil/jigtree-operations`).

The Streamlit tool at `C:\Users\sahil\CoWork\Central Kayako Tickets\` is **not modified** by this project.
This is a clean rewrite as a multi-user web application.

---

## Deployment

| Environment | URL | Trigger |
|---|---|---|
| Production | https://jigtree-operations.vercel.app | `npx vercel --prod` |
| GitHub | https://github.com/goyal-sahil/jigtree-operations | `git push origin main` |

### What diverged from the original plan
- **Prisma added**: the plan used raw Supabase client for DB — Prisma ORM was chosen instead for type-safe queries and schema management
- **`next.config.mjs`** instead of `next.config.ts` — Next.js 14 does not support `.ts` config files
- **`tsconfig.json`** requires `"target": "ES2017"` — needed for Set/Map iteration without downlevelIteration
- **Supabase SSR cookie type**: `CookieOptionsWithName` doesn't include `value`; inline type `{ name, value, options }[]` used instead
- **`lib/utils.ts`** added: shared helpers (`safeName`, `safeLabel`, `extractEmail`, `fmtDt`, `fmtDate`, `getPostText`, `ageDays`)
- **`NavBar.tsx`** added: not in original plan, extracted as its own component
- **Settings page**: uses Prisma instead of raw Supabase `.from()` calls; includes `isFirstLogin` prop for welcome flow
- **`DATABASE_URL` + `DIRECT_URL`**: Prisma requires two connection strings (transaction pooler port 6543 for runtime, direct port 5432 for migrations)

---

## 1. Project Structure

```
Central Kayako Tickets (Vercel)/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx                  # Google SSO login page
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts              # Supabase OAuth callback handler
│   ├── (dashboard)/
│   │   ├── layout.tsx                    # Auth guard — redirects to /login if no session
│   │   ├── page.tsx                      # Main ticket analyser page
│   │   └── settings/
│   │       └── page.tsx                  # First-login settings (credentials form)
│   └── api/
│       ├── ticket/
│       │   └── route.ts                  # POST — fetch ticket + all posts from Kayako
│       ├── analysis/
│       │   └── route.ts                  # POST — run AI analysis or return from cache
│       ├── note/
│       │   └── route.ts                  # POST — post internal note to Kayako
│       └── settings/
│           └── route.ts                  # POST — save encrypted credentials to Supabase
├── components/
│   ├── TicketAnalyser.tsx                # Main client component (state machine)
│   ├── TicketCard.tsx                    # Ticket metadata card
│   ├── ConversationThread.tsx            # Colour-coded post list
│   ├── Timeline.tsx                      # Date-grouped timeline view
│   ├── AIAnalysis.tsx                    # AI analysis sections + model pill
│   ├── AddNoteForm.tsx                   # Internal note textarea + submit
│   └── SettingsForm.tsx                  # Credentials form (Kayako + Anthropic)
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # Browser-side Supabase client (singleton)
│   │   └── server.ts                     # Server-side Supabase client (cookies)
│   ├── kayako/
│   │   └── client.ts                     # KayakoClient class (TypeScript port)
│   ├── anthropic/
│   │   └── client.ts                     # analyseTicket() + detectModel()
│   └── encryption.ts                     # AES-256-GCM encrypt/decrypt helpers
├── types/
│   └── kayako.ts                         # TypeScript interfaces for Kayako API objects
├── middleware.ts                          # Edge middleware — protects dashboard routes
├── .env.local                            # Local secrets (never commit)
├── .env.example                          # Documented env var template (commit this)
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── package.json
└── vercel.json
```

---

## 2. Supabase Setup

### 2.1 Create Supabase Project

1. Go to https://supabase.com → New project
2. Note the project URL and anon key for env vars

### 2.2 SQL Migrations

Run these in the Supabase SQL Editor in order.

**Migration 001 — user_settings:**
```sql
create table public.user_settings (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id) on delete cascade unique not null,
  kayako_url          text,
  kayako_email        text,
  kayako_password_enc text,   -- AES-256-GCM: base64(iv‖authTag‖ciphertext)
  anthropic_key_enc   text,   -- AES-256-GCM: base64(iv‖authTag‖ciphertext)
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table public.user_settings enable row level security;

create policy "users manage own settings"
  on public.user_settings
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

**Migration 002 — ticket_analyses:**
```sql
create table public.ticket_analyses (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  ticket_id     integer not null,
  kayako_url    text not null,
  sections      jsonb not null,   -- keys: executive_summary, one_line, case_summary,
                                  --       customer_sentiment, what_needed, next_steps
  day_summaries jsonb,            -- { "YYYY-MM-DD": "one sentence", ... }
  model_used    text,
  post_count    integer,
  created_at    timestamptz default now(),
  unique (user_id, ticket_id, kayako_url)
);

alter table public.ticket_analyses enable row level security;

create policy "users manage own analyses"
  on public.ticket_analyses
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

**Migration 003 — updated_at trigger:**
```sql
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on public.user_settings
  for each row execute procedure public.handle_updated_at();
```

### 2.3 Google OAuth Config

1. Supabase Dashboard → Authentication → Providers → Google → Enable
2. Create a Google Cloud OAuth 2.0 Client ID (Web application)
3. Authorised redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Paste Client ID and Client Secret into Supabase
5. In Supabase → Authentication → URL Configuration, add redirect URLs:
   - `http://localhost:3000/auth/callback` (local dev)
   - `https://your-vercel-domain.vercel.app/auth/callback` (production)

---

## 3. Environment Variables

Add to `.env.local` for local dev and to Vercel Dashboard for production.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL, e.g. `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key (safe to expose to browser) |
| `ENCRYPTION_SECRET` | 64-char hex string (32 bytes). Generate: `openssl rand -hex 32` |
| `NEXT_PUBLIC_APP_URL` | Full app URL e.g. `https://your-app.vercel.app` |

> **Important:** `ENCRYPTION_SECRET` must never change after users have saved credentials — rotating it invalidates all encrypted data in the database. Store it in a password manager.

> **Note:** `SUPABASE_SERVICE_ROLE_KEY` is not needed — all DB operations use the user's own session with RLS enforcement.

---

## 4. Phase-by-Phase Build Plan

---

### Phase 1 — Scaffold + Tooling

Bootstrap the project and install dependencies.

```bash
npx create-next-app@14 . --typescript --tailwind --app --no-src-dir
npm install @supabase/supabase-js @supabase/ssr @anthropic-ai/sdk
```

**Files to create/configure:**

**`package.json`** — key dependencies:
```json
{
  "dependencies": {
    "next": "14.2.x",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0",
    "@anthropic-ai/sdk": "^0",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "tailwindcss": "^3",
    "postcss": "^8",
    "autoprefixer": "^10"
  }
}
```

**`tsconfig.json`** — add path alias:
```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./*"] }
  }
}
```

**`.env.example`** — commit this (no real values):
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ENCRYPTION_SECRET=your-64-char-hex-string
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**`.gitignore`** — include `.env.local`, `node_modules/`, `.next/`

---

### Phase 2 — Supabase Auth + Middleware

**`lib/supabase/client.ts`** — browser client (used in `'use client'` components):
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**`lib/supabase/server.ts`** — server client (Route Handlers + Server Components):
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

**`middleware.ts`** — runs on every request, protects dashboard routes:
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  if (!user && !pathname.startsWith('/login') && !pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (user && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

**`app/(auth)/login/page.tsx`** — Google login button:
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 w-full max-w-sm">
        <h1 className="text-xl font-bold text-slate-900 mb-2">BU Support Analyser</h1>
        <p className="text-slate-500 text-sm mb-6">Sign in with your Google account to continue.</p>
        <button
          onClick={signInWithGoogle}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition"
        >
          Continue with Google
        </button>
      </div>
    </div>
  )
}
```

**`app/(auth)/auth/callback/route.ts`** — exchange OAuth code for session:
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}/`)
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_error`)
}
```

---

### Phase 3 — Encryption Helpers

**`lib/encryption.ts`** — AES-256-GCM. Server-only — never import in client components.

```typescript
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_SECRET
  if (!hex || hex.length !== 64) {
    throw new Error('ENCRYPTION_SECRET must be a 64-character hex string (32 bytes)')
  }
  return Buffer.from(hex, 'hex')
}

/**
 * Encrypt a plaintext string.
 * Returns base64(iv[12] + authTag[16] + ciphertext)
 */
export function encrypt(plaintext: string): string {
  const key = getKey()
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return Buffer.concat([iv, authTag, encrypted]).toString('base64')
}

/**
 * Decrypt a base64 blob produced by encrypt().
 */
export function decrypt(blob: string): string {
  const key = getKey()
  const buf = Buffer.from(blob, 'base64')
  const iv       = buf.subarray(0, 12)
  const authTag  = buf.subarray(12, 28)
  const ciphertext = buf.subarray(28)
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)
  return decipher.update(ciphertext) + decipher.final('utf8')
}
```

---

### Phase 4 — Settings Page + API Route

**`app/(dashboard)/settings/page.tsx`** — server component; passes non-sensitive existing values to form:
```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsForm from '@/components/SettingsForm'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: settings } = await supabase
    .from('user_settings')
    .select('kayako_url, kayako_email')
    .eq('user_id', user.id)
    .maybeSingle()

  // Passwords/keys are never passed back to the browser
  return (
    <SettingsForm
      initialKayakoUrl={settings?.kayako_url ?? ''}
      initialKayakoEmail={settings?.kayako_email ?? ''}
    />
  )
}
```

**`components/SettingsForm.tsx`** — client component with four fields:
- Kayako URL, Kayako Email, Kayako Password (`type="password"`), Anthropic API Key (`type="password"`)
- On submit: `POST /api/settings`
- On success: `router.push('/')`
- Password/key fields are always empty on load (re-enter to change)

**`app/api/settings/route.ts`:**
```typescript
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { encrypt } from '@/lib/encryption'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as {
    kayako_url: string
    kayako_email: string
    kayako_password?: string
    anthropic_key?: string
  }

  const payload: Record<string, string> = {
    user_id: user.id,
    kayako_url: body.kayako_url.trim(),
    kayako_email: body.kayako_email.trim(),
    updated_at: new Date().toISOString(),
  }

  if (body.kayako_password?.trim()) {
    payload.kayako_password_enc = encrypt(body.kayako_password.trim())
  }
  if (body.anthropic_key?.trim()) {
    payload.anthropic_key_enc = encrypt(body.anthropic_key.trim())
  }

  const { error } = await supabase
    .from('user_settings')
    .upsert(payload, { onConflict: 'user_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
```

---

### Phase 5 — Kayako Client (TypeScript Port)

**`types/kayako.ts`:**
```typescript
export interface KayakoCase {
  id: number
  subject: string
  status: { id: number; label?: string; name?: string }
  priority: { id: number; label?: string; name?: string }
  requester: KayakoUser
  assigned_agent: KayakoUser | null
  assigned_team: { id: number; name?: string } | null
  tags: string[]
  created_at: string
  updated_at: string
}

export interface KayakoUser {
  id: number
  full_name?: string
  name?: string
  identities?: Array<{ resource_type?: string; email?: string; value?: string }>
  emails?: Array<{ email?: string; value?: string } | string>
}

export interface KayakoPost {
  id: number
  channel: { id?: number; label?: string } | string
  creator: KayakoUser
  contents: string | string[]
  created_at: string
}
```

**`lib/kayako/client.ts`** — key implementation notes:

- No `requests.Session` in Node.js — `session_id` and `X-CSRF-Token` are stored as instance properties and manually injected into every request via `headers()`.
- `AbortSignal.timeout(15_000)` is Node.js 18+ built-in — no extra package needed.
- `resolveUsers` fetches all missing users concurrently with `Promise.allSettled` (vs sequential in Python).
- Every API route invocation creates a fresh `KayakoClient` and calls `authenticate()` — Vercel serverless functions have no persistent memory.

```typescript
import type { KayakoCase, KayakoPost, KayakoUser } from '@/types/kayako'

export class KayakoClient {
  private baseUrl: string
  private sessionId = ''
  private csrfToken = ''

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  async authenticate(email: string, password: string): Promise<void> {
    const b64 = Buffer.from(`${email}:${password}`).toString('base64')
    const resp = await fetch(`${this.baseUrl}/api/v1/me`, {
      headers: { Authorization: `Basic ${b64}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(15_000),
    })
    if (!resp.ok) throw new Error(`Kayako auth failed: HTTP ${resp.status}`)

    const body = await resp.json()
    this.sessionId = body.session_id ?? ''

    if (!this.sessionId) {
      const match = (resp.headers.get('set-cookie') ?? '').match(/session_id=([^;]+)/)
      if (match) this.sessionId = match[1]
    }
    this.csrfToken = resp.headers.get('x-csrf-token') ?? ''
  }

  private headers(): HeadersInit {
    const h: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    if (this.sessionId) h['Cookie'] = `session_id=${this.sessionId}`
    if (this.csrfToken) h['X-CSRF-Token'] = this.csrfToken
    return h
  }

  async get<T = unknown>(path: string, params?: Record<string, string | number>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`)
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
    const resp = await fetch(url.toString(), {
      headers: this.headers(),
      signal: AbortSignal.timeout(15_000),
    })
    if (!resp.ok) throw new Error(`Kayako GET ${path} failed: HTTP ${resp.status}`)
    return resp.json() as Promise<T>
  }

  async post<T = unknown>(path: string, body: unknown): Promise<T> {
    const resp = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    })
    if (!resp.ok) throw new Error(`Kayako POST ${path} failed: HTTP ${resp.status}`)
    return resp.json() as Promise<T>
  }

  async getCase(caseId: number): Promise<{ data: KayakoCase }> {
    return this.get(`/api/v1/cases/${caseId}`, { include: 'user,team' })
  }

  async getAllPosts(
    caseId: number,
    pageSize = 200,
    maxPosts = 500
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
          signal: AbortSignal.timeout(15_000),
        })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        data = await resp.json()
      } catch (err: unknown) {
        warning = `Posts fetch error after ${allPosts.length} posts: ${err instanceof Error ? err.message : String(err)}`
        break
      }

      const batch = data.data ?? []
      const newPosts = batch.filter(p => !seenIds.has(p.id))
      newPosts.forEach(p => seenIds.add(p.id))
      allPosts.push(...newPosts)

      if (data.next_url) {
        url = data.next_url.startsWith('http') ? data.next_url : `${this.baseUrl}${data.next_url}`
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

  async resolveUsers(posts: KayakoPost[], seedUsers: KayakoUser[] = []): Promise<KayakoPost[]> {
    const cache = new Map<number, KayakoUser>()
    seedUsers.forEach(u => { if (u?.id && u?.full_name) cache.set(u.id, u) })

    const missing = new Set<number>()
    posts.forEach(p => {
      const uid = p.creator?.id
      if (uid && !p.creator?.full_name && !cache.has(uid)) missing.add(uid)
    })

    await Promise.allSettled(
      [...missing].map(async uid => {
        try {
          const resp = await this.get<{ data: KayakoUser }>(`/api/v1/users/${uid}`)
          if (resp.data?.id) cache.set(uid, resp.data)
        } catch {}
      })
    )

    return posts.map(post => ({
      ...post,
      creator: cache.get(post.creator?.id) ?? post.creator,
    }))
  }

  async addNote(caseId: number, htmlContent: string): Promise<unknown> {
    return this.post(`/api/v1/cases/${caseId}/reply`, {
      contents: htmlContent,
      channel: 'NOTE',
      channel_options: { html: true },
    })
  }
}

export function extractCaseId(input: string): number | null {
  const trimmed = input.trim()
  const match = trimmed.match(/\/conversations\/(\d+)/)
  if (match) return parseInt(match[1], 10)
  if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10)
  return null
}
```

---

### Phase 6 — Ticket API Route

**`app/api/ticket/route.ts`** — decrypts credentials, authenticates with Kayako, fetches and returns full ticket data:

```typescript
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { KayakoClient, extractCaseId } from '@/lib/kayako/client'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: settings } = await supabase
    .from('user_settings')
    .select('kayako_url, kayako_email, kayako_password_enc')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!settings?.kayako_password_enc) {
    return NextResponse.json(
      { error: 'Kayako credentials not configured. Please visit Settings.' },
      { status: 400 }
    )
  }

  const { ticketInput } = await request.json() as { ticketInput: string }
  const caseId = extractCaseId(ticketInput)
  if (!caseId) return NextResponse.json({ error: 'Invalid ticket URL or ID' }, { status: 400 })

  let password: string
  try {
    password = decrypt(settings.kayako_password_enc)
  } catch {
    return NextResponse.json({ error: 'Failed to decrypt credentials' }, { status: 500 })
  }

  const client = new KayakoClient(settings.kayako_url)
  try {
    await client.authenticate(settings.kayako_email, password)
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Authentication failed' },
      { status: 502 }
    )
  }

  try {
    const caseResp = await client.getCase(caseId)
    const caseData = caseResp.data
    const { posts, warning } = await client.getAllPosts(caseId)
    const seedUsers = [caseData.requester, caseData.assigned_agent].filter(Boolean)
    const enrichedPosts = await client.resolveUsers(posts, seedUsers as KayakoUser[])
    return NextResponse.json({ caseData, posts: enrichedPosts, warning, caseId })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch ticket' },
      { status: 502 }
    )
  }
}
```

---

### Phase 7 — Anthropic Analysis + Caching

**`lib/anthropic/client.ts`** — port of `detect_model` and `analyse_ticket_with_ai`:

```typescript
import Anthropic from '@anthropic-ai/sdk'
import type { KayakoCase, KayakoPost } from '@/types/kayako'

const COMPLEXITY_KEYWORDS = [
  'urgent', 'escalat', 'legal', 'refund', 'cancel', 'chargeback',
  'frustrated', 'angry', 'unacceptable', 'lawsuit', 'terrible',
  'outage', 'critical', 'broken', 'down', 'lost data',
]

export function detectModel(caseData: KayakoCase, posts: KayakoPost[]): string {
  let score = 0
  const n = posts.length
  if (n > 15) score += 2
  if (n > 30) score += 2

  const combined = [
    caseData.subject ?? '',
    ...posts.map(p => Array.isArray(p.contents) ? p.contents.join(' ') : String(p.contents ?? '')),
  ].join(' ').toLowerCase()

  if (COMPLEXITY_KEYWORDS.some(kw => combined.includes(kw))) score += 1

  if (caseData.created_at) {
    const ageDays = (Date.now() - new Date(caseData.created_at).getTime()) / 86_400_000
    if (ageDays > 7) score += 2
  }

  return score >= 3 ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001'
}

export interface AnalysisSections {
  executive_summary: string
  one_line: string
  case_summary: string
  customer_sentiment: string
  what_needed: string
  next_steps: string
}

export interface AnalysisResult {
  sections: AnalysisSections
  day_summaries: Record<string, string>
  model_used: string
  post_count: number
}

function buildConversationBlock(posts: KayakoPost[]): string {
  return posts.map(post => {
    const ch = typeof post.channel === 'object' ? (post.channel.label ?? '') : String(post.channel ?? '')
    const isNote = ch.toUpperCase() === 'NOTE'
    const author = post.creator?.full_name ?? post.creator?.name ?? 'Unknown'
    const text = (Array.isArray(post.contents) ? post.contents.join(' ') : String(post.contents ?? '')).slice(0, 1500)
    const ts = (post.created_at ?? '').slice(0, 16).replace('T', ' ')
    const vis = isNote ? '[INTERNAL — not visible to customer]' : '[Customer-visible]'
    return `[${ts}] ${vis} ${author}:\n${text}`
  }).join('\n\n---\n\n')
}

function parseSections(raw: string): AnalysisSections & { day_summaries_raw: string } {
  const map: Record<string, string> = {}
  for (const part of raw.split(/^##\s+/m)) {
    if (!part.trim()) continue
    const nl = part.indexOf('\n')
    map[part.slice(0, nl < 0 ? undefined : nl).trim()] = nl < 0 ? '' : part.slice(nl + 1).trim()
  }
  return {
    executive_summary: map['Executive Summary'] ?? '',
    one_line: map['One-Line Summary'] ?? '',
    case_summary: map['Case Summary'] ?? '',
    customer_sentiment: map['Customer Sentiment'] ?? '',
    what_needed: map["What's Needed to Close This Ticket"] ?? '',
    next_steps: map['Recommended Next Steps'] ?? '',
    day_summaries_raw: map['Day-by-Day Summary'] ?? '',
  }
}

function parseDaySummaries(raw: string): Record<string, string> {
  const result: Record<string, string> = {}
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (/^\d{4}-\d{2}-\d{2}:/.test(t)) {
      const i = t.indexOf(':')
      result[t.slice(0, i).trim()] = t.slice(i + 1).trim()
    }
  }
  return result
}

export async function analyseTicket(
  caseData: KayakoCase,
  posts: KayakoPost[],
  apiKey: string
): Promise<AnalysisResult> {
  const model = detectModel(caseData, posts)
  const client = new Anthropic({ apiKey })

  const subject = caseData.subject ?? 'No subject'
  const requester = caseData.requester?.full_name ?? caseData.requester?.name ?? '—'
  const status = String((caseData.status as Record<string, unknown>)?.label ?? (caseData.status as Record<string, unknown>)?.name ?? '—')
  const tags = caseData.tags?.join(', ') || '—'

  const systemPrompt = `You are a senior customer support analyst. You read full support ticket histories — including internal notes that the customer cannot see — and produce clear, actionable analysis for support agents. Be concise, specific, and professional. Use markdown formatting.`

  const userPrompt = `Analyse this support ticket and return EXACTLY these seven sections with these headings:

## Executive Summary
One short paragraph (3–4 sentences) a manager could read in 10 seconds.

## One-Line Summary
A single sentence (max 20 words) describing what this ticket is about.

## Case Summary
3–5 sentences: what was reported, what was tried, where things stand now.

## Customer Sentiment
One sentence on emotional state, then 1–2 sentences on what's driving it.

## What's Needed to Close This Ticket
Bullet-point list of specific closure conditions. Be precise.

## Recommended Next Steps
Numbered action plan, ordered by priority. Include who is responsible.

## Day-by-Day Summary
For each active date, one sentence. Format exactly as:
YYYY-MM-DD: [one sentence summary]

---

TICKET METADATA
- Subject: ${subject}
- Requester: ${requester}
- Status: ${status}
- Tags: ${tags}
- Created: ${(caseData.created_at ?? '').slice(0, 10)}
- Total posts: ${posts.length}

FULL CONVERSATION HISTORY
${buildConversationBlock(posts)}`

  const response = await client.messages.create({
    model,
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : ''
  const parsed = parseSections(raw)

  return {
    sections: {
      executive_summary: parsed.executive_summary,
      one_line: parsed.one_line,
      case_summary: parsed.case_summary,
      customer_sentiment: parsed.customer_sentiment,
      what_needed: parsed.what_needed,
      next_steps: parsed.next_steps,
    },
    day_summaries: parseDaySummaries(parsed.day_summaries_raw),
    model_used: model,
    post_count: posts.length,
  }
}
```

**`app/api/analysis/route.ts`** — cache check, Claude call on miss, upsert and return:
```typescript
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { analyseTicket } from '@/lib/anthropic/client'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { caseId, caseData, posts, forceRefresh = false } = await request.json()

  const { data: settings } = await supabase
    .from('user_settings')
    .select('kayako_url, anthropic_key_enc')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!settings?.anthropic_key_enc) {
    return NextResponse.json({ error: 'Anthropic API key not configured.' }, { status: 400 })
  }

  // Cache hit
  if (!forceRefresh) {
    const { data: cached } = await supabase
      .from('ticket_analyses')
      .select('sections, day_summaries, model_used, post_count, created_at')
      .eq('user_id', user.id)
      .eq('ticket_id', caseId)
      .eq('kayako_url', settings.kayako_url)
      .maybeSingle()

    if (cached) return NextResponse.json({ ...cached, fromCache: true })
  }

  let apiKey: string
  try {
    apiKey = decrypt(settings.anthropic_key_enc)
  } catch {
    return NextResponse.json({ error: 'Failed to decrypt Anthropic key' }, { status: 500 })
  }

  let result
  try {
    result = await analyseTicket(caseData, posts, apiKey)
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'AI analysis failed' },
      { status: 502 }
    )
  }

  // Save to cache
  await supabase.from('ticket_analyses').upsert({
    user_id: user.id,
    ticket_id: caseId,
    kayako_url: settings.kayako_url,
    sections: result.sections,
    day_summaries: result.day_summaries,
    model_used: result.model_used,
    post_count: result.post_count,
  }, { onConflict: 'user_id,ticket_id,kayako_url' })

  return NextResponse.json({ ...result, fromCache: false })
}
```

---

### Phase 8 — Add Note API Route

**`app/api/note/route.ts`:**
```typescript
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decrypt } from '@/lib/encryption'
import { KayakoClient } from '@/lib/kayako/client'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { caseId, noteText } = await request.json() as { caseId: number; noteText: string }

  const { data: settings } = await supabase
    .from('user_settings')
    .select('kayako_url, kayako_email, kayako_password_enc')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!settings?.kayako_password_enc) {
    return NextResponse.json({ error: 'Kayako credentials not configured.' }, { status: 400 })
  }

  const password = decrypt(settings.kayako_password_enc)
  const client = new KayakoClient(settings.kayako_url)
  await client.authenticate(settings.kayako_email, password)

  // Convert plain text to HTML paragraphs (matches Streamlit tool behaviour)
  const html = noteText.replace(/\r\n/g, '\n').split('\n\n')
    .filter(p => p.trim())
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('')

  await client.addNote(caseId, html)
  return NextResponse.json({ ok: true })
}
```

---

### Phase 9 — Main Dashboard UI

**`app/(dashboard)/page.tsx`** — server component; first-login check and initial render:
```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TicketAnalyser from '@/components/TicketAnalyser'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: settings } = await supabase
    .from('user_settings')
    .select('id, kayako_url')
    .eq('user_id', user.id)
    .maybeSingle()

  // First login — no credentials saved yet
  if (!settings?.kayako_url) redirect('/settings')

  return <TicketAnalyser userEmail={user.email ?? ''} />
}
```

**`components/TicketAnalyser.tsx`** — client component; owns all interactive state:
- State: `ticketInput`, `loading`, `ticketData` (caseData + posts + warning + caseId), `analysis`, `activeTab`
- `fetchTicket()`: calls `POST /api/ticket`, sets `ticketData`
- `runAnalysis(forceRefresh?)`: calls `POST /api/analysis`, sets `analysis`
- Renders: search bar → `<TicketCard>` → warning banner → conversation expander → tabs (AI Analysis / Timeline / Add Note)

**Component responsibilities:**

| Component | Props | Renders |
|---|---|---|
| `TicketCard` | `caseData`, `caseId` | Subject, requester, agent, team, status badge, priority, tags, created, message count |
| `ConversationThread` | `posts`, `requesterId` | Colour-coded bubbles (red/blue/yellow) with author, timestamp, badge |
| `AIAnalysis` | `analysis`, `onRerun`, `loading` | Model pill, 2-column sections, "Re-run" button |
| `Timeline` | `posts`, `daySummaries` | Date groups with AI summary and collapsible post list |
| `AddNoteForm` | `caseId`, `onSuccess` | Textarea + post button → `POST /api/note` |

**Colour coding** (matches Streamlit):
- `channel === 'NOTE'` → yellow (`#fffde7`)
- `creator.id === requester.id && not NOTE` → red (`#fff5f5`)
- else → blue (`#eff6ff`)

---

### Phase 10 — UI Polish + Deploy

1. **Nav bar**: user avatar + email + "Settings" link + "Sign Out" button (`supabase.auth.signOut()`)
2. **Loading states**: skeleton placeholders during ticket fetch and AI analysis
3. **Toast/inline feedback**: settings saved, note posted, errors from API routes
4. **Mobile responsive**: Tailwind `sm:` prefixes on grid layouts
5. **Deploy to Vercel**:
   - Push to GitHub
   - Import repo in Vercel dashboard
   - Add all env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ENCRYPTION_SECRET`, `NEXT_PUBLIC_APP_URL`)
   - Update Supabase redirect URLs with the Vercel production domain
   - Deploy

---

## 5. Key Implementation Decisions

### 5.1 Stateless API Routes

Vercel functions have no persistent memory between requests. A new `KayakoClient` instance is created per API call and re-authenticates with Kayako each time. This is one extra HTTP call per user action but is fast and correct.

If Kayako auth latency becomes a problem, a short-lived server-side cache (e.g. Redis/Upstash) could cache `session_id` per user for a few minutes. Out of scope for the initial build.

### 5.2 Service Role Key Not Required

All database operations happen inside Route Handlers using the user's own Supabase session. RLS policies enforce row-level isolation. No `SUPABASE_SERVICE_ROLE_KEY` is needed.

### 5.3 Encryption Key Rotation

Rotating `ENCRYPTION_SECRET` requires a migration script:
1. Fetch all `user_settings` rows with the service role key
2. Decrypt each encrypted field with the old key
3. Re-encrypt with the new key
4. Write back

Store the key permanently in a password manager — losing it means losing all saved credentials.

### 5.4 AI Cache Invalidation

Cache key: `(user_id, ticket_id, kayako_url)`. Cache is NOT auto-invalidated when the ticket changes. Users click **"Re-run Analysis"** which calls `POST /api/analysis` with `forceRefresh: true`.

---

## 6. TypeScript Port Mapping

| Python (`kayako_tool.py`) | Next.js equivalent |
|---|---|
| `KayakoClient.__init__` + `_authenticate` | `KayakoClient.constructor` + `.authenticate()` |
| `KayakoClient.get / post` | `KayakoClient.get / post` |
| `KayakoClient.get_case` | `KayakoClient.getCase` |
| `KayakoClient.get_all_posts` | `KayakoClient.getAllPosts` |
| `KayakoClient.resolve_users` | `KayakoClient.resolveUsers` (parallel) |
| `KayakoClient.add_note` | `KayakoClient.addNote` |
| `extract_case_id` | `extractCaseId` |
| `safe_label / safe_name / extract_email` | Inline in component/util files |
| `fmt_dt / fmt_date` | `Intl.DateTimeFormat` in `lib/utils.ts` |
| `detect_model` | `detectModel` in `lib/anthropic/client.ts` |
| `build_conversation_block` | `buildConversationBlock` in `lib/anthropic/client.ts` |
| `analyse_ticket_with_ai` | `analyseTicket` in `lib/anthropic/client.ts` |
| Streamlit sidebar credentials | `app/(dashboard)/settings/` + `app/api/settings/` |
| `st.session_state` (ticket, posts) | `React.useState` in `TicketAnalyser.tsx` |
| AI analysis tab | `AIAnalysis.tsx` + `app/api/analysis/` |
| Timeline tab | `Timeline.tsx` |
| Add note tab | `AddNoteForm.tsx` + `app/api/note/` |
| Streamlit auth (Connect button) | Handled transparently — credentials from Supabase |

---

## 7. Build Order Checklist

- [x] Phase 1 — Scaffold + Tooling (package.json, tsconfig, Tailwind, next.config.mjs, .gitignore, .env.example)
- [x] Phase 2 — Supabase Auth + Middleware (clients, middleware, login page, OAuth callback)
- [x] Phase 3 — Encryption Helpers (`lib/encryption.ts` — AES-256-GCM)
- [x] Phase 4 — Settings Page + API Route (Prisma-based; includes isFirstLogin welcome flow)
- [x] Phase 5 — Kayako Client (`types/kayako.ts`, `lib/kayako/client.ts`, `lib/utils.ts`)
- [x] Phase 6 — Ticket API Route (`app/api/ticket/route.ts`)
- [x] Phase 7 — Anthropic Analysis + Caching (`lib/anthropic/client.ts`, `app/api/analysis/route.ts`)
- [x] Phase 8 — Add Note API Route (`app/api/note/route.ts`)
- [x] Phase 9 — UI Components + Dashboard (NavBar, TicketCard, ConversationThread, AIAnalysis, Timeline, AddNoteForm, SettingsForm, TicketAnalyser, all pages)
- [x] Phase 10 — Polish + Deploy
  - [x] NavBar with email, settings link, sign out
  - [x] Deploy to Vercel (https://jigtree-operations.vercel.app)
  - [x] GitHub repo: goyal-sahil/jigtree-operations
  - [x] Mobile responsive (sm: Tailwind prefixes on grids)
- [x] Supabase: create project (JigTree Operations, ap-northeast-1)
- [x] Google Cloud: create OAuth client (JigTree Operations (Vercel)), add redirect URIs
- [x] Fill in `.env.local` and `.env` with all credentials
- [x] Run `npm run db:push` — tables created in Supabase
- [x] Run RLS policies in Supabase SQL editor — done (user_settings, ticket_analyses, bu_ps_* tables)
- [x] Vercel: env vars set, GitHub connected, deployed

---

### Phase 11 — JigTree Operations Hub + Layout Restructure

**Spec:** `docs/bu-ps-tickets-spec.md` §2–3

- [x] Add `Sidebar.tsx` — collapsible left nav (icon + label, active route highlight, user footer)
- [x] Update `app/(dashboard)/layout.tsx` — sidebar + main content grid, retire NavBar
- [x] Move Ticket Analyser to `app/(dashboard)/analyser/page.tsx`
- [x] Add `HubPage.tsx` — tile grid component
- [x] Update `app/(dashboard)/page.tsx` — render Hub (first-login redirect to /settings preserved)

---

### Phase 12 — BU/PS Tickets

**Spec:** `docs/bu-ps-tickets-spec.md` §4–13
**Kayako view:** https://central-supportdesk.kayako.com/agent/conversations/view/64

#### 12.1 Database
- [x] Add `BuPsTicket`, `BuPsTicketPost`, `BuPsTicketCustomField` models to `prisma/schema.prisma`
- [x] Run `npm run db:push` — schema applied to Supabase
- [x] Run RLS SQL in Supabase (see spec §9) — SELECT policies created for all 3 tables

#### 12.2 Types & Client
- [x] Extend `types/kayako.ts` — add `KayakoOrganization`, `BuPsTicketRow`; add `organization` to `KayakoCase`
- [x] Add `getViewCases(viewId)` to `KayakoClient` — paginated view fetch with endpoint fallback

#### 12.3 API Routes
- [x] `app/api/bu-tickets/route.ts` — GET tickets from DB
- [x] `app/api/bu-tickets/sync/route.ts` — POST sync from Kayako (batched, upserts all 3 tables)

#### 12.4 UI
- [x] `components/BUTicketsTable.tsx` — sortable/filterable table, Sync button, last-synced indicator
- [x] `app/(dashboard)/bu-tickets/page.tsx` — server component shell + client table

#### 12.5 Deploy & Test
- [x] Push to GitHub → auto-deployed
- [x] Sync endpoint working — Kayako view endpoint confirmed (`/api/v1/views/64/cases`)
- [x] Field mapping verified: Esc, Team, BU, GHI, JIRA, Hold Reason

### Phase 13 — Unified Architecture + Ticket Detail Page

- [x] Unified `tickets` table replaces `BuPsTicket` (schema reset, `db:push` applied)
- [x] Unified `ticket_posts` replaces `BuPsTicketPost`
- [x] Unified `ticket_analyses` with `status` field (pending/running/done/error)
- [x] `requesterKayakoId` and `customFields` added to `tickets` table
- [x] `inputTokens` / `outputTokens` added to `ticket_analyses`
- [x] `getCaseRaw` + `getCase` include `brand` + `fields=+tags`
- [x] Brand name used as BU column (was `organization.name`, now `brand.name`)
- [x] GHI extraction handles full GitHub URLs — extracts issue number
- [x] `/api/bu-tickets/sync-posts` — background post-fetch job (10 tickets/run)
- [x] `/api/bu-tickets/analyse-batch` — background AI analysis job (5 tickets/run)
- [x] Sync triggers both background jobs client-side after completing
- [x] `/api/bu-tickets/[id]` — GET single ticket + posts + analysis from DB
- [x] `/api/bu-tickets/[id]/refresh` — POST re-fetch from Kayako, persist, return TicketResponse
- [x] `/api/ticket` — now DB-first; persists ticket + posts to unified table
- [x] `/api/analysis` — reads from DB (no longer accepts caseData/posts in body)
- [x] `/api/credentials` — GET hasKayako / hasAnthropic booleans
- [x] `lib/kayako/ticketService.ts` — single fetchAndPersistTicket service (Analyser + BU/PS refresh)
- [x] AI prompt updated: bullet-point format, 4 sections + timeline
- [x] `AIAnalysis.tsx` reworked: Lucide icons, card layout, pending/error states
- [x] `TicketCard` — accepts `TicketRow`, `lastSyncedAt`, `onRefresh`, `refreshing`
- [x] `ConversationThread` — accepts `UnifiedPost[]` + `requesterKayakoId`; filter toggles (Customer/Support/Note)
- [x] `Timeline` — accepts `UnifiedPost[]` + `requesterKayakoId`
- [x] `CredentialsBanner` component — shown on both Analyser and BU/PS pages
- [x] `BUTicketsTable` — ID links to detail page, external Kayako icon link
- [x] `/bu-tickets/[id]` detail page — shared components (TicketCard/ConversationThread/Timeline), tabs (AI/Timeline/Note), Refresh button
- [x] Token tracking: `inputTokens` / `outputTokens` stored in `ticket_analyses`
- [x] Deployed to Vercel — `ADMIN_EMAILS` env var added

### Runtime bugs fixed post-build
- **Kayako 401 on case fetch**: Authorization header was not included in post-auth requests. Fixed by storing `authHeader` as instance property and including it in `headers()` on all calls.
- **Prisma `DIRECT_URL` not found**: Prisma reads `.env`, not `.env.local`. Created separate `.env` file for Prisma DB URLs.
- **Supabase direct DB port blocked**: Corporate network blocks port 5432 on `db.xxx.supabase.co`. Switched `DIRECT_URL` to session mode pooler (`pooler.supabase.com:5432`).
- **Anthropic 500 errors**: Transient server errors from Anthropic — retry resolves them.
- **SELECT custom fields showing raw numeric IDs** (e.g. "7147" instead of "Discover XI"): The case response returns option IDs, not labels. Fixed by fetching `GET /api/v1/cases/fields/{fieldId}?include=field_option,locale_field` for each SELECT field to resolve option labels. `/api/v1/base/field/option/{id}` returns HTTP 400 for external API consumers and cannot be used. Added `KayakoCaseFieldDef` and `KayakoCustomField` types. `getCase()` now runs 4 parallel calls (case, statuses, priorities, field defs) plus N calls per SELECT field.

---

## Phase 14 — Post-launch fixes and polish

- [x] **RLS policies**: Run in Supabase SQL editor for `tickets`, `ticket_posts`, `ticket_analyses`, `analysis_runs`, `model_pricing` tables — SQL written in `docs/setup.md § 4`
- [x] **Anthropic retry on transient 500**: 1 retry after 2s in `analyseTicket()` — implemented
- [x] **Token tracking in analyse-batch**: `inputTokens`/`outputTokens` added to the batch analysis upsert
- [x] **Stale-data banner on BU/PS detail page**: shown when `postsStatus !== 'done'` and posts are empty, prompting Refresh
- [x] **Escape key in TicketAnalyser**: clears input + ticket state
- [x] **Post channel resolution fix**: `resolvePostChannel()` in `ticketService.ts` — uses `source_channel.type`, `original.resource_type`, `is_requester` from raw post JSON. `include=channel` was discovered to be silently ignored by Kayako.
- [x] **HTML rendering for post contents**: `dangerouslySetInnerHTML` + `@tailwindcss/typography` `prose` styling in `ConversationThread`
- [x] **Single code path for sync-posts**: `sync-posts/route.ts` now calls `fetchAndPersistTicket()` directly — identical to individual Refresh button
- [x] **`requesterKayakoId` fixed in sync/route.ts**: `mapTicket` now includes `requesterKayakoId: caseData.requester?.id ?? null`
- [x] **4-type filter toggles in ConversationThread**: Customer / Support / Internal Note / Side Conversation — only shows types present in the ticket
- [x] **8-section AI prompt**: `one_liner`, `blocker_type`, `blocker_detail`, `path_to_closure`, `case_summary`, `customer_sentiment`, `what_needed`, `next_steps` — `oneLiner` + `blockerType` stored as dedicated DB columns
- [x] **Analysis run history** (`analysis_runs` table): append-only log of every analysis attempt; `ticketId onDelete: SetNull` for orphan safety; `kayakoTicketId + kayakoUrl` for re-linking; auto-relink in `GET /api/bu-tickets/[id]`
- [x] **USD cost calculation** (`lib/pricing.ts`, `model_pricing` table): date-range pricing rows seeded via `prisma/seed-pricing.sql`; `findPricing` + `computeCost` compute costs at query time; `AnalysisHistory` shows per-run and total costs
- [x] **`AnalysisHistory` component**: collapsible table with 11 columns + cost tfoot; orphaned run labels
- [x] **`TimezoneProvider` + `lib/tz.ts`**: browser timezone propagated via context; used for date formatting across all components

## Post-launch bug fixes (applied after v1.0.0)

- [x] **Bug: Cached AI analysis not auto-loading in Ticket Analyser** — `/api/ticket` now performs a `ticketAnalysis.findUnique` lookup (for both DB-cache hit and live fetch paths) and returns `cachedAnalysis?: AnalysisResult | null` in the response. `TicketAnalyser.doFetch()` reads this field and calls `setAnalysis(data.cachedAnalysis)` so the AI tab pre-populates on load. Types updated: `TicketResponse` in `types/kayako.ts` now includes `cachedAnalysis?`.
- [x] **Bug: Tags missing for newly pulled tickets (Ticket Analyser)** — Root cause: `url.searchParams.set('fields', '+tags')` in `getCase()` encoded `+` as `%2B`, which Kayako did not recognise, returning no tags. Fix: `getCase()` now includes `getCaseTags(caseId)` as a 5th parallel call in `Promise.allSettled`, using the dedicated `/api/v1/cases/{caseId}/tags` endpoint that reliably returns `string[]`. The `fields=+tags` param was removed from the case GET request.
- [x] **Architecture note: TA vs BU/PS Sync pull paths are intentionally separate** — TA and BU/PS Refresh both use `fetchAndPersistTicket` (ticketService.ts). BU/PS Sync has its own `mapTicket` / `resolveCustomFields` / `extractTeam` in `sync/route.ts` because it pre-fetches shared data once for all tickets (performance critical for 90+ ticket sync). These paths must be kept manually in sync — changes to field extraction logic in one path must be reviewed for the other.

---

## Phase 16 (All Tickets) — ✅ Complete

All Tickets page now live at `/all-tickets`. Work completed:

- [x] `app/(dashboard)/all-tickets/page.tsx` — async Server Component, same URL-driven pattern as BU/PS
- [x] `lib/all-tickets-list-filters.ts` — pure filter functions (`parseAllTicketsSearchParams`, `serializeAllTicketsParams`, `allTicketsFilterSignature`, `countActiveFilters`, sort/page hrefs, `openOnly` support)
- [x] `lib/all-tickets-list-query.ts` — server-only Prisma query layer (`buildAllTicketsWhere`, `fetchAllTicketsPage`, `fetchAllTicketsForExport`, `fetchAllTicketsFilterOptions`)
- [x] `app/actions/all-ticket-filter-presets.actions.ts` — Server Actions for preset CRUD (module=`"all-tickets"`)
- [x] `components/AllTicketsToolbar.tsx` — Sync Now + Delete All + last-synced
- [x] `components/AllTicketsFilters.tsx` — Search + filter panel + preset management + Options box (Escalated + Open Only)
- [x] `components/AllTicketsTable.tsx` — URL sort + pagination + column visibility + CSV export
- [x] `components/TicketProductAnalytics.tsx` — collapsible open-ticket pill bar per product; shared by both BU/PS and All Tickets pages
- [x] `components/BatchSyncStatus.tsx` — admin page batch job widget (trigger + recent run log)
- [x] `app/api/all-tickets/sync/route.ts` — full sync from view #242; team=`extractTeam(tags)??"Support"`; skips closed; updates isBuPs flags
- [x] `app/api/all-tickets/sync-posts/route.ts` — background post fetch for non-BU/PS tickets
- [x] `app/api/all-tickets/export/route.ts` — CSV export route
- [x] `prisma/schema.prisma` — `module` field on `FilterPreset`; `BatchRun` model added
- [x] `npm run db:push` — `filter_presets.module`, `batch_runs` table created
- [x] `openOnly` filter on both BU/PS and All Tickets filter layers
- [x] Admin presets table updated with "Page" column (module display)
- [x] Hub tile added for All Tickets; Sidebar updated
- [x] `BatchRun` logging integrated into batch job routes

---

## Future Phases

- [ ] **Automated sync**: Vercel cron job (every N hours) to trigger All Tickets sync + post-sync without manual click
- [ ] **Additional Hub tiles**: Other tooling tiles as needed
- [ ] **Mobile responsiveness**: `sm:` Tailwind breakpoints on remaining layouts
- [ ] **Supabase region migration — Japan → India (Mumbai)**: Current project is in `ap-northeast-1` (Tokyo). Move to `ap-south-1` (Mumbai) for lower latency. No built-in Supabase migration tool — process: create new project in Mumbai → `db:push` + seed pricing → pg_dump/restore data → update Google OAuth callback URL → update Vercel env vars.

---

## Phase 15 — URL-Driven Filtering, Sorting & Saved Presets (BU/PS Tickets)

**Spec:** `Spec/Filter-Sorting/` (README, IMPLEMENTATION-CHECKLIST, templates)

**Decisions confirmed:**
- All 8 filter dimensions (search, team, status, priority, blocker type, age risk, product, escalated)
- Server-side Prisma query — page becomes a Server Component
- Private + Shared preset visibility

**Architecture overview:**
The BU/PS Tickets page converts from a client-component-fetch model to a Next.js App Router Server Component. URL is the single source of truth for all filter/sort/page state. Sync and delete remain client-side (`router.refresh()` triggers server re-render after mutations).

---

### 15.1 — Database

- [x] Add `FilterPreset` model to `prisma/schema.prisma`
  - Fields: `id`, `userId`, `module` (= `"bu-tickets"`), `name`, `filtersJson` (canonical QS), `isDefault`, `visibility` (`PERSONAL` | `SHARED`), `createdAt`, `updatedAt`
  - Relation: → `UserSettings` via `userId` + `onDelete: Cascade`
  - Indexes: `(userId, module, isDefault)`, `(userId, module, createdAt)`
- [x] Add `FilterPresetVisibility` enum to schema
- [x] `npm run db:push` (stop dev server first)
- [x] `npm run db:generate`

---

### 15.2 — Filter Type Layer  *(client-safe — no Prisma import)*

**New file: `lib/bu-tickets-list-filters.ts`**

- [x] `SortField` + `SortDir` as separate types (`sortField: SortField`, `sortDir: SortDir`)
- [x] `BuTicketsListFilters` type (search, team, status, priority, blockerType, ageRisk, product, isEscalated, sortField, sortDir, page, pageSize)
- [x] `parseBuTicketsSearchParams(raw)` — parse + validate all fields with safe defaults
- [x] `serializeBuTicketsParams(f)` — serialize to query string, omitting all defaults
- [x] `buTicketsFilterSignature(f)` — canonical QS with page stripped to 1
- [x] `buTicketsSortHref(params, field)` — toggle sort direction / reset to asc for new column
- [x] `buTicketsPageHref(params, page)` — build pagination URL
- [x] `countActiveFilters(f)` — number of active filter dimensions
- [x] `urlSearchParamsToRecord(sp)` — shared helper

---

### 15.3 — Server Query Layer  *(server-only — `import 'server-only'`)*

**New file: `lib/bu-tickets-list-query.ts`**

- [x] `buildBuTicketsWhere(f, userId, kayakoUrl)` — Prisma `WhereInput` using `AND: []` pattern; all 8 filter dimensions
- [x] `orderByBuTickets(f)` — Prisma `orderBy` from `sortField`/`sortDir`
- [x] `fetchBuTicketsPage(f, userId, kayakoUrl)` → `BuTicketsPage` (paginated + total + unfilteredTotal)
- [x] `fetchAllBuTickets(f, userId, kayakoUrl)` → `TicketRow[]` (all filtered rows, no skip/take — for CSV export)
- [x] `fetchBuTicketsFilterOptions(userId, kayakoUrl)` → distinct values for checkbox groups

---

### 15.4 — Server Actions  *(per-user preset CRUD)*

**New file: `app/actions/bu-ticket-filter-presets.actions.ts`**

- [x] `fetchPresetsForUser(userId)` — own + all SHARED presets, default-first
- [x] `createBuTicketFilterPreset(name, filtersJson, visibility)` — inserts; revalidates `/bu-tickets`
- [x] `deleteBuTicketFilterPreset(id)` — ownership guard + delete
- [x] `setDefaultBuTicketFilterPreset(id)` — `$transaction`: clears others, sets this one
- [x] `clearDefaultBuTicketFilterPreset()` — clears all own defaults
- [x] `updateBuTicketFilterPresetFilters(id, filtersJson)` — overwrites saved filters ("Update" button)
- [x] `toggleBuTicketFilterPresetVisibility(id)` — flips `PERSONAL ↔ SHARED`

---

### 15.5 — Page Restructure  *(Server Component)*

**Rewrite: `app/(dashboard)/bu-tickets/page.tsx`**

- [x] Convert to `async` Server Component — accepts `{ searchParams }` prop
- [x] Parse filters via `parseBuTicketsSearchParams(searchParams)`
- [x] Auth + load `kayakoUrl` from `prisma.userSettings`
- [x] `Promise.all` parallel fetch: page + filter options + presets + lastSyncedAt
- [x] Default preset redirect (when `searchParams` is empty and user has a default)
- [x] Render: `BUTicketsToolbar` + `BUTicketsFilters` + `BUTicketsTable`
- [x] Remove `fetchTickets()` client-side fetch — data now comes from server

---

### 15.6 — New UI Components

**New: `components/BUTicketsFilters.tsx`**
- [x] Search bar always-visible, debounced 350 ms, stale-closure-safe (uses `useSearchParams()` in timeout)
- [x] Collapsible filter panel; auto-opens when `countActiveFilters > 0`
- [x] `ScrollableCheckboxGroup` sub-component: `max-h-36 overflow-y-auto`, "All · None" buttons
- [x] Draft state → Apply Filters navigates via `router.push()` (not `<form method="GET">`)
- [x] `useEffect([paramsSig])` draft sync — no `key` remount
- [x] NProgress: `navigate(url)` helper calls `NProgress.start()` + `router.push()`; `useEffect` calls `NProgress.done()` on URL change
- [x] Preset pills inline (active = blue, ★ default, "Shared" badge)
- [x] **Update preset button** — shown when draft differs from active own preset
- [x] Preset management: ★ toggle default, eye/badge toggle visibility (PERSONAL ↔ SHARED), ✕ inline delete confirm
- [x] `useTransition` + `loadingId` for per-item spinners
- [x] Save preset dialog (name + visibility select)

**New: `components/BUTicketsToolbar.tsx`**  *(extracted from BUTicketsTable)*
- [x] Sync Now + Delete All (admin) + last-synced display
- [x] `router.refresh()` after each mutation

---

### 15.7 — Refactor `BUTicketsTable`

- [x] URL sort headers (`<Link href={buTicketsSortHref(searchParams, field)}>`) — no click handlers
- [x] Pagination footer (`<Link>` prev/next/numbers/page-size selector)
- [x] **Column visibility dropdown**: all visible by default, `id` always-visible, click-outside close, "Reset to defaults"
- [x] **CSV export**: async fetch from `GET /api/bu-tickets/export?${searchParams}` (ALL filtered rows); BOM prefix; respects `visibleCols`
- [x] Admin delete selected (checkbox + DELETE /api/bu-tickets + `router.refresh()`)
- [x] Sync + delete controls moved to `BUTicketsToolbar`

---

### 15.8 — Shared Presets

- [x] Shared presets fetched via `fetchPresetsForUser(userId)` — own + SHARED, default-first
- [x] Preset pills distinguish: ★ own default, "Shared" badge for others' SHARED presets
- [x] Non-owners see shared presets as read-only (no delete/manage)
- [x] Owner can toggle visibility via eye/badge button (PERSONAL ↔ SHARED)

### 15.9 — Extras added beyond original spec

- [x] **NProgress** (`nextjs-toploader` + manual `NProgress.start/done`) — loading bar on all filter/sort/page/preset navigation
- [x] **Update preset button** — appears when current draft differs from active own preset's saved filters
- [x] **`GET /api/bu-tickets/export`** — new API route; calls `fetchAllBuTickets` to return all filtered rows for CSV download
- [x] **Admin section** (Phase 17.1): `/admin` page, `AdminPresetsTable`, `admin.actions.ts`
- [x] RLS policies for `filter_presets` applied in Supabase
- [x] 53 unit tests (37 filter layer + 16 query builder)

### 15.10 — Cleanup & Deploy

- [x] Update `CLAUDE.md` — new files, architecture change for BU/PS page
- [x] Update `docs/filter-model.md` — full pattern reference + replication guide
- [x] Update `Spec/Filter-Sorting/` templates — finalized pattern
- [x] `npm run build` — verify no TypeScript errors
- [x] Deploy to Vercel (`git push origin main`)

---

### File Map for Phase 15

| New / Changed | Path |
|---|---|
| NEW | `lib/bu-tickets-list-filters.ts` |
| NEW | `lib/bu-tickets-list-query.ts` |
| NEW | `app/actions/bu-ticket-filter-presets.actions.ts` |
| NEW | `app/api/bu-tickets/export/route.ts` |
| NEW | `components/BUTicketsFilters.tsx` |
| NEW | `components/BUTicketsToolbar.tsx` |
| NEW | `app/(dashboard)/admin/page.tsx` |
| NEW | `components/AdminPresetsTable.tsx` |
| NEW | `app/actions/admin.actions.ts` |
| NEW | `docs/filter-model.md` |
| NEW | `.claude/commands/filter-model.md` |
| REWRITE | `app/(dashboard)/bu-tickets/page.tsx` |
| REFACTOR | `components/BUTicketsTable.tsx` (URL sort, pagination, column visibility, CSV export) |
| REFACTOR | `components/BUTicketsFilters.tsx` (preset management merged in; NProgress; update preset) |
| CHANGE | `prisma/schema.prisma` |
| REWRITE | `Spec/Filter-Sorting/` (all templates updated to finalized pattern) |

---

## Phase 16B — Notion Portfolio Integration (Planned)

_Note: Phase 16 (All Tickets) was implemented first and is now complete. This is the original "Phase 16" Notion work, renamed 16B to avoid confusion._

**Source**: Notion database at `trilogy-enterprises` workspace (view ID: `28485e927d3181c89d6cdd6fd57ea07d`)
**Goal**: Ingest portfolio company data from Notion into the app, match companies to Kayako customers, and surface ARR + portfolio context on BU/PS tickets and in AI analysis.

**Decisions confirmed:**
- Sync direction: Notion → App only (one-way)
- Sync trigger: Manual button (automated later)
- Matching: Fuzzy company-name match with manual review/override UI
- Data scope: Shared across all users; edits admin-only; sensitive column flagging scoped for future
- Hub tile: New `/portfolio` page

---

### Architecture Overview

```
Notion API (read-only)
  ↓  POST /api/portfolio/sync
notion_companies (DB table)
  ↕  matchup UI
  ↓  company_ticket_matches (DB table — links notionCompanyId ↔ kayako org name)
BU/PS Tickets table   ← shows matched company ARR / tier
BU/PS Ticket detail   ← shows portfolio panel
AI Analysis prompt    ← injects company context if matched
/portfolio page       ← tile, sync, match management
```

---

### 16.1 — Notion API Setup & Schema Discovery

**Before any code**: verify Notion connection and discover actual column schema.

- [ ] Add `@notionhq/client` to `package.json`
- [ ] Add env vars:
  - `NOTION_API_TOKEN` — Internal Integration token from https://www.notion.so/my-integrations
  - `NOTION_PORTFOLIO_DB_ID` — Database ID from the URL (`28485e927d3181c89d6cdd6fd57ea07d`)
- [ ] Add both to `.env.example` and Vercel environment variables
- [ ] Create `lib/notion/client.ts` — `NotionClient` singleton wrapping `@notionhq/client`
- [ ] Write a one-off discovery script or use Notion MCP to call `GET /databases/{id}` and inspect all property names + types
- [ ] Document confirmed column schema in `docs/notion-integration.md` (name, type, whether nullable)

---

### 16.2 — Database Schema

**New Prisma models** (add to `prisma/schema.prisma`):

```prisma
model NotionCompany {
  id              String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  notionPageId    String    @unique       // Notion page ID
  name            String                  // Company name (primary match field)
  // --- columns discovered in 16.1 ---
  arr             Float?                  // Annual Recurring Revenue
  tier            String?                 // e.g. "Enterprise", "Mid-Market"
  status          String?                 // e.g. "Active", "Churned"
  owner           String?                 // CSM / account owner name
  region          String?
  product         String?
  rawProperties   Json?                   // Full Notion properties blob (future-proof)
  // --- sync metadata ---
  lastSyncedAt    DateTime  @default(now())
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  matches CompanyTicketMatch[]

  @@map("notion_companies")
}

model CompanyTicketMatch {
  id                String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  notionCompanyId   String   @db.Uuid
  kayakoOrgName     String   // org name as it appears in Kayako tickets
  matchedBy         String   // 'auto' | 'manual'
  confidence        Float?   // 0–1 for auto matches; null for manual
  confirmedAt       DateTime?
  confirmedBy       String?  // userId of admin who confirmed
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  company NotionCompany @relation(fields: [notionCompanyId], references: [id], onDelete: Cascade)

  @@unique([notionCompanyId, kayakoOrgName])
  @@map("company_ticket_matches")
}
```

- [ ] Add `NotionCompany` and `CompanyTicketMatch` models to `prisma/schema.prisma`
- [ ] `npm run db:push` (stop dev server first)
- [ ] `npm run db:generate`
- [ ] Add RLS policies for both tables in Supabase SQL editor:
  - `notion_companies`: authenticated users can SELECT; no direct INSERT/UPDATE (server only)
  - `company_ticket_matches`: authenticated users can SELECT; admin-only mutations enforced at API level

---

### 16.3 — Notion Sync Service

**New file: `lib/notion/portfolioSync.ts`**

- [ ] `fetchNotionPortfolio(apiToken, dbId)` — paginate through all Notion database pages (`100` per page), return raw page objects
- [ ] `mapNotionPageToCompany(page)` — extract typed fields from Notion property blobs into `NotionCompany` shape (title, number, select, rich_text, etc.)
- [ ] `syncPortfolioToDB(pages)` — upsert all companies into `notion_companies` on `notionPageId`; update `lastSyncedAt`
- [ ] Returns `{ synced: number, failed: number, duration: number }`

---

### 16.4 — API Routes

- [ ] **`POST /api/portfolio/sync`** — auth required, admin only (`ADMIN_EMAILS`)
  - Decrypt or read `NOTION_API_TOKEN` from env (not per-user — shared token)
  - Call `syncPortfolioToDB()`
  - Returns `{ ok, synced, failed, duration }`

- [ ] **`GET /api/portfolio/companies`** — auth required
  - Return all `notion_companies` with their confirmed `company_ticket_matches`
  - Supports `?q=` text search on name

- [ ] **`GET /api/portfolio/match-candidates`** — auth required
  - Returns distinct `organization` values from `tickets` table (Kayako org names)
  - Joined with existing matches so the UI knows what's already linked

- [ ] **`POST /api/portfolio/matches`** — auth required, admin only
  - Body: `{ notionCompanyId, kayakoOrgName, matchedBy: 'manual' }`
  - Upsert into `company_ticket_matches`

- [ ] **`DELETE /api/portfolio/matches/[id]`** — auth required, admin only
  - Delete a match by ID

---

### 16.5 — Auto-Match Logic

**New file: `lib/notion/autoMatch.ts`**

- [ ] `scoreName(a, b): number` — normalise (lowercase, strip Ltd/Inc/Corp/LLC), then:
  - Exact match → 1.0
  - One contains the other → 0.85
  - Jaro-Winkler similarity (or simple token overlap) → 0.0–0.84
- [ ] `autoMatchCompanies(companies, kayakoOrgs)` — cross-match all pairs; return those above threshold (0.75) sorted by score; flag exact matches as `confidence = 1.0`
- [ ] Auto-match runs as part of `POST /api/portfolio/sync` — inserts high-confidence candidates into `company_ticket_matches` with `matchedBy: 'auto'`; does NOT overwrite existing confirmed manual matches

---

### 16.6 — Portfolio Page (`/portfolio`)

**New page**: `app/(dashboard)/portfolio/page.tsx`

Add Hub tile linking to `/portfolio`.

**Layout:**
```
[ Portfolio ] tile in Hub
  ↓
/portfolio
  ├── Toolbar: "Sync from Notion" button + last synced timestamp + match stats badge
  ├── Match Review Panel (collapsible)
  │     ├── Unmatched Kayako orgs (need a match)
  │     ├── Auto-match candidates (confirm / reject)
  │     └── Confirmed matches (view / unlink)
  └── Portfolio Table
        Columns: Company, ARR, Tier, Status, Owner, Region, Product, Matched Kayako Org, # Tickets
```

**Components to create:**
- [ ] `components/PortfolioTable.tsx` — sortable table of `NotionCompany[]`; admin edit/unlink controls
- [ ] `components/PortfolioMatchPanel.tsx` — three-section match review; confirm/reject auto-matches; manual search + link
- [ ] `components/PortfolioToolbar.tsx` — Sync button with elapsed timer (mirrors `BUTicketsToolbar` pattern)

---

### 16.7 — Surface Portfolio Data on BU/PS Tickets

Once matches exist, show company context wherever a Kayako ticket's `organization` has a confirmed match.

- [ ] **BU/PS Tickets table** — add "ARR" and "Tier" columns (from matched `NotionCompany`); join in `GET /api/bu-tickets` query
- [ ] **BU/PS Ticket detail page** — add a `PortfolioPanel` component below `TicketCard` showing full matched company card (ARR, tier, status, owner, region)
- [ ] **AI Analysis prompt injection** — in `lib/anthropic/client.ts`, if the ticket has a matched company, prepend a company context block to the system prompt:
  ```
  Customer context: [Company Name] — ARR: $X, Tier: Y, Status: Z, Owner: A
  ```
  This helps Claude calibrate urgency and recommendations.

**New component:**
- [ ] `components/PortfolioPanel.tsx` — compact card showing matched company data; shown on BU/PS ticket detail; "No match" state with link to `/portfolio` matchup view

---

### 16.8 — Sensitive Column Scaffolding (future-proof, no UI yet)

- [ ] Add `sensitiveColumns String[]` field to `NotionCompany` (default `[]`) — stores column names marked sensitive
- [ ] No UI — just the DB field so it's easy to add later without a migration
- [ ] API routes already filter: if a column name is in `sensitiveColumns`, omit it from non-admin responses (implement the filter even though nothing is marked sensitive yet)

---

### 16.9 — Cleanup + Deploy

- [ ] Add `NOTION_API_TOKEN` and `NOTION_PORTFOLIO_DB_ID` to Vercel environment variables
- [ ] Run `prisma/seed-rls-portfolio.sql` in Supabase SQL editor (RLS for new tables)
- [ ] Update `CLAUDE.md` — new models, new routes, new components
- [ ] Update `docs/` — add `docs/notion-integration.md`; update `docs/overview.md`, `docs/api-routes.md`, `docs/components.md`, `docs/database.md`
- [ ] `npm run build` — verify no TypeScript errors
- [ ] Bump `package.json` to `1.2.0`, update `CHANGELOG.md`
- [ ] `git push origin main`

---

### File Map for Phase 16

| New / Changed | Path |
|---|---|
| NEW | `lib/notion/client.ts` |
| NEW | `lib/notion/portfolioSync.ts` |
| NEW | `lib/notion/autoMatch.ts` |
| NEW | `app/(dashboard)/portfolio/page.tsx` |
| NEW | `app/api/portfolio/sync/route.ts` |
| NEW | `app/api/portfolio/companies/route.ts` |
| NEW | `app/api/portfolio/match-candidates/route.ts` |
| NEW | `app/api/portfolio/matches/route.ts` |
| NEW | `app/api/portfolio/matches/[id]/route.ts` |
| NEW | `components/PortfolioTable.tsx` |
| NEW | `components/PortfolioMatchPanel.tsx` |
| NEW | `components/PortfolioToolbar.tsx` |
| NEW | `components/PortfolioPanel.tsx` |
| NEW | `docs/notion-integration.md` |
| NEW | `prisma/seed-rls-portfolio.sql` |
| CHANGE | `prisma/schema.prisma` |
| CHANGE | `components/HubPage.tsx` |
| CHANGE | `components/BUTicketsTable.tsx` |
| CHANGE | `app/(dashboard)/bu-tickets/[id]/page.tsx` |
| CHANGE | `lib/anthropic/client.ts` |
| CHANGE | `app/api/bu-tickets/route.ts` |

---

### Env Vars Added in Phase 16

| Variable | Description |
|---|---|
| `NOTION_API_TOKEN` | Internal Integration token — from https://www.notion.so/my-integrations |
| `NOTION_PORTFOLIO_DB_ID` | Notion database ID — `28485e927d3181c89d6cdd6fd57ea07d` |

Both are server-only (no `NEXT_PUBLIC_` prefix). The Notion token is a shared app credential, not per-user.

---

## Phase 17 — Admin Section

**Goal**: A dedicated `/admin` area (admin-gated by `ADMIN_EMAILS`) for cross-user management tasks. Scaffolded in Phase 15 UI work.

### Phase 17.1 — Filter Preset Management ✅ (complete)
- `app/(dashboard)/admin/page.tsx` — Server Component, admin-gated redirect
- `components/AdminPresetsTable.tsx` — all presets grouped by user, with delete
- `app/actions/admin.actions.ts` — `adminDeleteFilterPreset`
- Sidebar shows "Admin" nav item to admin users only
- Hub page shows "Administration" tile section for admins

### Phase 17.2 — User Management (planned)
- List all users who have saved settings (from `user_settings`)
- Show last-seen date, credential status (has Kayako / has Anthropic key)
- Admin can revoke / impersonate (future)

### Phase 17.3 — Model Pricing Management (planned)
- CRUD UI for `model_pricing` table (currently managed via raw SQL seed)
- Add new pricing rows when Anthropic changes rates
- View current effective pricing per model
