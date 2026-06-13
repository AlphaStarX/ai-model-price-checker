import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-foreground hover:opacity-80"
            >
              AI Model Price Checker
            </Link>
            <p className="text-xs text-muted-foreground">
              Compare AI model API pricing across every major provider.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link
              href="/models"
              className="hover:text-foreground transition-colors"
            >
              Models
            </Link>
            <Link
              href="/providers"
              className="hover:text-foreground transition-colors"
            >
              Providers
            </Link>
            <Link
              href="/calculator"
              className="hover:text-foreground transition-colors"
            >
              Calculator
            </Link>
            <Link
              href="/compare"
              className="hover:text-foreground transition-colors"
            >
              Compare
            </Link>
            <Link
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              About
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AI Model Price Checker. Not affiliated with
            any AI provider.
          </p>
        </div>
      </div>
    </footer>
  );
}
