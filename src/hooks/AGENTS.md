# Client-Side Hooks

## Purpose

React hooks for client-side state management, browser APIs, and shared interactive behavior.

## Local Contracts

- All hooks are client-side only (`"use client"`)
- Follow React hook naming conventions: `use[Name]`
- Always include cleanup for subscriptions and event listeners
- Debounced values must cancel on unmount
- Media query hooks must respond to changes, not just initial value

## Work Guidance

- Hooks should be focused and composable — one concern per hook
- Prefer `useCallback` and `useMemo` only when profiling shows a need
- Export the hook type alongside the hook for consumers that need it

## Verification

- Hooks work correctly in Strict Mode (no double-mount issues)
- Cleanup functions prevent memory leaks
- SSR-safe: hooks don't access `window`/`document` without guard

## Child DOX Index

No children — leaf node.
