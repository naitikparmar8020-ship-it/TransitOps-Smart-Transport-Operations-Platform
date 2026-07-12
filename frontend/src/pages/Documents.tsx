import * as React from "react";
import {
  Plus,
  Search,
  UploadCloud,
  FileText,
  FileCheck,
  Clock,
  FileX,
  Eye,
  Download,
  ShieldCheck,
  BookOpen,
  ClipboardCheck,
  ScrollText,
  CreditCard,
  Stethoscope,
  type LucideIcon,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet } from "@/components/ui/sheet";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { documents as seed } from "@/data";
import type { DocumentRecord, DocumentType } from "@/types";
import { formatDate, cn } from "@/lib/utils";

const DOC_TYPES: { type: DocumentType; icon: LucideIcon; accent: string }[] = [
  { type: "Vehicle Insurance", icon: ShieldCheck, accent: "bg-primary/10 text-primary" },
  { type: "RC Book", icon: BookOpen, accent: "bg-emerald/10 text-emerald" },
  { type: "Fitness", icon: ClipboardCheck, accent: "bg-violet-500/10 text-violet-500" },
  { type: "Permit", icon: ScrollText, accent: "bg-amber-500/10 text-amber-500" },
  { type: "Driver License", icon: CreditCard, accent: "bg-cyan-500/10 text-cyan-500" },
  { type: "Medical Certificate", icon: Stethoscope, accent: "bg-pink-500/10 text-pink-500" },
];

