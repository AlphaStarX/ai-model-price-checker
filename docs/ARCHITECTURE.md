# Architecture

## Overview

AI Model Price Checker is a Next.js 16 App Router application that compares AI model API pricing across providers. Free, developer-focused, no accounts, no SaaS, no monetization.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (Base UI primitives) |
| Database | PostgreSQL 17 |
| ORM | Prisma 6 |
| State (client) | React Query v5 (TanStack) |
| Deployment | Vercel |
| Icons | Lucide React |
| Themes | next-themes |

## Directory Structure

```
src/
├── app/                  # 34 files — routes, layouts, API, sitemap, OG images
│   ├── page.tsx          # Homepage (hero + features)
│   ├── layout.tsx        # Root layout (Theme, Tooltip, QueryClient providers)
│   ├── sitemap.ts        # Dynamic sitemap
│   ├── models/
│   │   ├── page.tsx      # Model directory (client: search, filters, grid)
│   │   └── [slug]/       # Model detail (server: specs, pricing, SEO)
│   ├── providers/
│   │   ├── page.tsx      # Provider directory (server)
│   │   └── [slug]/       # Provider detail (server: models + pricing)
│   ├── calculator/       # Cost calculator (client: tokens → costs)
│   ├── compare/          # Side-by-side comparison (client: 2-4 models)
│   ├── (marketing)/about/ # Static about page
│   └── api/              # 5 endpoints: search, pricing, models, models/[slug], cron
├── components/
│   ├── layout/           # 5 files: Header, Footer, MobileNav, ThemeToggle, SearchCommand
│   ├── features/
│   │   ├── models/       # 6 files: Card, Grid, DetailHeader, Capabilities, ContextBadge, Search
│   │   ├── pricing/      # 3 files: Table, Row, Skeleton
│   │   ├── calculator/   # 4 files: Calculator, TokenInput, CostBreakdown, CostChart
│   │   ├── filters/      # 3 files: FilterBar, CheckboxGroup, Select
│   │   └── providers/    # 3 files: Card, Grid, StatusBadge
│   └── ui/               # 18 shadcn/ui primitives (generated)
├── lib/                  # 8 files: prisma, utils, pricing-calc, search, metadata, structured-data, constants, filters
├── server/
│   ├── actions/          # 3 files: models, pricing, providers
│   ├── adapters/         # 11 files: interface, registry, barrel, 7 adapters, 1 mapping
│   └── jobs/             # 1 file: update-all-pricing orchestrator
├── hooks/                # Client hook conventions (AGENTS.md only — hooks in component files)
├── queries/              # React Query conventions (AGENTS.md only)
└── types/                # 4 files: model, pricing, provider, filter
```

## Routes

| Route | Render | Data Fetching |
|---|---|---|
| `/` | Static + Client hybrid | None (static content) |
| `/models` | Client | React Query → `/api/models` → Server Action |
| `/models/[slug]` | Server | Direct Server Action call |
| `/providers` | Server | Direct Server Action call |
| `/providers/[slug]` | Server | Direct Server Action call |
| `/calculator` | Client | React Query → `/api/pricing` |
| `/compare` | Client | React Query → `/api/models/[slug]` |
| `/about` | Server | None (static) |

## Data Flow

```
External Provider APIs (OpenRouter, Together, DeepInfra, Groq)
        ↓
  Provider Adapters  (fetch + normalize, no DB writes)
        ↓
  Update Jobs        (upsert Pricing + PricingHistory, mark provider status)
        ↓
  PostgreSQL          (Prisma ORM)
        ↓
  Server Actions      (typed data access, "use server")
        ↓
  React Components    (Server Components by default, "use client" only for interactivity)
```

## Database Schema (7 tables)

- **Developer** — AI companies (OpenAI, Anthropic, Google, Meta, etc.)
- **Model** — Individual models with specs (context window, output tokens, family, params)
- **Capability** — Enum-like table (reasoning, vision, function-calling, etc.)
- **ModelCapability** — Junction with optional JSON metadata
- **Provider** — API providers (OpenRouter, Together, direct APIs, etc.)
- **Pricing** — Per-model, per-provider pricing. Unique on [modelId, providerId]
- **PricingHistory** — Price change audit trail

## Provider Adapters (7)

| Adapter | Type | Auth |
|---|---|---|
| OpenRouter | Live API (public) | None |
| Together AI | Live API | `TOGETHER_API_KEY` |
| DeepInfra | Live API (public) | None |
| Groq | Live API | `GROQ_API_KEY` |
| OpenAI Direct | Curated config | None |
| Anthropic Direct | Curated config | None |
| Google Direct | Curated config | None |

## Component Inventory (24 feature + 5 layout + 18 UI = 47 components)

### Layout (5)
Header, Footer, MobileNav, ThemeToggle, SearchCommand

### Features — Models (6)
ModelCard, ModelGrid, ModelCardSkeleton, ModelSearchInput, ModelDetailHeader, ModelCapabilities

### Features — Pricing (3)
PricingTable, PricingRow, PricingSkeleton

### Features — Calculator (4)
CostCalculator, TokenInput, CostBreakdown, CostChart, ModelSelector

### Features — Filters (3)
FilterBar, FilterCheckboxGroup, FilterSelect

### Features — Providers (3)
ProviderCard, ProviderGrid, ProviderStatusBadge

### UI (18)
Button, Badge, Card, Dialog, Command, Popover, Select, Slider, Skeleton, Table, Tabs, Tooltip, Checkbox, Separator, Label, Input, Sheet, Sonner

## SEO Strategy

- **Metadata**: Every page exports `metadata` or uses `generateMetadata`
- **Open Graph**: Dynamic OG images per model via `@vercel/og` (Satori)
- **Structured Data**: JSON-LD SoftwareApplication on model pages, ItemList on directory
- **Sitemap**: Dynamic `sitemap.ts` listing all models, providers, and static routes
- **Canonical URLs**: On every page via `metadata.alternates.canonical`

## Key Architecture Decisions

1. **Server Components by default** — only 4 client pages (`/models`, `/calculator`, `/compare`, Cmd+K dialog)
2. **Server Actions for data access** — API routes only for real-time client interactions (search, calculator)
3. **React Query** — client cache with 30s stale time for instant filter and calculator updates
4. **No ORM in components** — all data access through Server Actions or API routes
5. **Mobile-first** — 1 col mobile, 2 col tablet, 3 col desktop across all grids
6. **Dark mode default** — neutral shadcn theme with `next-themes` for light mode support
7. **CSS-only charts** — no charting library; cost bars use Tailwind + CSS transitions
8. **Adapter isolation** — every provider adapter is independent; one failure doesn't affect others

## Deployment

- **Platform**: Vercel (Hobby or Pro)
- **Cron**: Every 6 hours via `vercel.json` → `/api/cron/update-pricing`
- **Database**: PostgreSQL (local: Docker, production: Neon or Vercel Postgres)
- **Env vars**: `DATABASE_URL`, `CRON_SECRET`, `TOGETHER_API_KEY` (optional), `GROQ_API_KEY` (optional)
