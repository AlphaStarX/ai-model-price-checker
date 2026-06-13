// ─── Server Actions: Providers ────────────────────────────

"use server";

import { prisma } from "@/lib/prisma";
import type { ProviderSummary, ProviderDetail } from "@/types/model";

export async function getProviders(): Promise<ProviderSummary[]> {
  const providers = await prisma.provider.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      website: true,
      docsUrl: true,
      logoUrl: true,
      description: true,
      status: true,
      lastFetchedAt: true,
      _count: { select: { pricing: true } },
    },
    orderBy: { pricing: { _count: "desc" } },
  });

  return providers.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    website: p.website,
    docsUrl: p.docsUrl,
    logoUrl: p.logoUrl,
    description: p.description,
    status: p.status,
    lastFetchedAt: p.lastFetchedAt?.toISOString() ?? null,
    modelCount: p._count.pricing,
  }));
}

export async function getProviderBySlug(
  slug: string,
): Promise<ProviderDetail | null> {
  const provider = await prisma.provider.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      website: true,
      docsUrl: true,
      logoUrl: true,
      description: true,
      apiFormat: true,
      status: true,
      lastFetchedAt: true,
      consecutiveScrapeFailures: true,
      lastScrapeFailedAt: true,
      pricing: {
        select: {
          inputPricePerMillion: true,
          outputPricePerMillion: true,
          cachedInputPricePerMillion: true,
          model: {
            select: {
              slug: true,
              name: true,
              modelFamily: true,
              contextWindow: true,
            },
          },
        },
        orderBy: { model: { name: "asc" } },
      },
    },
  });

  if (!provider) return null;

  return {
    id: provider.id,
    name: provider.name,
    slug: provider.slug,
    website: provider.website,
    docsUrl: provider.docsUrl,
    logoUrl: provider.logoUrl,
    description: provider.description,
    apiFormat: provider.apiFormat,
    status: provider.status,
    lastFetchedAt: provider.lastFetchedAt?.toISOString() ?? null,
    consecutiveScrapeFailures: provider.consecutiveScrapeFailures,
    lastScrapeFailedAt: provider.lastScrapeFailedAt?.toISOString() ?? null,
    models: provider.pricing.map((p) => ({
      modelSlug: p.model.slug,
      modelName: p.model.name,
      modelFamily: p.model.modelFamily,
      contextWindow: p.model.contextWindow,
      inputPricePerMillion: p.inputPricePerMillion,
      outputPricePerMillion: p.outputPricePerMillion,
      cachedInputPricePerMillion: p.cachedInputPricePerMillion,
    })),
  };
}
