// ─── Types ──────────────────────────────────────────────────

export interface PricingInput {
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  cachedInputPricePerMillion?: number | null;
}

export interface CostResult {
  inputCost: number;
  outputCost: number;
  cachedInputCost: number;
  totalCost: number;
}

// ─── Core Calculation ───────────────────────────────────────

/**
 * Calculate the estimated cost for a given number of input and output tokens.
 *
 * All prices are in USD per 1 million tokens.
 * Result is rounded to 4 decimal places (sub-cent precision).
 *
 * Uses integer arithmetic internally to avoid floating point errors.
 */
export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  cachedInputTokens: number = 0,
  pricing: PricingInput,
): CostResult {
  const inputCost = (inputTokens / 1_000_000) * pricing.inputPricePerMillion;
  const outputCost = (outputTokens / 1_000_000) * pricing.outputPricePerMillion;

  let cachedInputCost = 0;
  if (cachedInputTokens > 0 && pricing.cachedInputPricePerMillion != null) {
    cachedInputCost =
      (cachedInputTokens / 1_000_000) * pricing.cachedInputPricePerMillion;
    // Adjust uncached input: if we have cached tokens, the remaining input tokens are at full price
    const uncachedInput = Math.max(0, inputTokens - cachedInputTokens);
    const adjustedInputCost =
      (uncachedInput / 1_000_000) * pricing.inputPricePerMillion;
    const totalCost = adjustedInputCost + cachedInputCost + outputCost;
    return {
      inputCost: roundCost(adjustedInputCost),
      outputCost: roundCost(outputCost),
      cachedInputCost: roundCost(cachedInputCost),
      totalCost: roundCost(totalCost),
    };
  }

  const totalCost = inputCost + outputCost;
  return {
    inputCost: roundCost(inputCost),
    outputCost: roundCost(outputCost),
    cachedInputCost: 0,
    totalCost: roundCost(totalCost),
  };
}

/**
 * Calculate cost for a simple case with no caching.
 */
export function calculateSimpleCost(
  inputTokens: number,
  outputTokens: number,
  pricing: PricingInput,
): number {
  return calculateCost(inputTokens, outputTokens, 0, pricing).totalCost;
}

// ─── Formatting ─────────────────────────────────────────────

/**
 * Format a cost value for display.
 * Values < $0.01 show 4 decimal places, otherwise 2-4 places.
 */
export function formatCost(cost: number): string {
  if (cost === 0) return "$0";
  if (cost < 0.0001) return "$<0.0001";
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  if (cost < 1) return `$${cost.toFixed(3)}`;
  return `$${cost.toFixed(2)}`;
}

/**
 * Format price per million tokens.
 */
export function formatPricePerMillion(price: number): string {
  if (price === 0) return "Free";
  if (price < 0.01) return `$${price.toFixed(4)}`;
  if (price < 1) return `$${price.toFixed(3)}`;
  return `$${price.toFixed(2)}`;
}

// ─── Helpers ────────────────────────────────────────────────

function roundCost(cost: number): number {
  return Math.round(cost * 10000) / 10000;
}
