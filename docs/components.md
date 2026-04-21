# UI Components

All components are in `components/`. Server components live in `app/`. The main interactive surfaces are client-side.

---

## Component Tree

```
app/(dashboard)/layout.tsx     [server — auth guard]
  Sidebar                      [client — collapsible left nav]
  app/(dashboard)/page.tsx     [server — first-login redirect]
    HubPage                    [client — tile grid]

app/(dashboard)/analyser/page.tsx  [server]
  TicketAnalyser               [client — main state machine]
    CredentialsBanner          [client — missing credentials warning]
    TicketCard                 [client — ticket metadata]
    ConversationThread         [client — post list with filter toggles]
    ─── tab: AI Analysis ───
    AIAnalysis                 [client — analysis display]
    ─── tab: Timeline ───
    Timeline                   [client — date-grouped posts]
    ─── tab: Add Note ───
    AddNoteForm                [client — note textarea]

app/(dashboard)/bu-tickets/page.tsx  [client — BU/PS table]
  CredentialsBanner
  BUTicketsTable               [client — sortable/filterable table]

app/(dashboard)/bu-tickets/[id]/page.tsx  [client — detail page]
  TicketCard                   [shared with Analyser]
  ConversationThread           [shared with Analyser]
  ─── tab: AI Analysis ───
  AIAnalysis                   [shared with Analyser]
  ─── tab: Timeline ───
  Timeline                     [shared with Analyser]
  ─── tab: Add Note ───
  AddNoteForm                  [shared with Analyser]
  AnalysisHistory              [BU/PS only — collapsible run log]

app/(dashboard)/settings/page.tsx  [server]
  SettingsForm                 [client — credential form]
```

---

## `TicketAnalyser`

`components/TicketAnalyser.tsx` — the top-level client component for the Ticket Analyser page. Owns all state and orchestrates all API calls.

**State:**
- `input` — the URL/ID text field value
- `fetching` — loading spinner for ticket fetch
- `refreshing` — spinner for the Refresh button (forceRefresh=true fetch)
- `fetchError` — error from `/api/ticket`
- `ticketData: TicketResponse | null` — full response (ticket + posts + fromCache + lastSyncedAt + warning)
- `analysis: AnalysisResult | null` — result from `/api/analysis`
- `aiLoading` — loading state while analysis runs
- `aiError` — error from `/api/analysis`
- `activeTab: 'ai' | 'timeline' | 'note'`
- `missingKayako` / `missingAnthropic` — from `GET /api/credentials`, shown in `CredentialsBanner`

**Key behaviours:**
- On mount: fetches `/api/credentials` to check if credentials are set, shows `CredentialsBanner` if not
- Pressing Enter in the input field triggers `doFetch(false)`
- "Refresh" button in `TicketCard` calls `doFetch(true)` (`forceRefresh=true`) — re-fetches from Kayako and clears analysis
- After a note is posted (`onNotePosted`): clears `analysis` then calls `doFetch(true)` to reload the ticket
- AI tab shows "Run Analysis" button until first run; after that shows result with "Re-run" button

---

## `TicketCard`

`components/TicketCard.tsx` — client component. Used on both the Ticket Analyser and BU/PS detail page.

**Props:**
```typescript
{
  ticket:       TicketRow        // DB-typed ticket row (not KayakoCase)
  postCount:    number
  lastSyncedAt: string           // ISO string — shown as "Last fetched: ..."
  onRefresh:    () => void       // called when Refresh button is clicked
  refreshing:   boolean          // disables Refresh button + shows spinner
}
```

**Renders:**
- Hold reason banner (amber) — shown if `ticket.holdReason` is set
- Title row: Kayako link (`#ID`), ESC badge, Team badge (PS/BU)
- Ticket subject
- Meta grid: Customer (org name), Requester name+email, Assignee, Created date, Message count + status note
- Status badge (colour-coded), Priority badge, Product badge (indigo)
- Refresh button + "Last fetched" timestamp
- Tags (violet pills, collapsible if > 5)
- GHI link + JIRA key badges
- Custom fields (collapsible "Other Fields" grid)

**Status badge colours:**
| Status keyword | Style |
|---|---|
| closed / completed | `bg-slate-100 text-slate-600` |
| pending | `bg-yellow-100 text-yellow-800` |
| open | `bg-blue-100 text-blue-800` |
| new / other | `bg-green-100 text-green-800` |

