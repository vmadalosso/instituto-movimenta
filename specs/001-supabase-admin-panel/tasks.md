# Tasks: Supabase Integration & Admin Panel

**Input**: Design documents from `specs/001-supabase-admin-panel/`

**Branch**: `feature/supabase-admin-panel` | **Generated**: 2026-06-24

**User Stories**:

- US1 — Public Form Persistence (P1) 🎯 MVP
- US2 — Admin Authentication (P1)
- US3 — Admin Dashboard Overview (P2)
- US4 — Registration Management & Export (P2)

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel with other [P] tasks in the same group (different files, no shared dependencies)
- **[Story]**: Which user story this task belongs to

---

## Phase 1: Setup

**Purpose**: Install dependencies and create database migration file.

- [x] T001 Install packages: `bun add @supabase/ssr @supabase/supabase-js`
- [x] T002 Create `supabase/migrations/001_initial_schema.sql` with the SQL from `specs/001-supabase-admin-panel/data-model.md` (4 CREATE TABLE statements + UNIQUE indexes + RLS policies)
- [x] T003 Run migration in Supabase Dashboard → SQL Editor; verify 4 tables appear in Table Editor (`cursinho_inscricoes`, `voluntarios`, `mensagens_contato`, `newsletter_emails`)

**Checkpoint**: `bun run dev` starts without errors; Supabase project has 4 tables.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required by ALL user stories. No story work can begin until this phase is complete.

**⚠️ CRITICAL**: All stories depend on env.ts and supabase.ts being in place.

- [x] T004 Create `src/lib/env.ts`: Zod object validating `NEXT_PUBLIC_SUPABASE_URL` (z.string().url()), `NEXT_PUBLIC_SUPABASE_ANON_KEY` (z.string().min(1)), `SUPABASE_SERVICE_ROLE_KEY` (z.string().min(1)); export parsed `env` object; throw on missing values at startup
- [x] T005 Create `src/lib/supabase.ts`: export `createServerSupabaseClient()` using `createServerClient` from `@supabase/ssr` with cookie helpers; export `createBrowserSupabaseClient()` using `createBrowserClient` from `@supabase/ssr`; import env from `@/lib/env`

**Checkpoint**: `bunx tsc --noEmit` passes with no errors on the two new files.

---

## Phase 3: User Story 1 — Public Form Persistence (Priority: P1) 🎯 MVP

**Goal**: All 4 public forms save data to Supabase. Duplicate emails show friendly error. Bots are silently discarded. Consent is required.

**Independent Test**: Submit each form with valid data + consent checked → success screen. Submit again with same email → duplicate error message. Fill the hidden `website` field and submit → success screen appears but no record is saved in Supabase.

### Schema changes

- [x] T006 Update `src/lib/form-schemas.ts`: (1) rename `whatsapp` → `phone` in `cursinhoSchema`; (2) add `consent: z.literal(true, { errorMap: () => ({ message: "Você precisa aceitar para continuar." }) })` to `cursinhoSchema`, `voluntarioSchema`, and `contatoSchema`; (3) update exported type names accordingly

### Database layer (all files independent — run in parallel)

- [x] T007 [P] [US1] Create `src/lib/db/cursinho.ts`: implement `insertCursinho`, `listCursinho(opts)`, `countCursinho`, `deleteCursinho(id)` — use `createServerSupabaseClient()`; map Postgres error code `23505` to `{ success: false, duplicate: true }`
- [x] T008 [P] [US1] Create `src/lib/db/voluntarios.ts`: implement `insertVoluntario`, `listVoluntarios(opts)`, `countVoluntarios`, `deleteVoluntario(id)` — same duplicate-error pattern
- [x] T009 [P] [US1] Create `src/lib/db/contato.ts`: implement `insertContato`, `listContato(opts)`, `countContato`, `countUnreadContato`, `toggleLidaContato(id, lida)`, `deleteContato(id)` — no duplicate constraint on email
- [x] T010 [P] [US1] Create `src/lib/db/newsletter.ts`: implement `insertNewsletter`, `listNewsletter(opts)`, `countNewsletter`, `deleteNewsletter(id)` — map error `23505` to `{ success: false, duplicate: true }`

### Server Actions (each depends on its db file; files are independent of each other)

