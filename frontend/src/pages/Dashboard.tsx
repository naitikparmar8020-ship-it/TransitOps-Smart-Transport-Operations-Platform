import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
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
  Truck,
  CheckCircle2,
  Wrench,
  Archive,
  Route,
  Clock,
  Users,
  Gauge,
  Plus,
  UserPlus,
  MapPin,
  Fuel,
  FileBarChart,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/common/KpiCard";
import { ChartCard } from "@/components/common/ChartCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  fleetStats,
  utilizationTrend,
  tripsOverview,
  fuelConsumption,
  vehicleStatusPie,
  monthlyExpenses,
  trips,
  maintenance,
  expenses,
  vehicleById,
  driverById,
} from "@/data";
import { formatCurrency, formatDate } from "@/lib/utils";

const quickActions = [
  { label: "Add Vehicle", icon: Plus, to: "/app/vehicles", accent: "bg-primary/10 text-primary" },
  { label: "Add Driver", icon: UserPlus, to: "/app/drivers", accent: "bg-emerald/10 text-emerald" },
  { label: "Create Trip", icon: MapPin, to: "/app/trips", accent: "bg-violet-500/10 text-violet-500" },
  { label: "Maintenance", icon: Wrench, to: "/app/maintenance", accent: "bg-amber-500/10 text-amber-500" },
  { label: "Fuel Entry", icon: Fuel, to: "/app/fuel", accent: "bg-cyan-500/10 text-cyan-500" },
  { label: "Generate Report", icon: FileBarChart, to: "/app/reports", accent: "bg-pink-500/10 text-pink-500" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const recentTrips = trips.slice(0, 6);
  const latestMaintenance = maintenance.slice(0, 5);
  const latestExpenses = expenses.slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Fleet operations overview — live metrics & activity">
        <Button variant="outline" onClick={() => navigate("/app/reports")}>
          <FileBarChart /> Reports
        </Button>
        <Button variant="gradient" onClick={() => navigate("/app/trips")}>
          <Plus /> Create Trip
        </Button>
      </PageHeader>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Active Vehicles" value={fleetStats.active} icon={Truck} trend={8} progress={70} accent="primary" index={0} />
        <KpiCard title="Available Vehicles" value={fleetStats.available} icon={CheckCircle2} trend={4} progress={55} accent="emerald" index={1} />
        <KpiCard title="In Maintenance" value={fleetStats.inShop} icon={Wrench} trend={-2} progress={20} accent="amber" index={2} />
        <KpiCard title="Retired Vehicles" value={fleetStats.retired} icon={Archive} trend={0} progress={12} accent="violet" index={3} />
        <KpiCard title="Active Trips" value={fleetStats.activeTrips} icon={Route} trend={12} progress={64} accent="primary" index={4} />
        <KpiCard title="Pending Trips" value={fleetStats.pendingTrips} icon={Clock} trend={-5} progress={30} accent="amber" index={5} />
        <KpiCard title="Drivers On Duty" value={fleetStats.driversOnDuty} icon={Users} trend={6} progress={48} accent="emerald" index={6} />
        <KpiCard title="Fleet Utilization" value={fleetStats.utilization} suffix="%" icon={Gauge} trend={9} progress={fleetStats.utilization} accent="violet" index={7} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Fleet Utilization" description="Monthly utilization vs target" className="lg:col-span-2" index={0}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={utilizationTrend} margin={{ left: -18, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="utilization" stroke="#2563EB" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="target" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Vehicle Status" description="Current fleet distribution" index={1}>
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
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Trips Overview" description="Completed vs dispatched vs cancelled" index={0}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={tripsOverview} margin={{ left: -18, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
              <Bar dataKey="completed" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="dispatched" stackId="a" fill="#2563EB" />
              <Bar dataKey="cancelled" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fuel Consumption" description="Litres consumed per month" index={1}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={fuelConsumption} margin={{ left: -18, right: 8 }}>
              <defs>
                <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="liters" stroke="#10B981" strokeWidth={3} fill="url(#fuelGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Expenses" description="Fuel · Maintenance · Other" index={2}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyExpenses} margin={{ left: -18, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
              <Bar dataKey="fuel" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="maintenance" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="other" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {quickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.to)}
                className="group flex flex-col items-center gap-2 rounded-xl border p-4 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-card"
              >
                <div className={`flex size-11 items-center justify-center rounded-xl ${a.accent} transition-transform group-hover:scale-110`}>
                  <a.icon className="size-5" />
                </div>
                <span className="text-center text-xs font-medium">{a.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent trips */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Recent Trips</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate("/app/trips")}>
            View all <ArrowRight className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Trip</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTrips.map((t) => (
                <TableRow key={t.id} className="cursor-pointer" onClick={() => navigate(`/app/trips/${t.id}`)}>
                  <TableCell className="font-medium">{t.code}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {t.source} → {t.destination}
                  </TableCell>
                  <TableCell>{vehicleById(t.vehicleId)?.name}</TableCell>
                  <TableCell>{driverById(t.driverId)?.name}</TableCell>
                  <TableCell>{t.distanceKm} km</TableCell>
                  <TableCell>
                    <StatusBadge status={t.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Latest maintenance + expenses */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Latest Maintenance</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/app/maintenance")}>
              View all <ArrowRight className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {latestMaintenance.map((m) => (
              <div key={m.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                  <Wrench className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.issue}</p>
                  <p className="text-xs text-muted-foreground">
                    {vehicleById(m.vehicleId)?.name} · {m.mechanic}
                  </p>
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Latest Expenses</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/app/expenses")}>
              View all <ArrowRight className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {latestExpenses.map((e) => (
              <div key={e.id} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileBarChart className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{e.notes}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.type} · {formatDate(e.date)}
                  </p>
                </div>
                <span className="text-sm font-semibold">{formatCurrency(e.amount)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
