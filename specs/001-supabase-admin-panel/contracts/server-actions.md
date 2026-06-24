# Server Action & DB Function Contracts

**Branch**: `feature/supabase-admin-panel` | **Date**: 2026-06-24

These are the internal TypeScript interfaces between client components, Server Actions, and DB functions. Not a public API — internal to the Next.js application.

---

## Shared Return Types

```ts
// src/lib/actions/types.ts (or inline in each action file)

type ActionSuccess = { success: true; message: string };
type ActionError = { success: false; message: string; errors?: Record<string, string[]> };
type ActionResult = ActionSuccess | ActionError;

type DbListOptions = {
  page?: number; // 1-indexed, default 1
  pageSize?: number; // default 50
  dateFrom?: string; // ISO date string
  dateTo?: string; // ISO date string
  city?: string;
  interest?: string; // voluntarios only
};

type DbListResult<T> = {
  data: T[];
  total: number; // total matching records (for pagination)
};
```

---

## Server Actions (`src/lib/actions/`)

All Server Actions:

- Are `"use server"` functions
- Accept `FormData` as input
- Return `ActionResult`
- Check honeypot field first (silent discard on hit)
- Validate with Zod schema (omitting `consent` field before DB insert)
- Call corresponding `lib/db/` function

### `submitCursinho(formData: FormData): Promise<ActionResult>`

File: `src/lib/actions/cursinho.ts`

Honeypot field: `website`
Schema: `cursinhoSchema` (from `form-schemas.ts`, `consent` omitted before insert)
DB call: `insertCursinho(data)`
Duplicate message: `"Este e-mail já está cadastrado. Entre em contato se precisar atualizar seus dados."`

---

### `submitVoluntario(formData: FormData): Promise<ActionResult>`

File: `src/lib/actions/voluntarios.ts`

Honeypot field: `website`
Schema: `voluntarioSchema` (consent omitted before insert)
DB call: `insertVoluntario(data)`
Duplicate message: `"Este e-mail já está cadastrado. Entre em contato se precisar atualizar seus dados."`

---

### `submitContato(formData: FormData): Promise<ActionResult>`

File: `src/lib/actions/contato.ts`

Honeypot field: `website`
Schema: `contatoSchema` (consent omitted before insert)
DB call: `insertContato(data)`
No duplicate check (multiple messages from same email allowed).

---

### `submitNewsletter(formData: FormData): Promise<ActionResult>`

File: `src/lib/actions/newsletter.ts`

Honeypot field: `website`
Schema: `z.object({ email: z.string().email() })` (inline, no consent field stored)
DB call: `insertNewsletter({ email })`
Duplicate message: `"Este e-mail já está cadastrado na nossa newsletter."`

---

### Admin Server Actions

```ts
// src/lib/actions/admin.ts

// Toggle lida status of a contact message
toggleLida(id: string, lida: boolean): Promise<{ success: boolean }>

// Delete a single record from any table
deleteRecord(table: "cursinho_inscricoes" | "voluntarios" | "mensagens_contato" | "newsletter_emails", id: string): Promise<{ success: boolean }>
```

---

## DB Functions (`src/lib/db/`)

All DB functions use `createServerClient` (authenticated session) for admin reads/writes and `createServerClient` (anon key) for public inserts.

### `src/lib/db/cursinho.ts`

```ts
insertCursinho(data: Omit<CursinhoFormValues, "consent">): Promise<ActionResult>

listCursinho(opts: DbListOptions): Promise<DbListResult<CursinhoRow>>

countCursinho(): Promise<number>

deleteCursinho(id: string): Promise<{ success: boolean }>
```

---

### `src/lib/db/voluntarios.ts`

```ts
insertVoluntario(data: Omit<VoluntarioFormValues, "consent">): Promise<ActionResult>

listVoluntarios(opts: DbListOptions): Promise<DbListResult<VoluntarioRow>>

countVoluntarios(): Promise<number>

deleteVoluntario(id: string): Promise<{ success: boolean }>
```

---

### `src/lib/db/contato.ts`

```ts
insertContato(data: Omit<ContatoFormValues, "consent">): Promise<ActionResult>

listContato(opts: DbListOptions): Promise<DbListResult<ContatoRow>>

countContato(): Promise<number>

countUnreadContato(): Promise<number>

toggleLidaContato(id: string, lida: boolean): Promise<{ success: boolean }>

deleteContato(id: string): Promise<{ success: boolean }>
```

---

### `src/lib/db/newsletter.ts`

```ts
insertNewsletter(data: { email: string }): Promise<ActionResult>

listNewsletter(opts: DbListOptions): Promise<DbListResult<NewsletterRow>>

countNewsletter(): Promise<number>

deleteNewsletter(id: string): Promise<{ success: boolean }>
```

---

## Row Types

```ts
// These mirror the DB columns exactly

type CursinhoRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  neighborhood: string;
  school: string;
  shift: string;
  created_at: string;
};

type VoluntarioRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  instagram: string | null;
  interest: string;
  is_student: string;
  school_or_university: string | null;
  how_found: string;
  created_at: string;
};

type ContatoRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  lida: boolean;
  created_at: string;
};

type NewsletterRow = {
  id: string;
  email: string;
  created_at: string;
};
```
