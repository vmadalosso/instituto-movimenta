<!--
SYNC IMPACT REPORT
==================
Version change: N/A (template) → 1.0.0
Type of bump: Initial ratification (MAJOR — baseline governance established)

Added sections:
  - Core Principles (5 principles)
  - Restrições Explícitas
  - Fluxo de Desenvolvimento
  - Governance

Modified principles: N/A (initial version)
Removed sections: N/A (initial version)

Templates reviewed:
  - .specify/templates/plan-template.md ✅ Compatible — Constitution Check section is
    driven by this file at runtime; no structural changes needed.
  - .specify/templates/spec-template.md ✅ Compatible — generic enough; FR/SC format
    aligns with principle-driven requirements.
  - .specify/templates/tasks-template.md ✅ Compatible — task phasing aligns with
    progressive backend evolution principle.

Deferred TODOs:
  - RATIFICATION_DATE is set to first authoring date (2026-06-12); update if
    the team establishes a formal ratification ceremony.
  - Payment gateway integration not yet specified — no principle covers it yet;
    add when direction is confirmed.
-->

# Instituto Movimenta — Constituição do Projeto

## Core Principles

### I. Stack Obrigatória

O projeto DEVE usar exclusivamente a stack definida abaixo. Qualquer adição ou
substituição requer justificativa explícita e registro neste documento.

- **Framework**: Next.js 15 com App Router — nunca Pages Router.
- **Linguagem**: TypeScript em todos os arquivos `.ts` e `.tsx`, sem exceções.
- **Estilo**: Tailwind CSS v4 com utility classes. CSS customizado é PROIBIDO salvo
  os tokens de design já definidos em `src/app/globals.css`.
- **Componentes**: shadcn/ui como base. Componentes nativos do Radix UI são
  permitidos quando o wrapper shadcn não existir.
- **Validação**: Zod para toda validação de dados — formulários, API routes, e
  variáveis de ambiente.
- **Formulários**: React Hook Form com `@hookform/resolvers/zod`. Sem `useState`
  para gerenciar estado de formulário.
- **Ícones**: Lucide React — não introduzir outras bibliotecas de ícones.
- **Gerenciador de pacotes**: Bun — não usar npm ou yarn.

**Rationale**: Consistência elimina decisões repetidas, reduz fricção de onboarding
e garante que as convenções do Next.js 15 (Server Components, Server Actions,
Route Handlers) sejam aplicadas corretamente.

### II. Arquitetura e Estrutura de Código

A estrutura de pastas existente é canônica e DEVE ser respeitada ao adicionar
qualquer feature.

```
src/
├── app/                   # Next.js App Router (rotas, layouts, API routes)
│   ├── api/[rota]/        # Route Handlers — apenas validação + orquestração
│   └── [rota]/
│       ├── page.tsx       # Server Component por padrão
│       └── [Nome]Form.tsx # Client Component de formulário, co-localizado
├── components/
│   ├── ui/                # shadcn/ui — não editar manualmente
│   └── *.tsx              # Componentes de layout e UI reutilizáveis
├── hooks/                 # Custom hooks client-side (use-*.tsx)
├── lib/
│   ├── form-schemas.ts    # Todos os schemas Zod em arquivo único
│   └── utils.ts           # Utilitários sem estado
└── assets/                # Imagens estáticas
```

Regras estruturais:

- `page.tsx` DEVE ser Server Component por padrão; adicionar `"use client"` apenas
  quando estritamente necessário.
- Form components DEVEM ser co-localizados com sua `page.tsx`.
- Schemas Zod DEVEM ficar em `src/lib/form-schemas.ts`; tipos inferidos via
  `z.infer<typeof schema>` DEVEM ser exportados do mesmo arquivo.
- API routes DEVEM conter apenas: validação Zod + chamada de serviço + resposta.
  Lógica de negócio pertence a funções em `src/lib/`.
- Path alias `@/*` → `src/*` DEVE ser usado em todos os imports internos.

**Rationale**: Estrutura previsível reduz tempo de localização de código e facilita
a evolução incremental do backend sem mover arquivos existentes.

### III. Formulários e Validação

Todo formulário DEVE seguir o padrão:

1. Schema Zod definido em `src/lib/form-schemas.ts`.
2. Tipo inferido exportado do mesmo arquivo.
3. `useForm<T>` com `resolver: zodResolver(schema)`.
4. Submissão via **Server Action** em `src/lib/actions/[entidade].ts`.
5. Campo honeypot (`name="website"`) oculto via CSS, lido via `useRef`, fora do RHF.
6. Checkbox de consentimento LGPD (`consent`) registrado no RHF com `z.boolean().refine(v => v === true)`.
7. Estados de sucesso e erro tratados no componente com `sent` e `submitError`.

Server Actions DEVEM:

- Verificar o honeypot primeiro — se preenchido, retornar `{ success: true }` silenciosamente.
- Validar com `schema.omit({ consent: true }).safeParse(data)`.
- Chamar exclusivamente funções de `src/lib/db/` — nunca Supabase direto.
- Retornar `{ success: boolean; message: string }`.

**Rationale**: Validação centralizada evita divergência entre client e server.
Server Actions eliminam a camada HTTP para mutações simples e são protegidos por
CSRF nativo do Next.js.

### IV. Backend e Camadas de Acesso a Dados

