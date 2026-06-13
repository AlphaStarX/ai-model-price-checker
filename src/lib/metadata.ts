import type { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "./constants";

interface BuildMetadataParams {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: "website" | "article";
  publishedTime?: string;
}

/**
 * Build consistent metadata for any page.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  type = "website",
  publishedTime,
}: BuildMetadataParams): Metadata {
  const url = `${SITE_URL}${path}`;
  const imageUrl = ogImage ?? `${SITE_URL}/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title,
      description,
      url,
      images: [{ url: imageUrl }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

/**
 * Build metadata for a model detail page.
 */
export function buildModelMetadata(model: {
  name: string;
  slug: string;
  developer: { name: string };
  contextWindow: number | null;
  description: string | null;
  pricing: { inputPricePerMillion: number; provider: { name: string } }[];
}): Metadata {
  const cheapest = model.pricing[0];
  const priceText = cheapest
    ? `$${cheapest.inputPricePerMillion}/M input via ${cheapest.provider.name}`
    : "Compare pricing";

  const description =
    model.description ??
    `Compare ${model.name} API pricing across providers. Context: ${
      model.contextWindow?.toLocaleString() ?? "N/A"
    } tokens.`;

  return buildMetadata({
    title: `${model.name} Pricing & API Providers`,
    description: `${model.name} by ${model.developer.name}. ${priceText}. ${description}`,
    path: `/models/${model.slug}`,
    ogImage: `/models/${model.slug}/opengraph-image`,
    publishedTime: undefined,
  });
}
