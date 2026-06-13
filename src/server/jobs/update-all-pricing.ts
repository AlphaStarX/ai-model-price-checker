// ─── Pricing Update Orchestrator ────────────────────────────

"use server";

import { prisma } from "@/lib/prisma";
// Side-effect: registers all adapters
import "@/server/adapters/index";
import { getAllAdapters } from "@/server/adapters/registry";
import type { NormalizedModelPricing } from "@/server/adapters/interface";

interface UpdateResult {
  updated: number;
  added: number;
  unchanged: number;
  errors: { provider: string; message: string }[];
}

/**
 * Fetch pricing from all registered adapters and upsert into the database.
 * Each adapter runs independently — one failure does not affect others.
 * Runs with a 25-second timeout per adapter.
 */
export async function updateAllPricing(): Promise<UpdateResult> {
  const result: UpdateResult = {
    updated: 0,
    added: 0,
    unchanged: 0,
    errors: [],
  };

  const adapters = getAllAdapters();

  if (adapters.length === 0) {
    console.warn("[update-pricing] No adapters registered. Skipping.");
    return result;
  }

  console.log(`[update-pricing] Starting update for ${adapters.length} providers`);

  for (const adapter of adapters) {
    try {
      console.log(`[update-pricing] Fetching from ${adapter.providerName}...`);

      // 25-second timeout per adapter
      const pricingData = await Promise.race([
        adapter.fetchPricing(),
        new Promise<NormalizedModelPricing[]>((_, reject) =>
          setTimeout(
            () => reject(new Error("Timeout after 25s")),
            25_000,
          ),
        ),
      ]);

      let providerUpdated = 0;
      let providerAdded = 0;
      let providerUnchanged = 0;

      for (const entry of pricingData) {
        // Resolve canonical slug to model ID
        const model = await prisma.model.findUnique({
          where: { slug: entry.canonicalModelSlug },
          select: { id: true },
        });

        if (!model) {
          // Model not in our database yet — log and skip
          console.debug(
            `[update-pricing] Unknown model: ${entry.canonicalModelSlug}`,
          );
          continue;
        }

        const provider = await prisma.provider.findUnique({
          where: { slug: adapter.providerSlug },
          select: { id: true },
        });

        if (!provider) {
          console.warn(
            `[update-pricing] Provider not found: ${adapter.providerSlug}`,
          );
          continue;
        }

        await prisma.$transaction(async (tx) => {
          const existing = await tx.pricing.findUnique({
            where: {
              modelId_providerId: {
                modelId: model.id,
                providerId: provider.id,
              },
            },
            select: {
              id: true,
              inputPricePerMillion: true,
              outputPricePerMillion: true,
              cachedInputPricePerMillion: true,
            },
          });

          if (existing) {
            // Check if price changed
            const changed =
              existing.inputPricePerMillion !== entry.inputPricePerMillion ||
              existing.outputPricePerMillion !== entry.outputPricePerMillion ||
              existing.cachedInputPricePerMillion !== entry.cachedInputPricePerMillion;

            if (changed) {
              // Record history first
              await tx.pricingHistory.create({
                data: {
                  pricingId: existing.id,
                  inputPricePerMillion: existing.inputPricePerMillion,
                  outputPricePerMillion: existing.outputPricePerMillion,
                  cachedInputPricePerMillion:
                    existing.cachedInputPricePerMillion,
                },
              });

              // Update pricing
              await tx.pricing.update({
                where: { id: existing.id },
                data: {
                  inputPricePerMillion: entry.inputPricePerMillion,
                  outputPricePerMillion: entry.outputPricePerMillion,
                  cachedInputPricePerMillion:
                    entry.cachedInputPricePerMillion,
                  sourceUrl: entry.sourceUrl,
                  lastVerifiedAt: new Date(),
                },
              });

              providerUpdated++;
            } else {
              // Touch lastVerifiedAt only
              await tx.pricing.update({
                where: { id: existing.id },
                data: { lastVerifiedAt: new Date() },
              });
              providerUnchanged++;
            }
          } else {
            // New pricing entry
            await tx.pricing.create({
              data: {
                modelId: model.id,
                providerId: provider.id,
                inputPricePerMillion: entry.inputPricePerMillion,
                outputPricePerMillion: entry.outputPricePerMillion,
                cachedInputPricePerMillion: entry.cachedInputPricePerMillion,
                source: "api",
                sourceUrl: entry.sourceUrl,
              },
            });
            providerAdded++;
          }
        });
      }

      // Update provider — success: reset failure counter
      await prisma.provider.update({
        where: { slug: adapter.providerSlug },
        data: {
          lastFetchedAt: new Date(),
          status: "active",
          consecutiveScrapeFailures: 0,
          lastScrapeFailedAt: null,
        },
      });

      console.log(
        `[update-pricing] ${adapter.providerName}: +${providerAdded} ~${providerUpdated} =${providerUnchanged}`,
      );

      result.updated += providerUpdated;
      result.added += providerAdded;
      result.unchanged += providerUnchanged;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      console.error(
        `[update-pricing] Error fetching from ${adapter.providerName}:`,
        message,
      );
      result.errors.push({ provider: adapter.providerSlug, message });

      // Increment failure counter, degrade if 3+ consecutive failures
      try {
        const provider = await prisma.provider.findUnique({
          where: { slug: adapter.providerSlug },
          select: { consecutiveScrapeFailures: true },
        });
        const failures = (provider?.consecutiveScrapeFailures ?? 0) + 1;

        await prisma.provider.update({
          where: { slug: adapter.providerSlug },
          data: {
            status: failures >= 3 ? "degraded" : undefined,
            consecutiveScrapeFailures: failures,
            lastScrapeFailedAt: new Date(),
          },
        });
      } catch {
        // Provider might not exist yet
      }
    }
  }

  console.log(
    `[update-pricing] Complete: +${result.added} ~${result.updated} =${result.unchanged}, ${result.errors.length} errors`,
  );

  return result;
}
