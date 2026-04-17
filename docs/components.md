# UI Components

All components are in `components/`. Server components live in `app/`. The main interactive surface is all client-side within `TicketAnalyser`.

---

## Component Tree

```
app/(dashboard)/layout.tsx     [server — auth guard]
  NavBar                       [client — sign out]
  app/(dashboard)/page.tsx     [server — redirect if no credentials]
    TicketAnalyser             [client — main state machine]
      TicketCard               [client — ticket metadata]
      ConversationThread       [client — post list]
      ─── tab: AI Analysis ───
      AIAnalysis               [client — analysis display]
      ─── tab: Timeline ───
      Timeline                 [client — date-grouped posts]
      ─── tab: Add Note ───
      AddNoteForm              [client — note textarea]

app/(dashboard)/settings/page.tsx  [server]
  SettingsForm                     [client — credential form]
```

---

## `TicketAnalyser`

`components/TicketAnalyser.tsx` — the top-level client component. Owns all state and orchestrates all API calls.

**State:**
- `input` — the URL/ID text field value
- `fetching` — loading spinner for ticket fetch
- `fetchError` — error from `/api/ticket`
- `ticketData` — the full `TicketData` response (caseData + posts + warning + caseId)
- `analysis` — the `AnalysisResult` response from `/api/analysis`
- `aiLoading` — loading state while analysis runs
- `aiError` — error from `/api/analysis`
- `activeTab` — `'ai' | 'timeline' | 'note'`

**Key behaviours:**
- Pressing Enter in the input field triggers `fetchTicket()`
- After a note is posted (`onNotePosted`): clears `analysis` (invalidates cache display) then reloads the ticket
- The AI tab shows a "Run Analysis" button until analysis has been run; after that shows the result with a "Re-run" button

---

## `NavBar`

`components/NavBar.tsx` — client component.

Shows: app title, user email, "Sign out" button, link to Settings.

Sign out calls `supabase.auth.signOut()` (browser client) then `router.push('/login')`.

**Props:** `userEmail: string`

---

## `SettingsForm`

`components/SettingsForm.tsx` — client component.

Four fields: Kayako URL, Kayako Email, Kayako Password (password input), Anthropic API Key (password input). Password and API key fields show `••••••••` placeholder when a value is already saved (the server never returns the actual values).

Submits to `POST /api/settings`. On success redirects to `/` (first login) or shows a "Saved" confirmation (subsequent saves).

**Props:** `initialKayakoUrl`, `initialKayakoEmail`, `isFirstLogin`

---

## `TicketCard`

`components/TicketCard.tsx` — client component.

Displays ticket metadata in a card:
- Subject (clickable link to Kayako agent UI: `https://central-supportdesk.kayako.com/agent/conversations/{caseId}`)
- Case ID
- Status badge (colour-coded: green=Completed/Closed, yellow=Pending, blue=Open, grey=New/other)
- Status note inline with message count (e.g. "Open for 3.2 days", "Pending customer response", "Case closed")
- Priority
- Requester name + email
- Assigned agent
- Assigned team
- Created date
- Message count (post count passed as prop)
- Tags (as violet pills, top-right)
- **Product badge** (indigo pill, top-right) — resolved from `custom_fields` by label `"Product"`
- **Other Fields section** (bottom of card, grid layout) — all non-system custom fields from `caseData.custom_fields` with their resolved labels and values

**Props:** `caseData: KayakoCase`, `caseId: number`, `postCount: number`

Status badge colours:
| Status keyword | Tailwind classes |
|---|---|
| closed / completed | `bg-slate-100 text-slate-600` |
| pending | `bg-yellow-100 text-yellow-800` |
| open | `bg-blue-100 text-blue-800` |
| new / other | `bg-green-100 text-green-800` |

Status note logic (`statusNote()`):
- `open` or `hold` → "Open for N days" (amber, calculates from `created_at`)
- `pend` → "Pending customer response" (blue)
- `clos` or `complet` → "Case closed" (green)

Product field: `(caseData.custom_fields ?? []).find(f => f.label === 'Product')?.value` — shown as an indigo badge alongside the status badge. The "Product" field is a SELECT custom field (Kayako field ID 16); its label is resolved server-side by `getCase()`.

Other Fields: all entries in `caseData.custom_fields` are rendered in a 2–3 column grid below the main metadata. System fields and fields with empty values are already filtered out by `getCase()` — everything in this array is safe to display.

---

## `ConversationThread`

`components/ConversationThread.tsx` — client component.

Renders all posts as a collapsible list (default: first 5 shown, "Show all N" button to expand).

Post bubbles are colour-coded:
- Red background — customer post (requester)
- Blue background — agent reply
- Yellow background — internal note (channel type = NOTE)

Each bubble shows: author name + email, timestamp, channel badge, and post content.

**Props:** `posts: KayakoPost[]`, `requesterId: number | null`

---

## `AIAnalysis`

`components/AIAnalysis.tsx` — client component.

Displays the analysis result returned by `/api/analysis`:
- Model pill (Haiku = green, Sonnet = purple)
- "From cache / Re-run" context line
- Executive Summary + One-Line Summary (full width, prominent)
- 2-column grid: Case Summary, Customer Sentiment, What's Needed to Close, Recommended Next Steps
- "Re-run Analysis" button (calls `onRerun`)

**Props:** `analysis: AnalysisResult`, `loading: boolean`, `onRerun: () => void`

---

## `Timeline`

`components/Timeline.tsx` — client component.

Groups posts by calendar date (UTC). Each day section shows:
- Date heading + post count
- AI day summary (if available from `daySummaries`)
- Collapsed by default — "Show N messages" / "Hide messages" toggle
- Posts within each day use the same colour scheme as ConversationThread

If `daySummaries` is empty (analysis not run yet), day summaries are simply absent.

**Props:** `posts: KayakoPost[]`, `requesterId: number | null`, `daySummaries: Record<string, string>`

---

## `AddNoteForm`

`components/AddNoteForm.tsx` — client component.

Textarea for composing an internal note. Submits to `POST /api/note`. On success calls `onSuccess()` (which reloads the ticket) and clears the textarea. Shows success/error feedback inline.

**Props:** `caseId: number`, `onSuccess: () => void`

---

## Utility Functions (`lib/utils.ts`)

Helper functions used across multiple components:

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
