// ─── Moonshot AI Direct Pricing ─────────────────────────────
// Curated from https://platform.moonshot.cn

import type { ProviderAdapter, NormalizedModelPricing } from "./interface";

const MOONSHOT_PRICING: NormalizedModelPricing[] = [
  { canonicalModelSlug: "kimi-k2-5", providerModelId: "kimi-k2-5", inputPricePerMillion: 1.50, outputPricePerMillion: 6.00, cachedInputPricePerMillion: null, sourceUrl: "https://platform.moonshot.cn/pricing" },
  { canonicalModelSlug: "kimi-k2", providerModelId: "kimi-k2", inputPricePerMillion: 0.80, outputPricePerMillion: 3.20, cachedInputPricePerMillion: null, sourceUrl: "https://platform.moonshot.cn/pricing" },
];

export const moonshotDirectAdapter: ProviderAdapter = {
  providerSlug: "moonshot-direct",
  providerName: "Moonshot (Direct)",
  async fetchPricing() { console.log("[moonshot-direct] Returning curated pricing"); return MOONSHOT_PRICING; },
};
