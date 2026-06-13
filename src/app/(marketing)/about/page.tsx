import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Search, TrendingUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About — AI Model Price Checker",
  description:
    "AI Model Price Checker is a free, developer-focused tool for comparing AI model API pricing across every major provider.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">About</h1>

      <div className="mt-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
        <p>
          AI Model Price Checker is a free, independent tool for developers who need to
          find the cheapest AI API provider for any model. We track pricing
          across aggregators, inference platforms, and direct APIs so you can
          make informed decisions.
        </p>
        <p>
          This project is <strong>not a SaaS</strong>. It is{" "}
          <strong>not monetized</strong>. There are{" "}
          <strong>no user accounts</strong>. It exists purely to help developers
          find the best pricing.
        </p>
        <p>
          Pricing data is refreshed every 6 hours from provider APIs and
          official pricing pages. For providers without public pricing APIs, we
          maintain curated pricing configurations that are reviewed regularly.
        </p>
      </div>

      <Separator className="my-8" />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">How It Works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-4 space-y-2">
            <Search className="h-6 w-6 text-primary" />
            <h3 className="text-sm font-medium">Search</h3>
            <p className="text-xs text-muted-foreground">
              Find any AI model by name, developer, or model family.
            </p>
          </div>
          <div className="rounded-lg border border-border p-4 space-y-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h3 className="text-sm font-medium">Compare</h3>
            <p className="text-xs text-muted-foreground">
              Compare pricing across providers sorted by cheapest total cost.
            </p>
          </div>
          <div className="rounded-lg border border-border p-4 space-y-2">
            <Calculator className="h-6 w-6 text-primary" />
            <h3 className="text-sm font-medium">Calculate</h3>
            <p className="text-xs text-muted-foreground">
              Estimate exact costs with the built-in token calculator.
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Providers Tracked</h2>
        <p className="text-sm text-muted-foreground">
          We track pricing from OpenRouter, Together AI, DeepInfra, Groq,
          Fireworks AI, and direct APIs from OpenAI, Anthropic, and Google.
          More providers are added regularly.
        </p>
      </div>

      <Separator className="my-8" />

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/models"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Browse Models
        </Link>
        <Link
          href="/calculator"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Try the Calculator
        </Link>
      </div>
    </div>
  );
}
