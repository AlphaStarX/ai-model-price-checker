// ─── Model ──────────────────────────────────────────────────

export interface ModelSummary {
  id: string;
  name: string;
  slug: string;
  developer: {
    name: string;
    slug: string;
  };
  modelFamily: string | null;
  contextWindow: number | null;
  capabilities: { slug: string; label: string }[];
  pricingCount: number;
  cheapestPrice: number | null;
}

export interface ModelDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  contextWindow: number | null;
  maxOutputTokens: number | null;
  releaseDate: string | null;
  isExperimental: boolean;
  isOpenSource: boolean;
  modelFamily: string | null;
  paramSize: string | null;
  developer: {
    name: string;
    slug: string;
    website: string | null;
  };
  capabilities: {
    slug: string;
    label: string;
    icon: string | null;
    metadata: Record<string, unknown> | null;
  }[];
  pricing: PricingEntry[];
}

// ─── Pricing ────────────────────────────────────────────────

export interface PricingEntry {
  id: string;
  provider: {
    name: string;
    slug: string;
    logoUrl: string | null;
    status: string;
  };
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  cachedInputPricePerMillion: number | null;
  sourceUrl: string | null;
  lastVerifiedAt: string;
}

// ─── Provider ───────────────────────────────────────────────

export interface ProviderSummary {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  docsUrl: string | null;
  logoUrl: string | null;
  description: string | null;
  status: string;
  lastFetchedAt: string | null;
  modelCount: number;
}

export interface ProviderDetail {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  docsUrl: string | null;
  logoUrl: string | null;
  description: string | null;
  apiFormat: string | null;
  status: string;
  lastFetchedAt: string | null;
  consecutiveScrapeFailures: number;
  lastScrapeFailedAt: string | null;
  models: ProviderModelEntry[];
}

export interface ProviderModelEntry {
  modelSlug: string;
  modelName: string;
  modelFamily: string | null;
  contextWindow: number | null;
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  cachedInputPricePerMillion: number | null;
}

// ─── Filter ─────────────────────────────────────────────────

export interface FilterState {
  query: string;
  modelFamilies: string[];
  developers: string[];
  contextWindowRange: [number, number];
  capabilities: string[];
  sort: FilterSort;
}

export type FilterSort =
  | "name"
  | "contextWindow"
  | "releaseDate"
  | "cheapestPrice";

export interface FilterOptions {
  modelFamilies: { value: string; label: string; count: number }[];
  developers: { value: string; label: string; count: number }[];
  contextWindowRange: { min: number; max: number };
  capabilities: { value: string; label: string; count: number }[];
}

// ─── Calculator ─────────────────────────────────────────────

export interface CalculatorResult {
  providerName: string;
  providerSlug: string;
  inputCost: number;
  outputCost: number;
  cachedInputCost: number;
  totalCost: number;
  isCheapest: boolean;
}

// ─── Search ─────────────────────────────────────────────────

export interface SearchResult {
  type: "model" | "provider";
  slug: string;
  name: string;
  subtitle: string;
}
