# JigTree Operations Hub — Vercel Web App: Overview

## What This Is

A multi-user operations web application for the JigTree BU Support team. It provides a central hub for support tooling:

- **Ticket Analyser** — load any Kayako ticket, read the full conversation, run AI analysis, view a day-by-day timeline, post internal notes
- **BU/PS Tickets** — live table of all tickets from Kayako view #64 (JigTree BU Tickets), cached in PostgreSQL with full post history and a per-ticket detail page

Deployed at **https://jigtree-operations.vercel.app**. GitHub: `goyal-sahil/jigtree-operations`.

This is a parallel build to the Streamlit tool at `C:\Users\sahil\CoWork\Central Kayako Tickets\`. The Streamlit tool is kept as-is; this app is the web-deployable multi-user version. Feature parity is intentional — the same conversation layout, the same AI prompt, the same model selection logic, the same pagination strategy.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Authentication | Supabase Auth — Google OAuth only |
| Database | Supabase PostgreSQL via Prisma ORM |
| Credential storage | AES-256-GCM encrypted columns in PostgreSQL |
| AI analysis | Anthropic Claude (`claude-haiku-4-5-20251001` default, `claude-sonnet-4-6` for complex tickets) |
| Styling | Tailwind CSS |
| Hosting | Vercel (serverless functions for all API routes) |
| Kayako API | REST, Basic HTTP auth (email + API password → session_id) |

---

## Architecture

```
Browser (React)
│
├── /login              Google OAuth → Supabase Auth
├── /settings           SettingsForm → POST /api/settings
└── / (dashboard)       ← Left sidebar nav
    ├── /               JigTree Operations Hub (tile grid)
    ├── /analyser       TicketAnalyser
    │   ├── doFetch()       → POST /api/ticket  (DB-first; returns TicketResponse)
    │   ├── runAnalysis()   → POST /api/analysis (reads from DB)
    │   └── onNotePosted()  → POST /api/note
    └── /bu-tickets     BUTicketsTable + detail page
        ├── load()              → GET /api/bu-tickets
        ├── onSync()            → POST /api/bu-tickets/sync
        │     ├── background:   POST /api/bu-tickets/sync-posts
        │     └── background:   POST /api/bu-tickets/analyse-batch
        └── /bu-tickets/[id]    BuTicketDetailPage
              ├── load()         → GET /api/bu-tickets/[id]
              ├── refreshTicket() → POST /api/bu-tickets/[id]/refresh
              └── runAnalysis()  → POST /api/analysis

API Layer (Next.js Route Handlers, Vercel serverless)
│
├── /api/settings             Save / load Kayako + Anthropic credentials
├── /api/credentials          GET hasKayako / hasAnthropic booleans
├── /api/ticket               DB-first fetch; calls fetchAndPersistTicket on miss
├── /api/analysis             AI analysis — reads ticket+posts from DB
├── /api/note                 Post an internal note to Kayako
├── /api/bu-tickets           GET all BU/PS tickets from DB; DELETE (admin)
├── /api/bu-tickets/sync      POST — full sync from Kayako view 64
├── /api/bu-tickets/sync-posts     POST — background post fetch (10/run)
├── /api/bu-tickets/analyse-batch  POST — background AI analysis (5/run)
├── /api/bu-tickets/[id]      GET single ticket + posts + analysis
└── /api/bu-tickets/[id]/refresh   POST — re-fetch from Kayako, persist

Data Layer
├── Supabase Auth       User identity (Google SSO)
└── Supabase DB         via Prisma
    ├── UserSettings    per-user credentials (encrypted)
    ├── Ticket          unified ticket cache (Analyser + BU/PS sync)
    ├── TicketPost      all posts per ticket
    ├── TicketAnalysis  cached AI analyses (per user+ticket)
    ├── ModelPricing    Anthropic pricing rates by date range
    └── AnalysisRun     append-only log of every AI analysis attempt
