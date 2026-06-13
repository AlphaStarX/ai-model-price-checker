# Shared Utilities & Business Logic

## Purpose

Pure business logic with no React or database dependencies. These functions are the intellectual core of the application — pricing calculations, search, metadata generation, and constants.

## Ownership

- `prisma.ts` — Prisma client singleton (the one exception: depends on Prisma)
- `utils.ts` — General utilities (cn() for Tailwind class merging)
- `pricing-calc.ts` — Core cost calculation engine
- `search.ts` — Client-side fuzzy search
- `metadata.ts` — SEO metadata builders
- `structured-data.ts` — JSON-LD structured data generators
- `constants.ts` — Application constants (model families, capabilities, presets)
- `filters.ts` — Filter state serialization/deserialization

## Local Contracts

- Pure functions only — no side effects, no database access, no React imports (except prisma.ts)
- Price calculations use division by 1,000,000 with rounding to 4 decimal places
- No floating-point accumulation errors: calculate then round once
- Search is client-side fuzzy matching against an in-memory index — no external search service
- Constants are the single source of truth for model families, capability slugs, token presets
- Metadata builders produce consistent Open Graph + Twitter card data

## Work Guidance

- Add new model families or capabilities to `constants.ts` first, then seed the database
- When adding a utility, consider: is it pure? does it belong in a Server Action instead?
- Keep utils focused: one file per domain
- Price formatting functions live in `pricing-calc.ts` since they're tightly coupled to the calculation

## Verification

- Unit-testable: functions take input, return output, no mocking needed (except prisma.ts)
- Price calculation: `calculateSimpleCost(1000, 1000, {inputPricePerMillion: 0.15, outputPricePerMillion: 0.60})` equals `0.00075` exactly
- Metadata builds valid Next.js Metadata objects
- Structured data validates against schema.org

## Child DOX Index

No children — leaf node.
