# Quickstart: Supabase Integration & Admin Panel

**Branch**: `feature/supabase-admin-panel` | **Date**: 2026-06-24

Setup guide for a new developer environment. Follow in order.

---

## Prerequisites

- Bun installed (`bun --version`)
- Access to the Supabase project dashboard
- `.env.local` file at the repo root (see `.env.example`)

---

## Step 1 — Install new packages

```bash
bun add @supabase/ssr @supabase/supabase-js
```

---

## Step 2 — Configure environment variables

Ensure `.env.local` has all three values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

Get these from: **Supabase Dashboard → Settings → API**.

> `SUPABASE_SERVICE_ROLE_KEY` is validated at startup by `src/lib/env.ts` but not used in application code. It is reserved for potential Supabase CLI use in local development.

---

## Step 3 — Run the database migration

1. Open **Supabase Dashboard → SQL Editor**
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste into the SQL editor and click **Run**

Alternatively, if Supabase CLI is installed:

```bash
supabase db push
```

Verify the 4 tables were created under **Table Editor**.

---

## Step 4 — Configure Supabase Auth session duration

1. In Supabase Dashboard → **Authentication → Settings**
2. Set **JWT expiry** to `604800` (7 days in seconds)
3. Save

---

## Step 5 — Create the first admin user

1. In Supabase Dashboard → **Authentication → Users**
2. Click **Invite user** (or **Add user**)
3. Enter the team member's email and a temporary password
4. The user logs in at `/admin/login` and can change their password via Supabase Auth

> No self-registration flow exists in the app. All admin accounts are provisioned here.

---

## Step 6 — Run the development server

```bash
bun run dev
```

Test the public forms at:

- `http://localhost:3000/cursinho`
- `http://localhost:3000/voluntario`
- `http://localhost:3000/contato`

Test the admin panel at:

- `http://localhost:3000/admin/login`

---

## Step 7 — Vercel environment variables (production)

Add the same three env vars to the Vercel project:

- **Vercel Dashboard → Project → Settings → Environment Variables**

> Never commit `.env.local` with real values. It is gitignored.

---

## Supabase Dashboard reference

| Task               | Location                          |
| ------------------ | --------------------------------- |
| View table data    | Table Editor → select table       |
| Run SQL            | SQL Editor                        |
| Manage auth users  | Authentication → Users            |
| Check RLS policies | Table Editor → select table → RLS |
| JWT settings       | Authentication → Settings         |
| API keys           | Settings → API                    |