```

### DB-First Pattern

All ticket fetches follow a DB-first pattern: the API route checks the `tickets` table first. If a cached record with `postsStatus = 'done'` exists, it is returned immediately (`fromCache: true`). Only on a cache miss (or `forceRefresh=true`) does the route authenticate with Kayako and call `fetchAndPersistTicket()` from `lib/kayako/ticketService.ts`.

Each API route is stateless: it re-authenticates with Kayako on every live fetch. This is necessary because Vercel serverless functions have no shared state between invocations.

---

## File Map

```
Central Kayako Tickets (Vercel)/
│
├── app/
│   ├── globals.css                         Tailwind base styles
│   ├── layout.tsx                          Root HTML shell, metadata
│   ├── (auth)/
│   │   ├── login/page.tsx                  Google Sign-In button
│   │   └── auth/callback/route.ts          OAuth code exchange
│   ├── (dashboard)/
│   │   ├── layout.tsx                      Auth guard + Sidebar + main content
│   │   ├── page.tsx                        JigTree Operations Hub (tile grid)
│   │   ├── analyser/page.tsx               Ticket Analyser
│   │   ├── bu-tickets/page.tsx             BU/PS Tickets table (client component)
│   │   ├── bu-tickets/[id]/page.tsx        BU/PS ticket detail page (client component)
│   │   └── settings/page.tsx              Settings page → SettingsForm
│   └── api/
│       ├── settings/route.ts               GET + POST credentials
│       ├── credentials/route.ts            GET hasKayako / hasAnthropic
│       ├── ticket/route.ts                 POST DB-first ticket fetch
│       ├── analysis/route.ts               POST run / serve cached AI analysis
│       ├── note/route.ts                   POST add internal note
│       └── bu-tickets/
│           ├── route.ts                    GET all BU/PS tickets; DELETE (admin)
│           ├── sync/route.ts               POST sync from Kayako view 64
│           ├── sync-posts/route.ts         POST background post fetch
│           ├── analyse-batch/route.ts      POST background AI analysis
│           ├── [id]/route.ts               GET single ticket + posts + analysis
│           └── [id]/refresh/route.ts       POST re-fetch + persist single ticket
│
├── components/
│   ├── Sidebar.tsx                         Collapsible left nav
│   ├── HubPage.tsx                         Operations Hub tile grid
│   ├── CredentialsBanner.tsx               Banner shown when credentials are missing
│   ├── NavBar.tsx                          Top nav (retired — user info moved to Sidebar)
│   ├── SettingsForm.tsx                    Credential input form
│   ├── TimezoneProvider.tsx                Context: user browser timezone (used for date formatting)
│   ├── TicketAnalyser.tsx                  Main state machine — Ticket Analyser page
│   ├── TicketCard.tsx                      Ticket metadata card (accepts TicketRow)
│   ├── ConversationThread.tsx              Filter-toggled colour-coded post list (UnifiedPost[])
│   ├── AIAnalysis.tsx                      AI analysis display + re-run button
│   ├── Timeline.tsx                        Date-grouped posts + AI day summaries (UnifiedPost[])
│   ├── AddNoteForm.tsx                     Internal note textarea + submit
│   ├── AnalysisHistory.tsx                 Collapsible analysis run log with cost columns
│   └── BUTicketsTable.tsx                  Sortable BU/PS ticket table with sync controls
│
├── lib/
│   ├── prisma.ts                           Singleton PrismaClient
│   ├── encryption.ts                       AES-256-GCM encrypt/decrypt
│   ├── pricing.ts                          findPricing, computeCost, formatCostUsd — Anthropic cost helpers
│   ├── tz.ts                               formatDateTime, formatDate — timezone-aware date helpers
│   ├── utils.ts                            fmtDt, fmtDate, safeName, safeLabel, extractEmail, getPostText, ageDays
│   ├── supabase/
│   │   ├── client.ts                       Browser Supabase client
│   │   └── server.ts                       Server Supabase client (cookies)
│   ├── kayako/
│   │   ├── client.ts                       KayakoClient class + helpers
│   │   └── ticketService.ts                fetchAndPersistTicket + converters (shared service)
│   └── anthropic/
│       └── client.ts                       analyseTicket(), detectModel()
│
├── types/
│   └── kayako.ts                           All Kayako + app types
│                                           (KayakoCase, KayakoPost, UnifiedPost, TicketRow, TicketResponse, AnalysisResult)
│
├── prisma/
│   ├── schema.prisma                       6 DB models: UserSettings, Ticket, TicketPost, TicketAnalysis, ModelPricing, AnalysisRun
│   └── seed-pricing.sql                    INSERT for haiku-4-5 and sonnet-4-6 pricing rows
│
├── docs/
│   ├── overview.md                         This file
│   ├── bu-ps-tickets-spec.md               Original Phase 11–12 spec (historical)
│   ├── setup.md                            Install + deploy guide
│   ├── auth.md                             Google OAuth → Supabase flow
│   ├── database.md                         Schema, connections, RLS
│   ├── encryption.md                       AES-256-GCM details
│   ├── kayako-integration.md               KayakoClient, ticketService, view API, field mapping
│   ├── ai-analysis.md                      Model selection, prompt, caching, token tracking
│   ├── api-routes.md                       All API routes
│   ├── components.md                       Component tree and props
│   └── NextActions.md                      Prioritised next actions
│
├── middleware.ts                           Session refresh + route protection
├── next.config.mjs                         Next.js config
├── vercel.json                             Vercel framework config
├── tailwind.config.ts                      Tailwind content paths
├── tsconfig.json                           TypeScript config (target ES2017)
├── package.json                            Dependencies + npm scripts
└── PLAN.md                                 Full build plan + phase checklist
```

---

## Relationship to Streamlit Tool

| Aspect | Streamlit Tool | Vercel Web App |
|---|---|---|
| Location | `C:\...\Central Kayako Tickets\` | `C:\...\Central Kayako Tickets (Vercel)\` |
| Users | Local (Sahil only) | Multi-user |
| Auth | None (local) | Google SSO via Supabase |
| Credentials | `.env` file | Encrypted DB columns |
| AI cache | In-memory (session) | PostgreSQL (persists) |
| Deployment | `streamlit run` | Vercel |
| Streamlit modified? | No | N/A (separate codebase) |

The Python `KayakoClient` and AI analysis logic in `kayako_tool.py` were ported to TypeScript. Pagination strategy, user resolution, model selection, and the AI prompt are carried over. The Vercel app extends the original with a persistent DB cache, BU/PS sync, and a shared `ticketService` used by all fetch paths.
