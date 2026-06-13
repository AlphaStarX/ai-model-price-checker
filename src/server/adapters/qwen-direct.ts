// ─── Qwen Direct Pricing (Alibaba Cloud) ───────────────────
// Curated from https://help.aliyun.com

import type { ProviderAdapter, NormalizedModelPricing } from "./interface";

const QWEN_PRICING: NormalizedModelPricing[] = [
  { canonicalModelSlug: "qwen-3-7-max", providerModelId: "qwen3-7-max", inputPricePerMillion: 1.50, outputPricePerMillion: 6.00, cachedInputPricePerMillion: null, sourceUrl: "https://help.aliyun.com/document_detail/qwen-pricing" },
  { canonicalModelSlug: "qwen-2-5-max", providerModelId: "qwen-max", inputPricePerMillion: 1.20, outputPricePerMillion: 4.80, cachedInputPricePerMillion: null, sourceUrl: "https://help.aliyun.com/document_detail/qwen-pricing" },
  { canonicalModelSlug: "qwen-2-5-coder", providerModelId: "qwen2.5-coder-32b", inputPricePerMillion: 0.20, outputPricePerMillion: 0.60, cachedInputPricePerMillion: null, sourceUrl: "https://help.aliyun.com/document_detail/qwen-pricing" },
];

export const qwenDirectAdapter: ProviderAdapter = {
  providerSlug: "qwen-direct",
  providerName: "Qwen (Direct)",
  async fetchPricing() { console.log("[qwen-direct] Returning curated pricing"); return QWEN_PRICING; },
};
