// ─── Adapter Registry ───────────────────────────────────────

import type { ProviderAdapter } from "./interface";

const adapters = new Map<string, ProviderAdapter>();

/**
 * Register a provider adapter. Called by each adapter module at import time.
 */
export function registerAdapter(adapter: ProviderAdapter): void {
  adapters.set(adapter.providerSlug, adapter);
}

/**
 * Get a single adapter by provider slug.
 */
export function getAdapter(slug: string): ProviderAdapter | undefined {
  return adapters.get(slug);
}

/**
 * Get all registered adapters.
 */
export function getAllAdapters(): ProviderAdapter[] {
  return Array.from(adapters.values());
}

/**
 * Get slugs of all registered providers.
 */
export function getRegisteredProviderSlugs(): string[] {
  return Array.from(adapters.keys());
}
