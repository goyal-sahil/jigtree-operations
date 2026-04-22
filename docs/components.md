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
    Download .md button        [inline — in TicketAnalyser]
    ConversationThread         [client — post list with filter toggles]
    ─── tab: AI Analysis ───
    AIAnalysis                 [client — analysis display]
    ─── tab: Timeline ───
    Timeline                   [client — date-grouped posts]
    ─── tab: Add Note ───
    AddNoteForm                [client — note textarea]
    AnalysisHistory            [client — API usage history (analysis + download runs)]

app/(dashboard)/bu-tickets/page.tsx  [server — async Server Component]
  CredentialsBanner
  TicketProductAnalytics       [client — product open-ticket pill bar]
  BUTicketsToolbar             [client — sync, delete-all, last-synced]
  BUTicketsFilters             [client — search + collapsible filter panel + presets]
  BUTicketsTable               [client — URL sort headers + pagination]

app/(dashboard)/bu-tickets/[id]/page.tsx  [client — detail page]
  TicketCard                   [shared with Analyser]
  Download .md button          [inline — in BuTicketDetailPage]
  ConversationThread           [shared with Analyser]
  ─── tab: AI Analysis ───
  AIAnalysis                   [shared with Analyser]
  ─── tab: Timeline ───
  Timeline                     [shared with Analyser]
  ─── tab: Add Note ───
  AddNoteForm                  [shared with Analyser]
  AnalysisHistory              [collapsible API usage history (analysis + download runs)]

app/(dashboard)/all-tickets/page.tsx  [server — async Server Component]
  CredentialsBanner
  TicketProductAnalytics       [client — product open-ticket pill bar]
  AllTicketsToolbar            [client — sync, delete-all, last-synced]
  AllTicketsFilters            [client — search + collapsible filter panel + presets]
  AllTicketsTable              [client — URL sort headers + pagination + CSV export]

app/(dashboard)/settings/page.tsx  [server]
  SettingsForm                 [client — credential form]

app/(dashboard)/admin/page.tsx  [server — admin-gated]
  AdminPresetsTable            [client — all presets grouped by user, with "Page" column]
  BatchSyncStatus              [client — batch job trigger + recent run log (per job type)]
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
- `analysisRuns: AnalysisRunRow[]` — run history from `/api/ticket` and reloaded after each run
- `aiLoading` — loading state while analysis runs
- `aiError` — error from `/api/analysis`
- `exportInfo: ExportInfo | null` — cached export status from `/api/ticket`
- `exporting` — loading state while export generates
- `exportPhase: string` — current phase label ("Refreshing analysis…" / "Generating export…")
- `exportError` — error from `/api/export`
- `activeTab: 'ai' | 'timeline' | 'note'`
- `missingKayako` / `missingAnthropic` — from `GET /api/credentials`, shown in `CredentialsBanner`

**Key behaviours:**
- On mount: fetches `/api/credentials` to check if credentials are set, shows `CredentialsBanner` if not
- Pressing Enter in the input field triggers `doFetch(false)`
- `doFetch(false)` — checks `data.cachedAnalysis`, `data.analysisRuns`, and `data.export` in the response; auto-populates AI tab and run history without extra API calls
- "Refresh" button in `TicketCard` calls `doFetch(true)` (`forceRefresh=true`) — re-fetches from Kayako and clears analysis state
- After a note is posted (`onNotePosted`): clears `analysis` then calls `doFetch(true)` to reload the ticket
- AI tab: auto-populates from `cachedAnalysis` on first load if analysis exists; shows "Run Analysis" button if not; shows "Re-run" button once analysis is loaded
- **Download .md button**: shown when `postsStatus='done'`. `downloadExport(forceRefresh)`:
  1. Checks `isAnalysisStale(ticket, analysis)` — stale if `Math.max(lastSyncedAt, postsLastSyncedAt) > analysis.created_at`
  2. If stale or forceRefresh: re-runs analysis first, then reloads run history
  3. Calls `POST /api/export` — receives `markdown` string
  4. Triggers browser download via Blob + URL.createObjectURL
  5. Reloads run history so the download entry appears immediately
- **"↻ Regenerate" link**: shown next to Download button when `exportInfo?.status === 'done'`; calls `downloadExport(true)`
- `<AnalysisHistory runs={analysisRuns} />` rendered below tabs when runs exist

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

## `BUTicketsToolbar`

`components/BUTicketsToolbar.tsx` — client component.

**Props:**
```typescript
{
  lastSyncedAt: string | null   // ISO — shown as "Last synced: ..."
  isAdmin:      boolean
  totalCount:   number          // unfiltered total for display
}
```

**Features:**
- **Sync Now** — `POST /api/bu-tickets/sync`, then fires `sync-posts` and `analyse-batch` background jobs; shows elapsed timer while running
- **Delete All** — admin only; `DELETE /api/bu-tickets`; requires confirmation dialog
- Calls `router.refresh()` after each mutation so the Server Component re-runs

---

## `BUTicketsFilters`

