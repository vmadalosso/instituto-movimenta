# Instituto Movimenta — Guia de Desenvolvimento

Site institucional da ONG Instituto Movimenta (Rio Grande do Sul). Atua em
solidariedade, educação (cursinho popular), esporte, cultura e meio ambiente.
Lema: "A saída é coletiva."

<!-- SPECKIT START -->

Nenhuma feature em andamento. Para iniciar uma nova feature, rodar `/speckit-git-feature`.
A constituição do projeto está em `.specify/memory/constitution.md`.

<!-- SPECKIT END -->

---

## Stack

| Tecnologia          | Versão         | Papel                                              |
| ------------------- | -------------- | -------------------------------------------------- |
| Next.js             | ^15.5.10       | Framework — App Router **obrigatório**             |
| React               | ^18.3.1        | UI runtime                                         |
| TypeScript          | ^5.9.3         | Linguagem — strict mode ativo                      |
| Tailwind CSS        | ^4.2.4         | Estilo — utility-first via PostCSS                 |
| shadcn/ui           | new-york style | Biblioteca de componentes (sobre Radix UI)         |
| Supabase            | —              | Backend: PostgreSQL + Auth (via `@supabase/ssr`)   |
| Zod                 | ^3.25.76       | Validação de dados (formulários, env, Server Actions) |
| React Hook Form     | ^7.75.0        | Estado e submissão de formulários                  |
| @hookform/resolvers | ^5.2.2         | Bridge entre RHF e Zod                             |
| Lucide React        | ^0.575.0       | Ícones                                             |
| Vitest              | ^4.1.5         | Testes unitários                                   |
| Bun                 | —              | Gerenciador de pacotes e runtime de scripts        |
| Vercel              | —              | Deploy — produção em institutomovimenta.org        |

**Fontes** (carregadas via Google Fonts em `globals.css`):

- `Bricolage Grotesque` — display/headings (`font-display`)
- `Inter` — corpo (`font-body`)

---

## Comandos

```bash
bun run dev        # Servidor de desenvolvimento (http://localhost:3000)
bun run build      # Build de produção
bun run start      # Servidor de produção local
bun run lint       # ESLint (flat config, eslint.config.js)
bun run format     # Prettier (escreve os arquivos)
bun run test       # Vitest (run único)
bun run test:watch # Vitest em modo watch
```

Não há comando `type-check` explícito. Para checar tipos:

```bash
bunx tsc --noEmit
```

---

## Estrutura de Pastas

```
src/
├── app/                          # Next.js App Router
│   ├── admin/                    # Painel administrativo (protegido por middleware)
│   │   ├── (panel)/              # Route group — layout com sidebar
│   │   │   ├── layout.tsx        # Layout do painel (sidebar + contagem de não lidas)
│   │   │   ├── page.tsx          # Dashboard (/admin)
│   │   │   ├── cursinho/page.tsx # Tabela de inscrições
│   │   │   ├── voluntarios/page.tsx
│   │   │   ├── contato/page.tsx  # Mensagens com toggle "lida"
│   │   │   └── newsletter/page.tsx
│   │   └── login/
│   │       ├── page.tsx
│   │       └── AdminLoginForm.tsx # Client Component de login
│   ├── api/                      # Route Handlers — apenas doacoes (stub)
│   │   └── doacoes/route.ts      # Stub — gateway de pagamento não integrado
│   ├── contato/
│   │   ├── ContatoForm.tsx       # Client Component — Server Action
│   │   └── page.tsx
│   ├── cursinho/
│   │   ├── CursinhoForm.tsx
│   │   └── page.tsx
│   ├── doacoes/
│   │   ├── DoacoesForm.tsx       # Sem integração — em breve
│   │   └── page.tsx
│   ├── cidades/page.tsx
│   ├── projetos/page.tsx
│   ├── quem-somos/page.tsx
│   ├── voluntario/
│   │   ├── VoluntarioForm.tsx
│   │   └── page.tsx
│   ├── error.tsx
│   ├── globals.css               # Tokens de design + Tailwind v4 entry
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
│
├── assets/                       # Imagens estáticas (importadas como módulos)
│   ├── hero-community.jpg
│   ├── logo-movimenta.jpg
│   ├── project-culture.jpg
│   ├── project-education.jpg
│   ├── project-environment.jpg
│   ├── project-recreation.jpg
│   └── project-solidarity.jpg
│
├── components/
│   ├── admin/                    # Componentes exclusivos do painel admin
│   │   ├── AdminDataTable.tsx    # Tabela genérica com filtros, CSV export, delete
│   │   ├── AdminSidebar.tsx      # Sidebar responsiva com badge de não lidas
│   │   └── DeleteConfirmModal.tsx
│   ├── ui/                       # shadcn/ui — gerado pelo CLI, não editar à mão
│   ├── PageLayout.tsx
│   ├── SiteFooter.tsx            # Newsletter integrada ao Supabase
│   └── SiteHeader.tsx
│
├── hooks/
│   └── use-mobile.tsx
│
├── lib/
│   ├── actions/                  # Server Actions ("use server")
│   │   ├── admin.ts              # deleteRecord, toggleLida (admin panel)
│   │   ├── contato.ts
│   │   ├── cursinho.ts
│   │   ├── newsletter.ts
│   │   └── voluntarios.ts
│   ├── db/                       # Acesso ao banco — NUNCA inline em actions/componentes
│   │   ├── contato.ts
│   │   ├── cursinho.ts
│   │   ├── newsletter.ts
│   │   └── voluntarios.ts
│   ├── env.ts                    # Validação Zod de variáveis de ambiente
│   ├── form-schemas.ts           # Schemas Zod + tipos inferidos
│   ├── supabase.ts               # createServerSupabaseClient() com cookie helpers
│   └── utils.ts                  # cn(), maskBrPhone()
│
├── middleware.ts                 # Proteção de rotas /admin/** via Supabase Auth
├── styles.css                    # Referenciado pelo shadcn (components.json)
└── global.d.ts
```

