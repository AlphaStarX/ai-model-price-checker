import type { Metadata } from "next";
import { getProviders } from "@/server/actions/providers";
import { ProviderGrid } from "@/components/features/providers/provider-grid";

export const metadata: Metadata = {
  title: "AI API Providers — Compare LLM Platforms",
  description:
    "Browse AI API providers including OpenRouter, Together, DeepInfra, Groq, and direct APIs from OpenAI, Anthropic, and Google. Compare pricing and supported models.",
};

export default async function ProvidersPage() {
  const providers = await getProviders();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          API Providers
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Platforms that serve AI models. Compare pricing, supported models, and
          documentation.
        </p>
      </div>

      <ProviderGrid providers={providers} />
    </div>
  );
}
