# AI Model Price Checker

Find the cheapest AI API provider. Compare real-time pricing for GPT, Claude, Gemini, Llama, DeepSeek, and more across every major provider.

**Free. No accounts. No monetization. Just data.**

## Features

- **Model Search** — Instantly search across 18+ models. Press Cmd+K to jump anywhere.
- **Provider Comparison** — See input/output token pricing from OpenRouter, Together, DeepInfra, Groq, and more.
- **Cost Calculator** — Enter token counts, see exact costs across every provider.
- **Model Directory** — Browse all models with filters by family, developer, context window, and capabilities.
- **Provider Directory** — See which models each provider supports with documentation links.
- **Dark Mode** — Clean, neutral dark design with excellent readability.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **State**: React Query (TanStack)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- Docker Desktop (for local PostgreSQL)
- npm

### Setup

```bash
# Install dependencies
npm install

# Start PostgreSQL
docker compose up -d

# Run migrations
npx prisma migrate dev --name init

# Seed the database
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `CRON_SECRET` — Secret for Vercel Cron endpoint authentication
- `NEXT_PUBLIC_SITE_URL` — Public URL (for SEO metadata)

## Project Structure

```
src/
├── app/           # Next.js App Router pages and API routes
├── components/    # React components (layout, features, ui)
├── lib/           # Business logic (pricing calc, search, metadata)
├── server/        # Server Actions, provider adapters, jobs
├── hooks/         # Client-side React hooks
├── queries/       # React Query configuration
└── types/         # TypeScript type definitions
```

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full architecture documentation.

## License

MIT