Arquivos de configuração na raiz:

| Arquivo              | Finalidade                                          |
| -------------------- | --------------------------------------------------- |
| `next.config.mjs`    | `reactStrictMode: true`                             |
| `postcss.config.cjs` | Plugin `@tailwindcss/postcss`                       |
| `tsconfig.json`      | Target ES2022, moduleResolution Bundler, paths `@/*`|
| `components.json`    | Config do shadcn/ui (style: new-york, rsc: false)   |
| `vitest.config.ts`   | Ambiente node, globals                              |
| `eslint.config.js`   | Flat config com typescript-eslint + prettier        |
| `.prettierrc`        | Prettier config                                     |
| `vercel.json`        | Deploy target                                       |
| `bunfig.toml`        | Config do Bun                                       |

---

## Componentes e Padrões Existentes

### PageLayout e PageHero (`src/components/PageLayout.tsx`)

Usados em **todas** as páginas públicas internas:

```tsx
<PageLayout>
  <PageHero
    eyebrow="Rótulo pequeno"
    title={<>Título com <span className="text-accent">destaque</span>.</>}
    subtitle="Subtítulo descritivo."
  />
  {/* conteúdo da página */}
</PageLayout>
```

### Formulários — Padrão com Server Actions

```tsx
"use client";
// 1. schema importado de @/lib/form-schemas
// 2. useForm<T> com resolver: zodResolver(schema)
// 3. useRef para campo honeypot (fora do controle do RHF)
// 4. onSubmit → const { consent: _, ...data } = values
//              → await submitAction(data, honeypotRef.current?.value ?? "")
// 5. estado local: sent (boolean) + submitError (string | null)
// 6. sucesso → tela de confirmação
// 7. checkbox de consentimento LGPD registrado no RHF
```

Todos os formulários públicos têm:
- **Honeypot**: `<input name="website" style={{ display: "none" }} ref={honeypotRef} />`
- **Consentimento LGPD**: checkbox `consent` validado com `z.boolean().refine(v => v === true)`
- **Duplicatas**: erro amigável quando Postgres retorna código `23505`

### Server Actions (`src/lib/actions/`)

Todas marcadas com `"use server"`. Padrão:
1. Verificar honeypot → se preenchido, retornar `{ success: true }` silenciosamente
2. Validar com `schema.omit({ consent: true }).safeParse(data)`
3. Chamar função do `src/lib/db/`
4. Retornar `{ success: boolean; message: string }`

### Camada de banco (`src/lib/db/`)

Cada arquivo exporta funções puras de acesso ao banco. **Nunca** chamar Supabase direto
em Server Actions ou componentes — sempre via `src/lib/db/`.

### Painel Admin

- Rota protegida por `src/middleware.ts` — redireciona para `/admin/login` se não autenticado
- Layout com sidebar responsiva (desktop fixa, mobile drawer)
- `AdminDataTable` é client component genérico: filtros via URL params, CSV export nativo, delete com modal
- Contagem de mensagens não lidas: calculada no layout (Server Component) e passada como prop

---

## Schemas Zod (`src/lib/form-schemas.ts`)

| Schema             | Campos principais                                                          |
| ------------------ | -------------------------------------------------------------------------- |
| `contatoSchema`    | name, email, subject, message, consent                                     |
| `cursinhoSchema`   | name, email, phone, city, state, neighborhood, school, shift, consent      |
| `doacoesSchema`    | amount (number, min 1) — sem consent (sem persistência por ora)            |
| `voluntarioSchema` | name, email, phone, city, state, instagram?, interest, isStudent, schoolOrUniversity?, howFound, consent |

Todos os schemas com `consent` usam `z.boolean().refine(v => v === true)`.

---

## Design System

### Tokens de cor (definidos em `src/app/globals.css`)