**Status note** (shown inline with message count):
- `open` or `hold` → "Open for N days"
- `pend` → "Pending customer response"
- `clos` or `complet` → "Case closed"

---

## `ConversationThread`

`components/ConversationThread.tsx` — client component. Used on both Ticket Analyser and BU/PS detail page.

**Props:**
```typescript
{
  posts:             UnifiedPost[]    // from DB (not KayakoPost[])
  requesterKayakoId: number | null   // used to identify customer posts
}
```

Collapsible panel (collapsed by default). When expanded, shows filter toggle buttons and the post list.

**Filter toggles** (Customer / Support / Internal Note / Side Conversation) — all active by default. Only types that are actually present in the ticket are shown. At least one must remain active. Posts are filtered in real-time.

**Post type classification** (per post) — uses stored `channel` field:
- `channel === 'NOTE'` or `isPrivate === true` → `note` (yellow background, violet badge)
- `channel === 'SIDE_CONVERSATION'` → `side` (grey background, raw channel label shown)
- `channel === 'CUSTOMER'` → `customer` (red background)
- Fallback: if `requesterKayakoId != null && creatorId === requesterKayakoId` → `customer` (for posts fetched before channel-resolution was added)
- Otherwise → `support` (blue background)

Each post bubble shows: author name, timestamp, type badge, and post contents rendered as **HTML** via `dangerouslySetInnerHTML` with `@tailwindcss/typography` `prose prose-sm` styling. Side conversation posts show a placeholder if contents are empty.

---

## `Timeline`

`components/Timeline.tsx` — client component. Used on both Ticket Analyser and BU/PS detail page.

**Props:**
```typescript
{
  posts:             UnifiedPost[]
  requesterKayakoId: number | null
  daySummaries:      Record<string, string>   // from AI analysis; empty {} if not run
}
```

Groups posts by calendar date (UTC, `postedAt.slice(0, 10)`). Each day section (`DaySection`) shows:
- Date heading + message count
- AI day summary (italic, if available)
- Expand/collapse toggle — posts collapsed by default
- Posts use the same colour coding as `ConversationThread` (yellow/red/blue)

Days are sorted chronologically. If `daySummaries` is empty (analysis not run), summaries are absent but the structure is otherwise unchanged.

---

## `AIAnalysis`

`components/AIAnalysis.tsx` — client component.

**Props:**
```typescript
{
  analysis:  AnalysisResult
  loading:   boolean
  onRerun:   () => void
  createdAt: string | null   // ISO string — shown as "Analysed: ..."
}
```

Renders analysis cards using Lucide icons:
- Model pill (Haiku = green, Sonnet = purple) + "Analysed: <date>" label
- Cards for all 8 sections: One-liner, Blocker (type + detail), Path to Closure, Case Summary, Customer Sentiment, What's Needed to Close, Next Steps
- "Re-run Analysis" button (`onRerun`)
- Handles `analysis.status === 'error'` — shows error message
- Handles `analysis.status === 'pending' | 'running'` — shows loading state
- Uses `useTimezone()` from `TimezoneProvider` to format the analysis timestamp

---

## `BUTicketsTable`

`components/BUTicketsTable.tsx` — client component.

**Props:**
```typescript
{
  tickets:       TicketRow[]
  lastSyncedAt:  string | null
  syncStatus:    string | null
  syncElapsed:   number
  isAdmin:       boolean
  onSync:        () => Promise<void>
  onDelete:      (ids: string[]) => Promise<void>
  onDeleteAll:   () => Promise<void>
}
```

**Columns**: ID (links to `/bu-tickets/[id]` + external Kayako icon), Esc, Team, Title, One-liner (AI), Blocker Type (AI), Product, Customer, Priority, Status, Age Risk, Last Analysed.

**Features:**
- Client-side text filter (search across title, customer, one-liner)
- Sortable by any column (click header to toggle asc/desc)
- Pagination: 25 / 50 / all rows
- Sync button with elapsed timer and status message
- Age risk badge: `overdue` (red) / `at-risk` (amber) / `ok` (green) based on ticket age and status
- Admin (email in `NEXT_PUBLIC_ADMIN_EMAILS`): checkbox row selection, "Delete selected", "Delete All" with confirmation

---

