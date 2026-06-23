# Instituto Movimenta — Guia de Desenvolvimento

Site institucional da ONG Instituto Movimenta (Rio Grande do Sul). Atua em
solidariedade, educação (cursinho popular), esporte, cultura e meio ambiente.
Lema: "A saída é coletiva."

<!-- SPECKIT START -->

Para planos de feature ativos, leia o arquivo `specs/[branch]/plan.md` da
feature em desenvolvimento. A constituição do projeto está em
`.specify/memory/constitution.md`.

<!-- SPECKIT END -->

---

## Stack

| Tecnologia          | Versão         | Papel                                         |
| ------------------- | -------------- | --------------------------------------------- |
| Next.js             | ^15.5.10       | Framework — App Router **obrigatório**        |
| React               | ^18.3.1        | UI runtime                                    |
| TypeScript          | ^5.9.3         | Linguagem — strict mode ativo                 |
| Tailwind CSS        | ^4.2.4         | Estilo — utility-first via PostCSS            |
| shadcn/ui           | new-york style | Biblioteca de componentes (sobre Radix UI)    |
| Zod                 | ^3.25.76       | Validação de dados (formulários e API routes) |
| React Hook Form     | ^7.75.0        | Estado e submissão de formulários             |
| @hookform/resolvers | ^5.2.2         | Bridge entre RHF e Zod                        |
| Lucide React        | ^0.575.0       | Ícones                                        |
| Vitest              | ^4.1.5         | Testes unitários                              |
| Bun                 | —              | Gerenciador de pacotes e runtime de scripts   |
| Vercel              | —              | Deploy (vercel.json presente)                 |

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
│   ├── api/                      # Route Handlers (POST apenas, stubs)
│   │   ├── contato/route.ts
│   │   ├── cursinho/route.ts
│   │   ├── doacoes/route.ts
│   │   └── voluntario/route.ts
│   ├── cidades/page.tsx          # Página de cidades atendidas
│   ├── contato/
│   │   ├── ContatoForm.tsx       # Client Component — co-localizado
│   │   └── page.tsx
│   ├── cursinho/
│   │   ├── CursinhoForm.tsx
│   │   └── page.tsx
│   ├── doacoes/
│   │   ├── DoacoesForm.tsx
│   │   └── page.tsx
│   ├── projetos/page.tsx         # Lista dos 5 frentes de atuação
│   ├── quem-somos/page.tsx       # Missão, visão, valores
│   ├── voluntario/
│   │   ├── VoluntarioForm.tsx
│   │   └── page.tsx
│   ├── error.tsx                 # Error boundary do App Router
│   ├── globals.css               # Tokens de design + Tailwind v4 entry
│   ├── layout.tsx                # Root layout com metadata global
│   ├── not-found.tsx             # Página 404
│   └── page.tsx                  # Home
│
├── assets/                       # Imagens estáticas (importadas como módulos)
│   ├── hero-community.jpg
│   ├── logo-movimenta.jpg
│   ├── project-culture.jpg
│   ├── project-education.jpg
│   ├── project-environment.jpg
│   ├── project-solidarity.jpg
│   └── project-sport.jpg
│
├── components/
│   ├── ui/                       # shadcn/ui — gerado pelo CLI, não editar à mão
│   │   └── index.ts              # Barrel export de todos os componentes ui/
│   ├── PageLayout.tsx            # <PageLayout> + <PageHero> reutilizáveis
│   ├── SiteFooter.tsx            # Footer global (newsletter mockup + links)
│   └── SiteHeader.tsx            # Header sticky com scroll blur e mobile menu
│
├── hooks/
│   └── use-mobile.tsx            # useIsMobile() — breakpoint 768px
│
├── lib/
│   ├── form-schemas.ts           # Todos os schemas Zod + tipos inferidos
│   └── utils.ts                  # cn() — única função utilitária
│
├── styles.css                    # Referenciado pelo shadcn (components.json)
└── global.d.ts                   # declare module "*.css"
```

Arquivos de configuração na raiz:

| Arquivo              | Finalidade                                                                 |
| -------------------- | -------------------------------------------------------------------------- |
| `next.config.mjs`    | `reactStrictMode: true` — sem mais configurações                           |
| `postcss.config.cjs` | Plugin `@tailwindcss/postcss`                                              |
| `tsconfig.json`      | Target ES2022, moduleResolution Bundler, paths `@/*`                       |
| `components.json`    | Config do shadcn/ui (style: new-york, rsc: false)                          |
| `vitest.config.ts`   | Ambiente node, globals, inclui `src/**/*.test.{ts,tsx}`                    |
| `eslint.config.js`   | Flat config com typescript-eslint + prettier                               |
| `.prettierrc`        | Prettier config                                                            |
| `vercel.json`        | Deploy target                                                              |
| `bunfig.toml`        | Config do Bun                                                              |
| `wrangler.jsonc`     | **Arquivo residual — não usar.** Referencia TanStack Start incorretamente. |

---

## Componentes e Padrões Existentes

### PageLayout e PageHero (`src/components/PageLayout.tsx`)

Usados em **todas** as páginas internas:

```tsx
// Página com hero padrão
<PageLayout>
  <PageHero
    eyebrow="Rótulo pequeno"
    title={
      <>
        Título com <span className="text-accent">destaque</span>.
      </>
    }
    subtitle="Subtítulo descritivo."
  />
  {/* conteúdo da página */}
