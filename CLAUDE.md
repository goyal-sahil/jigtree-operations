# Claude Working Memory — BU Support Ticket Analyser (Vercel Web App)

## Who I'm Working With
- **Name**: Sahil Goyal
- **Email**: sahil.goyal@aurea.com
- **Login**: Google SSO

---

## What This Is

A multi-user Next.js web app that mirrors the Streamlit tool at `C:\Users\sahil\CoWork\Central Kayako Tickets\` — load Kayako tickets, read conversation threads, run AI analysis, view timeline, post internal notes. Deployed to Vercel. The Streamlit tool is kept as-is and is a separate codebase.

---

## Status

**Running. Ticket fetch and AI analysis both confirmed working end-to-end.**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Auth | Supabase Auth — Google OAuth only |
| Database | Supabase PostgreSQL via Prisma 5 |
| Credential storage | AES-256-GCM encrypted columns |
| AI | Anthropic Claude (Haiku default, Sonnet for complex tickets) |
| Styling | Tailwind CSS |
| Hosting | Vercel (serverless functions) |

---

## Running Locally

```bash
npm install
npx prisma generate
# fill in .env.local (copy from .env.example)
npm run db:push        # push schema to Supabase (once)
npm run dev            # → http://localhost:3000
```

### `.env.local` variables

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API |
| `DATABASE_URL` | Supabase → DB → Connection string → Transaction mode (port 6543) + `?pgbouncer=true` |
| `DIRECT_URL` | Supabase → DB → Connection string → Direct (port 5432) |
| `ENCRYPTION_SECRET` | Generate: `openssl rand -hex 32` (must be exactly 64 hex chars) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally, `https://your-app.vercel.app` in prod |

---

## npm Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server at http://localhost:3000 |
| `npm run build` | Production build |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:push` | Push schema to DB (dev) |
| `npm run db:migrate` | Apply migrations (prod) |
| `npm run db:studio` | Prisma Studio GUI |

---

## Kayako API — Key Facts

- **Auth**: Basic HTTP (email + API password → session_id + X-CSRF-Token). Re-authenticated per request (stateless serverless).
- **The Kayako password is the API password**, not the web login. Users set it in Kayako: My Profile → Change Password → API Password.
- **Case fetch**: `GET /api/v1/cases/{id}?include=user,team` — 4 calls run in parallel inside `getCase()`:
  1. `GET /api/v1/cases/{id}?include=user,team` — case with requester, agent, team expanded
  2. `GET /api/v1/cases/statuses` — resolve status ID → label
  3. `GET /api/v1/cases/priorities` — resolve priority ID → label
  4. `GET /api/v1/cases/fields` — all field definitions (type, label, system flag)
- **Custom fields**: raw case has `custom_fields` as stubs `{ field: { id }, value }`. Resolved against field defs. System fields and empty values are filtered out.
- **SELECT field option labels**: for SELECT/RADIO/CASCADINGSELECT fields with numeric option IDs, resolved via `GET /api/v1/cases/fields/{fieldId}?include=field_option,locale_field` — returns the field with options expanded including locale translations inline. **Note**: `GET /api/v1/base/field/option/{id}` returns HTTP 400 and does NOT work for external API consumers.
- **Product field**: field ID 16, type SELECT. Resolved the same way as other SELECT fields — option label comes from `include=field_option,locale_field`. Displayed as a badge in the ticket header.
- **Posts fetch**: NO `include` param — `include=user` causes silent hangs on large tickets
- **User resolution**: after fetching posts, resolve creator names via individual `GET /api/v1/users/{id}` calls (parallel, fail-silent)
- **Pagination**: `limit=200` first, then follow `next_url` from response. The `offset` param is unreliable — Kayako frequently ignores it and returns the same first page. Deduplicate by post ID as a safety net.
- **Timeouts**: 15 s per request via `AbortSignal.timeout(15_000)`. On timeout, partial results + warning banner.
- **Max posts**: 500 per ticket load.

---

## Database Models

### `user_settings`
Per-user credentials. `userId` = Supabase `auth.users.id`.  
Encrypted fields: `kayakoPasswordEnc`, `anthropicKeyEnc` (AES-256-GCM, base64(iv+authTag+ciphertext)).

### `ticket_analyses`
Cached AI results. Unique on `(userId, ticketId, kayakoUrl)`.  
`forceRefresh=true` in the analysis request bypasses the cache and overwrites.

---

## AI Analysis

- **Default model**: `claude-haiku-4-5-20251001`
- **Complex tickets** (score ≥ 3): `claude-sonnet-4-6`
  - Score: >15 posts (+2), >30 posts (+2 more), urgency keywords (+1), >7 days old (+2)
- **Sections**: Executive Summary · One-Line Summary · Case Summary · Customer Sentiment · What's Needed to Close · Recommended Next Steps · Day-by-Day Summary
- **Cache**: PostgreSQL (persists across sessions). Cleared from UI state when a note is posted.

---

## Important Build Notes

- `next.config.mjs` — Next.js 14 does **not** support `.ts` config files
- `tsconfig.json` has `"target": "ES2017"` — required for `Set`/`Map` spread/iteration
- `lib/utils.ts`: `safeName`, `safeLabel`, `extractEmail` accept `object | null | undefined` — pass Kayako objects directly, no cast needed
- Supabase SSR cookie callbacks: use inline type `{ name: string; value: string; options: CookieOptions }[]` — **not** `CookieOptionsWithName` (that type doesn't have a `value` field)
- `KayakoClient` is instantiated fresh per API route call — no shared state between requests
- **Authorization header must be sent on every Kayako request**, not just during auth. Python's `requests.Session` does this automatically; TypeScript stores `authHeader` and includes it in `headers()` on all subsequent calls. Without it, case/post fetches return 401 despite a valid session_id.
- **Two env files**: Prisma reads `.env` (needs `DATABASE_URL` + `DIRECT_URL`). Next.js reads `.env.local` (all other vars). Keep both in sync.
- **Supabase direct connection (port 5432)** is blocked on corporate networks. Use the **session mode pooler** (`pooler.supabase.com:5432`) for `DIRECT_URL` instead.

---

## Supabase Setup Checklist

- [x] Create Supabase project (JigTree Operations, Asia-Pacific)
- [x] Copy `DATABASE_URL` (port 6543, pgbouncer=true) and `DIRECT_URL` (session pooler port 5432) into `.env` and `.env.local`
- [x] Run `npm run db:push` — tables created
- [ ] Run RLS policies in Supabase SQL editor (see `docs/setup.md`) — **still needed**
- [x] Enable Google provider in Supabase Auth → Providers → Google
- [x] Set Google Client ID + Secret in Supabase
- [x] Add `http://localhost:3000/auth/callback` to Supabase redirect URLs
- [x] Add Supabase callback URL to Google Cloud OAuth redirect URIs

