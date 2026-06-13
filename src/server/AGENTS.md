# Server Actions, Adapters & Jobs

## Purpose

Server-side business logic boundary. Contains all Server Actions (data access), provider adapters (external API integration), and scheduled jobs (pricing updates).

## Ownership

- `actions/` — Server Actions for data operations (models, pricing, providers, search, calculator)
- `adapters/` — Provider adapter interface, registry, and individual provider implementations
- `jobs/` — Scheduled job orchestrators (pricing updates, model metadata refresh)

## Local Contracts

### Server Actions
- Use `"use server"` directive at the top of each file
- Return typed results — never throw to the client
- Use Prisma select to fetch exactly the fields needed (no over-fetching)
- Handle errors gracefully: catch, log, return null or typed error state

### Provider Adapters
- Must implement the `ProviderAdapter` interface from `adapters/interface.ts`
- Code to the interface, never to a specific adapter implementation
- Adapters are PURE DATA FETCHERS: they fetch and normalize, they do NOT write to the database
- Jobs handle all database writes
- Every adapter has a 25-second effective timeout (enforced by the update job)
- Individual adapter failures must not crash the update job for other adapters

### Jobs
- `update-all-pricing.ts` is the main orchestrator
- Each adapter is called independently with error isolation
- Price changes are recorded in PricingHistory before updating Pricing

## Work Guidance
- New adapters follow the existing pattern: implement `ProviderAdapter`, call `registerAdapter()` at import time
- Adapter canonical name mappings go in a `mappings/` subdirectory per adapter
- Server Actions are grouped by domain (models, pricing, providers)
- Jobs are called from cron endpoints or manually via `/api/cron/`

## Verification
- Every adapter returns data matching `NormalizedModelPricing[]`
- Update job logs summary: updated/added/unchanged/errors counts
- Server Actions return data in expected shape (verify with TypeScript types)
- Manual pricing update via `npm run update:pricing` works without errors

## Current Adapters

| Adapter | File | Type | Auth |
|---|---|---|---|
| OpenRouter | `adapters/openrouter.ts` | Live API fetch | Public (no key) |
| Together AI | `adapters/together.ts` | Live API fetch | TOGETHER_API_KEY |
| DeepInfra | `adapters/deepinfra.ts` | Live API fetch | Public |
| Groq | `adapters/groq.ts` | Live API fetch | GROQ_API_KEY |
| OpenAI Direct | `adapters/openai-direct.ts` | Curated config | None |
| Anthropic Direct | `adapters/anthropic-direct.ts` | Curated config | None |
| Google Direct | `adapters/google-direct.ts` | Curated config | None |

## Child DOX Index

- `adapters/mappings/` — Canonical model name mapping files per adapter
