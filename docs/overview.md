# BU Support Ticket Analyser — Vercel Web App: Overview

## What This Is

A multi-user web application that lets BU Support team members load Kayako support tickets, read the full conversation thread, run AI analysis with Anthropic Claude, view a day-by-day timeline, and post internal notes — all from a browser, without needing the local Streamlit tool.

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
└── / (dashboard)
    └── TicketAnalyser
        ├── fetchTicket()   → POST /api/ticket
        ├── runAnalysis()   → POST /api/analysis
        └── onNotePosted()  → POST /api/note

API Layer (Next.js Route Handlers, Vercel serverless)
│
├── /api/settings     Save / load Kayako + Anthropic credentials
├── /api/ticket       Authenticate with Kayako, fetch case + posts + user names
├── /api/analysis     Run or serve cached AI analysis (Prisma cache)
└── /api/note         Post an internal note to Kayako

Data Layer
├── Supabase Auth     User identity (Google SSO)
└── Supabase DB       user_settings, ticket_analyses (via Prisma)
    ├── UserSettings  per-user credentials (encrypted)
    └── TicketAnalysis cached AI analyses (per user+ticket+kayakoUrl)
```

Each API route is stateless: it re-authenticates with Kayako on every request (no persistent session). This is necessary because Vercel serverless functions have no shared state between invocations.

---

## File Map

```
Central Kayako Tickets (Vercel)/
│
├── app/
│   ├── globals.css                  Tailwind base styles
│   ├── layout.tsx                   Root HTML shell, metadata
│   ├── (auth)/
│   │   ├── login/page.tsx           Google Sign-In button
│   │   └── auth/callback/route.ts   OAuth code exchange
│   ├── (dashboard)/
│   │   ├── layout.tsx               Auth guard + NavBar + container
│   │   ├── page.tsx                 Dashboard home → TicketAnalyser
│   │   └── settings/page.tsx        Settings page → SettingsForm
│   └── api/
│       ├── settings/route.ts        GET + POST credentials
│       ├── ticket/route.ts          POST fetch ticket
│       ├── analysis/route.ts        POST run / serve cached AI analysis
│       └── note/route.ts            POST add internal note
│
├── components/
│   ├── NavBar.tsx                   Top nav with user email + sign out
│   ├── SettingsForm.tsx             Credential input form
│   ├── TicketAnalyser.tsx           Main state machine (client component)
│   ├── TicketCard.tsx               Ticket metadata card + status badge
│   ├── ConversationThread.tsx       Collapsible colour-coded post list
│   ├── AIAnalysis.tsx               AI analysis result display + re-run
│   ├── Timeline.tsx                 Date-grouped posts + AI day summaries
│   └── AddNoteForm.tsx              Internal note textarea + submit
│
├── lib/
│   ├── prisma.ts                    Singleton PrismaClient
│   ├── encryption.ts                AES-256-GCM encrypt/decrypt
│   ├── utils.ts                     fmtDt, fmtDate, safeName, safeLabel, extractEmail, getPostText, ageDays
│   ├── supabase/
│   │   ├── client.ts                Browser Supabase client
│   │   └── server.ts                Server Supabase client (cookies)
│   ├── kayako/
│   │   └── client.ts                KayakoClient class + helpers
│   └── anthropic/
│       └── client.ts                analyseTicket(), detectModel()
│
├── types/
│   └── kayako.ts                    KayakoUser, KayakoCase, KayakoPost, KayakoCustomField, KayakoCaseFieldDef, AnalysisResult, TicketData
│
├── prisma/
│   └── schema.prisma                UserSettings + TicketAnalysis models
│
├── middleware.ts                    Session refresh + route protection
├── next.config.mjs                  Next.js config (Prisma external package)
├── tailwind.config.ts               Tailwind content paths
├── tsconfig.json                    TypeScript config (target ES2017)
├── package.json                     Dependencies + npm scripts
├── .env.example                     Template for .env.local
└── docs/                            This documentation
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
