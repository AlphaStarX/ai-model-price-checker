// ─── OpenAI Direct Pricing ──────────────────────────────────
// Source: https://developers.openai.com/api/docs/pricing (fetched June 2026)
// Standard tier, short context pricing shown

import type { ProviderAdapter, NormalizedModelPricing } from "./interface";

const OPENAI_PRICING: NormalizedModelPricing[] = [
  // GPT-5.5 (latest, June 2026)
  { canonicalModelSlug: "gpt-5.5", providerModelId: "gpt-5.5", inputPricePerMillion: 5.00, outputPricePerMillion: 30.00, cachedInputPricePerMillion: 0.50, sourceUrl: "https://developers.openai.com/api/docs/pricing" },
  // GPT-5.4 series
  { canonicalModelSlug: "gpt-5.4", providerModelId: "gpt-5.4", inputPricePerMillion: 2.50, outputPricePerMillion: 15.00, cachedInputPricePerMillion: 0.25, sourceUrl: "https://developers.openai.com/api/docs/pricing" },
  { canonicalModelSlug: "gpt-5.4-mini", providerModelId: "gpt-5.4-mini", inputPricePerMillion: 0.75, outputPricePerMillion: 4.50, cachedInputPricePerMillion: 0.075, sourceUrl: "https://developers.openai.com/api/docs/pricing" },
  { canonicalModelSlug: "gpt-5.4-nano", providerModelId: "gpt-5.4-nano", inputPricePerMillion: 0.20, outputPricePerMillion: 1.25, cachedInputPricePerMillion: 0.02, sourceUrl: "https://developers.openai.com/api/docs/pricing" },
  // o-series reasoning
  { canonicalModelSlug: "o3", providerModelId: "o3", inputPricePerMillion: 2.00, outputPricePerMillion: 8.00, cachedInputPricePerMillion: null, sourceUrl: "https://developers.openai.com/api/docs/pricing" },
  { canonicalModelSlug: "o4-mini", providerModelId: "o4-mini", inputPricePerMillion: 1.10, outputPricePerMillion: 4.40, cachedInputPricePerMillion: null, sourceUrl: "https://developers.openai.com/api/docs/pricing" },
  // GPT-4.1 series (previous gen, 1M context)
  { canonicalModelSlug: "gpt-4.1", providerModelId: "gpt-4.1", inputPricePerMillion: 2.00, outputPricePerMillion: 8.00, cachedInputPricePerMillion: null, sourceUrl: "https://developers.openai.com/api/docs/pricing" },
  { canonicalModelSlug: "gpt-4.1-mini", providerModelId: "gpt-4.1-mini", inputPricePerMillion: 0.40, outputPricePerMillion: 1.60, cachedInputPricePerMillion: null, sourceUrl: "https://developers.openai.com/api/docs/pricing" },
  { canonicalModelSlug: "gpt-4.1-nano", providerModelId: "gpt-4.1-nano", inputPricePerMillion: 0.10, outputPricePerMillion: 0.40, cachedInputPricePerMillion: null, sourceUrl: "https://developers.openai.com/api/docs/pricing" },
];

export const openaiDirectAdapter: ProviderAdapter = {
  providerSlug: "openai-direct",
  providerName: "OpenAI (Direct)",
  async fetchPricing() { console.log("[openai-direct] Returning official pricing"); return OPENAI_PRICING; },
};
