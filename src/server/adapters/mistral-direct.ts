// ─── Mistral Direct Pricing (La Plateforme) ────────────────
// Curated from https://mistral.ai/products/la-plateforme#pricing

import type { ProviderAdapter, NormalizedModelPricing } from "./interface";

const MISTRAL_PRICING: NormalizedModelPricing[] = [
  { canonicalModelSlug: "mistral-large-2", providerModelId: "mistral-large-latest", inputPricePerMillion: 2.00, outputPricePerMillion: 6.00, cachedInputPricePerMillion: null, sourceUrl: "https://mistral.ai/products/la-plateforme#pricing" },
  { canonicalModelSlug: "mistral-small-3", providerModelId: "mistral-small-latest", inputPricePerMillion: 0.10, outputPricePerMillion: 0.30, cachedInputPricePerMillion: null, sourceUrl: "https://mistral.ai/products/la-plateforme#pricing" },
];

export const mistralDirectAdapter: ProviderAdapter = {
  providerSlug: "mistral-direct",
  providerName: "Mistral (Direct)",
  async fetchPricing() { console.log("[mistral-direct] Returning curated pricing"); return MISTRAL_PRICING; },
};
