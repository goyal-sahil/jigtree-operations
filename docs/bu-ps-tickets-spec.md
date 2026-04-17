# BU/PS Tickets — Feature Specification

_Author: Sahil Goyal · Last updated: 2026-04-17_

---

## 1. Overview

This document specifies the full implementation of the **JigTree Operations Hub** and the **BU/PS Tickets** feature.

The app is being evolved from a single-purpose Ticket Analyser into a broader operations tool. The changes cover:

1. **Layout restructure** — collapsible left sidebar + hub home page
2. **JigTree Operations Hub** — landing page with tiles linking to all tools
3. **BU/PS Tickets page** — live view of Kayako view #64 in a sortable table, backed by a PostgreSQL cache with full post history

---

## 2. Navigation & Layout

### 2.1 Left Sidebar

A persistent collapsible left sidebar replaces the top NavBar as the primary navigation. The NavBar (`NavBar.tsx`) is retired; user info and sign-out move to the sidebar footer.

| Sidebar Item | Icon | Route |
|---|---|---|
| JigTree Operations Hub | Home | `/` |
| Ticket Analyser | Search | `/analyser` |
| BU/PS Tickets | Table | `/bu-tickets` |
| Settings | Gear | `/settings` |

**Behaviour:**
- Expanded by default on desktop (240px wide), showing icon + label
- Collapses to icon-only strip (64px) on toggle or at `< 768px` viewport
- Active route highlighted with accent colour
- User avatar, email, and Sign Out button pinned to sidebar footer

**Component:** `components/Sidebar.tsx` — client component (uses `usePathname`)

### 2.2 Dashboard Layout Update

`app/(dashboard)/layout.tsx` wraps all dashboard pages in a two-column grid: sidebar + main content area. Current full-width layout is replaced.

### 2.3 Route Changes

| Old Route | New Route | Notes |
|---|---|---|
| `/` (Ticket Analyser) | `/analyser` | File moves to `app/(dashboard)/analyser/page.tsx` |
| `/` | Hub page | New `app/(dashboard)/page.tsx` |
| (new) | `/bu-tickets` | New `app/(dashboard)/bu-tickets/page.tsx` |
| `/settings` | `/settings` | Unchanged |

The first-login redirect in `app/(dashboard)/page.tsx` remains: if no credentials saved → redirect to `/settings`.

---

## 3. JigTree Operations Hub

**Route:** `/`  
**File:** `app/(dashboard)/page.tsx`  
**Component:** `components/HubPage.tsx`

A professional tile grid landing page. Each tile navigates to a tool.

### 3.1 Tiles (initial set)

| Tile | Icon | Route | Description |
|---|---|---|---|
| Ticket Analyser | Search | `/analyser` | Load & AI-analyse any Kayako ticket |
| BU/PS Tickets | Table | `/bu-tickets` | JigTree BU tickets from Kayako view #64 |

Additional tiles added in future phases as new tools are built.

### 3.2 Design

- Dark header band: "JigTree Operations Hub" + subtitle
- Tile cards: white background, icon, title, description, hover shadow + border accent
- Responsive: 2-column grid → 1-column on mobile

---

## 4. BU/PS Tickets Page

**Route:** `/bu-tickets`  
**File:** `app/(dashboard)/bu-tickets/page.tsx`  
**Kayako view:** `https://central-supportdesk.kayako.com/agent/conversations/view/64`

### 4.1 Table Columns

| Column | Source | Display |
|---|---|---|
| **ID** | `kayakoTicketId` | Hyperlink → `https://central-supportdesk.kayako.com/agent/conversations/{id}` |
| **Esc** | `isEscalated` | Red badge "ESC" if `true`; blank if `false` |
| **BU** | `bu` | Organisation name (plain text) |
| **Team** | `team` | Pill badge: "PS" (blue) or "BU" (purple) |
| **Title** | `title` | Case subject (truncated at 60 chars) |
| **Product** | `product` | Plain text |
| **Customer** | `requesterName` | Requester full name |
| **Priority** | `priority` | Coloured pill (Urgent=red, High=orange, Normal=grey) |
| **Status** | `status` | Plain text |
| **Created** | `kayakoCreatedAt` | `dd MMM yyyy` |
| **Updated** | `kayakoUpdatedAt` | Relative ("2h ago") + full date on hover |
| **GHI** | `ghiId` | Hyperlink → `https://github.com/trilogy-group/eng-maintenance/issues/{ghiId}` if set; blank otherwise |
| **JIRA** | `jiraFields` | Comma-separated JIRA keys extracted from all JIRA-labelled fields |
| **Hold Reason** | `holdReason` | Plain text; blank if not set |

### 4.2 Table Behaviour

