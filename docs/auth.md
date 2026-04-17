# Authentication

## Overview

Authentication is handled entirely by Supabase Auth with Google OAuth. There is no username/password login — users sign in with their Google account. The app is restricted to whoever has a Google account that Supabase allows.

---

## Sign-In Flow

```
User visits /login
  → Clicks "Sign in with Google"
  → POST /auth/v1/authorize (Supabase → Google OAuth)
  → Google consent screen
  → Redirect to /auth/callback?code=...
  → app/(auth)/auth/callback/route.ts
      → supabase.auth.exchangeCodeForSession(code)
      → Session cookie set
  → Redirect to /
  → DashboardLayout reads user from cookie
  → If no kayakoUrl in UserSettings → redirect to /settings
  → Otherwise → show TicketAnalyser
```

---

## Key Files

### `app/(auth)/login/page.tsx`
Server component. Renders the sign-in page with a "Sign in with Google" button. The button calls the Supabase client's `signInWithOAuth` method with `provider: 'google'` and `redirectTo: /auth/callback`.

### `app/(auth)/auth/callback/route.ts`
GET route handler. Receives the `code` query param from Google's redirect, calls `supabase.auth.exchangeCodeForSession(code)` to turn it into a real session, then redirects to `/`. On failure redirects to `/login?error=oauth_error`.

### `lib/supabase/server.ts`
Creates a Supabase client for use in Server Components and API Route Handlers. Uses `@supabase/ssr`'s `createServerClient` which reads and writes session cookies via the Next.js `cookies()` API.

### `lib/supabase/client.ts`
Creates a Supabase client for use in Client Components (browser). Uses `createBrowserClient` which handles its own cookie management.

### `middleware.ts`
Runs on every request (except static assets). Two responsibilities:
1. **Session refresh** — calls `supabase.auth.getUser()` to keep the session alive (required by `@supabase/ssr`).
2. **Route protection** — redirects unauthenticated users from any non-auth route to `/login`. Redirects authenticated users away from `/login` to `/`.

---

## Session Management

Sessions are stored in HTTP-only cookies managed by `@supabase/ssr`. The middleware refreshes them on every request so they don't expire mid-session. The cookie name is managed by Supabase and should not be customised.

---

## `auth.users` and `user_settings`

Supabase Auth creates a record in `auth.users` for each signed-in user. The `userId` column in `user_settings` and `ticket_analyses` stores the `auth.users.id` UUID. This is obtained in API routes via:

```typescript
const { data: { user } } = await supabase.auth.getUser()
// user.id is the UUID used as the foreign key
```

The app does **not** create triggers or functions in Supabase — `UserSettings` rows are created lazily via Prisma `upsert` when the user saves their settings for the first time.

---

## Sign Out

The `NavBar` component has a "Sign out" button that calls `supabase.auth.signOut()` from the browser client, then redirects to `/login`. Sign-out clears the session cookie client-side.
