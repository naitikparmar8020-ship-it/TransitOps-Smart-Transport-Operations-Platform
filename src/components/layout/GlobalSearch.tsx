import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Truck, Users, Route, Wrench, Receipt } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { vehicles, drivers, trips, maintenance, expenses } from "@/data";
import { cn } from "@/lib/utils";

interface Result {
  label: string;
  sub: string;
  to: string;
  icon: typeof Truck;
}

export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [query, setQuery] = React.useState("");
  const navigate = useNavigate();

  const results = React.useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: Result[] = [];
    vehicles
      .filter((v) => v.name.toLowerCase().includes(q) || v.registrationNumber.toLowerCase().includes(q))
      .slice(0, 4)
      .forEach((v) => out.push({ label: v.name, sub: v.registrationNumber, to: "/app/vehicles", icon: Truck }));
    drivers
      .filter((d) => d.name.toLowerCase().includes(q))
      .slice(0, 4)
      .forEach((d) => out.push({ label: d.name, sub: d.licenseNumber, to: "/app/drivers", icon: Users }));
    trips
      .filter((t) => t.code.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach((t) => out.push({ label: t.code, sub: `${t.source} → ${t.destination}`, to: "/app/trips", icon: Route }));
    maintenance
      .filter((m) => m.issue.toLowerCase().includes(q))
      .slice(0, 2)
      .forEach((m) => out.push({ label: m.issue, sub: m.mechanic, to: "/app/maintenance", icon: Wrench }));
    expenses
      .filter((e) => e.notes.toLowerCase().includes(q) || e.type.toLowerCase().includes(q))
      .slice(0, 2)
      .forEach((e) => out.push({ label: e.notes, sub: e.type, to: "/app/expenses", icon: Receipt }));
    return out;
  }, [query]);

  const go = (to: string) => {
    onOpenChange(false);
    setQuery("");
    navigate(to);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-xl p-0">
      <div className="flex items-center gap-3 border-b px-4">
        <Search className="size-5 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search vehicles, drivers, trips, expenses..."
          className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
          ESC
        </kbd>
      </div>
      <div className="max-h-80 overflow-y-auto p-2">
        {query && results.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">No results for “{query}”</p>
        )}
        {!query && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Start typing to search across the platform
          </p>
        )}
        {results.map((r, i) => (
          <button
            key={i}
            onClick={() => go(r.to)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent",
            )}
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <r.icon className="size-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{r.label}</p>
              <p className="truncate text-xs text-muted-foreground">{r.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </Dialog>
  );
}
