# Setup Guide

## Prerequisites

- Node.js 18+ (required for `AbortSignal.timeout()`)
- A Supabase project (free tier works)
- Google Cloud OAuth credentials
- An Anthropic API key
- A Kayako API password for each user (separate from the web login password)

---

## 1. Install Dependencies

```bash
cd "Central Kayako Tickets (Vercel)"
npm install
npx prisma generate
```

---

## 2. Create `.env.local`

Copy `.env.example` to `.env.local` and fill in every value:

```env
# Supabase project URL and anon key — from Supabase dashboard → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Prisma database connections
# Transaction-mode pooler (port 6543) — Vercel serverless runtime
DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true
# Direct connection (port 5432) — Prisma migrations only
DIRECT_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres

# 64-character hex string (32 bytes) used to encrypt credentials at rest
# Generate with: openssl rand -hex 32
ENCRYPTION_SECRET=<your-64-char-hex-string>

# For local dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Both `DATABASE_URL` and `DIRECT_URL` come from Supabase dashboard → Project Settings → Database → Connection string. Switch the mode selector between "Transaction" (port 6543) and "Session/Direct" (port 5432).

---

## 3. Push the Database Schema

Once `DIRECT_URL` is set:

```bash
npm run db:push
```

This creates the `user_settings` and `ticket_analyses` tables in Supabase. You only need to do this once (or after schema changes).

To view and edit data visually:
```bash
npm run db:studio
```

---

## 4. Set Up Row-Level Security (RLS)

In the Supabase SQL editor, run these policies so users can only read/write their own rows:

```sql
-- user_settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own settings"
  ON user_settings FOR ALL
  USING (auth.uid() = "userId"::uuid)
  WITH CHECK (auth.uid() = "userId"::uuid);

-- ticket_analyses
ALTER TABLE ticket_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own analyses"
  ON ticket_analyses FOR ALL
  USING (auth.uid() = "userId"::uuid)
  WITH CHECK (auth.uid() = "userId"::uuid);
```

Note: The application also enforces `userId = auth.user.id` in every API route, so RLS is a defence-in-depth layer.

---

## 5. Enable Google OAuth in Supabase

1. Go to Supabase dashboard → Authentication → Providers → Google
2. Enable the Google provider
3. Enter your Google OAuth Client ID and Client Secret
4. Copy the **Callback URL** shown (looks like `https://<ref>.supabase.co/auth/v1/callback`)

---

## 6. Configure Google Cloud OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create or edit an OAuth 2.0 Client ID
3. Add to **Authorised redirect URIs**:
   - `https://<ref>.supabase.co/auth/v1/callback` (from Supabase step above)
   - `http://localhost:3000/auth/callback` (for local dev)
4. Paste the Client ID and Secret back into Supabase

---

## 7. Run Locally

```bash
npm run dev
```

Open http://localhost:3000. You will be redirected to `/login`. Sign in with a Google account. On first login you will be redirected to `/settings` to enter your Kayako and Anthropic credentials.

---

## 8. Deploy to Vercel

```bash
# Install Vercel CLI if needed
npm i -g vercel

# From the project directory
vercel
```

Set all `.env.local` variables as Environment Variables in the Vercel project settings (Settings → Environment Variables). Also add:

```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

And add `https://your-app.vercel.app/auth/callback` to the Google OAuth allowed redirect URIs.

---

## npm Scripts Reference

| Script | What it does |
|---|---|
| `npm run dev` | Start local dev server at http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Serve production build locally |
| `npm run lint` | ESLint |
| `npm run db:generate` | Regenerate Prisma client (run after schema changes) |
| `npm run db:push` | Push schema to database (dev — no migration files) |
| `npm run db:migrate` | Apply pending migrations (production) |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## Troubleshooting

**Login loops or 401 errors**
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct.
- Check the Google OAuth callback URL matches exactly (no trailing slash).

**`ENCRYPTION_SECRET must be a 64-character hex string`**
- Run `openssl rand -hex 32` and paste the output as `ENCRYPTION_SECRET`.

**Prisma: `Can't reach database server`**
- Check `DATABASE_URL` uses port 6543 (transaction pooler) and has `?pgbouncer=true`.
- Check `DIRECT_URL` uses port 5432.

**`Kayako authentication failed: HTTP 401`**
- The Kayako password stored in Settings is the API password, not the web login password. In Kayako: My Profile → Change Password → API Password.

**Posts timeout or partial results**
- The Kayako posts endpoint has a 15-second timeout per page. For very large tickets the banner "Posts fetch stopped after N posts" will appear — this is expected behaviour inherited from the Streamlit tool.
