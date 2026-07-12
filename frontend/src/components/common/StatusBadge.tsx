import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Variant = ComponentProps<typeof Badge>["variant"];

const MAP: Record<string, { label: string; variant: Variant; dot: string }> = {
  // vehicle
  available: { label: "Available", variant: "emerald", dot: "bg-emerald" },
  "on-trip": { label: "On Trip", variant: "default", dot: "bg-primary" },
  "in-shop": { label: "In Shop", variant: "amber", dot: "bg-amber-500" },
  retired: { label: "Retired", variant: "gray", dot: "bg-muted-foreground" },
  // driver
  "off-duty": { label: "Off Duty", variant: "gray", dot: "bg-muted-foreground" },
  suspended: { label: "Suspended", variant: "red", dot: "bg-destructive" },
  // trip / maintenance
  draft: { label: "Draft", variant: "gray", dot: "bg-muted-foreground" },
  dispatched: { label: "Dispatched", variant: "default", dot: "bg-primary" },
  completed: { label: "Completed", variant: "emerald", dot: "bg-emerald" },
  cancelled: { label: "Cancelled", variant: "red", dot: "bg-destructive" },
  scheduled: { label: "Scheduled", variant: "default", dot: "bg-primary" },
  "in-progress": { label: "In Progress", variant: "amber", dot: "bg-amber-500" },
  // documents
  valid: { label: "Valid", variant: "emerald", dot: "bg-emerald" },
  expiring: { label: "Expiring", variant: "amber", dot: "bg-amber-500" },
  expired: { label: "Expired", variant: "red", dot: "bg-destructive" },
  // users
  active: { label: "Active", variant: "emerald", dot: "bg-emerald" },
  inactive: { label: "Inactive", variant: "gray", dot: "bg-muted-foreground" },
  approved: { label: "Approved", variant: "emerald", dot: "bg-emerald" },
  pending: { label: "Pending", variant: "amber", dot: "bg-amber-500" },
};

export function StatusBadge({ status }: { status: string }) {
  const cfg = MAP[status] ?? { label: status, variant: "gray" as Variant, dot: "bg-muted-foreground" };
  return (
    <Badge variant={cfg.variant}>
      <span className={cn("size-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </Badge>
  );
}
