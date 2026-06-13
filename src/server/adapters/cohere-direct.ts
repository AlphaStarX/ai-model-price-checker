// ─── Cohere Direct Pricing ──────────────────────────────────
// Source: https://cohere.com/pricing
// Fetches live HTML and extracts pricing. Falls back to curated config.

import type { ProviderAdapter, NormalizedModelPricing } from "./interface";

const OFFICIAL_URL = "https://cohere.com/pricing";

const FALLBACK_PRICING: NormalizedModelPricing[] = [
  { canonicalModelSlug: "command-r-plus", providerModelId: "command-r-plus-08-2024", inputPricePerMillion: 2.50, outputPricePerMillion: 10.00, cachedInputPricePerMillion: null, sourceUrl: OFFICIAL_URL },
];

const COHERE_MODEL_MAP: Record<string, string> = {
  "command": "command-r-plus",
  "command r": "command-r-plus",
  "command r+": "command-r-plus",
  "command-r-plus": "command-r-plus",
};

async function fetchOfficialPricing(): Promise<NormalizedModelPricing[]> {
  const res = await fetch(OFFICIAL_URL, {
    headers: { Accept: "text/html" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const results: NormalizedModelPricing[] = [];

  // Cohere pricing page has model rows with $X / 1M token pattern
  const rowRegex = /<tr[^>]*>.*?<td[^>]*>([^<]+)<\/td>.*?\$([\d.]+)\s*\/\s*1M.*?\$([\d.]+)\s*\/\s*1M/gi;

  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const rawName = match[1].trim().toLowerCase();
    const inputPrice = parseFloat(match[2]);
    const outputPrice = parseFloat(match[3]);

    if (isNaN(inputPrice) || isNaN(outputPrice)) continue;

    const slug = COHERE_MODEL_MAP[rawName];
    if (!slug) continue;

    results.push({
      canonicalModelSlug: slug,
      providerModelId: rawName.replace(/\s+/g, "-"),
      inputPricePerMillion: inputPrice,
      outputPricePerMillion: outputPrice,
      cachedInputPricePerMillion: null,
      sourceUrl: OFFICIAL_URL,
    });
  }

  if (results.length === 0) throw new Error("No pricing rows parsed");
  console.log(`[cohere-direct] Scraped ${results.length} models from official page`);
  return results;
}

export const cohereDirectAdapter: ProviderAdapter = {
  providerSlug: "cohere-direct",
  providerName: "Cohere (Direct)",

  async fetchPricing(): Promise<NormalizedModelPricing[]> {
    try {
      return await fetchOfficialPricing();
    } catch (e) {
      console.warn("[cohere-direct] Scrape failed, using fallback:", (e as Error).message);
      return FALLBACK_PRICING;
    }
  },
};
