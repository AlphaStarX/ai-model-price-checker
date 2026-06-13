import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            <span className="font-mono text-primary">AI Model Price Checker</span>{" "}
            — free & open. Not affiliated with any AI provider.
          </p>

          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <Link href="/models" className="hover:text-foreground transition-colors">
              Models
            </Link>
            <Link href="/providers" className="hover:text-foreground transition-colors">
              Providers
            </Link>
            <Link href="/calculator" className="hover:text-foreground transition-colors">
              Calculator
            </Link>
            <Link href="/compare" className="hover:text-foreground transition-colors">
              Compare
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