## `CredentialsBanner`

`components/CredentialsBanner.tsx` — client component.

**Props:** `{ missingKayako: boolean; missingAnthropic: boolean }`

Shown at the top of both the Ticket Analyser and BU/PS Tickets pages. Renders a warning banner with a link to `/settings` when either credential is not configured.

---

## `Sidebar`

`components/Sidebar.tsx` — client component. Rendered in `app/(dashboard)/layout.tsx`.

Left navigation with icon + label items:
- Hub (/)
- Ticket Analyser (/analyser)
- BU/PS Tickets (/bu-tickets)

Active route is highlighted. User email is shown in the footer. Sign-out button calls `supabase.auth.signOut()`.

---

## `HubPage`

`components/HubPage.tsx` — client component. Rendered on `app/(dashboard)/page.tsx`.

Tile grid linking to the two main tools (Ticket Analyser + BU/PS Tickets).

---

## `AddNoteForm`

`components/AddNoteForm.tsx` — client component.

**Props:** `{ caseId: number; onSuccess: () => void }`

Textarea for composing an internal note. Submits to `POST /api/note`. On success calls `onSuccess()` and clears the textarea.

---

## `SettingsForm`

`components/SettingsForm.tsx` — client component.

Four fields: Kayako URL, Kayako Email, Kayako Password (password input), Anthropic API Key (password input). Password and API key fields show placeholder text when a value is already saved — the server never returns the actual values.

Submits to `POST /api/settings`. On success redirects to `/` (first login) or shows a "Saved" confirmation.

**Props:** `initialKayakoUrl`, `initialKayakoEmail`, `isFirstLogin`

---

## `AnalysisHistory`

`components/AnalysisHistory.tsx` — client component. Rendered on the BU/PS ticket detail page below the tabs section when at least one analysis run exists.

**Props:**
```typescript
{ runs: AnalysisRunRow[] }
```

`AnalysisRunRow` shape: `{ id, trigger, modelUsed, postCount, inputTokens, outputTokens, durationMs, status, errorMsg, createdAt, inputCostUsd, outputCostUsd, totalCostUsd, isOrphaned? }`

**Renders:**
- Collapsed by default — header shows run count and total cost
- When expanded: 11-column table (When, Trigger, Status, Model, Posts, In tokens, Out tokens, In cost, Out cost, Total cost, Duration)
- `<tfoot>` row showing total cost across all runs
- Orphaned runs (from a previous import) shown with amber "orphaned" label + tooltip
- Model display strips `claude-` prefix and date suffix for readability (e.g. `haiku-4-5` instead of `claude-haiku-4-5-20251001`)
- Uses `useTimezone()` for timestamp formatting

---

## `TimezoneProvider`

`components/TimezoneProvider.tsx` — client context provider. Wraps `app/(dashboard)/layout.tsx`.

Detects the user's browser timezone (`Intl.DateTimeFormat().resolvedOptions().timeZone`) on mount and makes it available via `useTimezone()` hook. Components that format dates (`AnalysisHistory`, `AIAnalysis`, `TicketCard`, `Timeline`, `ConversationThread`) call `useTimezone()` to get the IANA timezone string, then pass it to `formatDateTime()` / `formatDate()` from `lib/tz.ts`.

**`lib/tz.ts`** exports:
- `formatDateTime(iso, tz)` — format ISO string as `DD-MMM-YYYY HH:MM` in the given timezone
- `formatDate(iso, tz)` — format ISO string as `DD-MMM-YYYY`

---

## Utility Functions (`lib/utils.ts`)

| Function | Description |
|---|---|
| `fmtDt(ts)` | ISO timestamp → `DD-MMM-YYYY HH:MM` (UTC) |
| `fmtDate(ts)` | ISO date → `DD-MMM-YYYY` |
| `safeLabel(obj, fallback)` | Read `label \| name \| title \| ID:n` from any object |
| `safeName(obj, fallback)` | Read `full_name \| name \| ID:n` from any object |
| `extractEmail(user)` | Extract email from Kayako user (checks `email`, `identities`, `emails`) |
| `getPostText(post)` | Unwrap `contents` (string or string array) to plain string |
| `ageDays(isoDate)` | Float: days between an ISO date and now |

Both `safeLabel` and `safeName` accept `object | null | undefined` — no cast needed when passing Kayako objects.