function formatSize(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

export default function Documents() {
  const { toast } = useToast();
  const [data, setData] = React.useState<DocumentRecord[]>(seed);
  const [query, setQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<DocumentType | null>(null);
  const [selected, setSelected] = React.useState<DocumentRecord | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);

  const counts = React.useMemo(() => {
    const byType = (t: DocumentType) => data.filter((d) => d.type === t).length;
    return {
      byType,
      valid: data.filter((d) => d.status === "valid").length,
      expiring: data.filter((d) => d.status === "expiring").length,
      expired: data.filter((d) => d.status === "expired").length,
    };
  }, [data]);

  const filtered = React.useMemo(() => {
    return data.filter((d) => {
      const q = query.toLowerCase();
      const matchQ = d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q);
      const matchT = !typeFilter || d.type === typeFilter;
      return matchQ && matchT;
    });
  }, [data, query, typeFilter]);

  return (
    <div>
      <PageHeader title="Document Management" description={`${filtered.length} documents on file`}>
        <Button variant="gradient" onClick={() => setFormOpen(true)}>
          <Plus /> Upload Document
        </Button>
      </PageHeader>

      {/* Category tiles */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {DOC_TYPES.map(({ type, icon: Icon, accent }) => {
          const active = typeFilter === type;
          return (
            <button
              key={type}
              onClick={() => setTypeFilter((t) => (t === type ? null : type))}
              className={cn(
                "group flex flex-col items-start gap-3 rounded-xl border bg-card p-4 text-left shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-card",
                active && "border-primary ring-2 ring-primary/30",
              )}
            >
              <div className={cn("flex size-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110", accent)}>
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-xs font-medium leading-tight text-muted-foreground">{type}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight">{counts.byType(type)}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard title="Valid" value={counts.valid} icon={FileCheck} progress={80} accent="emerald" index={0} />
        <KpiCard title="Expiring Soon" value={counts.expiring} icon={Clock} progress={35} accent="amber" index={1} />
        <KpiCard title="Expired" value={counts.expired} icon={FileX} progress={15} accent="violet" index={2} />
      </div>

      {/* Filters */}
      <Card className="mb-4 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or type..."
              className="pl-9"
            />
          </div>
          {typeFilter && (
            <Button variant="outline" size="sm" onClick={() => setTypeFilter(null)}>
              Clear filter: {typeFilter}
            </Button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Linked To</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((d) => (
              <TableRow key={d.id} className="cursor-pointer" onClick={() => setSelected(d)}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="size-4" />
                    </div>
                    <span className="font-medium">{d.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{d.type}</Badge>
                </TableCell>
                <TableCell>{d.linkedTo}</TableCell>
                <TableCell>{formatDate(d.uploadedDate)}</TableCell>
                <TableCell
                  className={cn(
                    d.status === "expiring" && "font-medium text-amber-600 dark:text-amber-400",
                    d.status === "expired" && "font-medium text-destructive",
                  )}
                >
                  {formatDate(d.expiryDate)}
                </TableCell>
                <TableCell>{formatSize(d.sizeKb)}</TableCell>
                <TableCell>
                  <StatusBadge status={d.status} />
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => setSelected(d)}>
                      <Eye />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => toast({ title: "Download started", description: `${d.name} downloading (demo).`, variant: "info" })}
                    >
                      <Download />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                  No documents match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Preview drawer */}
      <Sheet
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        title={selected?.name}
        description={selected ? `${selected.type} · ${selected.linkedTo}` : ""}
      >
        {selected && (
          <div className="space-y-6">
            {/* Page mock */}
            <div className="mx-auto flex aspect-[3/4] w-full max-w-xs flex-col items-center justify-center gap-3 rounded-lg border bg-muted/40 p-6 text-center shadow-inner">
              <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="size-7" />
              </div>
              <p className="text-sm font-semibold">{selected.name}</p>
              <p className="text-xs text-muted-foreground">Document preview unavailable in demo</p>
              <div className="mt-2 w-full space-y-2">
                {[90, 75, 82, 60].map((w, i) => (
                  <div key={i} className="mx-auto h-2 rounded bg-muted-foreground/20" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Type", value: selected.type },
                { label: "Linked To", value: selected.linkedTo },
                { label: "Uploaded", value: formatDate(selected.uploadedDate) },
                { label: "Expiry", value: formatDate(selected.expiryDate) },
                { label: "Size", value: formatSize(selected.sizeKb) },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border p-3">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-sm font-semibold">{s.value}</p>
                </div>
              ))}
              <div className="rounded-xl border p-3">
                <p className="text-xs text-muted-foreground">Status</p>
                <div className="mt-1.5">
                  <StatusBadge status={selected.status} />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setSelected(null)}>
                Close
              </Button>
              <Button
                variant="gradient"
                className="flex-1"
                onClick={() => toast({ title: "Download started", description: `${selected.name} downloading (demo).`, variant: "info" })}
              >
                <Download /> Download
              </Button>
            </div>
          </div>
        )}
      </Sheet>

      {/* Upload form */}
      <UploadForm open={formOpen} onOpenChange={setFormOpen} onAdd={(d) => setData((prev) => [d, ...prev])} />
    </div>
  );
}

function UploadForm({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (o: boolean) => void; onAdd: (d: DocumentRecord) => void }) {
  const { toast } = useToast();
  const [docType, setDocType] = React.useState<DocumentType>("Vehicle Insurance");
  const [linkedTo, setLinkedTo] = React.useState("");
  const [expiry, setExpiry] = React.useState("");

  const reset = () => {
    setDocType("Vehicle Insurance"); setLinkedTo(""); setExpiry("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    const expiryDate = expiry || today;
    const daysUntilExpiry = Math.floor((new Date(expiryDate).getTime() - Date.now()) / 86400000);
    const newDoc: DocumentRecord = {
      id: `DOC-${Date.now()}`,
      name: `${docType.replace(/\s/g, "_")}_${linkedTo || "NEW"}.pdf`,
      type: docType,
      linkedTo: linkedTo || "Unlinked",
      uploadedDate: today,
      expiryDate,
      sizeKb: Math.floor(Math.random() * 3000 + 200),
      status: daysUntilExpiry < 0 ? "expired" : daysUntilExpiry < 30 ? "expiring" : "valid",
    };
    onAdd(newDoc);
    onOpenChange(false);
    reset();
    toast({ title: "Document uploaded", description: "New document added to the vault.", variant: "success" });
  };
  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }} className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogDescription>Add a new document to the compliance vault.</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-input bg-muted/30 px-6 py-10 text-center transition-colors hover:border-primary/50 hover:bg-muted/50">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UploadCloud className="size-6" />
          </div>
          <p className="text-sm font-medium">Drag &amp; drop or click to browse</p>
          <p className="text-xs text-muted-foreground">PDF, JPG or PNG up to 10 MB</p>
        </div>
        <div className="space-y-2">
          <Label>Document Type</Label>
          <Select value={docType} onChange={(ev) => setDocType(ev.target.value as DocumentType)}>
            {DOC_TYPES.map(({ type }) => (
              <option key={type}>{type}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Linked To</Label>
          <Input placeholder="VH-001 or DR-001" value={linkedTo} onChange={(ev) => setLinkedTo(ev.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Expiry Date</Label>
          <Input type="date" value={expiry} onChange={(ev) => setExpiry(ev.target.value)} />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient">
            <UploadCloud /> Upload
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
