// ─── Server Actions: Pricing ───────────────────────────────

"use server";

import { prisma } from "@/lib/prisma";
import { calculateCost } from "@/lib/pricing-calc";
import type { CalculatorResult } from "@/types/model";

export async function getPricingForModel(modelSlug: string) {
  const [pricing, model] = await Promise.all([
    prisma.pricing.findMany({
      where: { model: { slug: modelSlug } },
      select: {
        id: true,
        inputPricePerMillion: true,
        outputPricePerMillion: true,
        cachedInputPricePerMillion: true,
        sourceUrl: true,
        lastVerifiedAt: true,
        provider: {
          select: { name: true, slug: true, logoUrl: true, status: true, developerId: true },
        },
      },
    }),
    prisma.model.findUnique({ where: { slug: modelSlug }, select: { developerId: true } }),
  ]);

  // Sort: total price ASC, official-first on tie
  const modelDevId = model?.developerId;
  const sorted = [...pricing].sort((a, b) => {
    const totalA = a.inputPricePerMillion + a.outputPricePerMillion;
    const totalB = b.inputPricePerMillion + b.outputPricePerMillion;
    if (totalA !== totalB) return totalA - totalB;
    const aOfficial = a.provider.developerId === modelDevId ? 0 : 1;
    const bOfficial = b.provider.developerId === modelDevId ? 0 : 1;
    return aOfficial - bOfficial;
  });

  return sorted.map((p) => ({
    id: p.id,
    provider: p.provider,
    inputPricePerMillion: p.inputPricePerMillion,
    outputPricePerMillion: p.outputPricePerMillion,
    cachedInputPricePerMillion: p.cachedInputPricePerMillion,
    sourceUrl: p.sourceUrl,
    lastVerifiedAt: p.lastVerifiedAt.toISOString(),
  }));
}

export async function calculatePricing(
  modelSlug: string,
  inputTokens: number,
  outputTokens: number,
  cachedInputTokens: number = 0,
): Promise<CalculatorResult[]> {
  const pricing = await prisma.pricing.findMany({
    where: { model: { slug: modelSlug } },
    select: {
      inputPricePerMillion: true,
      outputPricePerMillion: true,
      cachedInputPricePerMillion: true,
      provider: { select: { name: true, slug: true } },
    },
  });

  const results = pricing.map((p) => {
    const cost = calculateCost(inputTokens, outputTokens, cachedInputTokens, {
      inputPricePerMillion: p.inputPricePerMillion,
      outputPricePerMillion: p.outputPricePerMillion,
      cachedInputPricePerMillion: p.cachedInputPricePerMillion,
    });

    return {
      providerName: p.provider.name,
      providerSlug: p.provider.slug,
      inputCost: cost.inputCost,
      outputCost: cost.outputCost,
      cachedInputCost: cost.cachedInputCost,
      totalCost: cost.totalCost,
      isCheapest: false,
    };
  });

  // Sort by total cost and mark cheapest
  results.sort((a, b) => a.totalCost - b.totalCost);
  if (results.length > 0) {
    results[0].isCheapest = true;
  }

  return results;
}

export async function getCheapestProviderForModel(modelSlug: string) {
  const pricing = await prisma.pricing.findFirst({
    where: { model: { slug: modelSlug } },
    orderBy: [
      { inputPricePerMillion: "asc" },
      { outputPricePerMillion: "asc" },
    ],
    select: {
      inputPricePerMillion: true,
      outputPricePerMillion: true,
      provider: { select: { name: true, slug: true } },
    },
  });

  if (!pricing) return null;

  return {
    providerName: pricing.provider.name,
    providerSlug: pricing.provider.slug,
    inputPricePerMillion: pricing.inputPricePerMillion,
    outputPricePerMillion: pricing.outputPricePerMillion,
  };
}
