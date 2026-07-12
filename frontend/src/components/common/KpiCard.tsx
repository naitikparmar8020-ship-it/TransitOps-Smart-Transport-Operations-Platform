import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AnimatedCounter } from "./AnimatedCounter";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  progress?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  accent?: "primary" | "emerald" | "amber" | "violet";
  index?: number;
}

const accents = {
  primary: { text: "text-primary", bg: "bg-primary/10", bar: "bg-primary" },
  emerald: { text: "text-emerald", bg: "bg-emerald/10", bar: "bg-emerald" },
  amber: { text: "text-amber-500", bg: "bg-amber-500/10", bar: "bg-amber-500" },
  violet: { text: "text-violet-500", bg: "bg-violet-500/10", bar: "bg-violet-500" },
};

export function KpiCard({
  title,
  value,
  icon: Icon,
  trend,
  progress,
  suffix,
  prefix,
  decimals = 0,
  accent = "primary",
  index = 0,
}: KpiCardProps) {
  const a = accents[accent];
  const up = (trend ?? 0) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Card className="kpi-gradient group relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">
              <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
            </p>
          </div>
          <div className={cn("rounded-xl p-2.5 transition-transform group-hover:scale-110", a.bg)}>
            <Icon className={cn("size-5", a.text)} />
          </div>
        </div>

        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
                up ? "bg-emerald/10 text-emerald" : "bg-destructive/10 text-destructive",
              )}
            >
              {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {Math.abs(trend)}%
            </span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        )}

        {progress !== undefined && (
          <Progress value={progress} className="mt-4 h-1.5" indicatorClassName={a.bar} />
        )}
      </Card>
    </motion.div>
  );
}
