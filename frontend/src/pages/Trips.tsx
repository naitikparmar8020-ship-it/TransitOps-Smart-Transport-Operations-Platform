import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Search,
  Route,
  Navigation,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Eye,
  Check,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/common/KpiCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { trips as seed, vehicles, drivers, vehicleById, driverById } from "@/data";
import type { Trip } from "@/types";
import { formatNumber } from "@/lib/utils";

const STATUS_OPTIONS = ["all", "draft", "dispatched", "completed", "cancelled"];

export default function Trips() {
  const navigate = useNavigate();
  const [data, setData] = React.useState<Trip[]>(seed);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [wizardOpen, setWizardOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const perPage = 8;

  const counts = React.useMemo(
    () => ({
      total: data.length,
      dispatched: data.filter((t) => t.status === "dispatched").length,
      completed: data.filter((t) => t.status === "completed").length,
      cancelled: data.filter((t) => t.status === "cancelled").length,
    }),
    [data],
  );

  const filtered = React.useMemo(() => {
    return data.filter((t) => {
      const q = query.toLowerCase();
      const matchQ =
        t.code.toLowerCase().includes(q) ||
        t.source.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q);
      const matchS = status === "all" || t.status === status;
      return matchQ && matchS;
    });
  }, [data, query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  React.useEffect(() => setPage(1), [query, status]);

  return (
    <div>
      <PageHeader title="Trip Management" description={`${filtered.length} trips across your fleet`}>
        <Button variant="gradient" onClick={() => setWizardOpen(true)}>
          <Plus /> Create Trip
        </Button>
      </PageHeader>

      {/* KPI cards */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total Trips" value={counts.total} icon={Route} accent="primary" index={0} />
        <KpiCard title="Active / Dispatched" value={counts.dispatched} icon={Navigation} accent="violet" index={1} />
        <KpiCard title="Completed" value={counts.completed} icon={CheckCircle2} accent="emerald" index={2} />
        <KpiCard title="Cancelled" value={counts.cancelled} icon={XCircle} accent="amber" index={3} />
      </div>

      {/* Filters */}
      <Card className="mb-4 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by code, source, destination..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-3">
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-40">
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All Status" : s}
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
              <TableHead>Trip Code</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {current.map((t) => (
              <TableRow
                key={t.id}
                className="cursor-pointer"
                onClick={() => navigate(`/app/trips/${t.id}`)}
              >
                <TableCell className="font-medium">{t.code}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <span>{t.source}</span>
                    <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                    <span>{t.destination}</span>
                  </div>
                </TableCell>
                <TableCell>{vehicleById(t.vehicleId)?.name}</TableCell>
                <TableCell>{driverById(t.driverId)?.name}</TableCell>
                <TableCell>{formatNumber(t.distanceKm)} km</TableCell>
                <TableCell>{formatNumber(t.cargoWeightKg)} kg</TableCell>
                <TableCell>
                  <StatusBadge status={t.status} />
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => navigate(`/app/trips/${t.id}`)}
                    >
                      <Eye />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {current.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                  No trips match your filters.
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

      {/* Create trip wizard */}
      <CreateTripWizard open={wizardOpen} onOpenChange={setWizardOpen} onAdd={(t) => setData((prev) => [t, ...prev])} />
    </div>
  );
}

interface WizardState {
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeightKg: string;
  distanceKm: string;
}

const emptyState: WizardState = {
  source: "",
  destination: "",
  vehicleId: vehicles[0]?.id ?? "",
  driverId: drivers[0]?.id ?? "",
  cargoWeightKg: "",
  distanceKm: "",
};

const STEPS = [
  { n: 1, label: "Route" },
  { n: 2, label: "Details" },
  { n: 3, label: "Review" },
];

function CreateTripWizard({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (o: boolean) => void; onAdd: (t: Trip) => void }) {
  const { toast } = useToast();
  const [step, setStep] = React.useState(1);
  const [form, setForm] = React.useState<WizardState>(emptyState);

  const set = (key: keyof WizardState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const reset = () => {
    setStep(1);
    setForm(emptyState);
  };

  const dispatch = () => {
    const newTrip: Trip = {
      id: `TR-${Date.now()}`,
      code: `TRIP-${new Date().getFullYear()}${String(Math.floor(Math.random() * 900 + 100)).padStart(3, "0")}`,
      source: form.source || "Origin",
      destination: form.destination || "Destination",
      vehicleId: form.vehicleId,
      driverId: form.driverId,
      cargoWeightKg: Number(form.cargoWeightKg) || 0,
      distanceKm: Number(form.distanceKm) || 0,
      status: "dispatched",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: null,
      fuelUsedL: 0,
      expense: 0,
      revenue: 0,
    };
    onAdd(newTrip);
    onOpenChange(false);
    toast({
      title: "Trip dispatched",
      description: `New trip from ${newTrip.source} to ${newTrip.destination} created.`,
      variant: "success",
    });
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
      className="max-w-2xl"
    >
      <DialogHeader>
        <DialogTitle>Create Trip</DialogTitle>
        <DialogDescription>Plan and dispatch a new trip in three steps.</DialogDescription>
      </DialogHeader>

      {/* Stepper */}
      <div className="mb-6 flex items-center justify-between">
        {STEPS.map((s, i) => {
          const active = step === s.n;
          const done = step > s.n;
          return (
            <React.Fragment key={s.n}>
              <div className="flex items-center gap-2">
                <div
                  className={
                    "flex size-8 items-center justify-center rounded-full text-sm font-semibold transition-colors " +
                    (done
                      ? "bg-emerald text-emerald-foreground"
                      : active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground")
                  }
                >
                  {done ? <Check className="size-4" /> : s.n}
                </div>
                <span
                  className={
                    "text-sm font-medium " +
                    (active ? "text-foreground" : "text-muted-foreground")
                  }
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-2 h-px flex-1 bg-border" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Steps */}
      <div className="min-h-[220px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Source</Label>
                  <Input
                    value={form.source}
                    onChange={(e) => set("source", e.target.value)}
                    placeholder="Metro City"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Destination</Label>
                  <Input
                    value={form.destination}
                    onChange={(e) => set("destination", e.target.value)}
                    placeholder="Port Harbor"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Vehicle</Label>
                  <Select value={form.vehicleId} onChange={(e) => set("vehicleId", e.target.value)}>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Driver</Label>
                  <Select value={form.driverId} onChange={(e) => set("driverId", e.target.value)}>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cargo Weight (kg)</Label>
                  <Input
                    type="number"
                    value={form.cargoWeightKg}
                    onChange={(e) => set("cargoWeightKg", e.target.value)}
                    placeholder="12000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Distance (km)</Label>
                  <Input
                    type="number"
                    value={form.distanceKm}
                    onChange={(e) => set("distanceKm", e.target.value)}
                    placeholder="480"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="rounded-xl border p-4">
                  <p className="mb-3 text-sm font-semibold">Trip Summary</p>
                  <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                    <ReviewRow label="Source" value={form.source || "—"} />
                    <ReviewRow label="Destination" value={form.destination || "—"} />
                    <ReviewRow label="Vehicle" value={vehicleById(form.vehicleId)?.name ?? "—"} />
                    <ReviewRow label="Driver" value={driverById(form.driverId)?.name ?? "—"} />
                    <ReviewRow
                      label="Cargo Weight"
                      value={form.cargoWeightKg ? `${formatNumber(Number(form.cargoWeightKg))} kg` : "—"}
                    />
                    <ReviewRow
                      label="Distance"
                      value={form.distanceKm ? `${formatNumber(Number(form.distanceKm))} km` : "—"}
                    />
                  </dl>
                </div>
                <p className="text-sm text-muted-foreground">
                  Dispatching this trip will assign the vehicle and driver and mark it as dispatched.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={step === 1}
          onClick={() => setStep((s) => Math.max(1, s - 1))}
        >
          Back
        </Button>
        {step < 3 ? (
          <Button type="button" variant="default" onClick={() => setStep((s) => Math.min(3, s + 1))}>
            Next
          </Button>
        ) : (
          <Button type="button" variant="gradient" onClick={dispatch}>
            <Navigation /> Dispatch Trip
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-1.5 last:border-0 sm:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
