# Research: Supabase Integration & Admin Panel

**Branch**: `feature/supabase-admin-panel` | **Date**: 2026-06-24

---

## Decision 1 — Supabase Client Library

**Decision**: Use `@supabase/ssr` for all server-side clients (Server Components, Server Actions, Middleware). Use `createBrowserClient` from `@supabase/ssr` for any client-side Supabase access.

**Rationale**: `@supabase/ssr` is the current recommended library for Next.js App Router. It correctly handles cookie-based session management across server and client boundaries. The previously common `@supabase/auth-helpers-nextjs` package is deprecated as of 2024.

**Alternatives considered**:

- `@supabase/auth-helpers-nextjs` — deprecated, would cause session handling issues in Next.js 15
- Raw `@supabase/supabase-js` on the server — does not handle cookie-based sessions automatically; requires manual cookie plumbing

---

## Decision 2 — Auth Strategy

**Decision**: Supabase Auth with email + password. Sessions managed via HTTP-only cookies set by `@supabase/ssr`. Middleware refreshes tokens on every request to prevent silent session expiry.

**Rationale**: Cookie-based sessions work correctly with Next.js Server Components (no `localStorage` dependency). The middleware refresh pattern is the officially documented approach for Next.js + Supabase Auth and prevents the "session expired mid-use" edge case.

**Session duration**: 7 days with rolling renewal — configured in Supabase Dashboard under **Authentication → JWT Settings → JWT expiry** (set to `604800` seconds). No code change required for this configuration.

**Alternatives considered**:

- JWT stored in localStorage — incompatible with Server Components; exposes token to XSS
- NextAuth.js — additional dependency; Supabase Auth is sufficient and avoids dual-auth complexity

---

## Decision 3 — Admin Routing Structure

**Decision**: Route group `(panel)` under `app/admin/` for all authenticated admin pages. `app/admin/login/` sits outside the group as a public route. The `(panel)/layout.tsx` renders the `AdminSidebar` and main content area.

**Rationale**: Route groups in Next.js App Router allow a shared layout (sidebar) for all panel pages without affecting URL structure. Login gets no sidebar; panel pages get the sidebar. The middleware handles auth enforcement — the layout does not re-check auth.

**URL mapping**:

- `/admin/login` → `app/admin/login/page.tsx` (public)
- `/admin` → `app/admin/(panel)/page.tsx` (protected)
- `/admin/cursinho` → `app/admin/(panel)/cursinho/page.tsx` (protected)
- etc.

**Alternatives considered**:

- Single `app/admin/layout.tsx` with conditional sidebar — requires `usePathname` (forces "use client"), breaks Server Component layout
- Sidebar as component imported per page — repetitive; route group is cleaner

---

## Decision 4 — Server Actions vs API Routes

**Decision**: Replace all stub API routes (`/api/cursinho`, `/api/voluntario`, `/api/contato`) with Server Actions in `src/lib/actions/`. Each Server Action: checks honeypot → validates Zod schema → calls `lib/db/` → returns typed result.

**Rationale**: Server Actions eliminate the HTTP round-trip for form submissions, have built-in CSRF protection, and work natively with React 19's form actions. The constitution explicitly permits this pattern ("Server Actions: Podem substituir API routes para mutações quando houver ganho claro de DX").

**Pattern for each action**:

```ts
"use server";
export async function submitCursinho(formData: FormData) {
  if (formData.get("website")) return { success: true }; // honeypot — silent discard
  const raw = Object.fromEntries(formData);
  const result = cursinhoSchema.omit({ consent: true }).safeParse(raw);
  if (!result.success) return { success: false, errors: result.error.flatten() };
  return await insertCursinho(result.data);
}
```

**Alternatives considered**:

- Keep API routes and call from client — functional but defeats Server Actions benefit; constitution prefers clean patterns
- tRPC — unnecessary complexity for this scale

---

## Decision 5 — Honeypot Implementation

**Decision**: A plain `<input>` element (not registered with React Hook Form) with `style={{ display: "none" }}` and `name="website"`. Read via `formData.get("website")` at the start of each Server Action.

**Rationale**: CSS-hidden inputs (not `type="hidden"`) fool most bots that fill visible fields. Using `style` attribute rather than a CSS class avoids accidental reversal by Tailwind purge. Not registering with RHF ensures it is not submitted programmatically by JS form handlers.

**Why "website" as field name**: Common bot-attracting name; generic enough not to confuse users who might inspect the DOM.

---

## Decision 6 — LGPD Consent Checkbox

**Decision**: Add `consent: z.literal(true, { errorMap: () => ({ message: "Você precisa aceitar para continuar." }) })` to each public form schema. Consent is validated server-side in the Server Action but **not stored** in the database — it is a submission gate, not a data attribute.

**Rationale**: The checkbox confirms the user's intent at the time of submission. Storing `consent: true` in the DB would add a column of no analytical value (it would always be `true` since we block on false). The timestamp of the record itself serves as implicit evidence of consent given the context.

---

## Decision 7 — CSV Export

**Decision**: Client-side generation using the native `Blob` API and a hidden anchor click. No library.

**Rationale**: The constitution prohibits libraries without explicit justification. Native CSV generation for flat tabular data is trivial (join fields with commas, wrap strings in quotes, escape internal quotes). The admin panel will never export millions of rows (NGO scale), so browser memory is not a concern.

**Pattern**:

```ts
function exportCsv(rows: Record<string, unknown>[], filename: string) {
  const headers = Object.keys(rows[0])
  const lines = [headers, ...rows.map(r => headers.map(h => `"${String(r[h] ?? "").replace(/"/g, '""')}"`))
  const blob = new Blob([lines.map(l => l.join(",")).join("\n")], { type: "text/csv" })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}
```

---

## Decision 8 — Row Level Security Strategy

**Decision**: Enable RLS on all 4 tables. Two policies per table:

1. `anon` role: INSERT only (public form submissions via anon key)
2. `authenticated` role: ALL operations (admin panel via Supabase Auth session)

The `SUPABASE_SERVICE_ROLE_KEY` is validated in `env.ts` but **not used in any application code**. Admin panel queries use the authenticated user's session JWT (via `createServerClient` with cookies) — this is sufficient with the `authenticated` ALL policy.

**Rationale**: RLS provides defense-in-depth. Using the authenticated session (not the service role key) means the admin panel is subject to the same access control as any other authenticated user — safer than bypassing RLS entirely. The service role key is kept in `env.ts` for potential Supabase CLI use in local development.

---

## Decision 9 — Database Migrations

**Decision**: SQL migration file at `supabase/migrations/001_initial_schema.sql`. Run manually via Supabase Dashboard SQL editor (or `supabase db push` if CLI is installed).

**Rationale**: Version-controlled SQL is the safest approach for a small team. The Supabase Dashboard SQL editor is accessible without installing the CLI, lowering the barrier for team members.

---

## Decision 10 — Unread Message Badge

**Decision**: The `(panel)/layout.tsx` Server Component fetches the unread count from `lib/db/contato.ts` on each render and passes it as a prop to `AdminSidebar`. The dashboard page fetches the same count independently for the card badge.

**Rationale**: Layout Server Components can fetch data directly. Fetching in the layout ensures the badge is always up-to-date on navigation without client-side state management. Minor double-fetch on the dashboard page is acceptable at NGO scale.
