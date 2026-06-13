# Routes, Layouts & Pages

## Purpose

Defines the route architecture, page components, layouts, and SEO strategy for the application. Every user-facing route originates here.

## Ownership

All files in `src/app/`:
- Route files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`)
- `sitemap.ts` — Dynamic sitemap generation
- `globals.css` — Global styles and Tailwind configuration
- `api/` — API route handlers

## Local Contracts

- Every page exports metadata (or inherits from a parent layout). No page should lack SEO metadata.
- Dynamic routes generate static params where possible (`generateStaticParams`)
- All data fetching goes through Server Actions in `src/server/actions/` — no direct Prisma calls in page files
- Every data-fetching route has a `loading.tsx` with skeleton UI
- Page components are thin orchestrators — they call Server Actions and pass data to feature components
- No business logic in page files — that belongs in `src/lib/` or `src/server/`

## Work Guidance

- New routes follow existing conventions: `page.tsx` + `layout.tsx` if needed + `loading.tsx` + `error.tsx`
- Use route groups `(group)` for shared layouts
- API routes in `api/` are for client-side fetch calls only (search, calculator, cron)
- All other data operations use Server Actions
- Route naming: kebab-case directories, `[slug]` for dynamic segments

## Verification

- `npm run build` generates valid static pages with no route errors
- `sitemap.ts` returns valid XML when accessed at `/sitemap.xml`
- Every page renders without server errors in development
- Structured data validates against schema.org

## Child DOX Index

- `models/[slug]/` — Model detail page (server component), OG image, loading + error boundaries
- `api/search/` — Instant search endpoint for Cmd+K dialog
- `api/pricing/` — Pricing calculation endpoint for calculator
- `api/models/` — Models list endpoint wrapping getModels Server Action
- `api/cron/update-pricing/` — Vercel Cron pricing update endpoint
