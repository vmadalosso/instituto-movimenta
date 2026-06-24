<h1 align="center">Instituto Movimenta</h1>

<p align="center">
  Site institucional da ONG Instituto Movimenta — "A saída é coletiva."
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=BD93F9&labelColor=282A36">
  <img alt="Bun" src="https://img.shields.io/static/v1?label=runtime&message=Bun&color=FFDF00&labelColor=282A36">
  <img alt="TypeScript" src="https://img.shields.io/static/v1?label=lang&message=TypeScript&color=8BE9FD&labelColor=282A36">
  <img alt="Next.js" src="https://img.shields.io/static/v1?label=framework&message=Next.js+15&color=50FA7B&labelColor=282A36">
</p>

<p align="center">
  <a href="#about">About</a> ·
  <a href="#features">Features</a> ·
  <a href="#tech-stack">Tech Stack</a> ·
  <a href="#screenshots">Screenshots</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#deployment">Deployment</a> ·
  <a href="#running-tests">Running Tests</a> ·
  <a href="#volunteer-context">Volunteer Context</a>
</p>

---

## About

**Instituto Movimenta** é uma ONG do Rio Grande do Sul que atua em solidariedade, educação, esporte, cultura e meio ambiente, promovendo transformação social através de ações comunitárias.

Este repositório é o site institucional da organização. Serve como plataforma digital para divulgar projetos, conectar voluntários, receber inscrições no cursinho popular e captar doações.

---

## Features

- **Home institucional** — apresentação da ONG e chamada para ação
- **Quem Somos** — história, missão, visão e valores
- **Projetos** — as 5 frentes de atuação (solidariedade, educação, esporte, cultura, meio ambiente)
- **Cidades** — municípios atendidos no RS
- **Cursinho Popular** — inscrição com formulário validado e persistência no banco
- **Voluntariado** — cadastro de voluntários com formulário validado e persistência no banco
- **Newsletter** — inscrição via footer, integrada ao banco
- **Doações** — formulário (integração com gateway a definir)
- **Contato** — formulário de contato com persistência
- **Painel admin** — `/admin` protegido por autenticação; tabelas com filtros, exportação CSV e gestão de mensagens
- **Design responsivo** — mobile-first, acessível

---

## Tech Stack

### Frontend

| Ferramenta              | Finalidade                              |
| ----------------------- | --------------------------------------- |
| Next.js 15 (App Router) | Framework full-stack                    |
| TypeScript              | Tipagem estática                        |
| Tailwind CSS v4         | Estilização utility-first               |
| shadcn/ui (new-york)    | Componentes acessíveis (sobre Radix UI) |
| React Hook Form + Zod   | Formulários e validação                 |
| Lucide React            | Ícones                                  |

### Backend

| Ferramenta           | Finalidade                              |
| -------------------- | --------------------------------------- |
| Next.js Server Actions | Mutações (formulários públicos e admin) |
| Supabase             | Banco de dados PostgreSQL + Auth        |
| Zod                  | Validação server-side e env vars        |

### Infrastructure

| Ferramenta | Finalidade                  |
| ---------- | --------------------------- |
| Vercel     | Deploy e hosting            |
| Supabase   | PostgreSQL + auth + storage |
| Bun        | Package manager e runtime   |

---

## Screenshots

<p align="center">
  <img src="./public/screenshots/home.png" alt="Página inicial" width="80%"/>
</p>
<p align="center"><em>Página inicial</em></p>

---

## Getting Started

### Pré-requisitos

- [Bun](https://bun.sh/) >= 1.x
- Uma conta no [Supabase](https://supabase.com) (para rodar com backend)

### 1. Clone o repositório

```bash
git clone https://github.com/vmadalosso/instituto-movimenta.git
cd instituto-movimenta
```

### 2. Instale as dependências

```bash
bun install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL="https://<seu-projeto>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
```

> As três variáveis são obrigatórias — o app valida sua presença na inicialização e não sobe sem elas.

### 4. Execute o projeto

```bash
bun run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### Scripts disponíveis

```bash
bun run dev          # Servidor de desenvolvimento
bun run build        # Build de produção
bun run start        # Servidor de produção local
bun run lint         # ESLint
bun run format       # Prettier
bun run test         # Vitest (run único)
bun run test:watch   # Vitest em modo watch
```

---

## Deployment

O projeto é uma aplicação Next.js única, deployada na Vercel com Supabase como banco de dados.

### Passo 1 — Crie o projeto no Supabase

1. [supabase.com](https://supabase.com) → **New Project**
2. Copie a **Project URL** e as chaves **anon** e **service_role**
3. No **SQL Editor**, execute o conteúdo de `supabase/migrations/001_initial_schema.sql` para criar as tabelas e políticas RLS

### Passo 2 — Deploy na Vercel

1. [vercel.com](https://vercel.com) → **New Project** → importe este repositório
2. Configure as variáveis de ambiente:

| Variável                        | Valor                                   |
| ------------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL do projeto Supabase                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon pública                      |
| `SUPABASE_SERVICE_ROLE_KEY`     | Chave service role (apenas server-side) |

3. Deploy

---

## Running Tests

```bash
bun run test
```

Os testes ficam co-localizados com os arquivos testados (`*.test.ts`). Cobertura atual: schemas Zod.

---

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── admin/                  # Painel administrativo (protegido)
│   │   ├── (panel)/            # Layout com sidebar
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── cursinho/
│   │   │   ├── voluntarios/
│   │   │   ├── contato/
│   │   │   └── newsletter/
│   │   └── login/
│   ├── api/doacoes/            # Stub — gateway a definir
│   ├── contato/                # Página + formulário
│   ├── cursinho/               # Página + formulário
│   ├── doacoes/                # Página + formulário
│   ├── voluntario/             # Página + formulário
│   ├── cidades/
│   ├── projetos/
│   └── quem-somos/
├── components/
│   ├── admin/                  # AdminDataTable, AdminSidebar, DeleteConfirmModal
│   ├── ui/                     # shadcn/ui (gerado pelo CLI)
│   ├── PageLayout.tsx
│   ├── SiteHeader.tsx
│   └── SiteFooter.tsx
├── lib/
│   ├── actions/                # Server Actions ("use server")
│   ├── db/                     # Acesso ao banco (Supabase)
│   ├── env.ts                  # Validação Zod de variáveis de ambiente
│   ├── form-schemas.ts         # Schemas Zod centralizados
│   ├── supabase.ts             # Cliente Supabase (server)
│   └── utils.ts
└── middleware.ts               # Proteção de rotas /admin/**
```

---

## Volunteer Context

Este projeto é desenvolvido de forma voluntária para o **Instituto Movimenta**, ONG do Rio Grande do Sul. Faz parte também do meu portfólio profissional como desenvolvedor.

**Desenvolvedor:** Vitor Madalosso  
**Instagram da ONG:** [@inst.movimenta](https://www.instagram.com/inst.movimenta/)

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Made with ♥ by <a href="https://github.com/vmadalosso">Vitor Madalosso</a>
</p>
