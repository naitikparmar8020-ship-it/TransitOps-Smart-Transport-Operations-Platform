import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Plus,
  Search,
  Download,
  Fuel as FuelIcon,
  DollarSign,
  Gauge,
  ListChecks,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/common/KpiCard";
import { ChartCard } from "@/components/common/ChartCard";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { fuelLogs as seed, vehicles, vehicleById, fuelConsumption, fuelEfficiencyByType } from "@/data";
import type { FuelLog } from "@/types";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";

function efficiencyVariant(eff: number): "emerald" | "amber" | "red" {
  if (eff >= 8) return "emerald";
  if (eff >= 5) return "amber";
  return "red";
}

export default function Fuel() {
  const { toast } = useToast();
  const [data] = React.useState<FuelLog[]>(seed);
  const [query, setQuery] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const perPage = 8;

  const totalLiters = data.reduce((s, f) => s + f.liters, 0);
  const totalCost = data.reduce((s, f) => s + f.cost, 0);
  const avgEfficiency = data.length
    ? data.reduce((s, f) => s + f.efficiency, 0) / data.length
    : 0;

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    return data.filter((f) => {
      const vehicleName = vehicleById(f.vehicleId)?.name.toLowerCase() ?? "";
      return vehicleName.includes(q) || f.station.toLowerCase().includes(q);
    });
  }, [data, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  React.useEffect(() => setPage(1), [query]);

  return (
    <div>
      <PageHeader title="Fuel Management" description={`${filtered.length} fuel logs recorded`}>
        <Button
          variant="outline"
          onClick={() =>
            toast({ title: "Export complete", description: "fuel-logs.csv downloaded (demo).", variant: "success" })
          }
        >
          <Download /> Export
        </Button>
        <Button variant="gradient" onClick={() => setFormOpen(true)}>
          <Plus /> Add Fuel Log
        </Button>
      </PageHeader>

      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total Fuel" value={Math.round(totalLiters)} suffix=" L" icon={FuelIcon} accent="primary" index={0} />
        <KpiCard title="Total Fuel Cost" value={Math.round(totalCost)} prefix="$" icon={DollarSign} accent="amber" index={1} />
        <KpiCard title="Avg Efficiency" value={avgEfficiency} suffix=" km/L" icon={Gauge} accent="emerald" index={2} />
        <KpiCard title="Logs Count" value={data.length} icon={ListChecks} accent="violet" index={3} />
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Fuel Consumption" description="Litres consumed per month" index={0}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={fuelConsumption} margin={{ left: -8, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="fuelAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="liters" stroke="#2563EB" strokeWidth={3} fill="url(#fuelAreaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Efficiency by Vehicle Type" description="Average km/L per type" index={1}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={fuelEfficiencyByType} margin={{ left: -8, right: 8, top: 8 }}>
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
      </div>

      {/* Filters */}
      <Card className="mb-4 p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by vehicle or station..."
            className="pl-9"
          />
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Vehicle</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Fuel</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Odometer</TableHead>
              <TableHead>Efficiency</TableHead>
              <TableHead>Station</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {current.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium">{vehicleById(f.vehicleId)?.name ?? "—"}</TableCell>
                <TableCell>{formatDate(f.date)}</TableCell>
                <TableCell>{formatNumber(f.liters)} L</TableCell>
                <TableCell>{formatCurrency(f.cost)}</TableCell>
                <TableCell>{formatNumber(f.odometer)} km</TableCell>
                <TableCell>
                  <Badge variant={efficiencyVariant(f.efficiency)}>{f.efficiency.toFixed(1)} km/L</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{f.station}</TableCell>
              </TableRow>
            ))}
            {current.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                  No fuel logs match your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Page {page} of {pageCount} · {filtered.length} results
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Add fuel log form */}
      <FuelForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}

function FuelForm({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { toast } = useToast();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenChange(false);
    toast({ title: "Fuel log added", description: "New fuel entry recorded.", variant: "success" });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add Fuel Log</DialogTitle>
        <DialogDescription>Record a new fuel purchase for a vehicle.</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Vehicle</Label>
          <Select defaultValue={vehicles[0]?.id}>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} · {v.registrationNumber}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Date</Label>
          <Input type="date" required />
        </div>
        <div className="space-y-2">
          <Label>Fuel (Liters)</Label>
          <Input type="number" placeholder="120" min={0} required />
        </div>
        <div className="space-y-2">
          <Label>Fuel Cost ($)</Label>
          <Input type="number" placeholder="180" min={0} required />
        </div>
        <div className="space-y-2">
          <Label>Odometer (km)</Label>
          <Input type="number" placeholder="45000" min={0} required />
        </div>
        <div className="space-y-2">
          <Label>Station</Label>
          <Input placeholder="Shell Highway 12" required />
        </div>
        <DialogFooter className="sm:col-span-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient">
            <Plus /> Add Log
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
