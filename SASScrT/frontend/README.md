# SaaS E-commerce — Frontend

React 18 + TypeScript + Vite. Painel admin com editor visual de blocos e storefront público multi-tenant.

## Stack

| Lib | Uso |
|---|---|
| React 18 + TypeScript | UI |
| Vite 5 | Build / dev server |
| React Router v6 | Roteamento |
| Zustand + persist | Estado de autenticação |
| TanStack Query v5 | Cache de dados do servidor |
| Axios | HTTP + interceptors JWT |
| @dnd-kit | Drag-and-drop no editor |
| Tailwind CSS v3 | Estilização |
| Zod + React Hook Form | Validação de formulários |
| Lucide React | Ícones |

## Estrutura

```
src/
├── components/
│   ├── blocks/         # Blocos renderizáveis (HeroSlider, ProductGrid, PromoBanner…)
│   └── ui/             # Componentes genéricos (Spinner, ErrorMessage…)
├── editor/
│   └── BlockRegistry.ts  # Registro central de tipos de bloco
├── hooks/
│   └── useAuth.ts      # Hook utilitário de autenticação
├── pages/
│   ├── admin/
│   │   └── Editor.tsx  # Editor visual drag-and-drop
│   └── storefront/
│       ├── HomePage.tsx
│       ├── LoginPage.tsx
│       └── RegisterPage.tsx
├── services/
│   └── api.ts          # Instância Axios com interceptors JWT + tenant
├── store/
│   └── authStore.ts    # Zustand store persistido (login/register/logout)
├── theme/
│   └── ThemeProvider.tsx # Carrega tema do backend e aplica CSS vars
├── types/
│   └── index.ts        # Tipos globais (Product, Block, Theme, Auth…)
├── App.tsx             # Rotas + PrivateRoute
├── main.tsx            # Entry point
└── index.css           # Tailwind + CSS vars base
```

## Começando

```bash
# 1. Instalar dependências
npm install

# 2. Configurar env (opcional em dev — o proxy já cuida)
cp .env.example .env.local

# 3. Rodar o backend Spring Boot em localhost:8080

# 4. Subir o frontend
npm run dev
# → http://localhost:5173
```

## Rotas

| Rota | Acesso | Descrição |
|---|---|---|
| `/` | Público | Storefront — renderiza blocos da página `home` |
| `/login` | Público | Login de admin |
| `/register` | Público | Cadastro de nova loja (tenant) |
| `/admin/editor` | Autenticado | Editor visual de blocos |
| `/admin/editor/:slug` | Autenticado | Editor para página específica |

## Adicionando um novo bloco

```tsx
// src/components/blocks/MeuBloco.tsx
import { BlockProps, registerBlock } from '@/editor/BlockRegistry'

function MeuBloco({ settings }: BlockProps) {
  return <section>{settings.texto as string}</section>
}

registerBlock('meu-bloco', MeuBloco)
```

Depois importe em `src/components/blocks/index.tsx` para garantir o registro.

## Build de produção

```bash
npm run build
# output em dist/
```
