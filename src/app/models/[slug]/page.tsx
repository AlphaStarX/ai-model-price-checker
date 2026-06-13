import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getModelBySlug } from "@/server/actions/models";
import { buildModelMetadata } from "@/lib/metadata";
import { generateModelStructuredData, generateBreadcrumbStructuredData } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/constants";
import { ModelDetailHeader } from "@/components/features/models/model-detail-header";
import { ModelCapabilities } from "@/components/features/models/model-capabilities";
import { PricingTable } from "@/components/features/pricing/pricing-table";
import { Separator } from "@/components/ui/separator";
import Script from "next/script";

interface ModelPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ModelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const model = await getModelBySlug(slug);

  if (!model) {
    return { title: "Model Not Found" };
  }

  return buildModelMetadata(model);
}

export default async function ModelPage({ params }: ModelPageProps) {
  const { slug } = await params;
  const model = await getModelBySlug(slug);

  if (!model) {
    notFound();
  }

  const structuredData = generateModelStructuredData(model);
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: "Home", url: SITE_URL },
    { name: "Models", url: `${SITE_URL}/models` },
    { name: model.name, url: `${SITE_URL}/models/${model.slug}` },
  ]);

  return (
    <>
      <Script
        id="model-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Script
        id="model-breadcrumb-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header section */}
        <ModelDetailHeader model={model} />

        <Separator className="my-8" />

        {/* Capabilities */}
        <ModelCapabilities capabilities={model.capabilities} />

        <Separator className="my-8" />

        {/* Pricing table */}
        <PricingTable entries={model.pricing} />
      </div>
    </>
  );
}
