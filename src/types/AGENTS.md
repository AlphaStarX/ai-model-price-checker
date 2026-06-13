# TypeScript Type Definitions

## Purpose

Central type definitions shared across the application. All domain types (Model, Pricing, Provider, Filter) and their derived types live here.

## Ownership

- `model.ts` — Core model, pricing, provider, filter, calculator, and search types
- `pricing.ts` — Re-exports pricing-related types
- `provider.ts` — Re-exports provider-related types
- `filter.ts` — Re-exports filter-related types

## Local Contracts

- Prefer `interface` over `type` for object shapes (better error messages)
- Never use `any` — use `unknown` and narrow
- Use branded types where appropriate (e.g., distinguishing token counts from dollar amounts)
- Types must reflect the actual Prisma select shapes used in Server Actions
- String literal unions for constrained values (e.g., model families, sort options)
- All timestamp fields are strings (ISO format) in the type layer — Prisma Date objects are converted before serialization

## Work Guidance

- `model.ts` is the primary type file — add new domain types here
- Re-export files (`pricing.ts`, `provider.ts`, `filter.ts`) exist for cleaner imports
- When Prisma schema changes, update the corresponding types here
- Keep types in sync with Server Action return types

## Verification

- `npx tsc --noEmit` — All types are consistent
- No type errors in consuming files
- Types accurately reflect runtime data shapes

## Child DOX Index

No children — leaf node.
