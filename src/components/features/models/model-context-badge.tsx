import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ModelContextBadgeProps {
  contextWindow: number;
  className?: string;
}

function formatContextWindow(tokens: number): string {
  if (tokens >= 1_000_000) {
    const millions = tokens / 1_000_000;
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
  }
  if (tokens >= 1_000) {
    const thousands = tokens / 1_000;
    return `${thousands}K`;
  }
  return tokens.toLocaleString();
}

function getContextTier(tokens: number): "small" | "medium" | "large" | "massive" {
  if (tokens >= 1_000_000) return "massive";
  if (tokens >= 200_000) return "large";
  if (tokens >= 32_000) return "medium";
  return "small";
}

const tierStyles: Record<string, string> = {
  massive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  large: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  small: "bg-muted text-muted-foreground border-border",
};

export function ModelContextBadge({ contextWindow, className }: ModelContextBadgeProps) {
  const tier = getContextTier(contextWindow);

  return (
    <Badge
      variant="outline"
      className={cn("font-mono text-xs font-medium", tierStyles[tier], className)}
    >
      {formatContextWindow(contextWindow)} ctx
    </Badge>
  );
}
