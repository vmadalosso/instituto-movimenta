-- ============================================================
-- Instituto Movimenta — Initial Schema
-- Migration: 001_initial_schema.sql
-- Run via: Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS cursinho_inscricoes (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  email         text        NOT NULL,
  phone         text        NOT NULL,
  city          text        NOT NULL,
  state         text        NOT NULL,
  neighborhood  text        NOT NULL,
  school        text        NOT NULL,
  shift         text        NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS cursinho_inscricoes_email_idx
  ON cursinho_inscricoes (email);

CREATE TABLE IF NOT EXISTS voluntarios (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 text        NOT NULL,
  email                text        NOT NULL,
  phone                text        NOT NULL,
  city                 text        NOT NULL,
  state                text        NOT NULL,
  instagram            text,
  interest             text        NOT NULL,
  is_student           text        NOT NULL,
  school_or_university text,
  how_found            text        NOT NULL,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS voluntarios_email_idx
  ON voluntarios (email);

CREATE TABLE IF NOT EXISTS mensagens_contato (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text        NOT NULL,
  email      text        NOT NULL,
  subject    text        NOT NULL,
  message    text        NOT NULL,
  lida       boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS newsletter_emails (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_emails_email_idx
  ON newsletter_emails (email);

-- Row Level Security
ALTER TABLE cursinho_inscricoes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE voluntarios          ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens_contato    ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_emails    ENABLE ROW LEVEL SECURITY;

-- anon: INSERT only (public forms)
CREATE POLICY "anon_insert_cursinho"
  ON cursinho_inscricoes FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_voluntarios"
  ON voluntarios FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_contato"
  ON mensagens_contato FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_newsletter"
  ON newsletter_emails FOR INSERT TO anon WITH CHECK (true);

-- authenticated: full access (admin panel)
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
