# TODO

## Immediate (Next Session)

- [ ] Start Docker Desktop and run `docker compose up -d` for PostgreSQL
- [ ] Run `npx prisma migrate dev --name init` to create the initial migration
- [ ] Run `npx prisma db seed` to populate the database
- [ ] Verify `npm run dev` starts without errors
- [ ] Fix any TypeScript compilation issues with `npx tsc --noEmit`

## Phase 2: Model Directory + Detail Pages ✅

- [x] Build `/models` page: ModelGrid with search and filters
- [x] Build ModelCard component (name, developer, context window, cheapest price)
- [x] Build ModelGrid (responsive grid: 1 col mobile, 2 tablet, 3 desktop)
- [x] Build ModelDetailHeader (name, developer, release date, badges)
- [x] Build ModelCapabilities component (icon grid with labels)
- [x] Build `/models/[slug]` page: full model detail + pricing table
- [x] Build PricingTable and PricingRow components
- [x] Build FilterBar with FilterCheckboxGroup, FilterSelect
- [x] Add dynamic OG image for model pages (`opengraph-image.tsx`)
- [x] Add JSON-LD structured data to model detail pages
- [x] Add Suspense boundaries and loading skeletons

## Phase 3: Provider Adapters + Pricing Data ✅

- [x] Implement OpenRouter adapter (fetches from openrouter.ai API — public, no key)
- [x] Implement Together AI adapter (TOGETHER_API_KEY)
- [x] Implement DeepInfra adapter (public API, per-1K → per-1M conversion)
- [x] Implement Groq adapter (GROQ_API_KEY)
- [x] Implement OpenAI Direct pricing config (curated from openai.com/pricing)
- [x] Implement Anthropic Direct pricing config (curated from anthropic.com/pricing)
- [x] Implement Google Direct pricing config (curated for AI Studio)
- [x] Create canonical model name mappings for each adapter
- [x] Wire up adapter barrel + auto-registration in update job
- [x] Add pricing source URLs to model detail page

## Phase 4: Cost Calculator ✅

- [x] Build `/calculator` page with full interactivity
- [x] Build CostCalculator component (orchestrator with React Query)
- [x] Build TokenInput with preset buttons (100, 1K, 10K, 100K, 1M, 10M)
- [x] Build CostBreakdown table sorted by cheapest
- [x] Build CostChart (CSS horizontal bar, no library)
- [x] Add model selector dropdown with search (Popover + /api/search)
- [x] Wire up React Query for instant recalculation (300ms debounce)
- [x] Highlight cheapest provider prominently (emerald badge + bar)

## Phase 5: Provider Directory + Compare + Polish ✅

- [x] Build `/providers` page: ProviderGrid with status badges
- [x] Build `/providers/[slug]` page: provider detail + model list
- [x] Build ProviderCard and ProviderStatusBadge
- [x] Build `/compare` page: side-by-side model comparison (2-4 models)
- [x] Build `/about` page with project info
- [x] Mobile-first design (1 col mobile, 2 tablet, 3 desktop grids)
- [x] Error boundaries on all data pages (6 error.tsx files)
- [x] Loading skeletons on all async pages (7 loading.tsx files)

## Phase 6: Documentation + Launch Prep ✅

- [x] Finalize README.md with setup guide
- [x] Update ARCHITECTURE.md with final state (component inventory, routes, adapters)
- [x] Final DOX pass (all 10 AGENTS.md files verified current)
- [x] Create .vercelignore for production deployment
- [x] Configure vercel.json (cron, security headers, OG image caching)
- [x] Code cleanup (unused imports removed, zero type errors)
- [x] Final TypeScript verification (107 files, zero errors)

## Launch Checklist (requires Vercel account)

- [ ] Push to GitHub
- [ ] Import project to Vercel
- [ ] Set DATABASE_URL (Neon or Vercel Postgres)
- [ ] Set CRON_SECRET
- [ ] Optional: TOGETHER_API_KEY, GROQ_API_KEY
- [ ] Run `npx prisma migrate deploy` (or via build script)
- [ ] Run `npx prisma db seed`
- [ ] Enable Vercel Analytics + Speed Insights
- [ ] Lighthouse audit
- [ ] Launch 🚀

## Future Ideas

- [ ] Pricing history chart (price trends over time)
- [ ] Price drop alerts / notifications
- [ ] API endpoint for programmatic access
- [ ] Batch comparison (paste a list of models)
- [ ] Provider status page with uptime monitoring
- [ ] Community-contributed pricing corrections
- [ ] Dark/light mode toggle persistence across visits
