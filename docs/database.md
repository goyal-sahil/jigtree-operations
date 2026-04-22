# Database

## Stack

- **Database**: Supabase (hosted PostgreSQL)
- **ORM**: Prisma 5
- **Schema file**: `prisma/schema.prisma`
- **Client**: singleton in `lib/prisma.ts`

---

## Connection Strings

Two connection strings are required:

| Variable | Port | Used by |
|---|---|---|
| `DATABASE_URL` | 6543 (transaction pooler) | Prisma at runtime (Vercel serverless) |
| `DIRECT_URL` | 5432 (direct / session pooler) | Prisma migrations and `db:push` |

Vercel serverless functions cannot hold long-lived database connections, so all runtime queries go through Supabase's PgBouncer transaction pooler (port 6543). Prisma migrations need a direct connection (port 5432) because they run DDL which PgBouncer's transaction mode doesn't support.

Both strings come from Supabase dashboard → Project Settings → Database → Connection string. Toggle the mode selector between "Transaction" and "Session/Direct".

**Corporate network note**: The direct DB host (`db.xxxx.supabase.co:5432`) is blocked on corporate networks. Use the session-mode pooler (`aws-0-<region>.pooler.supabase.com:5432`) for `DIRECT_URL` instead — same port 5432 but via the pooler endpoint.

---

## Models

### `UserSettings` → table `user_settings`

Stores per-user Kayako and Anthropic credentials.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key, `gen_random_uuid()` |
| `userId` | UUID | Matches `auth.users(id)` — unique per user |
| `kayakoUrl` | String? | e.g. `https://central-supportdesk.kayako.com` |
| `kayakoEmail` | String? | Kayako login email |
| `kayakoPasswordEnc` | String? | AES-256-GCM encrypted API password |
| `anthropicKeyEnc` | String? | AES-256-GCM encrypted Anthropic API key |
| `createdAt` | DateTime | Auto-set on create |
| `updatedAt` | DateTime | Auto-updated on every write |

Relations: `analyses TicketAnalysis[]`

The password and API key are **never stored in plaintext**. See [encryption.md](encryption.md).

---

### `Ticket` → table `tickets`

Unified ticket cache used by both the Ticket Analyser and BU/PS sync. A ticket is upserted here whenever it is fetched from Kayako, whether via the Analyser or the BU/PS sync.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `kayakoTicketId` | Int | Kayako case ID |
| `kayakoUrl` | String | Kayako instance URL |
| `title` | String | Case subject |
| `status` | String? | Resolved status label |
| `priority` | String? | Resolved priority label |
| `product` | String? | Resolved from Product custom field |
| `brand` | String? | Brand name from Kayako (e.g. "Jigsaw", "Coppertree") — used as BU display |
| `requesterName` | String? | |
| `requesterEmail` | String? | |
| `requesterKayakoId` | Int? | Kayako user ID — used by ConversationThread/Timeline to colour-code customer posts |
| `organization` | String? | Kayako organisation name |
| `team` | String? | `"PS"` or `"BU"` derived from tags (`bu_ps` → PS, `bu_other` → BU) |
| `isEscalated` | Boolean | True if `cust-escalate` tag present |
| `ghiId` | String? | GitHub issue number (extracted from GHI custom field) |
| `ghiStatus` | String? | GitHub issue status (extracted from GHI custom field) |
| `jiraFields` | Json? | `{ "PS Skyvera JIRA Key": "ZTOPS-527", ... }` |
| `holdReason` | String? | On-hold reason from custom field |
| `tags` | String[] | All Kayako tags |
| `assignee` | String? | Assigned agent name |
| `customFields` | Json? | Full resolved custom fields array: `[{ id, label, value, type }]` |
| `isBuPs` | Boolean | True if synced from BU/PS view #64 |
| `postsStatus` | String | `"none"` / `"fetching"` / `"done"` / `"error"` |
| `postsLastSyncedAt` | DateTime? | When posts were last fetched |
| `kayakoCreatedAt` | DateTime? | |
| `kayakoUpdatedAt` | DateTime? | |
| `lastSyncedAt` | DateTime | When ticket metadata was last synced |
| `createdAt` | DateTime | Row creation time |
| `updatedAt` | DateTime | Auto-updated |

Unique constraint: `(kayakoTicketId, kayakoUrl)`

Relations: `posts TicketPost[]`, `analyses TicketAnalysis[]`, `analysisRuns AnalysisRun[]`, `exports TicketExport[]`

---

### `TicketPost` → table `ticket_posts`

