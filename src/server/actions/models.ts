// ─── Server Actions: Models ────────────────────────────────

"use server";

import { prisma } from "@/lib/prisma";
import type {
  ModelSummary,
  ModelDetail,
  FilterOptions,
} from "@/types/model";
import { MODELS_PER_PAGE } from "@/lib/constants";
import { Prisma } from "@prisma/client";

export async function getModels({
  query,
  modelFamilies,
  developers,
  contextWindowMin,
  contextWindowMax,
  capabilities,
  sort = "name",
  page = 1,
}: {
  query?: string;
  modelFamilies?: string[];
  developers?: string[];
  contextWindowMin?: number;
  contextWindowMax?: number;
  capabilities?: string[];
  sort?: "name" | "contextWindow" | "releaseDate" | "cheapestPrice";
  page?: number;
}): Promise<{ models: ModelSummary[]; total: number; filterOptions: FilterOptions }> {
  const where: Prisma.ModelWhereInput = {};

  // Text search
  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
      { developer: { name: { contains: query, mode: "insensitive" } } },
    ];
  }

  // Filters
  if (modelFamilies?.length) {
    where.modelFamily = { in: modelFamilies };
  }
  if (developers?.length) {
    where.developer = { slug: { in: developers } };
  }
  if (contextWindowMin != null || contextWindowMax != null) {
    where.contextWindow = {
      ...(contextWindowMin != null ? { gte: contextWindowMin } : {}),
      ...(contextWindowMax != null ? { lte: contextWindowMax } : {}),
    };
  }
  if (capabilities?.length) {
    where.capabilities = {
      some: {
        capability: {
          slug: { in: capabilities },
        },
      },
    };
  }

  // Sort
  let orderBy: Prisma.ModelOrderByWithRelationInput;
  switch (sort) {
    case "contextWindow":
      orderBy = { contextWindow: "desc" };
      break;
    case "releaseDate":
      orderBy = { releaseDate: "desc" };
      break;
    case "cheapestPrice":
      orderBy = { pricing: { _count: "desc" } }; // fallback sort
      break;
    default:
      orderBy = { name: "asc" };
  }

  const [models, total, familyAgg, developerAgg, capabilityAgg, contextStats] =
    await Promise.all([
      prisma.model.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          modelFamily: true,
          contextWindow: true,
          developer: { select: { name: true, slug: true } },
          capabilities: {
            select: {
              capability: { select: { slug: true, label: true } },
            },
          },
          pricing: {
            select: {
              inputPricePerMillion: true,
              outputPricePerMillion: true,
            },
          },
          _count: { select: { pricing: true } },
        },
        orderBy,
        skip: (page - 1) * MODELS_PER_PAGE,
        take: MODELS_PER_PAGE,
      }),
      prisma.model.count({ where }),
      prisma.model.groupBy({
        by: ["modelFamily"],
        where: { modelFamily: { not: null } },
        _count: true,
      }),
      prisma.model.groupBy({
        by: ["developerId"],
        _count: true,
      }),
      prisma.modelCapability.groupBy({
        by: ["capabilityId"],
        _count: true,
      }),
      prisma.model.aggregate({
        _min: { contextWindow: true },
        _max: { contextWindow: true },
      }),
    ]);

  // Get developer names for filter
  const developerIds = developerAgg.map((d) => d.developerId);
  const developerNames = await prisma.developer.findMany({
    where: { id: { in: developerIds } },
    select: { id: true, name: true, slug: true },
  });

  // Get capability names for filter
  const capabilityIds = capabilityAgg.map((c) => c.capabilityId);
  const capabilityNames = await prisma.capability.findMany({
    where: { id: { in: capabilityIds } },
    select: { id: true, slug: true, label: true },
  });

  const modelSummaries: ModelSummary[] = models.map((m) => {
    const cheapest = m.pricing.reduce(
      (min, p) => Math.min(min, p.inputPricePerMillion + p.outputPricePerMillion),
      Infinity,
    );
    return {
      id: m.id,
      name: m.name,
      slug: m.slug,
      developer: m.developer,
      modelFamily: m.modelFamily,
      contextWindow: m.contextWindow,
      capabilities: m.capabilities.map((c) => c.capability),
      pricingCount: m._count.pricing,
      cheapestPrice: cheapest === Infinity ? null : cheapest,
    };
  });

  return {
    models: modelSummaries,
    total,
    filterOptions: {
      modelFamilies: familyAgg
        .filter((f) => f.modelFamily != null)
        .map((f) => ({
          value: f.modelFamily!,
          label: f.modelFamily!,
          count: f._count,
        }))
        .sort((a, b) => b.count - a.count),
      developers: developerNames
        .map((d) => ({
          value: d.slug,
          label: d.name,
          count: developerAgg.find((a) => a.developerId === d.id)?._count ?? 0,
        }))
        .sort((a, b) => b.count - a.count),
      contextWindowRange: {
        min: contextStats._min.contextWindow ?? 0,
        max: contextStats._max.contextWindow ?? 2_000_000,
      },
      capabilities: capabilityNames
        .map((c) => ({
          value: c.slug,
          label: c.label,
          count: capabilityAgg.find((a) => a.capabilityId === c.id)?._count ?? 0,
        }))
        .sort((a, b) => b.count - a.count),
    },
  };
}

