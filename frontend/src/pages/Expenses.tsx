import * as React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Plus, Search, Fuel, Wrench, Receipt, DollarSign } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/common/KpiCard";
import { ChartCard } from "@/components/common/ChartCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { expenses as seed, expenseByType, monthlyExpenses, vehicles, vehicleById } from "@/data";
import type { Expense, ExpenseType } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const EXPENSE_TYPES: ExpenseType[] = ["Fuel", "Maintenance", "Toll", "Insurance", "Salary", "Other"];
const TYPE_FILTER = ["all", ...EXPENSE_TYPES];
const APPROVAL_FILTER = ["all", "approved", "pending"];

const TYPE_BADGE: Record<ExpenseType, BadgeProps["variant"]> = {
  Fuel: "default",
  Maintenance: "amber",
  Toll: "red",
  Insurance: "emerald",
  Salary: "gray",
  Other: "outline",
};

export default function Expenses() {
  const { toast } = useToast();
  const [data, setData] = React.useState<Expense[]>(seed);
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState("all");
  const [approval, setApproval] = React.useState("all");
  const [formOpen, setFormOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const perPage = 10;

  const totals = React.useMemo(() => {
    const sumBy = (types: ExpenseType[]) =>
      data.filter((e) => types.includes(e.type)).reduce((s, e) => s + e.amount, 0);
    const fuel = sumBy(["Fuel"]);
    const maintenance = sumBy(["Maintenance"]);
    const other = sumBy(["Toll", "Insurance", "Salary", "Other"]);
    return { fuel, maintenance, other, operational: fuel + maintenance + other };
  }, [data]);

  const filtered = React.useMemo(() => {
    return data.filter((e) => {
      const q = query.toLowerCase();
      const matchQ = e.notes.toLowerCase().includes(q) || e.type.toLowerCase().includes(q);
      const matchT = type === "all" || e.type === type;
      const matchA =
        approval === "all" ||
        (approval === "approved" && e.approved) ||
        (approval === "pending" && !e.approved);
      return matchQ && matchT && matchA;
    });
  }, [data, query, type, approval]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  React.useEffect(() => setPage(1), [query, type, approval]);

  return (
    <div>
      <PageHeader title="Expense Management" description={`${filtered.length} expense records`}>
        <Button variant="gradient" onClick={() => setFormOpen(true)}>
          <Plus /> Add Expense
        </Button>
      </PageHeader>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Fuel Cost" value={totals.fuel} prefix="$" icon={Fuel} trend={6} progress={70} accent="primary" index={0} />
        <KpiCard title="Maintenance Cost" value={totals.maintenance} prefix="$" icon={Wrench} trend={-3} progress={45} accent="amber" index={1} />
        <KpiCard title="Other Expenses" value={totals.other} prefix="$" icon={Receipt} trend={4} progress={55} accent="violet" index={2} />
        <KpiCard title="Operational Cost" value={totals.operational} prefix="$" icon={DollarSign} trend={5} progress={82} accent="emerald" index={3} />
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Expenses by Type" description="Total spend per category" index={0}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={expenseByType}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={90}
                paddingAngle={3}
                strokeWidth={0}
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

        <ChartCard title="Monthly Expenses" description="Fuel · Maintenance · Other" index={1}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyExpenses} margin={{ left: -18, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
              <Bar dataKey="fuel" stackId="a" fill="#2563EB" />
              <Bar dataKey="maintenance" stackId="a" fill="#F59E0B" />
              <Bar dataKey="other" stackId="a" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
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
              placeholder="Search by notes or type..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-3">
            <Select value={type} onChange={(e) => setType(e.target.value)} className="w-40">
              {TYPE_FILTER.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All Types" : t}
                </option>
              ))}
            </Select>
            <Select value={approval} onChange={(e) => setApproval(e.target.value)} className="w-40">
              {APPROVAL_FILTER.map((a) => (
                <option key={a} value={a}>
                  {a === "all" ? "All Status" : a === "approved" ? "Approved" : "Pending"}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {current.map((e) => (
              <TableRow key={e.id}>
                <TableCell>
                  <Badge variant={TYPE_BADGE[e.type]}>{e.type}</Badge>
                </TableCell>
                <TableCell className="font-semibold">{formatCurrency(e.amount)}</TableCell>
                <TableCell>{e.vehicleId ? vehicleById(e.vehicleId)?.name ?? "General" : "General"}</TableCell>
                <TableCell>{formatDate(e.date)}</TableCell>
                <TableCell className="text-muted-foreground">{e.notes}</TableCell>
                <TableCell>
                  <StatusBadge status={e.approved ? "approved" : "pending"} />
                </TableCell>
              </TableRow>
            ))}
            {current.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  No expenses match your filters.
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

      {/* Add form */}
      <ExpenseForm open={formOpen} onOpenChange={setFormOpen} onAdd={(exp) => setData((prev) => [exp, ...prev])} />
    </div>
  );
}

function ExpenseForm({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (o: boolean) => void; onAdd: (e: Expense) => void }) {
  const { toast } = useToast();
  const [eType, setEType] = React.useState<ExpenseType>("Fuel");
  const [amount, setAmount] = React.useState("");
  const [vehicleId, setVehicleId] = React.useState("");
  const [date, setDate] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const reset = () => {
    setEType("Fuel"); setAmount(""); setVehicleId(""); setDate(""); setNotes("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: Expense = {
      id: `EX-${Date.now()}`,
      type: eType,
      amount: Number(amount) || 0,
      vehicleId: vehicleId || null,
      date: date || new Date().toISOString().slice(0, 10),
      notes: notes || eType,
      approved: false,
    };
    onAdd(newExpense);
    onOpenChange(false);
    reset();
    toast({ title: "Expense added", description: "New expense recorded.", variant: "success" });
  };
  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }} className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add Expense</DialogTitle>
        <DialogDescription>Record a new operational expense.</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select value={eType} onChange={(ev) => setEType(ev.target.value as ExpenseType)}>
            {EXPENSE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Amount ($)</Label>
          <Input type="number" placeholder="1200" min={0} value={amount} onChange={(ev) => setAmount(ev.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Vehicle</Label>
          <Select value={vehicleId} onChange={(ev) => setVehicleId(ev.target.value)}>
            <option value="">— None —</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(ev) => setDate(ev.target.value)} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label>Notes</Label>
          <Textarea placeholder="Add a short description..." value={notes} onChange={(ev) => setNotes(ev.target.value)} />
        </div>
        <DialogFooter className="sm:col-span-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient">
            <Plus /> Add Expense
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
