import * as React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Download,
  FileText,
  Printer,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Gauge,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/common/KpiCard";
import { ChartCard } from "@/components/common/ChartCard";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  KPIS,
  revenueVsCost,
  monthlyExpenses,
  utilizationTrend,
  fuelEfficiencyByType,
  regionActivity,
  vehicles,
} from "@/data";
import { formatCompact } from "@/lib/utils";

export default function Reports() {
  const { toast } = useToast();

  const netProfit = KPIS.totalRevenue - KPIS.totalCost;
  const avgEfficiency = React.useMemo(() => {
    const sum = fuelEfficiencyByType.reduce((s, f) => s + f.efficiency, 0);
    return parseFloat((sum / Math.max(1, fuelEfficiencyByType.length)).toFixed(1));
  }, []);

  // Synthetic deterministic "ROI %" for the top 6 vehicles.
  const roiData = React.useMemo(
    () =>
      vehicles.slice(0, 6).map((v, i) => ({
        name: v.name,
        roi: Math.round(v.fuelEfficiency * 10 + i),
        color: v.imageColor,
      })),
    [],
  );

  const handleExport = (fmt: "CSV" | "PDF") =>
    toast({
      title: "Report exported",
      description: `Your report was exported as ${fmt} (demo).`,
      variant: "success",
    });

  const handlePrint = () => {
    toast({
      title: "Preparing print view",
      description: "Opening the print dialog.",
      variant: "info",
    });
    window.print();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Operational & financial reporting">
        <Button variant="outline" onClick={() => handleExport("CSV")}>
          <Download /> Export CSV
        </Button>
        <Button variant="outline" onClick={() => handleExport("PDF")}>
          <FileText /> Export PDF
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer /> Print
        </Button>
      </PageHeader>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Revenue"
          value={KPIS.totalRevenue}
          prefix="$"
          icon={DollarSign}
          trend={11}
          progress={82}
          accent="emerald"
          index={0}
        />
        <KpiCard
          title="Total Cost"
          value={KPIS.totalCost}
          prefix="$"
          icon={TrendingDown}
          trend={-4}
          progress={58}
          accent="amber"
          index={1}
        />
        <KpiCard
          title="Net Profit"
          value={netProfit}
          prefix="$"
          icon={TrendingUp}
          trend={9}
          progress={64}
          accent="primary"
          index={2}
        />
        <KpiCard
          title="Fuel Efficiency"
          value={avgEfficiency}
          suffix=" km/L"
          icon={Gauge}
          trend={3}
          progress={Math.round(avgEfficiency * 8)}
          accent="violet"
          index={3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Revenue vs Cost — full width */}
        <ChartCard
          title="Revenue vs Cost"
          description="Monthly revenue, cost & profit trend"
          className="lg:col-span-2"
          index={0}
        >
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={revenueVsCost} margin={{ left: -8, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickFormatter={(v) => formatCompact(v as number)}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cost" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="profit" stroke="#2563EB" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Expense Trend */}
        <ChartCard title="Expense Trend" description="Fuel · Maintenance · Other" index={1}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyExpenses} margin={{ left: -8, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="expFuel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expMaint" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expOther" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
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
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="fuel" stackId="1" stroke="#2563EB" strokeWidth={2} fill="url(#expFuel)" />
              <Area type="monotone" dataKey="maintenance" stackId="1" stroke="#F59E0B" strokeWidth={2} fill="url(#expMaint)" />
              <Area type="monotone" dataKey="other" stackId="1" stroke="#8B5CF6" strokeWidth={2} fill="url(#expOther)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Fleet Utilization */}
        <ChartCard title="Fleet Utilization" description="Utilization vs target" index={2}>
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

        {/* Fuel Efficiency by Type */}
        <ChartCard title="Fuel Efficiency by Type" description="Average km/L per vehicle type" index={3}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={fuelEfficiencyByType} margin={{ left: -18, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
              <Bar dataKey="efficiency" radius={[4, 4, 0, 0]}>
                {fuelEfficiencyByType.map((e) => (
                  <Cell key={e.name} fill={e.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Vehicle ROI — horizontal */}
        <ChartCard title="Vehicle ROI" description="Top 6 vehicles by return on investment (%)" index={4}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={roiData} layout="vertical" margin={{ left: 8, right: 16, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} fontSize={12} width={70} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
              <Bar dataKey="roi" radius={[0, 4, 4, 0]}>
                {roiData.map((e) => (
                  <Cell key={e.name} fill={e.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue by Region */}
        <ChartCard title="Activity by Region" description="Trips completed per region" index={5}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={regionActivity} margin={{ left: -18, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="region" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
              <Bar dataKey="trips" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
