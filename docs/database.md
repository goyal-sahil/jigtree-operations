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
| `DIRECT_URL` | 5432 (direct) | Prisma migrations and `db:push` |

Vercel serverless functions cannot hold long-lived database connections, so all runtime queries go through Supabase's PgBouncer transaction pooler (port 6543). Prisma migrations need a direct connection (port 5432) because they run DDL which PgBouncer's transaction mode doesn't support.

Both strings come from Supabase dashboard → Project Settings → Database → Connection string. Toggle the mode selector between "Transaction" and "Direct".

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

The password and API key are **never stored in plaintext**. See [encryption.md](encryption.md).

### `TicketAnalysis` → table `ticket_analyses`

Caches AI analysis results to avoid re-running Claude on the same ticket.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key, `gen_random_uuid()` |
| `userId` | UUID | FK → `user_settings.userId` (cascade delete) |
| `ticketId` | Int | Kayako case ID |
| `kayakoUrl` | String | Kayako instance URL (scopes cache per instance) |
| `sections` | Json | `{ executive_summary, one_line, case_summary, customer_sentiment, what_needed, next_steps }` |
| `daySummaries` | Json? | `{ "YYYY-MM-DD": "one sentence", ... }` |
| `modelUsed` | String? | `claude-haiku-4-5-20251001` or `claude-sonnet-4-6` |
| `postCount` | Int? | Number of posts analysed |
| `createdAt` | DateTime | When analysis was run |

The unique constraint `(userId, ticketId, kayakoUrl)` ensures one cached analysis per user per ticket per Kayako instance. On re-run (forceRefresh=true), the route does an `upsert` which overwrites the existing row.

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
# Regenerate TypeScript types
npm run db:generate

# Push schema to database (dev — no migration file created)
npm run db:push

# For production — create and apply a migration file
npx prisma migrate dev --name <description>
npm run db:migrate   # applies pending migrations on Vercel
```

---

## Row-Level Security

Prisma does not enforce RLS — it connects as the database owner. RLS is applied at the Supabase level to provide a defence-in-depth layer. See [setup.md](setup.md#4-set-up-row-level-security-rls) for the SQL.

Every API route also enforces `userId = auth.user.id` explicitly in the Prisma `where` clause, so even without RLS a user cannot access another user's data.
