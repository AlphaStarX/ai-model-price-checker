"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, Search, X, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { SearchCommand } from "./search-command";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/models", label: "Models" },
  { href: "/providers", label: "Providers" },
  { href: "/calculator", label: "Calculator" },
  { href: "/compare", label: "Compare" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full cyber-line transition-colors",
          scrolled
            ? "border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            : "border-b border-transparent bg-background",
        )}
      >
        <div className="mx-auto flex h-12 max-w-7xl items-center gap-4 px-4 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors shrink-0"
          >
            <Terminal className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold tracking-tight font-mono">
              PriceChecker
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 text-[13px] rounded-md transition-colors",
                  pathname === link.href ||
                    pathname.startsWith(link.href + "/")
                    ? "bg-accent/20 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/10",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-3.5 w-3.5" />
              <span className="sr-only">Search</span>
            </Button>

            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:hidden text-muted-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-3.5 w-3.5" />
              ) : (
                <Menu className="h-3.5 w-3.5" />
              )}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={NAV_LINKS}
      />

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
