// ─── xAI Direct Pricing ────────────────────────────────────
// Curated from https://console.x.ai

import type { ProviderAdapter, NormalizedModelPricing } from "./interface";

const XAI_PRICING: NormalizedModelPricing[] = [
  { canonicalModelSlug: "grok-4-20", providerModelId: "grok-4.20-beta", inputPricePerMillion: 4.00, outputPricePerMillion: 20.00, cachedInputPricePerMillion: null, sourceUrl: "https://console.x.ai" },
  { canonicalModelSlug: "grok-3", providerModelId: "grok-3", inputPricePerMillion: 3.00, outputPricePerMillion: 15.00, cachedInputPricePerMillion: null, sourceUrl: "https://console.x.ai" },
];

export const xaiDirectAdapter: ProviderAdapter = {
  providerSlug: "xai-direct",
  providerName: "xAI (Direct)",
  async fetchPricing() { console.log("[xai-direct] Returning curated pricing"); return XAI_PRICING; },
};