| Token         | Descrição                   |
| ------------- | --------------------------- |
| `--primary`   | Verde floresta escuro       |
| `--accent`    | Amarelo sol                 |
| `--highlight` | Laranja argila              |
| `--sky`       | Azul céu                    |
| `--secondary` | Bege claro (fundo de cards) |

**Gradientes customizados** (`@layer utilities`):
- `bg-gradient-hero`, `bg-gradient-warm`, `bg-gradient-soft`

**Sombras**: `shadow-soft`, `shadow-elevated`, `shadow-glow`

**Animações**: `animate-float-slow` (hero), `animate-fade-up` (hero + menu mobile)

### Tipografia

- `font-display` → Bricolage Grotesque (headings h1–h5 por padrão via `@layer base`)
- `font-body` → Inter (body)
- `letter-spacing: -0.02em` nos headings

### Radius

`--radius: 1rem`. Cards usam `rounded-3xl`, botões pill usam `rounded-full`.

---

## Convenções de Nomenclatura

| Contexto            | Padrão                         | Exemplo                             |
| ------------------- | ------------------------------ | ----------------------------------- |
| Componentes React   | PascalCase                     | `SiteHeader`, `AdminDataTable`      |
| Form components     | `[Rota]Form.tsx` co-localizado | `VoluntarioForm.tsx`                |
| Server Actions      | verbo + entidade               | `submitCursinho`, `deleteRecord`    |
| Rotas (pastas)      | kebab-case                     | `/quem-somos`, `/voluntario`        |
| Testes              | `*.test.ts` co-localizado      | `form-schemas.test.ts`              |
| Constantes de dados | SCREAMING_SNAKE_CASE           | `NAV`, `METRICS`, `PROJECTS`        |
| Hooks               | `use-kebab-case.tsx`           | `use-mobile.tsx`                    |
| Assets              | `kebab-case.ext`               | `project-education.jpg`             |
| Imports internos    | alias `@/*`                    | `import { cn } from "@/lib/utils"`  |
| Tipos de form       | sufixo `FormValues`            | `VoluntarioFormValues`              |

---

## Testes

- Runner: **Vitest** com `vite-tsconfig-paths`
- Ambiente: `node` (sem jsdom — sem testes de componente React)
- Localização: `src/**/*.test.{ts,tsx}` co-localizados
- Cobertura atual: schemas Zod (`form-schemas.test.ts`)

---

## Variáveis de Ambiente

Validadas em `src/lib/env.ts` via Zod. Nunca acessar `process.env` diretamente
em componentes ou Server Actions — sempre importar de `@/lib/env`.

| Variável                    | Onde usar              |
| --------------------------- | ---------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`  | server + browser       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | server + browser   |
| `SUPABASE_SERVICE_ROLE_KEY` | server apenas (env.ts) |

Exceção: `createBrowserClient` em Client Components usa `process.env.NEXT_PUBLIC_*`
diretamente (valores NEXT_PUBLIC_ são injetados pelo bundler no client).

---

## Direção Futura

Funcionalidades previstas mas **não implementadas**:

1. **Notificação por e-mail**: Quando uma mensagem de contato chega, disparar e-mail
   para a equipe via Resend (Supabase Webhook → Edge Function → Resend API).

2. **Doações**: Integração com gateway de pagamento a definir.
   `src/app/api/doacoes/route.ts` é stub — `DoacoesForm.tsx` já tem UI com nota "em breve".

3. **Reset de senha admin**: Criar rota `/auth/callback` para suportar o fluxo de
   reset de senha do Supabase Auth (atualmente admin é criado manualmente no Dashboard).

---

## O Que NÃO Fazer

- **Nunca usar Pages Router** (`pages/`). Este projeto usa App Router.
- **Nunca criar arquivos `.css` novos**. Usar Tailwind utilities. Tokens ficam
  exclusivamente em `src/app/globals.css`.
- **Nunca instalar bibliotecas sem aprovação**. Justificativa obrigatória: problema
  que resolve, alternativa nativa descartada, impacto no bundle.
- **Nunca usar `useState` para gerenciar estado de formulário**. Usar React Hook Form.
- **Nunca acessar `process.env` diretamente em Server Components ou Server Actions**.
  Usar `env` importado de `@/lib/env`.
- **Nunca colocar lógica de banco em Server Actions**. Actions chamam `src/lib/db/`.
  Actions chamam `src/lib/db/`. DB functions chamam Supabase.
- **Nunca criar abstrações prematuras**. Três instâncias similares justificam
  extração; uma ou duas, não.
- **Nunca editar arquivos em `src/components/ui/` manualmente**. São gerenciados
  pelo CLI do shadcn.
- **Nunca usar `npm` ou `yarn`**. Usar `bun add` / `bun remove`.
- **Nunca misturar Server Actions e API Routes para a mesma operação**. Formulários
  públicos usam Server Actions; `doacoes` usa API route até ter gateway integrado.