</PageLayout>
```

`PageLayout` renderiza `SiteHeader` + `<main>` + `SiteFooter`.

### SiteHeader (`src/components/SiteHeader.tsx`)

- `"use client"` — usa `usePathname` e `useState`
- Sticky com efeito blur ao scrollar (`window.scrollY > 12`)
- Menu mobile animado com `animate-fade-up`
- Nav ativa comparando `pathname === to`
- Links de navegação definidos na constante `NAV`

### SiteFooter (`src/components/SiteFooter.tsx`)

- `"use client"` — formulário de newsletter com estado local (mockup)
- Instagram real: `https://www.instagram.com/inst.movimenta/`
- Facebook: link placeholder (`#`)

### Formulários

Padrão uniforme em todos os `*Form.tsx`:

```tsx
"use client";
// 1. schema importado de @/lib/form-schemas
// 2. useForm<T> com resolver: zodResolver(schema)
// 3. onSubmit → fetch para /api/[rota]
// 4. estado local: sent (boolean) + submitError (string | null)
// 5. sucesso → tela de confirmação no lugar do formulário
// 6. erro de API → <p className="text-sm text-destructive">
```

Componentes de UI do shadcn usados nos forms: `Button`, `Input`, `Textarea`.
Importados via barrel: `import { Button, Input } from "@/components/ui"`.

### API Routes

Todas seguem o mesmo contrato:

```ts
// Sucesso
{ success: true, message: "..." }  // status 201

// Erro de validação
{ success: false, errors: parseResult.error.flatten() }  // status 422
```

**Todas são stubs** — validam com Zod e fazem `console.log`. Não há banco de dados.

---

## Schemas Zod (`src/lib/form-schemas.ts`)

| Schema             | Campos                                           |
| ------------------ | ------------------------------------------------ |
| `contatoSchema`    | name, email, subject, message                    |
| `cursinhoSchema`   | name, email, phone, city                         |
| `doacoesSchema`    | amount (number, min 1)                           |
| `voluntarioSchema` | name, email, phone, interest, message (optional) |

Tipos inferidos exportados: `ContatoFormValues`, `CursinhoFormValues`,
`DoacoesFormValues`, `VoluntarioFormValues`.

---

## Design System

### Tokens de cor (definidos em `src/app/globals.css`)

O tema usa cores OKLCH. Tokens principais:

| Token         | Descrição                   |
| ------------- | --------------------------- |
| `--primary`   | Verde floresta escuro       |
| `--accent`    | Amarelo sol                 |
| `--highlight` | Laranja argila              |
| `--sky`       | Azul céu                    |
| `--secondary` | Bege claro (fundo de cards) |

**Gradientes customizados** (usados como classes Tailwind via `@layer utilities`):

- `bg-gradient-hero` — verde escuro diagonal
- `bg-gradient-warm` — amarelo → laranja
- `bg-gradient-soft` — fundo suave para seções

**Sombras customizadas**:

- `shadow-soft`, `shadow-elevated`, `shadow-glow`

**Animações customizadas**:

- `animate-float-slow` (8s loop, usado no hero)
- `animate-fade-up` (0.8s, usado no hero e menu mobile)

