import {
  Brain,
  Eye,
  Image,
  Wrench,
  FileJson,
  Waves,
  Mic,
  Volume2,
  type LucideIcon,
} from "lucide-react";
import type { ModelDetail } from "@/types/model";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Brain,
  Eye,
  Image,
  Wrench,
  FileJson,
  Waves,
  Mic,
  Volume2,
};

interface ModelCapabilitiesProps {
  capabilities: ModelDetail["capabilities"];
  className?: string;
}

export function ModelCapabilities({
  capabilities,
  className,
}: ModelCapabilitiesProps) {
  if (capabilities.length === 0) {
    return (
      <div className={cn("space-y-3", className)}>
        <h2 className="text-lg font-semibold">Capabilities</h2>
        <p className="text-sm text-muted-foreground">
          No capability data available for this model.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <h2 className="text-lg font-semibold">Capabilities</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {capabilities.map((cap) => {
          const Icon = cap.icon ? ICON_MAP[cap.icon] : null;
          return (
            <div
              key={cap.slug}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5"
            >
              {Icon && (
                <Icon className="h-4 w-4 text-primary shrink-0" />
              )}
              <span className="text-sm font-medium">{cap.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