- Client-side sortable on all columns (click header to sort asc/desc)
- Client-side text filter (single search box filters ID, Title, Customer, BU, Product)
- Rows per page: 25 / 50 / All
- Alternating row shading for readability
- "Last synced: X minutes ago" shown above table
- "Sync Now" button — triggers `POST /api/bu-tickets/sync`, disables during sync, shows spinner

### 4.3 Page Load Behaviour

1. Page loads → immediately fetches `/api/bu-tickets` (GET) → renders from DB cache (fast)
2. No blocking wait for Kayako
3. If DB is empty (first load), shows empty state with "No tickets yet — click Sync to fetch"

---

## 5. Data Model

### 5.1 `bu_ps_tickets`

One row per Kayako ticket. Upserted on each sync (match on `kayakoTicketId`).

```prisma
model BuPsTicket {
  id               String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  kayakoTicketId   Int       @unique
  title            String
  status           String?
  priority         String?
  product          String?
  requesterName    String?
  requesterEmail   String?
  bu               String?   // case.organization.name
  team             String?   // "PS" | "BU" | null (from tags)
  isEscalated      Boolean   @default(false)  // tag cust-escalate
  ghiId            String?   // custom field matching /ghi|github/i
  jiraFields       Json?     // { "PS Skyvera JIRA Key": "ZTOPS-527", ... }
  holdReason       String?   // custom field matching /on-hold.*reason|hold.*reason/i
  tags             String[]  // all raw Kayako tags
  assignee         String?   // assigned_agent.full_name
  kayakoCreatedAt  DateTime?
  kayakoUpdatedAt  DateTime?
  lastSyncedAt     DateTime  @default(now())
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  posts        BuPsTicketPost[]
  customFields BuPsTicketCustomField[]

  @@map("bu_ps_tickets")
}
```

### 5.2 `bu_ps_ticket_posts`

All posts for each ticket. Upserted on sync (match on `ticketId` + `kayakoPostId`).

```prisma
model BuPsTicketPost {
  id            String    @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  kayakoPostId  Int
  ticketId      String    @db.Uuid
  contents      String    @db.Text
  contentType   String?   // "html" | "text"
  creatorId     Int?
  creatorName   String?
  creatorType   String?   // "USER" | "AGENT"
  channel       String?   // "NOTE" | "REPLY" | etc
  isPrivate     Boolean   @default(false)
  postedAt      DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  ticket BuPsTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)

  @@unique([ticketId, kayakoPostId])
  @@map("bu_ps_ticket_posts")
}
```

### 5.3 `bu_ps_ticket_custom_fields`

All raw custom fields per ticket. Upserted on sync (match on `ticketId` + `fieldId`). Provides full field history for future views (JIRA details, escalation fields, etc.).

```prisma
model BuPsTicketCustomField {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  ticketId    String   @db.Uuid
  fieldId     Int
  fieldLabel  String
  fieldValue  String?
  fieldType   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  ticket BuPsTicket @relation(fields: [ticketId], references: [id], onDelete: Cascade)

  @@unique([ticketId, fieldId])
  @@map("bu_ps_ticket_custom_fields")
}
```

---

## 6. Kayako Integration

### 6.1 View Endpoint

Primary endpoint to try:

```
GET /api/v1/cases/views/64
```

Per Kayako developer docs: https://developer.kayako.com/api/v1/cases/views/#Retrieve-a-view

Expected response: `{ data: KayakoCase[] }` with pagination via `next_url`.

**Fallback** (if above returns 400/404):

```
GET /api/v1/cases?view_id=64&limit=200
```

The sync code will detect a 400 on the primary endpoint and automatically retry the fallback. After first successful sync, the working endpoint is determined and used for all subsequent syncs.

### 6.2 Pagination

Same strategy as `getAllPosts()`:
- `limit=200` per page
- Follow `next_url` from response
- Fall back to offset if no `next_url`
- Deduplicate by `case.id`
- No hard limit on number of tickets (views are expected to have < 500 tickets)

### 6.3 Per-Ticket Data Fetching

For each case ID returned by the view:

1. **Full case detail**: `GET /api/v1/cases/{id}?include=user,team`
   - Resolves status label, priority label, custom fields
   - Same resolution logic as existing `getCase()` method
2. **Posts**: `getAllPosts(caseId)` — same as existing implementation
3. **User resolution**: `resolveUsers(posts, seedUsers)` — same as existing

All tickets processed **concurrently** in batches of 10 to avoid Kayako rate limits.

### 6.4 Field Mapping Logic

All field mappings use **label-based matching** (case-insensitive regex) — no hardcoded field IDs — to be robust against field ID changes.

