Perform a full documentation pass for the BU Support Ticket Analyser Vercel web app at `C:\Users\sahil\CoWork\Central Kayako Tickets (Vercel)\`. Work through all four steps below in order.

---

## Step 1 — Update `CLAUDE.md`

Read the current `CLAUDE.md` in the project root. Then read the key source files to understand the current state of the app:
- `package.json` (dependencies, scripts)
- `prisma/schema.prisma` (models)
- `lib/kayako/client.ts` (KayakoClient)
- `lib/anthropic/client.ts` (model selection, analysis)
- `lib/encryption.ts` (encryption details)
- `app/api/` route files
- `components/TicketAnalyser.tsx` (state machine)
- `.env.example` (env vars)

Update `CLAUDE.md` to accurately reflect:
- Current status of the app (what works, what still needs setup)
- Any new or changed npm scripts
- Any new or changed env variables
- Any new or changed Prisma models
- Any new or changed API routes
- Build/TypeScript gotchas discovered
- Supabase setup checklist (check off completed items if known)

Do not remove sections — only update or add content.

---

## Step 2 — Update `docs/`

Read each existing file in `docs/`. For each one, update it to match the current code if anything has changed. Focus on accuracy over completeness — if a section is still correct, leave it alone.

Files to review and update:
- `docs/overview.md` — tech stack, architecture, file map
- `docs/setup.md` — install steps, env vars, RLS SQL, OAuth, troubleshooting
- `docs/auth.md` — auth flow, middleware, session management
- `docs/database.md` — Prisma models, connection strings, schema workflow
- `docs/encryption.md` — algorithm, key format, what is encrypted
- `docs/kayako-integration.md` — KayakoClient methods, pagination, user resolution
- `docs/ai-analysis.md` — model selection, prompt, output sections, caching
- `docs/api-routes.md` — all route request/response shapes and steps
- `docs/components.md` — component tree, props, behaviours

If a new feature or file exists that has no doc entry, add it.

---

## Step 3 — Update `PLAN.md`

Read the current `PLAN.md`. Mark completed phases/steps as done. Add any new phases or steps discovered during the build. Update the status summary at the top to reflect what is now built vs. what is still pending.

---

## Step 4 — Create/Update `docs/NextActions.md`

Read the current state of the app (env files, Supabase setup, any TODO comments in code, PLAN.md) and write `docs/NextActions.md` with two sections:

### What I (Claude) can do next
Actions that can be done in code without any input from Sahil — list them as a prioritised checklist.

### What I need from Sahil
Specific items that are blocked on Sahil providing information, credentials, or making decisions. Be concrete:
- What exactly is needed
- Where to find it
- Why it's needed (which feature is blocked)

Keep this file concise and actionable. Remove items that have been completed since the last run.
