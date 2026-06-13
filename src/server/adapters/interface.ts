// ─── Provider Adapter Interface ─────────────────────────────

/**
 * Normalized pricing data returned by every provider adapter.
 * All prices in USD per 1 million tokens.
 */
export interface NormalizedModelPricing {
  /** Canonical model slug in our database */
  canonicalModelSlug: string;
  /** Provider-specific model ID (e.g., "anthropic/claude-3.5-sonnet") */
  providerModelId: string;
  /** USD per 1M input tokens */
  inputPricePerMillion: number;
  /** USD per 1M output tokens */
  outputPricePerMillion: number;
  /** USD per 1M cached input tokens (null if not supported by provider) */
  cachedInputPricePerMillion: number | null;
  /** URL to the pricing source for verification */
  sourceUrl: string;
}

/**
 * Optional: Normalized model metadata (for providers that also expose model info).
 */
export interface NormalizedModelMetadata {
  canonicalModelSlug: string;
  providerModelId: string;
  contextWindow: number | null;
  maxOutputTokens: number | null;
  description: string | null;
}

/**
 * Every provider adapter must implement this interface.
 *
 * Adapters are PURE DATA FETCHERS. They fetch and normalize data from
 * external APIs or config files. They do NOT write to the database.
 * The update job handles all database writes.
 */
export interface ProviderAdapter {
  /** Unique provider slug matching Provider.slug in the database */
  readonly providerSlug: string;

  /** Human-readable name for logging */
  readonly providerName: string;

  /** Fetch all pricing data for this provider */
  fetchPricing(): Promise<NormalizedModelPricing[]>;

  /** Optional: Fetch model metadata (descriptions, context windows) */
  fetchModelMetadata?(): Promise<NormalizedModelMetadata[]>;

  /** Optional: Check if the provider API is reachable */
  healthCheck?(): Promise<{ ok: boolean; latencyMs: number }>;
}