| Target Field | Label Match | Notes |
|---|---|---|
| `bu` | `case.organization?.name` | Top-level organization object on the case |
| `team` | tag `bu_ps` → "PS" · tag `bu_other` → "BU" | Check `case.tags[]` |
| `isEscalated` | tag `cust-escalate` present | Check `case.tags[]` |
| `product` | custom field label `/product/i` | Field ID 16 is known; label match is fallback |
| `ghiId` | custom field label `/ghi\|github/i` | Raw value is a number string |
| `holdReason` | custom field label `/hold.*reason\|on.hold.*reason/i` | |
| `jiraFields` | custom field label `/jira\|jia/i` | Store ALL matching fields as `{ label: value }` JSON |
| `requesterName` | `case.requester.full_name` | |
| `requesterEmail` | `case.requester.identities[0].email` | |
| `assignee` | `case.assigned_agent?.full_name` | |

### 6.5 New KayakoClient Method

```typescript
async getViewCases(viewId: number): Promise<KayakoCase[]>
```

- Fetches all pages from view endpoint
- Returns flat array of raw case objects (subject, status, priority, tags, custom_fields, organization, requester, assigned_agent)
- Does NOT fetch posts (posts are fetched separately per ticket during sync)

---

## 7. API Routes

### 7.1 `GET /api/bu-tickets`

Returns all rows from `bu_ps_tickets` ordered by `kayakoUpdatedAt DESC`.

**Response:**
```typescript
{
  tickets: BuPsTicketRow[]  // all columns except posts/customFields
  lastSyncedAt: string | null  // most recent lastSyncedAt across all rows
}
```

**Auth:** Supabase session required (same as all other routes). No per-user filtering — BU/PS tickets are shared team data.

### 7.2 `POST /api/bu-tickets/sync`

Triggers a full sync from Kayako view 64. Uses the requesting user's Kayako credentials (from their `user_settings`).

**Steps:**
1. Authenticate with Kayako using requesting user's credentials
2. Call `getViewCases(64)` — get all case IDs + basic data
3. For each case (batches of 10):
   a. Call full `getCase(id)` with custom field resolution
   b. Call `getAllPosts(id)`
   c. Call `resolveUsers(posts, ...)`
4. For each ticket: upsert `bu_ps_tickets` row (on `kayakoTicketId`)
5. For each post: upsert `bu_ps_ticket_posts` row (on `ticketId + kayakoPostId`)
6. For each custom field: upsert `bu_ps_ticket_custom_fields` row (on `ticketId + fieldId`)
7. Set `lastSyncedAt = now()` on all upserted ticket rows

**Response:**
```typescript
{
  ok: true
  synced: number     // tickets upserted
  duration: number   // ms
}
```

**Error handling:**
- Kayako timeout: returns partial results + `warning` field
- Auth failure: 502 with message
- DB error: 500

---

## 8. Component Specifications

### 8.1 `Sidebar.tsx`

**Type:** Client component (`'use client'`)  
**State:** `collapsed: boolean` (localStorage-persisted)

```
Props: { userEmail: string }

Renders:
  - App logo / "JigTree Operations" wordmark (collapsed: icon only)
  - Nav links (icon + label; active state from usePathname)
  - Collapse toggle button
  - Footer: user avatar (initials), email, Sign Out button
```

### 8.2 `HubPage.tsx`

**Type:** Client component  

```
Props: { userName: string }

Renders:
  - Dark hero strip: "JigTree Operations Hub", subtitle, user greeting
  - Tile grid (2 cols desktop, 1 col mobile):
    Each tile: icon, title, description, arrow indicator, onClick → router.push(route)
```

### 8.3 `BUTicketsTable.tsx`

**Type:** Client component  

```
Props: {
  tickets: BuPsTicketRow[]
  lastSyncedAt: string | null
  onSync: () => Promise<void>
}

State:
  - sortColumn: keyof BuPsTicketRow
  - sortDir: 'asc' | 'desc'
  - filterText: string
  - pageSize: 25 | 50 | 'all'
  - syncing: boolean

Renders:
  - Toolbar: search input, "Sync Now" button, "Last synced X ago" text
  - Table with sortable headers
  - Pagination controls
  - Empty state if no tickets
}
```

---

## 9. Prisma SQL Migrations

Run in Supabase SQL Editor after `npm run db:push` fails to add RLS:

```sql
-- BU/PS tickets (shared, no RLS — team-visible data)
ALTER TABLE bu_ps_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read bu_ps_tickets"
  ON bu_ps_tickets FOR SELECT
  USING (auth.role() = 'authenticated');

-- Posts (same visibility as parent ticket)
ALTER TABLE bu_ps_ticket_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read bu_ps_ticket_posts"
  ON bu_ps_ticket_posts FOR SELECT
  USING (auth.role() = 'authenticated');

-- Custom fields (same visibility)
ALTER TABLE bu_ps_ticket_custom_fields ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read bu_ps_ticket_custom_fields"
  ON bu_ps_ticket_custom_fields FOR SELECT
  USING (auth.role() = 'authenticated');

-- Sync writes use service role via Prisma (bypasses RLS)
-- No insert/update policies needed for authenticated role
```

