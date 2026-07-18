-- ============================================================
-- Instituto Movimenta — Add phone to mensagens_contato
-- Migration: 002_add_phone_to_contato.sql
-- Run via: Supabase Dashboard → SQL Editor
-- ============================================================

-- Nullable: registros existentes ficam com phone em branco (NULL).
-- Novo formulário de contato passa a enviar o campo, mas a coluna
-- não é NOT NULL para não quebrar as mensagens já recebidas.
ALTER TABLE mensagens_contato ADD COLUMN IF NOT EXISTS phone text;
