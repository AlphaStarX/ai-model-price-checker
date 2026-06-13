import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Models Directory — Compare LLM Pricing",
  description:
    "Browse and compare AI model API pricing across every major provider. Filter by model family, developer, context window, and capabilities.",
};

export default function ModelsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
