// ─── DeepSeek Direct Pricing ────────────────────────────────
// Source: https://api-docs.deepseek.com/quick_start/pricing
// Fetches live HTML and extracts pricing tables. Falls back to curated config.

import type { ProviderAdapter, NormalizedModelPricing } from "./interface";

const OFFICIAL_URL = "https://api-docs.deepseek.com/quick_start/pricing";

const FALLBACK_PRICING: NormalizedModelPricing[] = [
  { canonicalModelSlug: "deepseek-v4-flash", providerModelId: "deepseek-v4-flash", inputPricePerMillion: 0.14, outputPricePerMillion: 0.28, cachedInputPricePerMillion: 0.0028, sourceUrl: OFFICIAL_URL },
  { canonicalModelSlug: "deepseek-v4-pro", providerModelId: "deepseek-v4-pro", inputPricePerMillion: 0.435, outputPricePerMillion: 0.87, cachedInputPricePerMillion: 0.003625, sourceUrl: OFFICIAL_URL },
  { canonicalModelSlug: "deepseek-v3", providerModelId: "deepseek-chat", inputPricePerMillion: 0.14, outputPricePerMillion: 0.28, cachedInputPricePerMillion: null, sourceUrl: OFFICIAL_URL },
  { canonicalModelSlug: "deepseek-r1", providerModelId: "deepseek-reasoner", inputPricePerMillion: 0.14, outputPricePerMillion: 0.28, cachedInputPricePerMillion: null, sourceUrl: OFFICIAL_URL },
];

const DEEPSEEK_NAME_MAP: Record<string, string> = {
  "deepseek-v4-flash": "deepseek-v4-flash",
  "deepseek-v4-pro": "deepseek-v4-pro",
};

async function fetchOfficialPricing(): Promise<NormalizedModelPricing[]> {
  const res = await fetch(OFFICIAL_URL, {
    headers: { Accept: "text/html" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const results: NormalizedModelPricing[] = [];

  // DeepSeek pricing page has simple model-name → price structure
  // Look for patterns like: deepseek-v4-pro, $0.435, $0.87
  const sectionRegex = /<h[23][^>]*>\s*(deepseek-v4-\w+)\s*<\/h[23]>[\s\S]*?Input.*?\$([\d.]+)[\s\S]*?Output.*?\$([\d.]+)/gi;

  let match;
  while ((match = sectionRegex.exec(html)) !== null) {
    const modelId = match[1].trim().toLowerCase();
    const inputPrice = parseFloat(match[2]);
    const outputPrice = parseFloat(match[3]);

    if (isNaN(inputPrice) || isNaN(outputPrice)) continue;

    const slug = DEEPSEEK_NAME_MAP[modelId] || modelId;
    results.push({
      canonicalModelSlug: slug,
      providerModelId: modelId,
      inputPricePerMillion: inputPrice,
      outputPricePerMillion: outputPrice,
      cachedInputPricePerMillion: null,
      sourceUrl: OFFICIAL_URL,
    });

    // Also check for cache hit pricing in same section
    const cacheMatch = new RegExp(`cache hit.*?\\$([\\d.]+)`, "i").exec(
      html.slice(match.index, match.index + 2000),
    );
    if (cacheMatch) {
      results[results.length - 1].cachedInputPricePerMillion = parseFloat(cacheMatch[1]);
    }
  }

  if (results.length === 0) throw new Error("No pricing rows parsed");
  console.log(`[deepseek-direct] Scraped ${results.length} models from official page`);
  return results;
}

export const deepseekDirectAdapter: ProviderAdapter = {
  providerSlug: "deepseek-direct",
  providerName: "DeepSeek (Direct)",

  async fetchPricing(): Promise<NormalizedModelPricing[]> {
    try {
      return await fetchOfficialPricing();
    } catch (e) {
      console.warn("[deepseek-direct] Scrape failed, using fallback:", (e as Error).message);
      return FALLBACK_PRICING;
    }
  },
};
