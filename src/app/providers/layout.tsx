import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI API Providers — Compare LLM Platforms",
  description:
    "Browse AI API providers. Compare pricing, supported models, and documentation links.",
};

export default function ProvidersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
