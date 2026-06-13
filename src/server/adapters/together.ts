// ─── Together AI Adapter ────────────────────────────────────
// Together AI specializes in open-source models with competitive pricing.
// API: https://api.together.xyz/v1/models (needs TOGETHER_API_KEY env var)

import type { ProviderAdapter, NormalizedModelPricing } from "./interface";

const TOGETHER_CANONICAL_MAP: Record<string, string> = {
  "meta-llama/Llama-4-Scout-17B-16E-Instruct": "llama-4-scout",
  "meta-llama/Llama-4-Maverick-17B-128E-Instruct": "llama-4-maverick",
  "deepseek-ai/DeepSeek-V3": "deepseek-v3",
  "deepseek-ai/DeepSeek-R1": "deepseek-r1",
  "Qwen/Qwen2.5-Coder-32B-Instruct": "qwen-2-5-coder",
  "mistralai/Mistral-Small-24B-Instruct-2501": "mistral-small-3",
};

interface TogetherModel {
  id: string;
  pricing?: {
    input?: number;
    output?: number;
  };
}

export const togetherAdapter: ProviderAdapter = {
  providerSlug: "together",
  providerName: "Together AI",

  async fetchPricing(): Promise<NormalizedModelPricing[]> {
    const apiKey = process.env.TOGETHER_API_KEY;

    if (!apiKey) {
      console.warn("[together] No TOGETHER_API_KEY set — skipping API fetch");
      return [];
    }

    const response = await fetch("https://api.together.xyz/v1/models", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      throw new Error(
        `Together API returned ${response.status}: ${response.statusText}`,
      );
    }

    const models: TogetherModel[] = await response.json();
    console.log(`[together] Fetched ${models.length} models`);

    const results: NormalizedModelPricing[] = [];

    for (const model of models) {
      const canonicalSlug = TOGETHER_CANONICAL_MAP[model.id];
      if (!canonicalSlug) continue;

      const inputPrice = model.pricing?.input ?? 0;
      const outputPrice = model.pricing?.output ?? 0;

      // Together pricing is per 1M tokens already
      if (inputPrice === 0 && outputPrice === 0) continue;

      results.push({
        canonicalModelSlug: canonicalSlug,
        providerModelId: model.id,
        inputPricePerMillion: inputPrice,
        outputPricePerMillion: outputPrice,
        cachedInputPricePerMillion: null,
        sourceUrl: `https://together.ai/models/${model.id}`,
      });
    }

    console.log(`[together] Mapped ${results.length} models`);
    return results;
  },
};
