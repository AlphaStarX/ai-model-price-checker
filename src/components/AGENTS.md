# Component Library & Design System

## Purpose

All React components organized by domain. UI primitives (shadcn/ui) are separated from feature components. The design system enforces consistency across the application.

## Ownership

All files in `src/components/`:
- `layout/` — App shell: Header, Footer, MobileNav, ThemeToggle, SearchCommand
- `features/models/` — Model display components
- `features/pricing/` — Pricing display components
- `features/calculator/` — Cost calculator components
- `features/filters/` — Filter UI components
- `features/providers/` — Provider display components
- `ui/` — shadcn/ui primitives (generated, customize only via theme)

## Local Contracts

- UI components are shadcn/ui — customize via `globals.css` theme tokens, not by editing generated files
- Feature components follow a consistent pattern: named export, typed props, handle all states
- Every data-display component has: default, loading (skeleton), empty, and error states
- Components are Server Components by default — add `"use client"` only when interactive state is needed
- Mobile-first: all components work at 375px width first, then scale up
- All copy supports dark mode — use semantic color tokens, never hardcoded colors

## Work Guidance

- Components are organized by domain, not by type (don't mix feature and layout components)
- Each component file exports one primary component + optional helper sub-components
- Use TypeScript interfaces for props, co-located in the same file (unless shared across files)
- Skeleton variants share the same dimensions as their content counterparts
- Use `cn()` from `@/lib/utils` for conditional class merging

## Verification

- Components render without errors in all documented prop states
- Loading skeletons display correctly during Suspense boundaries
- Empty states have clear user-facing messages
- Components are accessible: keyboard navigable, proper ARIA labels, focus management
- All interactive elements have hover, focus, and active states

## Component Inventory

### Layout (5)
`header.tsx`, `footer.tsx`, `mobile-nav.tsx`, `theme-toggle.tsx`, `search-command.tsx`

### Features — Models (6)
`model-card.tsx`, `model-grid.tsx`, `model-card-skeleton.tsx`, `model-search-input.tsx`, `model-detail-header.tsx`, `model-capabilities.tsx`

### Features — Pricing (3)
`pricing-table.tsx`, `pricing-row.tsx`, `pricing-skeleton.tsx`

### Features — Calculator (5)
`cost-calculator.tsx`, `token-input.tsx`, `cost-breakdown.tsx`, `cost-chart.tsx`, `model-selector.tsx`

### Features — Filters (3)
`filter-bar.tsx`, `filter-checkbox-group.tsx`, `filter-select.tsx`

### Features — Providers (3)
`provider-card.tsx`, `provider-grid.tsx`, `provider-status-badge.tsx`

### UI (18 shadcn/ui primitives)
`button`, `badge`, `card`, `dialog`, `command`, `popover`, `select`, `slider`, `skeleton`, `table`, `tabs`, `tooltip`, `checkbox`, `separator`, `label`, `input`, `sheet`, `sonner`

## Child DOX Index

No children — leaf node with 25 feature + 5 layout + 18 UI = 48 total components.
