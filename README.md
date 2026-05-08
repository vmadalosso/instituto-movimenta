# Instituto Movimenta

[![Next.js](https://img.shields.io/badge/Next.js-15.5.10-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.4-38B2AC)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Bun-1.3.13-FFDF00)](https://bun.sh/)

> "A saída é coletiva" — Instituto Movimenta

Website oficial do Instituto Movimenta, ONG do Rio Grande do Sul que atua em solidariedade, educação, esporte, cultura e lazer, promovendo transformação social através de ações comunitárias.

## 🌟 Sobre o Projeto

O Instituto Movimenta é uma organização sem fins lucrativos que trabalha para construir uma sociedade mais justa e solidária. Nosso website serve como plataforma digital para:

- **Divulgar nossas ações** e projetos sociais
- **Conectar voluntários** com oportunidades de atuação
- **Receber doações** e apoios para nossas iniciativas
- **Informar sobre cursos** e capacitações oferecidas
- **Compartilhar nossa missão** e valores

## 🚀 Tecnologias

### Core

- **[Next.js 15](https://nextjs.org/)** — React framework com App Router
- **[TypeScript](https://www.typescriptlang.org/)** — Tipagem estática
- **[React 18](https://react.dev/)** — Biblioteca para interfaces

### UI & Styling

- **[Tailwind CSS 4](https://tailwindcss.com/)** — Framework CSS utilitário
- **[Radix UI](https://www.radix-ui.com/)** — Componentes acessíveis e headless
- **[Lucide React](https://lucide.dev/)** — Ícones modernos
- **[Tailwind Animate](https://github.com/jamiebuilds/tw-animate-css)** — Animações CSS

### Formulários & Validação

- **[React Hook Form](https://react-hook-form.com/)** — Gerenciamento de formulários
- **[Zod](https://zod.dev/)** — Validação de schemas
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** — Integração Zod + RHF

### Desenvolvimento

- **[Bun](https://bun.sh/)** — Runtime e package manager ultrarrápido
- **[ESLint](https://eslint.org/)** — Linting e qualidade de código
- **[Prettier](https://prettier.io/)** — Formatação automática
- **[Vitest](https://vitest.dev/)** — Framework de testes

### Deploy & Infra

- **[Vercel](https://vercel.com/)** — Plataforma de deploy
- **[Cloudflare](https://cloudflare.com/)** — CDN e proteção

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (backend futuro)
│   │   ├── contato/       # API contato
│   │   ├── cursinho/      # API cursos
│   │   ├── doacoes/       # API doações
│   │   └── voluntario/    # API voluntariado
│   ├── cidades/           # Página cidades atendidas
│   ├── contato/           # Página contato + formulário
│   ├── cursinho/          # Página cursos oferecidos
│   ├── doacoes/           # Página doações + formulário
│   ├── projetos/          # Página projetos sociais
│   ├── quem-somos/        # Página sobre nós
│   ├── voluntario/        # Página voluntariado + formulário
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (Radix UI)
│   ├── PageLayout.tsx    # Layout das páginas
│   ├── SiteHeader.tsx    # Cabeçalho do site
│   └── SiteFooter.tsx    # Rodapé do site
├── hooks/                # Custom hooks
├── lib/                  # Utilitários e configurações
│   ├── form-schemas.ts   # Schemas de validação
│   └── utils.ts          # Funções utilitárias
└── styles.css            # Estilos adicionais
```

## 🛠️ Como Executar

### Pré-requisitos

- **[Bun](https://bun.sh/)** (recomendado) ou Node.js 18+
- **Git**

### Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/vmadalosso/instituto-movimenta.git
   cd instituto-movimenta
   ```

2. **Instale as dependências:**

   ```bash
   bun install
   ```

3. **Execute o projeto:**

   ```bash
   bun dev
   ```

4. **Acesse:** [http://localhost:3000](http://localhost:3000)

### Scripts Disponíveis

```bash
bun dev          # Inicia servidor de desenvolvimento
bun build        # Build para produção
bun start        # Inicia servidor de produção
bun lint         # Executa ESLint
bun format       # Formata código com Prettier
bun test         # Executa testes
bun test:watch   # Executa testes em modo watch
```

## 🧪 Testes

O projeto utiliza [Vitest](https://vitest.dev/) para testes. Os testes estão localizados em arquivos `*.test.ts` e `*.test.tsx`.

```bash
# Executar todos os testes
bun test

# Executar testes em modo watch
bun test:watch

# Executar testes com coverage
bun test --coverage
```

## 📱 Funcionalidades

### ✅ Implementadas

- **🏠 Página Inicial** — Apresentação da ONG e chamada para ação
- **👥 Quem Somos** — Nossa história, missão e valores
- **🎯 Projetos** — Iniciativas sociais em andamento
- **🏙️ Cidades** — Locais onde atuamos no RS
- **📚 Cursinho** — Cursos preparatórios e capacitações
- **💝 Doações** — Sistema de doações com formulário
- **📞 Contato** — Formulário de contato e informações
- **🤝 Voluntariado** — Cadastro de voluntários
- **🎨 UI/UX Moderna** — Design responsivo e acessível
- **📝 Formulários Validados** — Validação em tempo real
- **🔍 SEO Otimizado** — Meta tags e Open Graph

### 🚧 Em Desenvolvimento

- **🔧 Backend APIs** — Implementação dos endpoints
- **💾 Banco de Dados** — Integração com sistema de dados
- **📧 Sistema de Email** — Notificações e comunicações
- **👤 Área do Voluntário** — Dashboard e gerenciamento
- **📊 Analytics** — Métricas e relatórios
- **🌐 Internacionalização** — Suporte multi-idioma

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- **Instituto Movimenta** — Pela missão inspiradora
- **Comunidade Open Source** — Pelas ferramentas incríveis
- **Contribuintes** — Pelo apoio e colaboração

---

**Instituto Movimenta** — Construindo um futuro mais solidário, uma ação de cada vez.

� [@inst.movimenta](https://www.instagram.com/inst.movimenta/)

---

Feito com 💜 por [Vitor Madalosso](https://github.com/vmadalosso)
