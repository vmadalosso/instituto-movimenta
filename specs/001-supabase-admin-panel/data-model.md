# Data Model: Supabase Integration & Admin Panel

**Branch**: `feature/supabase-admin-panel` | **Date**: 2026-06-24

---

## Tables

### `cursinho_inscricoes`

Stores prospective student applications to the cursinho popular.

| Column         | Type          | Constraints                                    |
| -------------- | ------------- | ---------------------------------------------- |
| `id`           | `uuid`        | PK, `gen_random_uuid()`                        |
| `name`         | `text`        | NOT NULL                                       |
| `email`        | `text`        | NOT NULL, UNIQUE                               |
| `phone`        | `text`        | NOT NULL                                       |
| `city`         | `text`        | NOT NULL                                       |
| `state`        | `text`        | NOT NULL                                       |
| `neighborhood` | `text`        | NOT NULL                                       |
| `school`       | `text`        | NOT NULL                                       |
| `shift`        | `text`        | NOT NULL, CHECK IN ('manha', 'tarde', 'noite') |
| `created_at`   | `timestamptz` | NOT NULL, DEFAULT `now()`                      |

**Indexes**: `UNIQUE (email)`

---

### `voluntarios`

Stores volunteer registrations.

| Column                 | Type          | Constraints                       |
| ---------------------- | ------------- | --------------------------------- |
| `id`                   | `uuid`        | PK, `gen_random_uuid()`           |
| `name`                 | `text`        | NOT NULL                          |
| `email`                | `text`        | NOT NULL, UNIQUE                  |
| `phone`                | `text`        | NOT NULL                          |
| `city`                 | `text`        | NOT NULL                          |
| `state`                | `text`        | NOT NULL                          |
| `instagram`            | `text`        | nullable                          |
| `interest`             | `text`        | NOT NULL                          |
| `is_student`           | `text`        | NOT NULL, CHECK IN ('sim', 'nao') |
| `school_or_university` | `text`        | nullable                          |
| `how_found`            | `text`        | NOT NULL                          |
| `created_at`           | `timestamptz` | NOT NULL, DEFAULT `now()`         |

**Indexes**: `UNIQUE (email)`

---

### `mensagens_contato`

Stores messages sent through the public contact form.

| Column       | Type          | Constraints               |
| ------------ | ------------- | ------------------------- |
| `id`         | `uuid`        | PK, `gen_random_uuid()`   |
| `name`       | `text`        | NOT NULL                  |
| `email`      | `text`        | NOT NULL                  |
| `subject`    | `text`        | NOT NULL                  |
| `message`    | `text`        | NOT NULL                  |
| `lida`       | `boolean`     | NOT NULL, DEFAULT `false` |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` |

**Note**: No UNIQUE constraint on email — same person may send multiple messages.

---

### `newsletter_emails`

Stores email addresses subscribed to organizational updates.

| Column       | Type          | Constraints               |
| ------------ | ------------- | ------------------------- |
| `id`         | `uuid`        | PK, `gen_random_uuid()`   |
| `email`      | `text`        | NOT NULL, UNIQUE          |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` |

---

## SQL Migration

File: `supabase/migrations/001_initial_schema.sql`

Run via Supabase Dashboard → SQL Editor, or `supabase db push` if CLI is installed.

```sql
-- ============================================================
-- Instituto Movimenta — Initial Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- cursinho_inscricoes
CREATE TABLE IF NOT EXISTS cursinho_inscricoes (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  email         text        NOT NULL,
  phone         text        NOT NULL,
  city          text        NOT NULL,
  state         text        NOT NULL,
  neighborhood  text        NOT NULL,
  school        text        NOT NULL,
  shift         text        NOT NULL CHECK (shift IN ('manha', 'tarde', 'noite')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS cursinho_inscricoes_email_idx
  ON cursinho_inscricoes (email);

-- voluntarios
CREATE TABLE IF NOT EXISTS voluntarios (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 text        NOT NULL,
  email                text        NOT NULL,
  phone                text        NOT NULL,
  city                 text        NOT NULL,
  state                text        NOT NULL,
  instagram            text,
  interest             text        NOT NULL,
  is_student           text        NOT NULL CHECK (is_student IN ('sim', 'nao')),
  school_or_university text,
  how_found            text        NOT NULL,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS voluntarios_email_idx
  ON voluntarios (email);

-- mensagens_contato
CREATE TABLE IF NOT EXISTS mensagens_contato (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  email      text        NOT NULL,
  subject    text        NOT NULL,
  message    text        NOT NULL,
  lida       boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- newsletter_emails
CREATE TABLE IF NOT EXISTS newsletter_emails (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_emails_email_idx
  ON newsletter_emails (email);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE cursinho_inscricoes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE voluntarios          ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens_contato    ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_emails    ENABLE ROW LEVEL SECURITY;

-- anon: INSERT only (public form submissions)
CREATE POLICY "anon_insert_cursinho"
  ON cursinho_inscricoes FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_voluntarios"
  ON voluntarios FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_contato"
  ON mensagens_contato FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_newsletter"
  ON newsletter_emails FOR INSERT TO anon WITH CHECK (true);

-- authenticated (admin): full access
CREATE POLICY "admin_all_cursinho"
  ON cursinho_inscricoes FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_voluntarios"
  ON voluntarios FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_contato"
  ON mensagens_contato FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "admin_all_newsletter"
  ON newsletter_emails FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
```

---

## Duplicate Error Handling

When an INSERT violates a UNIQUE constraint, Supabase returns a PostgreSQL error with code `23505`. DB functions must propagate this so Server Actions can return a user-friendly message:

```ts
// In lib/db/*.ts
if (error?.code === "23505") {
  return { success: false, duplicate: true };
}
```

```ts
// In lib/actions/*.ts
if (result.duplicate) {
  return {
    success: false,
    message: "Este e-mail já está cadastrado. Entre em contato se precisar atualizar seus dados.",
  };
}
```

---

## Future Scalability Notes

- Adding a `role` column to a `admin_users` table and adjusting RLS policies is the path to multi-role access control — no schema migration needed on the 4 data tables.
- All tables use `uuid` PKs — safe for distributed inserts and future data exports.
- `created_at` indexes can be added if query performance degrades at higher volumes (not needed at current NGO scale).