export async function getModelBySlug(
  slug: string,
): Promise<ModelDetail | null> {
  const model = await prisma.model.findUnique({
    where: { slug },
    select: {
      id: true,
      developerId: true,
      name: true,
      slug: true,
      description: true,
      contextWindow: true,
      maxOutputTokens: true,
      releaseDate: true,
      isExperimental: true,
      isOpenSource: true,
      modelFamily: true,
      paramSize: true,
      developer: {
        select: { name: true, slug: true, website: true },
      },
      capabilities: {
        select: {
          capability: {
            select: { slug: true, label: true, icon: true },
          },
          metadata: true,
        },
      },
      pricing: {
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
        // Fetch unsorted — we sort in JS with official-first tiebreaker
      },
    },
  });

  if (!model) return null;

  return {
    id: model.id,
    name: model.name,
    slug: model.slug,
    description: model.description,
    contextWindow: model.contextWindow,
    maxOutputTokens: model.maxOutputTokens,
    releaseDate: model.releaseDate?.toISOString() ?? null,
    isExperimental: model.isExperimental,
    isOpenSource: model.isOpenSource,
    modelFamily: model.modelFamily,
    paramSize: model.paramSize,
    developer: model.developer,
    capabilities: model.capabilities.map((c) => ({
      slug: c.capability.slug,
      label: c.capability.label,
      icon: c.capability.icon,
      metadata: c.metadata as Record<string, unknown> | null,
    })),
    pricing: [...model.pricing]
      .sort((a, b) => {
        // Primary: total price (input + output)
        const totalA = a.inputPricePerMillion + a.outputPricePerMillion;
        const totalB = b.inputPricePerMillion + b.outputPricePerMillion;
        if (totalA !== totalB) return totalA - totalB;
        // Tiebreaker: official/direct providers first
        const aOfficial = a.provider.developerId === model.developerId ? 0 : 1;
        const bOfficial = b.provider.developerId === model.developerId ? 0 : 1;
        return aOfficial - bOfficial;
      })
      .map((p) => ({
        id: p.id,
        provider: p.provider,
        inputPricePerMillion: p.inputPricePerMillion,
        outputPricePerMillion: p.outputPricePerMillion,
        cachedInputPricePerMillion: p.cachedInputPricePerMillion,
        sourceUrl: p.sourceUrl,
        lastVerifiedAt: p.lastVerifiedAt.toISOString(),
      })),
  };
}

export async function getSearchIndex(): Promise<
  { type: "model"; slug: string; name: string; subtitle: string }[]
> {
  const models = await prisma.model.findMany({
    select: {
      slug: true,
      name: true,
      developer: { select: { name: true } },
      modelFamily: true,
    },
    orderBy: { name: "asc" },
  });

  return models.map((m) => ({
    type: "model" as const,
    slug: m.slug,
    name: m.name,
    subtitle: `${m.developer.name}${m.modelFamily ? ` · ${m.modelFamily}` : ""}`,
  }));
}
