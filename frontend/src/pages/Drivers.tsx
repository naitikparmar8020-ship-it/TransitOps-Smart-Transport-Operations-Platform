import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Users,
  UserCheck,
  UserPlus,
  ShieldCheck,
  Star,
  Phone,
  Eye,
  CreditCard,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { KpiCard } from "@/components/common/KpiCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { drivers as seed } from "@/data";
import type { Driver } from "@/types";
import { formatDate, formatNumber, daysUntil } from "@/lib/utils";

const STATUS_OPTIONS = ["all", "available", "on-trip", "off-duty", "suspended"];
const REGION_OPTIONS = ["all", "North", "South", "East", "West", "Central"];

function scoreBar(score: number) {
  if (score >= 85) return "bg-emerald";
  if (score >= 70) return "bg-amber-500";
  return "bg-destructive";
}

export default function Drivers() {
  const navigate = useNavigate();
  const [data, setData] = React.useState<Driver[]>(seed);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [region, setRegion] = React.useState("all");
  const [formOpen, setFormOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    return data.filter((d) => {
      const q = query.toLowerCase();
      const matchQ =
        d.name.toLowerCase().includes(q) || d.licenseNumber.toLowerCase().includes(q);
      const matchS = status === "all" || d.status === status;
      const matchR = region === "all" || d.region === region;
      return matchQ && matchS && matchR;
    });
  }, [data, query, status, region]);

  const total = data.length;
  const onDuty = data.filter((d) => d.status === "on-trip").length;
  const available = data.filter((d) => d.status === "available").length;
  const avgSafety = Math.round(data.reduce((s, d) => s + d.safetyScore, 0) / Math.max(1, total));

  return (
    <div>
      <PageHeader title="Driver Management" description={`${filtered.length} drivers in your roster`}>
        <Button variant="gradient" onClick={() => setFormOpen(true)}>
          <Plus /> Add Driver
        </Button>
      </PageHeader>

      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total Drivers" value={total} icon={Users} trend={5} progress={80} accent="primary" index={0} />
        <KpiCard title="On Duty" value={onDuty} icon={UserCheck} trend={7} progress={(onDuty / Math.max(1, total)) * 100} accent="emerald" index={1} />
        <KpiCard title="Available" value={available} icon={UserPlus} trend={3} progress={(available / Math.max(1, total)) * 100} accent="violet" index={2} />
        <KpiCard title="Avg Safety Score" value={avgSafety} suffix="%" icon={ShieldCheck} trend={2} progress={avgSafety} accent="amber" index={3} />
      </div>

      {/* Filters */}
      <Card className="mb-4 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or license number..."
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
            <Select value={region} onChange={(e) => setRegion(e.target.value)} className="w-40">
              {REGION_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r === "all" ? "All Regions" : r}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* Views */}
      <Tabs defaultValue="cards">
        <TabsList>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>

        {/* Cards */}
        <TabsContent value="cards">
          {filtered.length === 0 ? (
            <Card className="py-16 text-center text-muted-foreground">
              No drivers match your filters.
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((d) => (
                <Card
                  key={d.id}
                  onClick={() => navigate(`/app/drivers/${d.id}`)}
                  className="cursor-pointer p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                >
                  <div className="flex items-start gap-3">
                    <Avatar name={d.name} color={d.avatarColor} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{d.name}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CreditCard className="size-3.5" /> {d.licenseNumber}
                      </p>
                      <div className="mt-2">
                        <StatusBadge status={d.status} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Safety Score</span>
                      <span className="font-semibold">{d.safetyScore}%</span>
                    </div>
                    <Progress value={d.safetyScore} className="mt-1.5 h-1.5" indicatorClassName={scoreBar(d.safetyScore)} />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 font-medium">
                      <Star className="size-4 fill-amber-400 text-amber-400" /> {d.rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">{formatNumber(d.totalTrips)} trips</span>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 border-t pt-3 text-xs text-muted-foreground">
                    <Phone className="size-3.5" /> {d.phone}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Table */}
        <TabsContent value="table">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Profile</TableHead>
                  <TableHead>License Number</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Safety Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((d) => {
                  const expiringSoon = daysUntil(d.licenseExpiry) < 30;
                  return (
                    <TableRow key={d.id} className="cursor-pointer" onClick={() => navigate(`/app/drivers/${d.id}`)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar name={d.name} color={d.avatarColor} size="sm" />
                          <div>
                            <p className="font-medium">{d.name}</p>
                            <p className="text-xs text-muted-foreground">{d.region}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{d.licenseNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{d.licenseCategory}</Badge>
                      </TableCell>
                      <TableCell className={expiringSoon ? "font-medium text-amber-600 dark:text-amber-400" : ""}>
                        {formatDate(d.licenseExpiry)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{d.phone}</TableCell>
                      <TableCell>
                        <Badge variant={d.safetyScore >= 85 ? "emerald" : d.safetyScore >= 70 ? "amber" : "red"}>
                          {d.safetyScore}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={d.status} />
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => navigate(`/app/drivers/${d.id}`)}>
                            <Eye />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                      No drivers match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add form */}
      <DriverForm open={formOpen} onOpenChange={setFormOpen} onAdd={(d) => setData((prev) => [d, ...prev])} />
    </div>
  );
}

function DriverForm({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (o: boolean) => void; onAdd: (d: Driver) => void }) {
  const { toast } = useToast();
  const [name, setName] = React.useState("");
  const [license, setLicense] = React.useState("");
  const [category, setCategory] = React.useState("Class A");
  const [expiry, setExpiry] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [region, setRegion] = React.useState("North");
  const [dStatus, setDStatus] = React.useState<Driver["status"]>("available");

  const reset = () => {
    setName(""); setLicense(""); setCategory("Class A"); setExpiry("");
    setPhone(""); setEmail(""); setRegion("North"); setDStatus("available");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const COLORS = ["#2563EB", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#06B6D4", "#EC4899", "#14B8A6"];
    const newDriver: Driver = {
      id: `DR-${Date.now()}`,
      name: name || "New Driver",
      licenseNumber: license || "N/A",
      licenseCategory: category,
      licenseExpiry: expiry || new Date().toISOString().slice(0, 10),
      phone: phone || "N/A",
      email: email || "new@transitops.io",
      safetyScore: 85,
      status: dStatus,
      region,
      totalTrips: 0,
      rating: 5.0,
      joinedDate: new Date().toISOString().slice(0, 10),
      avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    onAdd(newDriver);
    onOpenChange(false);
    reset();
    toast({ title: "Driver added", description: `${newDriver.name} added to your roster.`, variant: "success" });
  };
  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }} className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Add Driver</DialogTitle>
        <DialogDescription>Add a new driver to the roster.</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Driver Name" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
        <Field label="License Number" placeholder="DL123456A" value={license} onChange={(e) => setLicense(e.target.value)} />
        <div className="space-y-2">
          <Label>License Category</Label>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {["Class A", "Class B", "Class C"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </div>
        <Field label="License Expiry" type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
        <Field label="Phone" placeholder="+1 555-123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Field label="Email" type="email" placeholder="jane.doe@transitops.io" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="space-y-2">
          <Label>Region</Label>
          <Select value={region} onChange={(e) => setRegion(e.target.value)}>
            {["North", "South", "East", "West", "Central"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={dStatus} onChange={(e) => setDStatus(e.target.value as Driver["status"])}>
            {["available", "on-trip", "off-duty", "suspended"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </div>
        <DialogFooter className="sm:col-span-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient">
            <Plus /> Add Driver
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