Individual posts belonging to a ticket.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `kayakoPostId` | Int | Kayako post ID |
| `ticketId` | UUID | FK → `tickets.id` (cascade delete) |
| `contents` | Text | Post body (plain text, HTML stripped) |
| `contentType` | String? | |
| `creatorId` | Int? | Kayako user ID |
| `creatorName` | String? | Resolved author name |
| `creatorType` | String? | |
| `channel` | String? | e.g. `"NOTE"`, `"EMAIL"` |
| `isPrivate` | Boolean | True for internal notes |
| `postedAt` | DateTime? | When the post was created in Kayako |
| `createdAt` | DateTime | Row creation time |
| `updatedAt` | DateTime | Auto-updated |

Unique constraint: `(ticketId, kayakoPostId)`

---

### `TicketAnalysis` → table `ticket_analyses`

Caches AI analysis results. One record per user per ticket.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `ticketId` | UUID | FK → `tickets.id` (cascade delete) |
| `userId` | UUID | FK → `user_settings.userId` (cascade delete) |
| `sections` | Json? | `{ one_liner, blocker_type, blocker_detail, path_to_closure, case_summary, customer_sentiment, what_needed, next_steps }` |
| `daySummaries` | Json? | `{ "YYYY-MM-DD": "one sentence", ... }` |
| `modelUsed` | String? | `claude-haiku-4-5-20251001` or `claude-sonnet-4-6` |
| `postCount` | Int? | Number of posts analysed |
| `status` | String | `"pending"` / `"running"` / `"done"` / `"error"` |
| `errorMsg` | String? | Error detail if status is `"error"` |
| `oneLiner` | String? | Extracted from `sections.one_liner` — shown in BU/PS table |
| `blockerType` | String? | Extracted from `sections.blocker_type` — shown in BU/PS table |
| `inputTokens` | Int? | Anthropic input token count (for cost tracking) |
| `outputTokens` | Int? | Anthropic output token count |
| `createdAt` | DateTime | When analysis was first created |
| `updatedAt` | DateTime | Auto-updated (used as the analysis timestamp shown in UI) |

Unique constraint: `(ticketId, userId)` — one cached analysis per user per ticket.

On re-run (`forceRefresh=true`), the route does an `upsert` which overwrites the existing row, including `inputTokens` and `outputTokens`.

---

### `ModelPricing` → table `model_pricing`

Stores Anthropic API pricing rates per model per time period. Managed directly in DB (no UI). Used by `lib/pricing.ts` to compute costs for each `AnalysisRun`.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `modelPattern` | String | Substring to match against model ID (e.g. `"haiku-4-5"`, `"sonnet-4-6"`) |
| `inputCostPer1M` | Float | USD cost per 1M input tokens |
| `outputCostPer1M` | Float | USD cost per 1M output tokens |
| `effectiveFrom` | DateTime | When this pricing became active |
| `effectiveTo` | DateTime? | When this pricing ended (`null` = currently active) |
| `notes` | String? | Optional label (e.g. `"Haiku 4.5 launch pricing"`) |
| `createdAt` | DateTime | Row creation time |

**Date-range pricing**: when Anthropic changes rates, set `effectiveTo` on the existing row and insert a new row. Historical runs automatically use the prices that were active when they ran.

**Seed data** (`prisma/seed-pricing.sql`): pre-seeded with haiku-4-5 ($0.80/$4.00 per 1M) and sonnet-4-6 ($3.00/$15.00 per 1M).

---

### `AnalysisRun` → table `analysis_runs`

Append-only log of every Anthropic API call — both analysis runs and markdown export generation. One new row is added on every attempt (success or error). Rows survive ticket deletion (`ticketId` → `null`).

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `ticketId` | UUID? | FK → `tickets.id` (`onDelete: SetNull` — **not** cascade) |
| `userId` | UUID | Supabase user ID |
| `kayakoTicketId` | Int | Kayako integer ticket ID — used for re-linking orphans |
| `kayakoUrl` | String | Kayako base URL — combined with kayakoTicketId for uniqueness |
| `trigger` | String | `"manual"` / `"batch"` / `"forced"` |
| `runType` | String | `"analysis"` (AI analysis) or `"download"` (markdown export) — default `"analysis"` |
| `modelUsed` | String? | Full model ID e.g. `"claude-haiku-4-5-20251001"` |
| `postCount` | Int? | Posts analysed (null for download runs) |
| `inputTokens` | Int? | Anthropic input token count |
| `outputTokens` | Int? | Anthropic output token count |
| `durationMs` | Int? | Wall time for the Anthropic call |
| `status` | String | `"done"` / `"error"` |
| `errorMsg` | String? | Error detail if status is `"error"` |
| `createdAt` | DateTime | When this run started |

**Orphan preservation**: `ticketId` uses `onDelete: SetNull`. When a ticket is deleted, `analysis_runs` rows are retained with `ticketId = null`. The `GET /api/bu-tickets/[id]` route auto-relinks orphaned rows by `kayakoTicketId + kayakoUrl` when the same ticket is re-imported.

**No `analysisRuns` relation on `UserSettings`** — all run queries filter by `userId` directly on `analysis_runs`.

---

### `FilterPreset` → table `filter_presets`

