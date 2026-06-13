import Link from "next/link";
import { ArrowRight, Calculator, Search, TrendingUp } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-4 py-24 sm:py-32 lg:py-40 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Find the{" "}
            <span className="text-primary">Cheapest AI API</span> Provider
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            Compare real-time pricing for GPT, Claude, Gemini, Llama, and more
            across every major provider. No accounts. No fees. Just data.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/models"
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
            >
              Browse Models
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/calculator"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-full sm:w-auto",
              )}
            >
              <Calculator className="mr-2 h-4 w-4" />
              Cost Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold sm:text-3xl">18+</div>
              <div className="text-sm text-muted-foreground">
                Models Tracked
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold sm:text-3xl">8+</div>
              <div className="text-sm text-muted-foreground">Providers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold sm:text-3xl">9+</div>
              <div className="text-sm text-muted-foreground">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold sm:text-3xl">Real-time</div>
              <div className="text-sm text-muted-foreground">Pricing Data</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3 rounded-lg border border-border p-6">
            <Search className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Instant Search</h3>
            <p className="text-sm text-muted-foreground">
              Search across all models and providers instantly. Press Cmd+K to
              jump anywhere.
            </p>
          </div>
          <div className="space-y-3 rounded-lg border border-border p-6">
            <Calculator className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Cost Calculator</h3>
            <p className="text-sm text-muted-foreground">
              Enter your token counts and see estimated costs across every
              provider. Updates instantly.
            </p>
          </div>
          <div className="space-y-3 rounded-lg border border-border p-6">
            <TrendingUp className="h-8 w-8 text-primary" />
            <h3 className="font-semibold">Price Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Prices are refreshed every 6 hours. See historical changes and
              spot the best deals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
