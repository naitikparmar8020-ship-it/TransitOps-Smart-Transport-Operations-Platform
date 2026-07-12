import * as React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Truck,
  Route,
  DollarSign,
  Gauge,
  RotateCcw,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/common/KpiCard";
import { ChartCard } from "@/components/common/ChartCard";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  KPIS,
  vehicleStatusPie,
  fuelConsumption,
  regionActivity,
  utilizationTrend,
  expenseByType,
  activityHeatmap,
  WEEKDAYS,
  HOUR_BUCKETS,
} from "@/data";
import { formatCompact } from "@/lib/utils";

const TYPE_OPTIONS = ["all", "Truck", "Van", "Trailer", "Pickup", "Tanker", "Bus"];
const REGION_OPTIONS = ["all", "North", "South", "East", "West", "Central"];
const RANGE_OPTIONS = ["Last 7 days", "Last 30 days", "Last 90 days", "Last 12 months"];
const STATUS_OPTIONS = ["all", "available", "on-trip", "in-shop", "retired"];

const DEFAULTS = {
  type: "all",
  region: "all",
  range: "Last 30 days",
  status: "all",
};

export default function Analytics() {
  const [type, setType] = React.useState(DEFAULTS.type);
  const [region, setRegion] = React.useState(DEFAULTS.region);
  const [range, setRange] = React.useState(DEFAULTS.range);
  const [status, setStatus] = React.useState(DEFAULTS.status);

  const reset = () => {
    setType(DEFAULTS.type);
    setRegion(DEFAULTS.region);
    setRange(DEFAULTS.range);
    setStatus(DEFAULTS.status);
  };

  const netProfit = KPIS.totalRevenue - KPIS.totalCost;

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Business intelligence & fleet insights" />

      {/* Filters */}
      <Card className="p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="size-4" /> Filters
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Vehicle Type</Label>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All Types" : t}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Region</Label>
            <Select value={region} onChange={(e) => setRegion(e.target.value)}>
              {REGION_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r === "all" ? "All Regions" : r}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select value={range} onChange={(e) => setRange(e.target.value)}>
              {RANGE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All Status" : s}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end">
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw /> Reset
          </Button>
        </div>
      </Card>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total Vehicles" value={KPIS.totalVehicles} icon={Truck} trend={5} progress={72} accent="primary" index={0} />
        <KpiCard title="Total Trips" value={KPIS.totalTrips} icon={Route} trend={12} progress={68} accent="emerald" index={1} />
        <KpiCard title="Total Revenue" value={KPIS.totalRevenue} prefix="$" icon={DollarSign} trend={9} progress={80} accent="violet" index={2} />
        <KpiCard title="Net Profit" value={netProfit} prefix="$" icon={Gauge} trend={7} progress={62} accent="amber" index={3} />
      </div>

      {/* Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold leading-none tracking-tight">Activity Heatmap</h3>
            <p className="text-sm text-muted-foreground">Trip intensity by weekday & hour bucket</p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <div className="min-w-[560px]">
              {/* Column headers */}
              <div className="mb-2 flex gap-2 pl-12">
                {HOUR_BUCKETS.map((b) => (
                  <div key={b} className="flex-1 text-center text-xs font-medium text-muted-foreground">
                    {b}
                  </div>
                ))}
              </div>
              {/* Rows */}
              <div className="space-y-2">
                {activityHeatmap.map((row) => (
                  <div key={row.day} className="flex items-center gap-2">
                    <div className="w-10 shrink-0 text-xs font-medium text-muted-foreground">{row.day}</div>
                    {row.values.map((cell) => (
                      <div
                        key={cell.bucket}
                        title={`${row.day} · ${cell.bucket} — ${cell.value}`}
                        className="flex h-10 flex-1 items-center justify-center rounded-md border border-border/40 text-[11px] font-medium transition-transform hover:scale-105"
                        style={{
                          backgroundColor: `hsl(var(--primary) / ${cell.value / 100})`,
                          color: cell.value > 55 ? "#fff" : "hsl(var(--muted-foreground))",
                        }}
                      >
                        {cell.value}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-end gap-2 text-xs text-muted-foreground">
            <span>Less</span>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((o) => (
              <span
                key={o}
                className="size-4 rounded-sm border border-border/40"
                style={{ backgroundColor: `hsl(var(--primary) / ${o})` }}
              />
            ))}
            <span>More</span>
          </div>
        </Card>
      </motion.div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Vehicle Status Pie */}
        <ChartCard title="Vehicle Status" description="Current fleet distribution" index={0}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={vehicleStatusPie}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={90}
                paddingAngle={3}
                strokeWidth={0}
              >
                {vehicleStatusPie.map((e) => (
                  <Cell key={e.name} fill={e.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Fuel Consumption Area */}
        <ChartCard title="Fuel Consumption" description="Litres consumed per month" index={1}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={fuelConsumption} margin={{ left: -8, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="anFuelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickFormatter={(v) => formatCompact(v as number)}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="liters" stroke="#10B981" strokeWidth={3} fill="url(#anFuelGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Trips / Region grouped Bar */}
        <ChartCard title="Trips by Region" description="Trips & vehicles per region" index={2}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={regionActivity} margin={{ left: -18, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="region" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="trips" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="vehicles" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Utilization Line */}
        <ChartCard title="Fleet Utilization" description="Utilization vs target" index={3}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={utilizationTrend} margin={{ left: -18, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="utilization" stroke="#2563EB" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="target" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Expense breakdown Pie — full width */}
        <ChartCard title="Expense Breakdown" description="Spend by expense type" className="lg:col-span-2" index={4}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseByType}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                paddingAngle={2}
                strokeWidth={0}
                label={(entry: { name?: string }) => entry.name ?? ""}
              >
                {expenseByType.map((e) => (
                  <Cell key={e.name} fill={e.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
