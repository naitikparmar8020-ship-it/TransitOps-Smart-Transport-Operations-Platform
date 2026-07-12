import * as React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Upload,
  Download,
  Search,
  Truck,
  Gauge,
  MapPin,
  Calendar,
  DollarSign,
  Weight,
  Eye,
  Pencil,
  ArrowUpDown,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet } from "@/components/ui/sheet";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { vehicles as seed } from "@/data";
import type { Vehicle } from "@/types";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";

const STATUS_OPTIONS = ["all", "available", "on-trip", "in-shop", "retired"];
const TYPE_OPTIONS = ["all", "Truck", "Van", "Trailer", "Pickup", "Tanker", "Bus"];

export default function Vehicles() {
  const { toast } = useToast();
  const [data] = React.useState<Vehicle[]>(seed);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [type, setType] = React.useState("all");
  const [sortKey, setSortKey] = React.useState<keyof Vehicle>("registrationNumber");
  const [sortAsc, setSortAsc] = React.useState(true);
  const [selected, setSelected] = React.useState<Vehicle | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const perPage = 8;

  const filtered = React.useMemo(() => {
    let out = data.filter((v) => {
      const q = query.toLowerCase();
      const matchQ =
        v.name.toLowerCase().includes(q) ||
        v.registrationNumber.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q);
      const matchS = status === "all" || v.status === status;
      const matchT = type === "all" || v.type === type;
      return matchQ && matchS && matchT;
    });
    out = [...out].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortAsc ? av - bv : bv - av;
      return sortAsc
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return out;
  }, [data, query, status, type, sortKey, sortAsc]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  React.useEffect(() => setPage(1), [query, status, type]);

  const toggleSort = (key: keyof Vehicle) => {
    if (sortKey === key) setSortAsc((a) => !a);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div>
      <PageHeader title="Vehicle Registry" description={`${filtered.length} vehicles in your fleet`}>
        <Button variant="outline" onClick={() => toast({ title: "Import CSV", description: "CSV importer opened (demo).", variant: "info" })}>
          <Upload /> Import
        </Button>
        <Button variant="outline" onClick={() => toast({ title: "Export complete", description: "vehicles.csv downloaded (demo).", variant: "success" })}>
          <Download /> Export
        </Button>
        <Button variant="gradient" onClick={() => setFormOpen(true)}>
          <Plus /> Add Vehicle
        </Button>
      </PageHeader>

      {/* Filters */}
      <Card className="mb-4 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, registration, model..."
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
            <Select value={type} onChange={(e) => setType(e.target.value)} className="w-40">
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All Types" : t}
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
              <TableHead>
                <button className="flex items-center gap-1" onClick={() => toggleSort("registrationNumber")}>
                  Registration <ArrowUpDown className="size-3" />
                </button>
              </TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <button className="flex items-center gap-1" onClick={() => toggleSort("maxLoadKg")}>
                  Max Load <ArrowUpDown className="size-3" />
                </button>
              </TableHead>
              <TableHead>
                <button className="flex items-center gap-1" onClick={() => toggleSort("odometer")}>
                  Odometer <ArrowUpDown className="size-3" />
                </button>
              </TableHead>
              <TableHead>
                <button className="flex items-center gap-1" onClick={() => toggleSort("acquisitionCost")}>
                  Cost <ArrowUpDown className="size-3" />
                </button>
              </TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {current.map((v) => (
              <TableRow key={v.id} className="cursor-pointer" onClick={() => setSelected(v)}>
                <TableCell className="font-medium">{v.registrationNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex size-9 items-center justify-center rounded-lg text-white"
                      style={{ background: v.imageColor }}
                    >
                      <Truck className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium">{v.name}</p>
                      <p className="text-xs text-muted-foreground">{v.model}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{v.type}</Badge>
                </TableCell>
                <TableCell>{formatNumber(v.maxLoadKg)} kg</TableCell>
                <TableCell>{formatNumber(v.odometer)} km</TableCell>
                <TableCell>{formatCurrency(v.acquisitionCost)}</TableCell>
                <TableCell>{v.region}</TableCell>
                <TableCell>
                  <StatusBadge status={v.status} />
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => setSelected(v)}>
                      <Eye />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => toast({ title: "Edit vehicle", description: `Editing ${v.name} (demo).`, variant: "info" })}
                    >
                      <Pencil />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {current.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={9} className="py-12 text-center text-muted-foreground">
                  No vehicles match your filters.
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

      {/* Detail drawer */}
      <Sheet
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        title={selected?.name}
        description={selected ? `${selected.registrationNumber} · ${selected.model}` : ""}
      >
        {selected && (
          <div className="space-y-6">
            <div
              className="flex h-32 items-center justify-center rounded-xl text-white"
              style={{ background: `linear-gradient(135deg, ${selected.imageColor}, ${selected.imageColor}aa)` }}
            >
              <Truck className="size-16 opacity-90" />
            </div>

            <div className="flex items-center justify-between">
              <StatusBadge status={selected.status} />
              <Badge variant="outline">{selected.type}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Weight, label: "Max Load", value: `${formatNumber(selected.maxLoadKg)} kg` },
                { icon: Gauge, label: "Odometer", value: `${formatNumber(selected.odometer)} km` },
                { icon: DollarSign, label: "Acquisition", value: formatCurrency(selected.acquisitionCost) },
                { icon: MapPin, label: "Region", value: selected.region },
                { icon: Calendar, label: "Purchased", value: formatDate(selected.purchaseDate) },
                { icon: Gauge, label: "Efficiency", value: `${selected.fuelEfficiency} km/L` },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <s.icon className="size-3.5" /> {s.label}
                  </div>
                  <p className="mt-1 font-semibold">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setSelected(null)}>
                Close
              </Button>
              <Button variant="gradient" className="flex-1">
                <Pencil /> Edit Vehicle
              </Button>
            </div>
          </div>
        )}
      </Sheet>

      {/* Add form */}
      <VehicleForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}

function VehicleForm({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { toast } = useToast();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenChange(false);
    toast({ title: "Vehicle added", description: "New vehicle registered to your fleet.", variant: "success" });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add Vehicle</DialogTitle>
        <DialogDescription>Register a new vehicle to the fleet.</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Registration Number" placeholder="TX-45AB-1234" />
        <Field label="Vehicle Name" placeholder="Truck A1" />
        <Field label="Model" placeholder="Volvo FH16" />
        <div className="space-y-2">
          <Label>Type</Label>
          <Select defaultValue="Truck">
            {["Truck", "Van", "Trailer", "Pickup", "Tanker", "Bus"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </div>
        <Field label="Max Load (kg)" placeholder="12000" type="number" />
        <Field label="Odometer (km)" placeholder="45000" type="number" />
        <Field label="Acquisition Cost ($)" placeholder="85000" type="number" />
        <div className="space-y-2">
          <Label>Region</Label>
          <Select defaultValue="North">
            {["North", "South", "East", "West", "Central"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Select>
        </div>
        <Field label="Purchase Date" type="date" />
        <div className="space-y-2">
          <Label>Status</Label>
          <Select defaultValue="available">
            {["available", "on-trip", "in-shop", "retired"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </div>
        <DialogFooter className="sm:col-span-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient">
            <Plus /> Add Vehicle
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input {...props} />
    </div>
  );
}
