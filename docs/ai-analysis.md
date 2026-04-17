# AI Analysis

## Overview

AI analysis is powered by Anthropic Claude. When a user clicks "Run Analysis", the app sends the full ticket conversation to Claude and receives a structured analysis with seven sections. Results are cached in PostgreSQL so subsequent opens of the same ticket don't re-run Claude.

The implementation is a direct TypeScript port of `analyse_ticket_with_ai()` in `kayako_tool.py`. The prompt, section headings, and model selection logic are identical.

---

## Model Selection

`detectModel(caseData, posts)` in `lib/anthropic/client.ts` computes a complexity score:

| Condition | Score |
|---|---|
| > 15 posts | +2 |
| > 30 posts | +2 |
| Subject or any post contains a complexity keyword | +1 |
| Ticket created > 7 days ago | +2 |

**Score ≥ 3** → `claude-sonnet-4-6`  
**Score < 3** → `claude-haiku-4-5-20251001`

Complexity keywords: `urgent`, `escalat`, `legal`, `refund`, `cancel`, `chargeback`, `frustrated`, `angry`, `unacceptable`, `lawsuit`, `terrible`, `outage`, `critical`, `broken`, `down`, `lost data`

The model used is stored in `ticket_analyses.modelUsed` and displayed as a pill in the UI.

---

## Output Sections

Claude returns exactly seven sections:

| Section | Description |
|---|---|
| **Executive Summary** | 3–4 sentence paragraph — the situation at a glance for a manager |
| **One-Line Summary** | Single sentence, max 20 words |
| **Case Summary** | 3–5 sentences: what was reported, what was tried, current state |
| **Customer Sentiment** | One sentence on emotional state + 1–2 sentences on cause |
| **What's Needed to Close** | Bullet list of specific conditions to resolve the ticket |
| **Recommended Next Steps** | Numbered action plan, ordered by priority |
| **Day-by-Day Summary** | One sentence per date: `YYYY-MM-DD: [summary]` |

---

## Conversation Block Format

Each post is formatted as:
```
[YYYY-MM-DD HH:MM] [INTERNAL — not visible to customer] Agent Name:
<post text, truncated to 1500 chars>

---

[YYYY-MM-DD HH:MM] [Customer-visible] Customer Name:
<post text>
```

Internal notes are labelled `[INTERNAL — not visible to customer]`. The distinction is important so Claude knows what the customer has and hasn't seen.

Post text is truncated at 1500 characters per post to control token usage on large tickets.

---

## Caching

Results are stored in `ticket_analyses` with a unique key of `(userId, ticketId, kayakoUrl)`.

- **Cache hit** (no `forceRefresh`): the stored JSON is returned immediately with `fromCache: true` and the original `createdAt` timestamp
- **Cache miss or `forceRefresh=true`**: Claude is called, result is written via `upsert`
- **Invalidation**: the TicketAnalyser client sets `forceRefresh=true` when the user clicks "Re-run". Also invalidated (cleared from UI state, not DB) when a new note is posted and the ticket is reloaded

The cache is per-user, so one user's analysis never returns as another user's result.

---

## API Route (`POST /api/analysis`)

Request body:
```json
{
  "caseId": 12345,
  "caseData": { ...KayakoCase },
  "posts":    [ ...KayakoPost[] ],
  "forceRefresh": false
}
```

Response (success):
```json
{
  "sections": {
    "executive_summary": "...",
    "one_line": "...",
    "case_summary": "...",
    "customer_sentiment": "...",
    "what_needed": "...",
    "next_steps": "..."
  },
  "day_summaries": { "2024-01-15": "Customer reported...", ... },
  "model_used": "claude-haiku-4-5-20251001",
  "post_count": 23,
  "fromCache": false,
  "created_at": "2024-01-16T10:30:00.000Z"  // only if fromCache: true
}
```

The `caseData` and `posts` are passed in the request body (already fetched by the ticket route) rather than re-fetching from Kayako, which saves an extra authentication round-trip.

---

## Anthropic SDK

Uses `@anthropic-ai/sdk`. The API key is stored encrypted in `user_settings.anthropicKeyEnc` and decrypted per-request inside the route handler. It is never logged or returned to the browser.

```typescript
const client = new Anthropic({ apiKey })
const response = await client.messages.create({
  model,
  max_tokens: 2000,
  system: systemPrompt,
  messages: [{ role: 'user', content: userPrompt }],
})
```
