// ─── Anthropic Direct Pricing ───────────────────────────────
// Source: https://platform.claude.com/docs/en/docs/about-claude/pricing
// Fetches live HTML and extracts pricing tables. Falls back to curated config.

import type { ProviderAdapter, NormalizedModelPricing } from "./interface";

const OFFICIAL_URL = "https://platform.claude.com/docs/en/docs/about-claude/pricing";

// Fallback curated config (updated June 2026)
const FALLBACK_PRICING: NormalizedModelPricing[] = [
  { canonicalModelSlug: "claude-fable-5", providerModelId: "claude-fable-5", inputPricePerMillion: 10.00, outputPricePerMillion: 50.00, cachedInputPricePerMillion: 1.00, sourceUrl: OFFICIAL_URL },
  { canonicalModelSlug: "claude-mythos-preview", providerModelId: "claude-mythos-5", inputPricePerMillion: 10.00, outputPricePerMillion: 50.00, cachedInputPricePerMillion: 1.00, sourceUrl: OFFICIAL_URL },
  { canonicalModelSlug: "claude-opus-4-8", providerModelId: "claude-opus-4-8", inputPricePerMillion: 5.00, outputPricePerMillion: 25.00, cachedInputPricePerMillion: 0.50, sourceUrl: OFFICIAL_URL },
  { canonicalModelSlug: "claude-opus-4-6", providerModelId: "claude-opus-4-6", inputPricePerMillion: 5.00, outputPricePerMillion: 25.00, cachedInputPricePerMillion: 0.50, sourceUrl: OFFICIAL_URL },
  { canonicalModelSlug: "claude-sonnet-4-6", providerModelId: "claude-sonnet-4-6", inputPricePerMillion: 3.00, outputPricePerMillion: 15.00, cachedInputPricePerMillion: 0.30, sourceUrl: OFFICIAL_URL },
  { canonicalModelSlug: "claude-haiku-4-5", providerModelId: "claude-haiku-4-5", inputPricePerMillion: 1.00, outputPricePerMillion: 5.00, cachedInputPricePerMillion: 0.10, sourceUrl: OFFICIAL_URL },
  { canonicalModelSlug: "claude-opus-4-5", providerModelId: "claude-opus-4-5", inputPricePerMillion: 5.00, outputPricePerMillion: 25.00, cachedInputPricePerMillion: 0.50, sourceUrl: OFFICIAL_URL },
];

function modelNameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

async function fetchOfficialPricing(): Promise<NormalizedModelPricing[]> {
  const res = await fetch(OFFICIAL_URL, {
    headers: { Accept: "text/html" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  // Parse pricing table: find rows with $ / MTok pattern
  const results: NormalizedModelPricing[] = [];
  const rowRegex = /<tr[^>]*>.*?<td[^>]*>(.*?)<\/td>.*?<td[^>]*>\$([\d.]+)\s*\/\s*MTok<\/td>.*?<td[^>]*>\$([\d.]+)\s*\/\s*MTok<\/td>.*?<td[^>]*>\$([\d.]+)\s*\/\s*MTok<\/td>.*?<td[^>]*>\$([\d.]+)\s*\/\s*MTok<\/td>.*?<td[^>]*>\$([\d.]+)\s*\/\s*MTok<\/td>/gi;

  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const rawName = match[1].replace(/<[^>]+>/g, "").trim();
    const inputPrice = parseFloat(match[2]);      // Base input
    const cacheHitPrice = parseFloat(match[5]);    // Cache hits (5th column)
    const outputPrice = parseFloat(match[6]);      // Output (6th column)

    if (!rawName || isNaN(inputPrice) || isNaN(outputPrice)) continue;

    const slug = modelNameToSlug(rawName);
    results.push({
      canonicalModelSlug: slug,
      providerModelId: slug,
      inputPricePerMillion: inputPrice,
      outputPricePerMillion: outputPrice,
      cachedInputPricePerMillion: isNaN(cacheHitPrice) ? null : cacheHitPrice,
      sourceUrl: OFFICIAL_URL,
    });
  }

  if (results.length === 0) throw new Error("No pricing rows parsed");
  console.log(`[anthropic-direct] Scraped ${results.length} models from official page`);
  return results;
}

export const anthropicDirectAdapter: ProviderAdapter = {
  providerSlug: "anthropic-direct",
  providerName: "Anthropic (Direct)",

  async fetchPricing(): Promise<NormalizedModelPricing[]> {
    try {
      return await fetchOfficialPricing();
    } catch (e) {
      console.warn("[anthropic-direct] Scrape failed, using fallback:", (e as Error).message);
      return FALLBACK_PRICING;
    }
  },
};
