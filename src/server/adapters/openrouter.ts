// ─── OpenRouter Adapter ─────────────────────────────────────
// Fetches pricing from the public OpenRouter API.
// OpenRouter aggregates 200+ models from all major providers.
// No API key needed for the /models endpoint (returns pricing per token).

import type {
  ProviderAdapter,
  NormalizedModelPricing,
} from "./interface";
import { OPENROUTER_CANONICAL_MAP } from "./mappings/openrouter-mapping";

interface OpenRouterModel {
  id: string;
  name: string;
  pricing?: {
    prompt?: string;
    completion?: string;
  };
  context_length?: number;
}

export const openRouterAdapter: ProviderAdapter = {
  providerSlug: "openrouter",
  providerName: "OpenRouter",

  async fetchPricing(): Promise<NormalizedModelPricing[]> {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(
        `OpenRouter API returned ${response.status}: ${response.statusText}`,
      );
    }

    const data = await response.json();
    const models: OpenRouterModel[] = data?.data ?? [];

    if (!Array.isArray(models)) {
      throw new Error("OpenRouter API returned unexpected format");
    }

    console.log(`[openrouter] Fetched ${models.length} models`);

    const results: NormalizedModelPricing[] = [];
    const unmapped: string[] = [];

    for (const model of models) {
      const canonicalSlug = OPENROUTER_CANONICAL_MAP[model.id];

      if (!canonicalSlug) {
        unmapped.push(model.id);
        continue;
      }

      // OpenRouter pricing is in USD per token — convert to per 1M tokens
      const promptPrice = parseFloat(model.pricing?.prompt ?? "0");
      const completionPrice = parseFloat(model.pricing?.completion ?? "0");

      // Skip models with zero pricing (usually indicates unavailable model)
      if (promptPrice === 0 && completionPrice === 0) continue;

      results.push({
        canonicalModelSlug: canonicalSlug,
        providerModelId: model.id,
        inputPricePerMillion: promptPrice * 1_000_000,
        outputPricePerMillion: completionPrice * 1_000_000,
        cachedInputPricePerMillion: null, // OpenRouter pricing doesn't expose cache pricing via this endpoint
        sourceUrl: `https://openrouter.ai/models/${model.id}`,
      });
    }

    if (unmapped.length > 0) {
      console.warn(
        `[openrouter] ${unmapped.length} unmapped models:`,
        unmapped.slice(0, 10),
        unmapped.length > 10 ? `... and ${unmapped.length - 10} more` : "",
      );
    }

    console.log(
      `[openrouter] Mapped ${results.length} models to canonical slugs`,
    );
    return results;
  },
};
