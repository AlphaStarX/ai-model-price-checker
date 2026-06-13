// ─── Google Direct Pricing ──────────────────────────────────
// Source: https://ai.google.dev/pricing
// Fetches live HTML and extracts pricing tables. Falls back to curated config.

import type { ProviderAdapter, NormalizedModelPricing } from "./interface";

const OFFICIAL_URL = "https://ai.google.dev/pricing";

const FALLBACK_PRICING: NormalizedModelPricing[] = [
  { canonicalModelSlug: "gemini-3.5-flash", providerModelId: "gemini-3.5-flash", inputPricePerMillion: 1.50, outputPricePerMillion: 9.00, cachedInputPricePerMillion: null, sourceUrl: OFFICIAL_URL },
  { canonicalModelSlug: "gemini-3.1-pro", providerModelId: "gemini-3.1-pro", inputPricePerMillion: 2.00, outputPricePerMillion: 12.00, cachedInputPricePerMillion: null, sourceUrl: OFFICIAL_URL },
  { canonicalModelSlug: "gemini-2.5-pro", providerModelId: "gemini-2.5-pro", inputPricePerMillion: 1.25, outputPricePerMillion: 10.00, cachedInputPricePerMillion: null, sourceUrl: OFFICIAL_URL },
  { canonicalModelSlug: "gemini-2.5-flash", providerModelId: "gemini-2.5-flash", inputPricePerMillion: 0.30, outputPricePerMillion: 2.50, cachedInputPricePerMillion: null, sourceUrl: OFFICIAL_URL },
];

const GEMINI_NAME_MAP: Record<string, string> = {
  "gemini 3.5 flash": "gemini-3.5-flash",
  "gemini 3.1 pro": "gemini-3.1-pro",
  "gemini 2.5 pro": "gemini-2.5-pro",
  "gemini 2.5 flash": "gemini-2.5-flash",
};

async function fetchOfficialPricing(): Promise<NormalizedModelPricing[]> {
  const res = await fetch(OFFICIAL_URL, {
    headers: { Accept: "text/html" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const results: NormalizedModelPricing[] = [];

  // Match table rows with price patterns like "$1.50" or "$0.30"
  // Gemini pages use clean HTML tables
  const rowRegex = /<tr[^>]*>.*?<td[^>]*>(Gemini\s*[\d.]+[\s\w]*?(?:Flash|Pro|Flash-Lite)?)[^<]*<\/td>.*?<td[^>]*>\$?([\d.]+)\s*<\/td>.*?<td[^>]*>\$?([\d.]+)\s*<\/td>/gi;

  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const rawName = match[1].trim().toLowerCase();
    const inputPrice = parseFloat(match[2]);
    const outputPrice = parseFloat(match[3]);

    if (isNaN(inputPrice) || isNaN(outputPrice)) continue;

    const slug = GEMINI_NAME_MAP[rawName];
    if (!slug) continue; // skip models we don't track

    results.push({
      canonicalModelSlug: slug,
      providerModelId: slug,
      inputPricePerMillion: inputPrice,
      outputPricePerMillion: outputPrice,
      cachedInputPricePerMillion: null,
      sourceUrl: OFFICIAL_URL,
    });
  }

  if (results.length === 0) throw new Error("No pricing rows parsed");
  console.log(`[google-direct] Scraped ${results.length} models from official page`);
  return results;
}

export const googleDirectAdapter: ProviderAdapter = {
  providerSlug: "google-direct",
  providerName: "Google AI (Direct)",

  async fetchPricing(): Promise<NormalizedModelPricing[]> {
    try {
      return await fetchOfficialPricing();
    } catch (e) {
      console.warn("[google-direct] Scrape failed, using fallback:", (e as Error).message);
      return FALLBACK_PRICING;
    }
  },
};
