import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ collapsed = false, className }: { collapsed?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald shadow-glow">
        <Truck className="size-5 text-white" />
      </div>
      {!collapsed && (
        <div className="leading-tight">
          <p className="text-base font-extrabold tracking-tight">
            Transit<span className="text-primary">Ops</span>
          </p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Smart Transport
          </p>
        </div>
      )}
    </div>
  );
}