**Note on `DIRECT_URL`**: The direct DB host (`db.xxxx.supabase.co:5432`) is blocked on corporate networks. Use the session mode pooler instead: `postgresql://postgres.xxxx:pass@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres`

---

## Custom Commands

`.claude/commands/document.md` — invoke with `/document` in any Claude Code session in this workspace.  
Runs a full documentation pass: updates `CLAUDE.md`, all `docs/` files, `PLAN.md`, and `docs/NextActions.md`.

---

## Documentation

All docs are in `docs/`:

| File | Contents |
|---|---|
| `docs/overview.md` | Architecture diagram, tech stack, full file map |
| `docs/setup.md` | Full install + deploy guide, RLS SQL, troubleshooting |
| `docs/auth.md` | Google OAuth → Supabase flow, middleware, session management |
| `docs/database.md` | Prisma schema, connection strings, RLS, schema change workflow |
| `docs/encryption.md` | AES-256-GCM, blob format, key generation, rotation |
| `docs/kayako-integration.md` | KayakoClient methods, pagination strategy, user resolution |
| `docs/ai-analysis.md` | Model selection, prompt, output sections, caching, API shapes |
| `docs/api-routes.md` | All four routes: request/response shapes, steps, error codes |
| `docs/components.md` | Component tree, props, behaviours, utility functions |
| `docs/NextActions.md` | Prioritised next actions — what Claude can do vs what Sahil must provide |

---

## Important Notes

- The sandbox **cannot** reach `central-supportdesk.kayako.com`. All Kayako calls must run on Sahil's machine.
- `.env.local` must never be committed to version control.
- The Streamlit tool (`C:\Users\sahil\CoWork\Central Kayako Tickets\`) is a separate codebase — do not modify it from this workspace.