- [x] T011 [P] [US1] Create `src/lib/actions/cursinho.ts` (`"use server"`): read `website` honeypot from FormData → return `{ success: true }` if filled (silent discard); parse remaining fields; validate with `cursinhoSchema.omit({ consent: true })`; call `insertCursinho`; on duplicate return friendly message; on success return `{ success: true, message: "..." }`
- [x] T012 [P] [US1] Create `src/lib/actions/voluntarios.ts`: same pattern as T011 using `voluntarioSchema.omit({ consent: true })` and `insertVoluntario`
- [x] T013 [P] [US1] Create `src/lib/actions/contato.ts`: same pattern using `contatoSchema.omit({ consent: true })` and `insertContato` (no duplicate handling)
- [x] T014 [P] [US1] Create `src/lib/actions/newsletter.ts`: honeypot guard; validate `{ email: z.string().email() }` (no consent field in newsletter schema); call `insertNewsletter`; on duplicate return "Este e-mail já está cadastrado na nossa newsletter."

### Form component updates (each file is independent)

- [x] T015 [US1] Update `src/app/cursinho/CursinhoForm.tsx`: (1) change `action` prop to `submitCursinho` Server Action; (2) add `<input name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />` outside RHF control; (3) add consent `<input type="checkbox">` registered with RHF; (4) update `whatsapp` field reference to `phone`; (5) show duplicate/error message from action result
- [x] T016 [P] [US1] Update `src/app/voluntario/VoluntarioForm.tsx`: same honeypot + consent + Server Action pattern binding to `submitVoluntario`
- [x] T017 [P] [US1] Update `src/app/contato/ContatoForm.tsx`: same pattern binding to `submitContato`
- [x] T018 [P] [US1] Update `src/components/SiteFooter.tsx`: bind newsletter email input to `submitNewsletter` Server Action; add hidden `website` honeypot input outside form state; show duplicate/success feedback

### Cleanup: remove replaced API routes

- [x] T019 [P] [US1] Delete `src/app/api/cursinho/route.ts`
- [x] T020 [P] [US1] Delete `src/app/api/voluntario/route.ts`
- [x] T021 [P] [US1] Delete `src/app/api/contato/route.ts`

### Tests

- [x] T022 [P] [US1] Update `src/lib/form-schemas.test.ts`: add test cases for consent field — valid (true passes), invalid (false/undefined fails with correct message); add test for `phone` field in cursinhoSchema
- [x] T023 [P] [US1] Create `src/lib/actions/cursinho.test.ts`: test honeypot guard (filled `website` field → `{ success: true }` with no DB call); test duplicate error mapping

**Checkpoint**: Submit all 4 public forms in browser. Check Supabase Table Editor — rows appear. Submit same email again — duplicate message shows. Fill `website` field via DevTools and submit — no new row in DB.

---

## Phase 4: User Story 2 — Admin Authentication (Priority: P1)

**Goal**: `/admin/**` routes are protected. Login at `/admin/login`. Sessions last 7 days. Logout works.

**Independent Test**: Navigate to `http://localhost:3000/admin` unauthenticated → redirects to `/admin/login`. Enter valid credentials → lands on `/admin`. Enter invalid credentials → error shown. Click logout → back to login, `/admin` redirects again.

- [x] T024 Create `src/middleware.ts`: use `createServerClient` from `@supabase/ssr` with `NextRequest`/`NextResponse` cookie helpers; call `supabase.auth.getUser()`; if no user and path starts with `/admin` and is not `/admin/login`, redirect to `/admin/login`; if user and path is `/admin/login`, redirect to `/admin`; always return response with refreshed cookies (session renewal)
- [x] T025 [P] [US2] Create `src/app/admin/login/page.tsx`: Server Component with `export const metadata`; renders a client form component `AdminLoginForm.tsx` co-located in same folder; `AdminLoginForm` uses `supabase.auth.signInWithPassword({ email, password })` from `createBrowserClient`; on success `router.push('/admin')`; on error show inline error message using shadcn `Input` and `Button`
- [x] T026 [US2] Create `src/components/admin/AdminSidebar.tsx` (`"use client"`): nav links to `/admin`, `/admin/cursinho`, `/admin/voluntarios`, `/admin/contato`, `/admin/newsletter`; active link highlighted using `usePathname`; `unreadCount` prop displayed as a `Badge` next to "Contato" link when `> 0`; logout button at bottom calls `supabase.auth.signOut()` then `router.push('/admin/login')`; uses design system tokens (`--primary`, `--accent`) and `font-display`
- [x] T027 [US2] Create `src/app/admin/(panel)/layout.tsx`: Server Component; import `countUnreadContato` from `@/lib/db/contato`; fetch unread count; render `AdminSidebar` with `unreadCount` prop + `<main>` wrapper with padding; export `metadata` with title prefix "Admin — Instituto Movimenta"