> **Note:** Write operations (sync) bypass RLS because Prisma connects with `DATABASE_URL` (pooler connection string, not a Supabase user JWT). This is the intended pattern.

---

## 10. TypeScript Types to Add

In `types/kayako.ts`:

```typescript
export interface KayakoOrganization {
  id: number
  name?: string
}

// Extend KayakoCase:
export interface KayakoCase {
  // ... existing fields ...
  organization?: KayakoOrganization
}

// New types for BU/PS feature:
export interface BuPsTicketRow {
  id: string
  kayakoTicketId: number
  title: string
  status: string | null
  priority: string | null
  product: string | null
  requesterName: string | null
  requesterEmail: string | null
  bu: string | null
  team: string | null
  isEscalated: boolean
  ghiId: string | null
  jiraFields: Record<string, string> | null
  holdReason: string | null
  tags: string[]
  assignee: string | null
  kayakoCreatedAt: string | null
  kayakoUpdatedAt: string | null
  lastSyncedAt: string
}
```

---

## 11. Open Questions / Assumptions

| # | Question | Assumption |
|---|---|---|
| 1 | View API endpoint format | Try `GET /api/v1/cases/views/64` first; auto-fallback to `GET /api/v1/cases?view_id=64` |
| 2 | Does `organization` field exist on case response? | Yes — standard Kayako case response includes `organization` object. If absent, `bu` will be null |
| 3 | Is `cust-escalate` the only escalation tag? | Yes per user confirmation. Add others if discovered |
| 4 | GHI field — is the value always a plain integer? | Yes per user confirmation. Strip whitespace before storing |
| 5 | JIRA column in table — which field value to show? | Show comma-separated values from all fields matching `/jira\|jia/i` whose value looks like a JIRA key (`[A-Z]+-\d+`) |
| 6 | Posts: are they needed for the table view? | Not for the table itself, but stored for future drill-down / analysis features |
| 7 | Sync frequency | Manual only (Sync button). Automated sync can be added later via Vercel cron |
| 8 | Access control for sync | Any logged-in user can trigger sync (uses their own Kayako credentials) |

---

## 12. Implementation Order

1. **Prisma schema** — add 3 new models → `npm run db:push`
2. **TypeScript types** — extend `types/kayako.ts`
3. **KayakoClient** — add `getViewCases()` method + view endpoint fallback logic
4. **Sync API route** — `app/api/bu-tickets/sync/route.ts`
5. **Read API route** — `app/api/bu-tickets/route.ts`
6. **Sidebar component** — `components/Sidebar.tsx`
7. **Layout update** — `app/(dashboard)/layout.tsx`
8. **Hub page** — `app/(dashboard)/page.tsx` + `components/HubPage.tsx`
9. **Move Analyser** — `app/(dashboard)/analyser/page.tsx`
10. **BU Tickets page** — `app/(dashboard)/bu-tickets/page.tsx` + `components/BUTicketsTable.tsx`
11. **Deploy** — push to GitHub → auto-deploy via Vercel
12. **Test sync endpoint** — verify Kayako view API endpoint works from production

---

## 13. Files Created / Modified

### New Files

| File | Purpose |
|---|---|
| `docs/bu-ps-tickets-spec.md` | This spec |
| `app/(dashboard)/analyser/page.tsx` | Ticket Analyser (moved) |
| `app/(dashboard)/bu-tickets/page.tsx` | BU/PS Tickets page |
| `app/api/bu-tickets/route.ts` | GET tickets from DB |
| `app/api/bu-tickets/sync/route.ts` | POST sync from Kayako |
| `components/Sidebar.tsx` | Left sidebar nav |
| `components/HubPage.tsx` | Hub tile grid |
| `components/BUTicketsTable.tsx` | Sortable ticket table |

### Modified Files

| File | Change |
|---|---|
| `prisma/schema.prisma` | Add 3 new models |
| `types/kayako.ts` | Add `KayakoOrganization`, `BuPsTicketRow`; extend `KayakoCase` |
| `lib/kayako/client.ts` | Add `getViewCases()` method |
| `app/(dashboard)/layout.tsx` | Add Sidebar, remove NavBar |
| `app/(dashboard)/page.tsx` | Replace Ticket Analyser with Hub page |
| `components/NavBar.tsx` | Retired — user info moves to Sidebar |
