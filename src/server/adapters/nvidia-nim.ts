// ─── NVIDIA NIM Pricing ─────────────────────────────────────
// Curated from https://build.nvidia.com/pricing
// NVIDIA NIM hosts optimized open-weight models on NVIDIA GPUs.

import type { ProviderAdapter, NormalizedModelPricing } from "./interface";

const NVIDIA_PRICING: NormalizedModelPricing[] = [
  { canonicalModelSlug: "llama-4-scout", providerModelId: "meta/llama-4-scout", inputPricePerMillion: 0.10, outputPricePerMillion: 0.40, cachedInputPricePerMillion: null, sourceUrl: "https://build.nvidia.com/pricing" },
  { canonicalModelSlug: "llama-4-maverick", providerModelId: "meta/llama-4-maverick", inputPricePerMillion: 0.25, outputPricePerMillion: 0.80, cachedInputPricePerMillion: null, sourceUrl: "https://build.nvidia.com/pricing" },
  { canonicalModelSlug: "deepseek-v4-pro", providerModelId: "deepseek/deepseek-v4-pro", inputPricePerMillion: 0.45, outputPricePerMillion: 0.90, cachedInputPricePerMillion: null, sourceUrl: "https://build.nvidia.com/pricing" },
  { canonicalModelSlug: "mistral-large-2", providerModelId: "mistralai/mistral-large", inputPricePerMillion: 2.00, outputPricePerMillion: 6.00, cachedInputPricePerMillion: null, sourceUrl: "https://build.nvidia.com/pricing" },
  { canonicalModelSlug: "qwen-2-5-coder", providerModelId: "qwen/qwen2.5-coder-32b", inputPricePerMillion: 0.12, outputPricePerMillion: 0.35, cachedInputPricePerMillion: null, sourceUrl: "https://build.nvidia.com/pricing" },
];

export const nvidiaNimAdapter: ProviderAdapter = {
  providerSlug: "nvidia-nim",
  providerName: "NVIDIA NIM",
  async fetchPricing() { console.log("[nvidia-nim] Returning curated pricing"); return NVIDIA_PRICING; },
};