### Tipografia

- `font-display` → Bricolage Grotesque (todos os headings h1–h5 por padrão via `@layer base`)
- `font-body` → Inter (body)
- Headings: `letter-spacing: -0.02em` via `@layer base`

### Radius

`--radius: 1rem` (base). Cards usam `rounded-3xl`, botões pill usam `rounded-full`.

---

## Convenções de Nomenclatura

| Contexto            | Padrão                          | Exemplo                            |
| ------------------- | ------------------------------- | ---------------------------------- |
| Componentes React   | PascalCase                      | `SiteHeader`, `PageLayout`         |
| Form components     | `[Rota]Form.tsx` co-localizado  | `VoluntarioForm.tsx`               |
| Rotas (pastas)      | kebab-case                      | `/quem-somos`, `/voluntario`       |
| API routes          | `route.ts` em `app/api/[nome]/` | `app/api/contato/route.ts`         |
| Testes              | `*.test.ts` co-localizado       | `route.test.ts`                    |
| Constantes de dados | SCREAMING_SNAKE_CASE            | `NAV`, `METRICS`, `PROJECTS`       |
| Hooks               | `use-kebab-case.tsx`            | `use-mobile.tsx`                   |
| Assets              | `kebab-case.ext`                | `project-education.jpg`            |
| Imports internos    | alias `@/*`                     | `import { cn } from "@/lib/utils"` |
| Tipos de form       | sufixo `FormValues`             | `VoluntarioFormValues`             |

---

## Testes

- Runner: **Vitest** com `vite-tsconfig-paths`
- Ambiente: `node` (sem jsdom — sem testes de componente React hoje)
- Localização: `src/**/*.test.{ts,tsx}` co-localizados com o arquivo testado
- Cobertura atual: schemas Zod (`form-schemas.test.ts`) e API routes (`route.test.ts`)

---

## Direção Futura

As funcionalidades abaixo estão previstas mas **não implementadas**. Ao
desenvolver, tratar API routes como stubs até confirmação explícita de integração.

1. **Banco de dados**: Supabase (PostgreSQL). Quando integrado, queries DEVEM
   ser isoladas em `src/lib/db/` — nunca inline em API routes ou componentes.

2. **Newsletter**: A `SiteFooter` já tem o formulário de captura de e-mail (UI
   completa, estado local). Falta a integração com provedor (Supabase ou outro).

3. **Cadastro de voluntários** (`/api/voluntario`): Já tem validação Zod. Falta
   persistência no banco.

4. **Inscrição no cursinho** (`/api/cursinho`): Mesma situação — validação pronta,
   sem persistência.

5. **Doações** (`/api/doacoes`): Integração com gateway de pagamento não definida.
   A nota "em breve" já está no `DoacoesForm.tsx`.

6. **Variáveis de ambiente**: Quando o backend for integrado, criar
   `src/lib/env.ts` com validação Zod de todas as variáveis.

---

## O Que NÃO Fazer

- **Nunca usar Pages Router** (`pages/`). Este projeto usa App Router.
- **Nunca criar arquivos `.css` novos**. Usar Tailwind utilities. Tokens de design
  ficam exclusivamente em `src/app/globals.css`.
- **Nunca usar `wrangler.jsonc`**. Arquivo residual — este projeto é Next.js, não
  TanStack Start.
- **Nunca instalar bibliotecas sem aprovação**. Justificativa obrigatória: problema
  que resolve, alternativa nativa descartada, impacto no bundle.
- **Nunca usar `useState` para gerenciar estado de formulário**. Usar React Hook Form.
- **Nunca acessar `process.env` diretamente em componentes**. Centralizar em
  `src/lib/env.ts` (ainda a ser criado) com validação Zod.
- **Nunca adicionar lógica de negócio em API routes**. Route handlers DEVEM conter
  apenas: parse do body + validação Zod + chamada de função + retorno JSON.
- **Nunca criar abstrações prematuras**. Três instâncias similares justificam
  extração; uma ou duas, não.
- **Nunca editar arquivos em `src/components/ui/` manualmente**. São gerenciados
  pelo CLI do shadcn.
- **Nunca usar `npm` ou `yarn`**. Usar `bun add` / `bun remove`.
