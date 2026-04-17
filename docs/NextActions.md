# Next Actions

_Last updated: 2026-04-16_

---

## What's working

- Google SSO login ✓
- Settings page (save Kayako + Anthropic credentials) ✓
- Ticket fetch (case metadata + all posts + author names) ✓
- Custom fields resolved with human-readable labels (incl. Product) ✓
- AI analysis (Haiku / Sonnet, cached in PostgreSQL) ✓
- Conversation thread, Timeline, Add Note tabs ✓

---

## What I (Claude) can do next

- [ ] **Mobile responsiveness** — add `sm:` Tailwind breakpoints to the AI analysis grid and ticket metadata table. Currently desktop-only layout.
- [ ] **Skeleton loading states** — replace plain "Loading…" / "Analysing N posts…" text with animated skeleton placeholders during ticket fetch and AI analysis.
- [ ] **Anthropic retry on 500** — wrap `analyseTicket()` in a simple retry (1 retry after 2s) so transient Anthropic server errors auto-resolve without the user having to click again.

---

## What I need from Sahil

### 1. Run RLS policies in Supabase (2 min)
**Where**: Supabase dashboard → SQL Editor → paste and run:

```sql
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own settings"
  ON user_settings FOR ALL
  USING (auth.uid() = "userId"::uuid)
  WITH CHECK (auth.uid() = "userId"::uuid);

ALTER TABLE ticket_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own analyses"
  ON ticket_analyses FOR ALL
  USING (auth.uid() = "userId"::uuid)
  WITH CHECK (auth.uid() = "userId"::uuid);
```

**Why**: Without RLS, any authenticated user could theoretically query any other user's saved credentials or analyses (though the app itself prevents this). Required before sharing with other team members.

---

### 2. Deploy to Vercel (when ready)
**Steps**:
1. Push repo to GitHub
2. Import project in Vercel dashboard
3. Add all env vars from `.env.local` to Vercel (Settings → Environment Variables)
4. Add `DATABASE_URL` and `DIRECT_URL` from `.env` as well
5. Set `NEXT_PUBLIC_APP_URL=https://your-app.vercel.app`
6. Add `https://your-app.vercel.app/auth/callback` to Supabase Auth → URL Configuration → Redirect URLs
7. Add `https://your-app.vercel.app` to Google Cloud OAuth → Authorized JavaScript Origins