O backend usa Supabase (PostgreSQL + Auth). A arquitetura em camadas é obrigatória:

```
Client Component → Server Action → src/lib/db/ → Supabase
```

Princípios:

- **Camada de banco isolada**: Queries Supabase DEVEM estar exclusivamente em
  `src/lib/db/[entidade].ts`. Nunca chamar Supabase diretamente em Server Actions,
  componentes ou layouts.
- **Server Actions para mutações**: Formulários públicos e operações do admin usam
  Server Actions em `src/lib/actions/`. Nunca misturar com API routes na mesma operação.
- **API routes apenas quando necessário**: Apenas `src/app/api/doacoes/route.ts`
  permanece como stub até o gateway de pagamento ser definido.
- **Variáveis de ambiente**: Validadas com Zod em `src/lib/env.ts`. Nunca acessar
  `process.env` diretamente em Server Components ou Server Actions.
- **Auth do admin**: Supabase Auth com sessões de 7 dias. Middleware Next.js protege
  `/admin/**`. Usuários criados manualmente no Supabase Dashboard.
- **RLS**: anon pode apenas INSERT; authenticated tem acesso total. Queries do admin
  usam a sessão autenticada via cookies — nunca a service role key no código.

**Rationale**: Isolamento em `src/lib/db/` garante que mudança de provedor afete
apenas essa camada. Server Actions eliminam camada HTTP desnecessária para mutações.

### V. Simplicidade e Manutenibilidade

- **YAGNI**: Não implementar funcionalidade que não tenha uma user story aprovada.
- **Sem abstrações prematuras**: Três instâncias similares justificam extração;
  uma ou duas não.
- **Sem dependências sem aprovação**: Nova biblioteca DEVE ser justificada com:
  (a) problema que resolve, (b) alternativa nativa descartada, (c) tamanho do bundle.
- **Componentes pequenos**: Um componente DEVE fazer uma coisa. Se tem mais de
  ~150 linhas, avaliar extração.
- **Comentários apenas no "porquê"**: Não comentar o que o código já expressa pelos
  nomes. Comentários de `// TODO: integrar com X` são válidos.
- **Sem `any`**: TypeScript strict mode está habilitado. `as unknown as T` requer
  justificativa inline.

**Rationale**: O projeto é mantido por time reduzido / voluntários. Código simples
e previsível reduz o custo de entrada de novos colaboradores.

## Restrições Explícitas

As seguintes práticas são PROIBIDAS e não podem ser introduzidas sem emenda
desta constituição:

| Proibido                                  | Alternativa                                  |
| ----------------------------------------- | -------------------------------------------- |
| Pages Router (`pages/`)                   | App Router (`app/`)                          |
| Arquivos `.css` novos                     | Tailwind utilities + tokens em `globals.css` |
| TanStack Start / Wrangler                 | Next.js App Router nativo                    |
| GraphQL                                   | REST via Route Handlers                      |
| `useState` para form state                | React Hook Form                              |
| Validação ad-hoc (sem Zod)                | `z.object({})` em `form-schemas.ts`          |
| `process.env` direto em componentes       | `src/lib/env.ts` validado com Zod            |
| Biblioteca de ícones além de Lucide React | Lucide React                                 |
| `npm install` / `yarn add`                | `bun add`                                    |

## Fluxo de Desenvolvimento

- **Branches**: feature branches a partir de `main` com prefixo numérico
  (convenção gerenciada pelo speckit-git-feature).
- **Testes**: Vitest para lógica de negócio (schemas, API routes). Testes de UI
  são opcionais — se incluídos, usar `@testing-library/react`.
- **Arquivos de teste**: co-localizados com o arquivo testado como `*.test.ts`.
- **Lint / Format**: `bun run lint` e `bun run format` devem passar antes de
  qualquer commit. Configurados via ESLint flat config + Prettier.
- **Deploy**: Vercel. Variáveis de ambiente de produção gerenciadas no painel
  Vercel — nunca commitar `.env` com valores reais.
- **Metadata de SEO**: Toda `page.tsx` DEVE exportar `metadata` (ou `generateMetadata`)
  com `title` e `description` específicos da rota.

## Governance

Esta constituição é o documento normativo do projeto Instituto Movimenta. Ela
SUPERSEDE qualquer prática informal, decisão verbal ou convenção implícita.

**Processo de emenda**:

1. Identificar o princípio afetado e a mudança desejada.
2. Documentar a justificativa no PR que altera este arquivo.
3. Atualizar `CONSTITUTION_VERSION` conforme semantic versioning:
   - MAJOR: remoção ou redefinição de princípio existente.
   - MINOR: adição de novo princípio ou seção.
   - PATCH: clarificação de redação sem mudança semântica.
4. Atualizar `LAST_AMENDED_DATE` para a data do merge.
5. Verificar se templates em `.specify/templates/` precisam de atualização.

**Compliance**: Todo PR DEVE ser verificado contra os princípios desta constituição
antes do merge. Violações documentadas em `plan.md` (seção Complexity Tracking)
requerem justificativa explícita.

**Arquivo de referência em runtime**: `CLAUDE.md` na raiz do projeto contém
instruções de contexto para o agente de desenvolvimento.

---

**Version**: 1.1.0 | **Ratified**: 2026-06-12 | **Last Amended**: 2026-06-24