**Checkpoint**: Unauthenticated access to `/admin` redirects to `/admin/login`. Login with Supabase user credentials lands on `/admin`. Logout returns to login. Session persists across browser restarts for 7 days.

---

## Phase 5: User Story 3 — Admin Dashboard (Priority: P2)

**Goal**: Dashboard shows live counts for all 4 entities. Contact card shows unread badge.

**Independent Test**: With data in all 4 tables, load `/admin` — verify each card shows correct count. Unread contact messages appear as badge on the card. Clicking a card navigates to that section.

- [x] T028 [US3] Create `src/app/admin/(panel)/page.tsx`: Server Component; import `countCursinho`, `countVoluntarios`, `countContato`, `countUnreadContato`, `countNewsletter` from respective `@/lib/db/*` files; render 4 shadcn `Card` components with counts; contact card renders unread count as a `Badge`; each card is a link (`<Link>`) to its section; export `metadata = { title: "Dashboard | Admin" }`

**Checkpoint**: `/admin` dashboard shows correct counts matching rows in Supabase Table Editor.

---

## Phase 6: User Story 4 — Registration Management & Export (Priority: P2)

**Goal**: Admin can view, filter, export CSV, toggle read status, and delete records in all 4 sections.

**Independent Test**: In `/admin/cursinho` — filter by date range → only matching rows appear. Click "Exportar CSV" → file downloads with correct headers and filtered data. Click delete on a row → confirmation modal appears → confirm → row disappears and Supabase table no longer has the record. In `/admin/contato` → toggle a message to "lida" → badge count decreases.

### Admin server actions

- [x] T029 [US4] Create `src/lib/actions/admin.ts` (`"use server"`): implement `toggleLida(id: string, lida: boolean)` and `deleteRecord(table, id)` calling the appropriate db functions; `revalidatePath` after each mutation

### Shared admin UI components

- [x] T030 [P] [US4] Create `src/components/admin/DeleteConfirmModal.tsx`: wraps shadcn `Dialog`; accepts `onConfirm` prop; renders warning text "Esta ação é irreversível." with cancel and confirm buttons; confirm button calls `onConfirm()` and shows loading state during deletion
- [x] T031 [US4] Create `src/components/admin/AdminDataTable.tsx` (`"use client"`): generic table accepting columns, rows, total, page, filters (date-from/to, city, interest), tableName, onDelete, onToggleLida; renders shadcn `Table`; "Exportar CSV" button triggers native Blob CSV download; delete button per row opens `DeleteConfirmModal`; pagination controls shown when `total > 50`

### Admin section pages (each page is independent after T031)

- [x] T032 [US4] Create `src/app/admin/(panel)/cursinho/page.tsx`: Server Component accepting `searchParams`; call `listCursinho(opts)`; pass data to `AdminDataTable`; export `metadata`
- [x] T033 [P] [US4] Create `src/app/admin/(panel)/voluntarios/page.tsx`: same pattern with `listVoluntarios`; filter by city and interest; export `metadata`
- [x] T034 [P] [US4] Create `src/app/admin/(panel)/contato/page.tsx`: same pattern with `listContato`; `showLidaToggle` wired to `toggleLida` Server Action; export `metadata`
- [x] T035 [P] [US4] Create `src/app/admin/(panel)/newsletter/page.tsx`: same pattern with `listNewsletter`; export `metadata`

**Checkpoint**: All 4 admin sections load with real data. Date filter changes visible rows. CSV export downloads a file openable in spreadsheet software. Delete removes the row from the table and from Supabase. Toggle "lida" on a contact message updates the badge count in the sidebar on next navigation.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T036 [P] All admin pages export `metadata` with specific `title`
- [x] T037 [P] `.env.example` updated with `SUPABASE_SERVICE_ROLE_KEY=` entry
- [x] T038 `bun run lint`, `bun run format`, `bunx tsc --noEmit` all pass
- [x] T039 `bun run test` — all 12 Vitest tests pass
- [x] T040 Production build (`bun run build`) completes successfully — 18 pages generated

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on T001 (packages installed) — **blocks all user stories**
- **Phase 3 (US1)**: Depends on Phase 2 complete (T004, T005)
- **Phase 4 (US2)**: Depends on Phase 2 complete; T026 depends on T025; T027 depends on T026
- **Phase 5 (US3)**: Depends on Phase 3 db layer (T007–T010) + Phase 4 complete (T027)
- **Phase 6 (US4)**: Depends on Phase 3 db layer (T007–T010) + Phase 4 complete (T027); T031 depends on T030; T032–T035 depend on T031
- **Phase 7 (Polish)**: Depends on all phases complete
