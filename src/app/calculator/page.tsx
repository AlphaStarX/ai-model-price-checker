import type { Metadata } from "next";
import { CostCalculator } from "@/components/features/calculator/cost-calculator";

export const metadata: Metadata = {
  title: "LLM Cost Calculator — Estimate AI API Costs",
  description:
    "Calculate estimated AI API costs across every provider. Enter input and output tokens, compare pricing instantly. Find the cheapest provider for any model.",
};

export default function CalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Cost Calculator
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Estimate API costs across every provider. Pick a model, enter your
          token counts, and see exact pricing.
        </p>
      </div>

      <CostCalculator />
    </div>
  );
}
