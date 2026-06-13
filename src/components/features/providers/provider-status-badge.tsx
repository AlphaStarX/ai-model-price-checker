import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProviderStatusBadgeProps {
  status: string;
  className?: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active: {
    label: "Active",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  degraded: {
    label: "Degraded",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  down: {
    label: "Down",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

export function ProviderStatusBadge({
  status,
  className,
}: ProviderStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] py-0 px-1.5 font-medium uppercase tracking-wider",
        config.className,
        className,
      )}
    >
      {config.label}
    </Badge>
  );
}
