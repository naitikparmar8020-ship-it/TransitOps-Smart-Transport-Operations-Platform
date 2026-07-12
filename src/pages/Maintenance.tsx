import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Plus,
  Search,
  Wrench,
  CalendarClock,
  CheckCircle2,
  History,
  CircleCheck,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/common/KpiCard";
import { ChartCard } from "@/components/common/ChartCard";
import { StatusBadge } from "@/components/common/StatusBadge";
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
import { maintenance as seed, vehicles, vehicleById } from "@/data";
import type { MaintenanceRecord } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const STATUS_OPTIONS = ["all", "scheduled", "in-progress", "completed"];
const CATEGORY_OPTIONS = ["Preventive", "Corrective", "Inspection", "Emergency"];

export default function Maintenance() {
  const { toast } = useToast();
  const [data] = React.useState<MaintenanceRecord[]>(seed);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [formOpen, setFormOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const perPage = 8;

  const inShop = data.filter((m) => m.status === "in-progress").length;
  const upcoming = data.filter((m) => m.status === "scheduled").length;
  const completed = data.filter((m) => m.status === "completed").length;

  const costByCategory = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const m of data) {
      map.set(m.category, (map.get(m.category) ?? 0) + m.cost);
    }
    return Array.from(map, ([category, cost]) => ({ category, cost }));
  }, [data]);

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    return data.filter((m) => {
      const matchQ =
        m.issue.toLowerCase().includes(q) || m.mechanic.toLowerCase().includes(q);
      const matchS = status === "all" || m.status === status;
      return matchQ && matchS;
    });
  }, [data, query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  React.useEffect(() => setPage(1), [query, status]);

  return (
    <div>
      <PageHeader title="Maintenance" description={`${filtered.length} maintenance records`}>
        <Button
          variant="outline"
          onClick={() =>
            toast({ title: "Maintenance history", description: "Full history opened (demo).", variant: "info" })
          }
        >
          <History /> History
        </Button>
        <Button variant="gradient" onClick={() => setFormOpen(true)}>
          <Plus /> New Maintenance
        </Button>
      </PageHeader>

      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard title="Vehicles in Shop" value={inShop} icon={Wrench} accent="amber" index={0} />
        <KpiCard title="Upcoming Service" value={upcoming} icon={CalendarClock} accent="primary" index={1} />
        <KpiCard title="Completed Services" value={completed} icon={CheckCircle2} accent="emerald" index={2} />
      </div>

      {/* Cost by category chart */}
      <div className="mb-6">
        <ChartCard title="Maintenance Cost by Category" description="Total spend grouped by category" index={0}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={costByCategory} margin={{ left: -8, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="category" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
              <Bar dataKey="cost" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Filters */}
      <Card className="mb-4 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by issue or mechanic..."
              className="pl-9"
            />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-44">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Status" : s}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Vehicle</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Mechanic</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {current.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{vehicleById(m.vehicleId)?.name ?? "—"}</TableCell>
                <TableCell>{m.issue}</TableCell>
                <TableCell className="text-muted-foreground">{m.mechanic}</TableCell>
                <TableCell>
                  <Badge variant="outline">{m.category}</Badge>
                </TableCell>
                <TableCell>{formatDate(m.startDate)}</TableCell>
                <TableCell>{m.endDate ? formatDate(m.endDate) : "—"}</TableCell>
                <TableCell>{formatCurrency(m.cost)}</TableCell>
                <TableCell>
                  <StatusBadge status={m.status} />
                </TableCell>
                <TableCell className="text-right">
                  {m.status !== "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: "Maintenance closed",
                          description: `${m.issue} marked complete (demo).`,
                          variant: "success",
                        })
                      }
                    >
                      <CircleCheck /> Close
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {current.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={9} className="py-12 text-center text-muted-foreground">
                  No maintenance records match your filters.
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

      {/* New maintenance form */}
      <MaintenanceForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}

function MaintenanceForm({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { toast } = useToast();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenChange(false);
    toast({ title: "Maintenance scheduled", description: "New maintenance record created.", variant: "success" });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>New Maintenance</DialogTitle>
        <DialogDescription>Schedule a maintenance job for a vehicle.</DialogDescription>
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
          <Label>Issue</Label>
          <Input placeholder="Brake pad replacement" required />
        </div>
        <div className="space-y-2">
          <Label>Mechanic</Label>
          <Input placeholder="John Carter" required />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select defaultValue={CATEGORY_OPTIONS[0]}>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input type="date" required />
        </div>
        <div className="space-y-2">
          <Label>Cost ($)</Label>
          <Input type="number" placeholder="1200" min={0} />
        </div>
        <DialogFooter className="sm:col-span-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient">
            <Plus /> Create Record
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
