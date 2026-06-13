import type { Model, Developer, Capability } from "@prisma/client";

/**
 * Generate JSON-LD structured data for a model detail page.
 * Schema: SoftwareApplication with offers.
 */
export function generateModelStructuredData(model: {
  name: string;
  slug: string;
  description: string | null;
  developer: { name: string; website: string | null };
  pricing: {
    inputPricePerMillion: number;
    outputPricePerMillion: number;
    provider: { name: string; website?: string | null };
  }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: model.name,
    description: model.description ?? `${model.name} AI model pricing comparison`,
    applicationCategory: "AIApplication",
    operatingSystem: "Web",
    offers: model.pricing.map((p) => ({
      "@type": "Offer",
      name: `${model.name} via ${p.provider.name}`,
      price: p.inputPricePerMillion.toString(),
      priceCurrency: "USD",
      unitText: "per 1M input tokens",
      seller: {
        "@type": "Organization",
        name: p.provider.name,
        url: p.provider.website,
      },
    })),
    author: {
      "@type": "Organization",
      name: model.developer.name,
      url: model.developer.website,
    },
  };
}

/**
 * Generate JSON-LD structured data for the model directory page.
 * Schema: ItemList of SoftwareApplication.
 */
export function generateModelListStructuredData(
  models: { name: string; slug: string; description: string | null }[],
  siteUrl: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: models.map((model, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: model.name,
        description: model.description ?? `${model.name} AI model`,
        url: `${siteUrl}/models/${model.slug}`,
      },
    })),
  };
}

/**
 * Generate breadcrumb structured data.
 */
export function generateBreadcrumbStructuredData(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
