# JigTree Operations Hub — Vercel Web App: Overview

## What This Is

A multi-user operations web application for the JigTree BU Support team. It provides a central hub for support tooling, starting with:

- **Ticket Analyser** — load any Kayako ticket, read the full conversation, run AI analysis, view a day-by-day timeline, post internal notes
- **BU/PS Tickets** — live table of all tickets from Kayako view #64 (JigTree BU Tickets), cached in PostgreSQL with full post history

Deployed at **https://jigtree-operations.vercel.app**. GitHub: `goyal-sahil/jigtree-operations`.

This is a parallel build to the Streamlit tool at `C:\Users\sahil\CoWork\Central Kayako Tickets\`. The Streamlit tool is kept as-is; this app is the web-deployable version. Feature parity is intentional — the same conversation layout, the same AI prompt, the same model selection logic, the same pagination strategy.

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
    │   ├── fetchTicket()   → POST /api/ticket
    │   ├── runAnalysis()   → POST /api/analysis
    │   └── onNotePosted()  → POST /api/note
    └── /bu-tickets     BUTicketsTable
        ├── load()          → GET /api/bu-tickets
        └── onSync()        → POST /api/bu-tickets/sync

API Layer (Next.js Route Handlers, Vercel serverless)
│
├── /api/settings           Save / load Kayako + Anthropic credentials
├── /api/ticket             Authenticate with Kayako, fetch case + posts + user names
├── /api/analysis           Run or serve cached AI analysis (Prisma cache)
├── /api/note               Post an internal note to Kayako
├── /api/bu-tickets         GET all BU/PS tickets from DB
└── /api/bu-tickets/sync    POST — full sync from Kayako view 64

Data Layer
├── Supabase Auth       User identity (Google SSO)
└── Supabase DB         via Prisma
    ├── UserSettings              per-user credentials (encrypted)
    ├── TicketAnalysis            cached AI analyses (per user+ticket)
    ├── BuPsTicket                JigTree BU view tickets (shared)
    ├── BuPsTicketPost            all posts per BU ticket
    └── BuPsTicketCustomField     all raw custom fields per BU ticket
```

Each API route is stateless: it re-authenticates with Kayako on every request (no persistent session). This is necessary because Vercel serverless functions have no shared state between invocations.

---

## File Map

```
Central Kayako Tickets (Vercel)/
│
├── app/
│   ├── globals.css                        Tailwind base styles
│   ├── layout.tsx                         Root HTML shell, metadata
│   ├── (auth)/
│   │   ├── login/page.tsx                 Google Sign-In button
│   │   └── auth/callback/route.ts         OAuth code exchange
│   ├── (dashboard)/
│   │   ├── layout.tsx                     Auth guard + Sidebar + main content
│   │   ├── page.tsx                       JigTree Operations Hub (tile grid)
│   │   ├── analyser/page.tsx              Ticket Analyser
│   │   ├── bu-tickets/page.tsx            BU/PS Tickets table
│   │   └── settings/page.tsx             Settings page → SettingsForm
│   └── api/
│       ├── settings/route.ts              GET + POST credentials
│       ├── ticket/route.ts                POST fetch ticket
│       ├── analysis/route.ts              POST run / serve cached AI analysis
│       ├── note/route.ts                  POST add internal note
│       └── bu-tickets/
│           ├── route.ts                   GET all BU/PS tickets from DB
│           └── sync/route.ts             POST sync from Kayako view 64
│
├── components/
│   ├── Sidebar.tsx                        Collapsible left nav (Phase 11)
│   ├── HubPage.tsx                        Operations Hub tile grid (Phase 11)
│   ├── NavBar.tsx                         Top nav (retired in Phase 11 — user info moves to Sidebar)
│   ├── SettingsForm.tsx                   Credential input form
│   ├── TicketAnalyser.tsx                 Main state machine (client component)
│   ├── TicketCard.tsx                     Ticket metadata card + status badge
│   ├── ConversationThread.tsx             Collapsible colour-coded post list
│   ├── AIAnalysis.tsx                     AI analysis result display + re-run
│   ├── Timeline.tsx                       Date-grouped posts + AI day summaries
│   ├── AddNoteForm.tsx                    Internal note textarea + submit
│   └── BUTicketsTable.tsx                 Sortable BU/PS ticket table (Phase 12)
│
├── lib/
│   ├── prisma.ts                          Singleton PrismaClient
│   ├── encryption.ts                      AES-256-GCM encrypt/decrypt
│   ├── utils.ts                           fmtDt, fmtDate, safeName, safeLabel, extractEmail, getPostText, ageDays
│   ├── supabase/
│   │   ├── client.ts                      Browser Supabase client
│   │   └── server.ts                      Server Supabase client (cookies)
│   ├── kayako/
│   │   └── client.ts                      KayakoClient class + helpers (incl. getViewCases)
│   └── anthropic/
│       └── client.ts                      analyseTicket(), detectModel()
│
├── types/
│   └── kayako.ts                          All Kayako + app types (incl. BuPsTicketRow)
│
├── prisma/
│   └── schema.prisma                      All 5 DB models
│
├── docs/
│   ├── overview.md                        This file
│   ├── bu-ps-tickets-spec.md             Phase 11–12 full feature spec ← NEW
│   ├── setup.md                           Install + deploy guide
│   ├── auth.md                            Google OAuth → Supabase flow
│   ├── database.md                        Schema, connections, RLS
│   ├── encryption.md                      AES-256-GCM details
│   ├── kayako-integration.md              KayakoClient, view API, field mapping
│   ├── ai-analysis.md                     Model selection, prompt, caching
│   ├── api-routes.md                      All API routes
│   ├── components.md                      Component tree and props
│   └── NextActions.md                     Prioritised next actions
│
├── middleware.ts                          Session refresh + route protection
├── next.config.mjs                        Next.js config
├── vercel.json                            Vercel framework config
├── tailwind.config.ts                     Tailwind content paths
├── tsconfig.json                          TypeScript config (target ES2017)
├── package.json                           Dependencies + npm scripts
└── PLAN.md                                Full build plan + phase checklist
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

The Python `KayakoClient` and AI analysis logic in `kayako_tool.py` were ported to TypeScript verbatim. Pagination strategy, user resolution, model selection, and the AI prompt are identical.
