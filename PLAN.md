# JigTree Operations Hub — Vercel/Supabase App Plan

## Status: Running — Phases 1–10 complete. Phase 11–12 (Hub + BU/PS Tickets) in spec.

Core Ticket Analyser confirmed working end-to-end.  
App is live at **https://jigtree-operations.vercel.app** (GitHub: `goyal-sahil/jigtree-operations`).  
Phases 11–12 spec is at `docs/bu-ps-tickets-spec.md`.

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
  - [ ] Mobile responsive (sm: Tailwind prefixes on grids)
- [x] Supabase: create project (JigTree Operations, ap-northeast-1)
- [x] Google Cloud: create OAuth client (JigTree Operations (Vercel)), add redirect URIs
- [x] Fill in `.env.local` and `.env` with all credentials
- [x] Run `npm run db:push` — tables created in Supabase
- [ ] Run RLS policies in Supabase SQL editor — still pending
- [x] Vercel: env vars set, GitHub connected, deployed

---

### Phase 11 — JigTree Operations Hub + Layout Restructure

**Spec:** `docs/bu-ps-tickets-spec.md` §2–3

- [ ] Add `Sidebar.tsx` — collapsible left nav (icon + label, active route highlight, user footer)
- [ ] Update `app/(dashboard)/layout.tsx` — sidebar + main content grid, retire NavBar
- [ ] Move Ticket Analyser to `app/(dashboard)/analyser/page.tsx`
- [ ] Add `HubPage.tsx` — tile grid component
- [ ] Update `app/(dashboard)/page.tsx` — render Hub (first-login redirect to /settings preserved)

---

### Phase 12 — BU/PS Tickets

**Spec:** `docs/bu-ps-tickets-spec.md` §4–13
**Kayako view:** https://central-supportdesk.kayako.com/agent/conversations/view/64

#### 12.1 Database
- [ ] Add `BuPsTicket`, `BuPsTicketPost`, `BuPsTicketCustomField` models to `prisma/schema.prisma`
- [ ] Run `npm run db:push`
- [ ] Run RLS SQL in Supabase (see spec §9)

#### 12.2 Types & Client
- [ ] Extend `types/kayako.ts` — add `KayakoOrganization`, `BuPsTicketRow`; add `organization` to `KayakoCase`
- [ ] Add `getViewCases(viewId)` to `KayakoClient` — paginated view fetch with endpoint fallback

#### 12.3 API Routes
- [ ] `app/api/bu-tickets/route.ts` — GET tickets from DB
- [ ] `app/api/bu-tickets/sync/route.ts` — POST sync from Kayako (batched, upserts all 3 tables)

#### 12.4 UI
- [ ] `components/BUTicketsTable.tsx` — sortable/filterable table, Sync button, last-synced indicator
- [ ] `app/(dashboard)/bu-tickets/page.tsx` — server component shell + client table

#### 12.5 Deploy & Test
- [ ] Push to GitHub → auto-deploy
- [ ] Test sync endpoint — confirm Kayako view API endpoint (`/api/v1/cases/views/64`)
- [ ] Verify field mapping: Esc, Team, BU, GHI, JIRA, Hold Reason

### Runtime bugs fixed post-build
- **Kayako 401 on case fetch**: Authorization header was not included in post-auth requests. Fixed by storing `authHeader` as instance property and including it in `headers()` on all calls.
- **Prisma `DIRECT_URL` not found**: Prisma reads `.env`, not `.env.local`. Created separate `.env` file for Prisma DB URLs.
- **Supabase direct DB port blocked**: Corporate network blocks port 5432 on `db.xxx.supabase.co`. Switched `DIRECT_URL` to session mode pooler (`pooler.supabase.com:5432`).
- **Anthropic 500 errors**: Transient server errors from Anthropic — retry resolves them.
- **SELECT custom fields showing raw numeric IDs** (e.g. "7147" instead of "Discover XI"): The case response returns option IDs, not labels. Fixed by fetching `GET /api/v1/cases/fields/{fieldId}?include=field_option,locale_field` for each SELECT field to resolve option labels. `/api/v1/base/field/option/{id}` returns HTTP 400 for external API consumers and cannot be used. Added `KayakoCaseFieldDef` and `KayakoCustomField` types. `getCase()` now runs 4 parallel calls (case, statuses, priorities, field defs) plus N calls per SELECT field.
