import type { TooltipProps } from "recharts";

export function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-xs shadow-xl">
      {label && <p className="mb-1 font-semibold text-foreground">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span
            className="size-2 rounded-full"
            style={{ background: (p.color as string) || "hsl(var(--primary))" }}
          />
          <span className="capitalize text-muted-foreground">{p.name}:</span>
          <span className="font-medium text-foreground">
            {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}