`components/BUTicketsFilters.tsx` — client component. Manages all filter/preset UI.

**Props:**
```typescript
{
  filters:   BuTicketsListFilters  // current applied filters (parsed from URL)
  options:   FilterOptions         // available values for each checkbox group
  currentQS: string                // canonical filter signature (page=1)
  presets:   FilterPresetRow[]     // own + shared presets, default-first
  userId:    string                // current user UUID for ownership check
}
```

**Layout:**
1. **Search bar** — always visible above the filter panel; debounced 350 ms; updates URL live without requiring Apply. Uses `useSearchParams()` inside the timeout to avoid stale closure (not `filters` prop, which is stale inside `setTimeout`).
2. **Filter toggle row** — "▸ Filters" / "▾ Filters" button + active count badge + preset pills + "Save preset" button
3. **Collapsible filter panel** — auto-opens when `countActiveFilters > 0`

**NProgress integration:**
- `navigate(url)` helper: `NProgress.start()` then `router.push(url)` — gives instant visual feedback on Apply, preset click, Clear
- `useEffect([searchParams.toString()])` calls `NProgress.done()` when URL actually changes
- `nextjs-toploader` only intercepts `<a>` tag clicks — does NOT fire for programmatic `router.push()`

**Draft state sync:**
Uses `useEffect([paramsSig])` to sync checkbox draft from `filters` prop when URL changes — without remounting. This preserves in-progress checkbox selections when the debounced search navigates the URL. `paramsSig = serializeBuTicketsParams(filters).toString()`.

**Checkbox groups** (via `ScrollableCheckboxGroup`):
- Status, Priority, Team, Product, Blocker Type, Age Risk (labelled), Escalated (single boolean)
- Each group: `max-h-36 overflow-y-auto` scrollable list + "All · None" mini links
- Changes update local `draft` state; committed only on "Apply Filters"

**Preset pills** (inline with filter toggle button):
- Active preset = blue background; ★ prefix for own default; "Shared" badge for other users' SHARED presets
- Click navigates immediately to `?${preset.filtersJson}`

**Update preset button:**
- Shown when `draftSig !== activeOwnPreset?.filtersJson` (draft differs from active own preset)
- Calls `updateBuTicketFilterPresetFilters(id, draftSig)` — overwrites saved filters in-place

**Preset management** (inside filter panel, own presets only):
- ★ button toggles default (`setDefaultBuTicketFilterPreset` / `clearDefaultBuTicketFilterPreset`)
- Eye/badge button toggles visibility (`toggleBuTicketFilterPresetVisibility`) — pill shows "Shared" (emerald) or "Private" (slate)
- ✕ button: shows inline "Delete? Yes / No" confirmation via `deleteConfirmId` state (no modal)
- All preset actions use `useTransition` + `loadingId` for per-item spinners; global `isPending` disables all buttons during any transition

**Save preset dialog** (inline):
- Name text input + visibility selector + Save/Cancel
- Calls `createBuTicketFilterPreset` Server Action via `useTransition`

---

## `BUTicketsTable`

`components/BUTicketsTable.tsx` — client component.

**Props:**
```typescript
{
  tickets:  TicketRow[]
  total:    number              // filtered count for pagination
  filters:  BuTicketsListFilters
  isAdmin:  boolean
}
```

**Columns**: ID (links to `/bu-tickets/[id]` + external Kayako icon), Esc, Team, Title, One-liner (AI), Blocker Type (AI), Product, Customer, Priority, Status, Age Risk, Last Analysed.

**Features:**
- **URL sort headers** — `<Link href={buTicketsSortHref(searchParams, field)}>` per column; active column shows ↑/↓; no click handlers
- **Pagination footer** — prev/next + page number buttons (ellipsis style via `buildPageRange`) + page size selector (25/50/100); all `<Link>` elements
- **Column visibility dropdown** — all columns visible by default; `id` always-visible (toggle disabled); click-outside close via `useRef`/`useEffect`; "Reset to defaults" button
- **CSV export** — async `exportToCsv()`: fetches `GET /api/bu-tickets/export?${searchParams.toString()}` (ALL filtered rows, not current page); BOM-prefixed for Excel; escapes cells; respects `visibleCols`; "Export CSV" button shows spinner + "Exporting…" while in flight
- **Age risk badge** — `at_risk` (red) / `watch` (amber) / `ok` (green) computed from `kayakoCreatedAt`
- **Delete selected** — admin only; checkbox selection + `DELETE /api/bu-tickets` then `router.refresh()`
- Uses `useSearchParams()` to build current-aware sort/page hrefs

---

## `TicketProductAnalytics`

`components/TicketProductAnalytics.tsx` — client component. Used on both the BU/PS Tickets and All Tickets pages.

**Props:**
```typescript
{
  products:   ProductAnalyticsRow[]   // [{ product, count }] — open tickets per product
  storageKey: string                  // e.g. 'analytics-open-bu-tickets' or 'analytics-open-all-tickets'
}
```

