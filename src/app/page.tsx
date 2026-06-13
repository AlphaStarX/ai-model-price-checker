import Link from "next/link";
import { ArrowRight, Calculator, Layers, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero — terminal-style */}
      <section className="relative scan-lines border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-24 sm:py-32 lg:py-40 text-center">
          {/* Terminal prompt */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 mb-8">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">
              free & open · no accounts · no fees
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            AI Model
            <br />
            <span className="text-primary">Price Checker</span>
          </h1>

          <p className="mt-6 text-base text-muted-foreground sm:text-lg max-w-xl mx-auto font-mono">
            $ compare-ai-pricing --model gpt-5.4 --tokens 1M
          </p>
          <p className="mt-2 text-sm text-muted-foreground/60 max-w-lg mx-auto">
            Compare real-time API pricing across 15 providers.
            Find the cheapest way to run any model.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              href="/models"
              className={cn(
                "inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5",
                "text-sm font-medium text-primary-foreground",
                "hover:bg-primary/90 transition-colors",
                "shadow-[0_0_20px_-5px_oklch(0.7_0.15_185/0.3)]",
              )}
            >
              Browse Models
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-card transition-colors"
            >
              <Calculator className="h-4 w-4" />
              Open Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* Quick stats */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: "36", label: "Models Tracked" },
              { value: "15", label: "Providers" },
              { value: "11", label: "Developers" },
              { value: "Daily", label: "Price Updates" },
            ].map((stat) => (
              <div key={stat.label} className="text-center space-y-1">
                <div className="text-2xl font-bold font-mono text-primary tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — clean, icon-led, no marketing fluff */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          <Link
            href="/models"
            className="group rounded-lg border border-border bg-card p-6 hover:border-primary/40 transition-all duration-200 cyber-line"
          >
            <Search className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold text-sm mb-1">Search Models</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Find any model by name, developer, or capability. Press{" "}
              <kbd className="px-1 py-0.5 rounded text-[10px] border border-border bg-muted font-mono">
                ⌘K
              </kbd>{" "}
              to jump anywhere.
            </p>
          </Link>

          <Link
            href="/calculator"
            className="group rounded-lg border border-border bg-card p-6 hover:border-primary/40 transition-all duration-200 cyber-line"
          >
            <Calculator className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold text-sm mb-1">Calculate Costs</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enter token counts, see estimated cost across every provider.
              Updates instantly.
            </p>
          </Link>

          <Link
            href="/compare"
            className="group rounded-lg border border-border bg-card p-6 hover:border-primary/40 transition-all duration-200 cyber-line"
          >
            <Layers className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold text-sm mb-1">Compare Models</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Side-by-side pricing comparison. Pick 2–4 models and see who
              offers the best deal.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
