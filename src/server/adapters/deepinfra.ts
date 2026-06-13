// ─── DeepInfra Adapter ──────────────────────────────────────
// DeepInfra offers low-cost inference for open-source models.
// API: https://api.deepinfra.com/v1/openai/models

import type { ProviderAdapter, NormalizedModelPricing } from "./interface";

const DEEPINFRA_CANONICAL_MAP: Record<string, string> = {
  "meta-llama/Llama-4-Scout-17B-16E-Instruct": "llama-4-scout",
  "meta-llama/Llama-4-Maverick-17B-128E-Instruct": "llama-4-maverick",
  "deepseek-ai/DeepSeek-V3": "deepseek-v3",
  "deepseek-ai/DeepSeek-R1": "deepseek-r1",
  "Qwen/Qwen2.5-Coder-32B-Instruct": "qwen-2-5-coder",
  "mistralai/Mistral-Small-24B-Instruct-2501": "mistral-small-3",
  "CohereForAI/c4ai-command-r-plus": "command-r-plus",
};

interface DeepInfraModel {
  id: string;
  pricing?: {
    input_cost_per_1k_tokens?: number;
    output_cost_per_1k_tokens?: number;
  };
}

export const deepinfraAdapter: ProviderAdapter = {
  providerSlug: "deepinfra",
  providerName: "DeepInfra",

  async fetchPricing(): Promise<NormalizedModelPricing[]> {
    const response = await fetch(
      "https://api.deepinfra.com/v1/openai/models",
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(15_000),
      },
    );

    if (!response.ok) {
      throw new Error(
        `DeepInfra API returned ${response.status}: ${response.statusText}`,
      );
    }

    const data = await response.json();
    const models: DeepInfraModel[] = data?.data ?? [];

    console.log(`[deepinfra] Fetched ${models.length} models`);

    const results: NormalizedModelPricing[] = [];

    for (const model of models) {
      const canonicalSlug = DEEPINFRA_CANONICAL_MAP[model.id];
      if (!canonicalSlug) continue;

      // DeepInfra returns pricing per 1K tokens — convert to per 1M
      const inputPricePer1k = model.pricing?.input_cost_per_1k_tokens ?? 0;
      const outputPricePer1k = model.pricing?.output_cost_per_1k_tokens ?? 0;

      if (inputPricePer1k === 0 && outputPricePer1k === 0) continue;

      results.push({
        canonicalModelSlug: canonicalSlug,
        providerModelId: model.id,
        inputPricePerMillion: inputPricePer1k * 1000,
        outputPricePerMillion: outputPricePer1k * 1000,
        cachedInputPricePerMillion: null,
        sourceUrl: `https://deepinfra.com/models/${model.id}`,
      });
    }

    console.log(`[deepinfra] Mapped ${results.length} models`);
    return results;
  },
};
