// ─── API: Pricing Calculation ───────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateCost } from "@/lib/pricing-calc";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const modelSlug = searchParams.get("model");
  const inputStr = searchParams.get("input");
  const outputStr = searchParams.get("output");
  const cachedStr = searchParams.get("cached");

  if (!modelSlug || !inputStr || !outputStr) {
    return NextResponse.json(
      { error: "Missing required params: model, input, output" },
      { status: 400 },
    );
  }

  const inputTokens = parseInt(inputStr, 10);
  const outputTokens = parseInt(outputStr, 10);
  const cachedInputTokens = cachedStr ? parseInt(cachedStr, 10) : 0;

  if (isNaN(inputTokens) || isNaN(outputTokens) || isNaN(cachedInputTokens)) {
    return NextResponse.json(
      { error: "Token counts must be valid integers" },
      { status: 400 },
    );
  }

  const [pricing, model] = await Promise.all([
    prisma.pricing.findMany({
      where: { model: { slug: modelSlug } },
      select: {
        inputPricePerMillion: true,
        outputPricePerMillion: true,
        cachedInputPricePerMillion: true,
        provider: { select: { name: true, slug: true, developerId: true } },
      },
    }),
    prisma.model.findUnique({
      where: { slug: modelSlug },
      select: { developerId: true },
    }),
  ]);

  if (!pricing.length || !model) {
    return NextResponse.json(
      { error: "No pricing data found for this model" },
      { status: 404 },
    );
  }

  // Sort: total cost ASC, then official providers first on tie
  const modelDevId = model.developerId;
  const sorted = [...pricing].sort((a, b) => {
    const totalA = a.inputPricePerMillion + a.outputPricePerMillion;
    const totalB = b.inputPricePerMillion + b.outputPricePerMillion;
    if (totalA !== totalB) return totalA - totalB;
    const aOfficial = a.provider.developerId === modelDevId ? 0 : 1;
    const bOfficial = b.provider.developerId === modelDevId ? 0 : 1;
    return aOfficial - bOfficial;
  });

  const results = sorted.map((p) => {
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

  // Mark cheapest (first after sort)
  if (results.length > 0) {
    results[0].isCheapest = true;
  }

  return NextResponse.json({ results });
}