**Renders:**
- Collapsible section (chevron toggle). Collapsed state persisted in `localStorage` using `storageKey`.
- Header: "Open by Product" + product count + total open count + "excl. Closed & Completed" badge.
- Pill bar: one pill per product showing count. Clicking a pill sets `product=X&openOnly=true` in the URL via `router.push` (with NProgress). If the same product is already the only active filter, clicking again clears it.
- "Clear product filter" link shown when any product filter is active.

**Counts**: computed server-side — only tickets with status not in Closed/Completed are counted. Passed as prop from the Server Component page.

---

## `AllTicketsToolbar`

`components/AllTicketsToolbar.tsx` — client component. Mirror of `BUTicketsToolbar` for the All Tickets page.

**Props:**
```typescript
{
  lastSyncedAt: string | null
  isAdmin:      boolean
  totalCount:   number
}
```

**Features:**
- **Sync Now** — `POST /api/all-tickets/sync`; shows elapsed timer; fires `sync-posts` background job after sync
- **Delete All** — admin only; `DELETE /api/bu-tickets`; requires confirmation dialog
- Calls `router.refresh()` after each mutation

---

## `AllTicketsFilters`

`components/AllTicketsFilters.tsx` — client component. Mirror of `BUTicketsFilters` for the All Tickets page.

Same behaviour as `BUTicketsFilters` but uses:
- `lib/all-tickets-list-filters.ts` exports (`serializeAllTicketsParams`, `allTicketsFilterSignature`, `AllTicketsListFilters`, etc.)
- `app/actions/all-ticket-filter-presets.actions.ts` for preset CRUD

Filter panel includes the same "Options" box with "Escalated only" + "Open only" checkboxes.

---

## `AllTicketsTable`

`components/AllTicketsTable.tsx` — client component. Mirror of `BUTicketsTable` for the All Tickets page.

Same behaviour as `BUTicketsTable` but CSV export calls `GET /api/all-tickets/export`. Uses All Tickets sort/page href helpers from `lib/all-tickets-list-filters.ts`.

---

## `BatchSyncStatus`

`components/BatchSyncStatus.tsx` — client component. Used on the admin page.

**Props:**
```typescript
{
  label:        string         // e.g. "All Tickets — Sync Posts"
  endpoint:     string         // POST endpoint to trigger the job
  pendingCount: number         // tickets awaiting processing
  recentRuns:   RecentRun[]    // from batch_runs table
}
```

**Renders:**
- Header with label, pending count (amber if > 0, emerald "All up to date" if 0), and "Run now" button.
- Inline result message after a run completes (processed / failed / skipped counts).
- Recent runs list: coloured dot (emerald=done, red=error, blue=running), time, counts, duration, error message if any.

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
- **Support Tickets** section (collapsible):
  - BU/PS Tickets (/bu-tickets)
- **Admin** section (shown only when `process.env.NEXT_PUBLIC_ADMIN_EMAILS` includes the current user's email):
  - Administration (/admin)

Active route is highlighted. User email is shown in the footer. Sign-out button calls `supabase.auth.signOut()`.

---

## `HubPage`

`components/HubPage.tsx` — client component. Rendered on `app/(dashboard)/page.tsx`.

Tile grid linking to the main tools. For admin users (email in `NEXT_PUBLIC_ADMIN_EMAILS`), also shows an "Administration" tile section. Tiles: Ticket Analyser, BU/PS Tickets, and (admin) Administration.

---

## `AdminPresetsTable`

`components/AdminPresetsTable.tsx` — client component. Rendered on `app/(dashboard)/admin/page.tsx`.

**Props:**
```typescript
{ presets: FilterPresetRow[] }
```

Displays all filter presets in the system, grouped by user (email). Each row shows: preset name, **Page** column (BU/PS or All Tickets, derived from `module` field), visibility badge (PERSONAL/SHARED), default star, `filtersJson` (canonical QS). Admin can delete any preset via `adminDeleteFilterPreset` Server Action from `app/actions/admin.actions.ts`.

The admin page server component checks `ADMIN_EMAILS` env var and redirects non-admins to `/`.

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

`components/AnalysisHistory.tsx` — client component. Rendered on **both** the Ticket Analyser and BU/PS ticket detail page below the tabs section when at least one run exists.

**Props:**
```typescript
{ runs: AnalysisRunRow[] }
```

`AnalysisRunRow` is defined in `types/kayako.ts` (re-exported from `AnalysisHistory` for backward compatibility):
```typescript
{
  id, trigger, runType, modelUsed, postCount,
  inputTokens, outputTokens, durationMs,
  status, errorMsg, createdAt,
  inputCostUsd, outputCostUsd, totalCostUsd,
  isOrphaned?
}
```

**Renders:**
- Header: "📋 API Usage History (N)" + total cost (was "Analysis Run History" — renamed to cover both analysis and download runs)
- Collapsed by default — click to expand
- When expanded: **12-column table** — Type, When, Trigger, Status, Model, Posts, In tokens, Out tokens, In cost, Out cost, Total cost, Duration
- **Type column** (first): badge showing run type — "Analysis" (blue) or "Download" (emerald)
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