Saved URL-filter presets for the BU/PS Tickets and All Tickets pages.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `userId` | UUID | FK → `user_settings.userId` (cascade delete) |
| `module` | String | `"bu-tickets"` or `"all-tickets"` — scopes presets per page. Default `"bu-tickets"`. |
| `name` | String | Display name (user-supplied) |
| `filtersJson` | String | Canonical serialized QS (page stripped to 1) |
| `visibility` | Enum | `PERSONAL` or `SHARED` |
| `isDefault` | Boolean | Only one default per user per module (enforced by server action) |
| `createdAt` | DateTime | Auto-set on create |
| `updatedAt` | DateTime | Auto-updated |

---

### `BatchRun` → table `batch_runs`

Append-only log of background batch sync jobs. One row per job run.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `jobType` | String | `"all-tickets-sync"` / `"all-tickets-sync-posts"` / `"bu-tickets-sync-posts"` / `"bu-tickets-analyse-batch"` |
| `processedCount` | Int | Tickets successfully processed |
| `failedCount` | Int | Tickets that errored |
| `skippedCount` | Int | Tickets skipped (e.g. already closed) |
| `durationMs` | Int? | Wall time for the run |
| `status` | String | `"running"` / `"done"` / `"error"` |
| `errorMsg` | String? | Top-level error if the whole run failed |
| `createdAt` | DateTime | Auto-set on create |
| `updatedAt` | DateTime | Auto-updated |

Used by `BatchSyncStatus` component on the admin page to show recent run history per job type.

---

### `TicketExport` → table `ticket_exports`

Cached markdown export per user per ticket. One record per user per ticket (upserted on each generation).

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `ticketId` | UUID | FK → `tickets.id` (cascade delete) |
| `userId` | UUID | FK → `user_settings.userId` (cascade delete) |
| `markdownContent` | Text | The full generated `.md` file content |
| `modelUsed` | String? | Claude model used for the Overview section |
| `inputTokens` | Int? | Anthropic input token count (Overview call only) |
| `outputTokens` | Int? | Anthropic output token count |
| `status` | String | `"pending"` / `"running"` / `"done"` / `"error"` |
| `errorMsg` | String? | Error detail if status is `"error"` |
| `createdAt` | DateTime | Row creation time |
| `updatedAt` | DateTime | Auto-updated (used as the export timestamp shown in UI) |

Unique constraint: `(ticketId, userId)` — one cached export per user per ticket.

On re-generation (`forceRefresh=true`), the route does an `upsert` which overwrites the existing row.

**Structure of generated markdown**: Header → metadata table → tags → custom fields → Jira refs → AI Analysis sections (if available) → full conversation (all posts, no truncation). Claude generates only the "Overview" bullets section (max 400 tokens). All other content is built programmatically in TypeScript.

---

## DB-First Read Pattern

When a ticket is requested (via `/api/ticket` or `/api/bu-tickets/[id]/refresh`):

1. Check `tickets` table for a record matching `(kayakoTicketId, kayakoUrl)` with `postsStatus = 'done'`
2. If found and not `forceRefresh` → return from DB immediately (`fromCache: true`)
3. If not found or `forceRefresh=true` → call `fetchAndPersistTicket()` in `lib/kayako/ticketService.ts`

The AI analysis route (`/api/analysis`) always reads ticket and post data from the DB (it does not accept `caseData`/`posts` in the request body). The ticket must have been fetched first before analysis can run.

---

## Prisma Client Singleton

`lib/prisma.ts` exports a singleton PrismaClient to prevent connection pool exhaustion in development (where Next.js hot-reloads modules repeatedly):

```typescript
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

In production (Vercel), each function invocation gets a fresh instance — there is no hot-reload issue in production.

---

## Schema Changes

After editing `prisma/schema.prisma`:

```bash
# Regenerate TypeScript types (stop dev server first on Windows — DLL locked)
npm run db:generate

# Push schema to database (dev — no migration file created)
# Also regenerates the Prisma client
npm run db:push

# For production — create and apply a migration file
npx prisma migrate dev --name <description>
npm run db:migrate   # applies pending migrations on Vercel
```

**Important**: If you get a `ticket is not a function` or `prisma.ticket` undefined error at runtime, the Prisma client is stale. Stop the dev server, run `npm run db:generate`, and restart.

---

## Row-Level Security

Prisma does not enforce RLS — it connects as the database owner. RLS is applied at the Supabase level to provide a defence-in-depth layer. See [setup.md](setup.md#4-set-up-row-level-security-rls) for the SQL.

Every API route also enforces `userId = auth.user.id` explicitly in the Prisma `where` clause, so even without RLS a user cannot access another user's data.

For the `tickets` and `ticket_posts` tables, RLS is scoped to the user's `kayakoUrl` (the Kayako instance they are connected to) — users from different Kayako instances cannot see each other's data.
