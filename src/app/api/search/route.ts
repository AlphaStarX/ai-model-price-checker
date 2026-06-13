// ─── API: Search ───────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  // When query provided: search with limit
  if (q && q.length >= 1) {
    const [models, providers] = await Promise.all([
      prisma.model.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { developer: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
        select: {
          slug: true,
          name: true,
          developer: { select: { name: true } },
          modelFamily: true,
        },
        take: 8,
      }),
      prisma.provider.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        },
        select: {
          slug: true,
          name: true,
          description: true,
          _count: { select: { pricing: true } },
        },
        take: 3,
      }),
    ]);

    const results = [
      ...models.map((m) => ({
        type: "model" as const,
        slug: m.slug,
        name: m.name,
        subtitle: `${m.developer.name}${m.modelFamily ? ` · ${m.modelFamily}` : ""}`,
      })),
      ...providers.map((p) => ({
        type: "provider" as const,
        slug: p.slug,
        name: p.name,
        subtitle: `${p._count.pricing} models`,
      })),
    ];

    return NextResponse.json({ results });
  }

  // No query: return ALL models for dropdowns
  const models = await prisma.model.findMany({
    select: {
      slug: true,
      name: true,
      developer: { select: { name: true } },
      modelFamily: true,
    },
    orderBy: { name: "asc" },
    take: 100,
  });

  return NextResponse.json({
    results: models.map((m) => ({
      type: "model" as const,
      slug: m.slug,
      name: m.name,
      subtitle: `${m.developer.name}${m.modelFamily ? ` · ${m.modelFamily}` : ""}`,
    })),
  });
}
