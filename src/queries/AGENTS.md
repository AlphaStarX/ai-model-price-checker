# React Query Configuration

## Purpose

React Query key factories, default options, and fetcher functions for client-side data management.

## Local Contracts

- Use query key factories following `[domain, ...params]` pattern
- Default stale time: 60 seconds (pricing changes are infrequent)
- No automatic refetch on window focus (avoids unnecessary API calls)
- Fetchers call Server Actions or API routes — never Prisma directly
- Error retry: 1 attempt with exponential backoff

## Work Guidance

- Group queries by domain: models, pricing, providers
- Use `queryOptions` from React Query v5 for type-safe query definitions
- Prefetch data server-side when possible (use `dehydrate`/`HydrationBoundary`)

## Verification

- Query keys are unique per domain
- Fetchers return correctly typed data
- Cache invalidation works: mutating data clears affected queries

## Child DOX Index

No children — leaf node.
