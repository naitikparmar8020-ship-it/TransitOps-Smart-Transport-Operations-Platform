import * as React from "react";
import {
  Plus,
  Search,
  Users as UsersIcon,
  UserCheck,
  ShieldCheck,
  KeyRound,
  Pencil,
  Trash2,
  Check,
  X,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { users as seed } from "@/data";
import type { AppUser, UserRole } from "@/types";
import { formatDate } from "@/lib/utils";

const ROLES: UserRole[] = ["Admin", "Fleet Manager", "Driver", "Safety Officer", "Financial Analyst"];
const MODULES = ["Vehicles", "Drivers", "Trips", "Maintenance", "Fuel", "Expenses", "Reports", "Users"] as const;

type BadgeVariant = React.ComponentProps<typeof Badge>["variant"];

const ROLE_BADGE: Record<UserRole, BadgeVariant> = {
  Admin: "default",
  "Fleet Manager": "emerald",
  Driver: "gray",
  "Safety Officer": "amber",
  "Financial Analyst": "red",
};

// Hardcoded permission matrix: modules x roles
const PERMISSIONS: Record<UserRole, Record<(typeof MODULES)[number], boolean>> = {
  Admin: {
    Vehicles: true,
    Drivers: true,
    Trips: true,
    Maintenance: true,
    Fuel: true,
    Expenses: true,
    Reports: true,
    Users: true,
  },
  "Fleet Manager": {
    Vehicles: true,
    Drivers: true,
    Trips: true,
    Maintenance: true,
    Fuel: true,
    Expenses: true,
    Reports: true,
    Users: false,
  },
  Driver: {
    Vehicles: false,
    Drivers: false,
    Trips: true,
    Maintenance: false,
    Fuel: true,
    Expenses: false,
    Reports: false,
    Users: false,
  },
  "Safety Officer": {
    Vehicles: true,
    Drivers: true,
    Trips: false,
    Maintenance: false,
    Fuel: false,
    Expenses: false,
    Reports: true,
    Users: false,
  },
  "Financial Analyst": {
    Vehicles: false,
    Drivers: false,
    Trips: false,
    Maintenance: false,
    Fuel: false,
    Expenses: true,
    Reports: true,
    Users: false,
  },
};

export default function Users() {
  const { toast } = useToast();
  const [data] = React.useState<AppUser[]>(seed);
  const [query, setQuery] = React.useState("");
  const [role, setRole] = React.useState("all");
  const [formOpen, setFormOpen] = React.useState(false);

  const totalUsers = data.length;
  const activeUsers = data.filter((u) => u.status === "active").length;
  const admins = data.filter((u) => u.role === "Admin").length;

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    return data.filter((u) => {
      const matchQ =
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchR = role === "all" || u.role === role;
      return matchQ && matchR;
    });
  }, [data, query, role]);

  return (
    <div>
      <PageHeader title="User Management" description="Manage team members, roles & permissions">
        <Button variant="gradient" onClick={() => setFormOpen(true)}>
          <Plus /> Add User
        </Button>
      </PageHeader>

      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total Users" value={totalUsers} icon={UsersIcon} trend={5} progress={80} accent="primary" index={0} />
        <KpiCard title="Active Users" value={activeUsers} icon={UserCheck} trend={3} progress={(activeUsers / Math.max(totalUsers, 1)) * 100} accent="emerald" index={1} />
        <KpiCard title="Admins" value={admins} icon={ShieldCheck} trend={0} progress={40} accent="amber" index={2} />
        <KpiCard title="Roles" value={ROLES.length} icon={KeyRound} trend={0} progress={60} accent="violet" index={3} />
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles &amp; Permissions</TabsTrigger>
        </TabsList>

        {/* Users tab */}
        <TabsContent value="users">
          <Card className="mb-4 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="pl-9"
                />
              </div>
              <Select value={role} onChange={(e) => setRole(e.target.value)} className="w-52">
                <option value="all">All Roles</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} color={u.avatarColor} size="sm" />
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ROLE_BADGE[u.role]}>{u.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={u.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(u.lastActive)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => toast({ title: "Edit user", description: `Editing ${u.name} (demo).`, variant: "info" })}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => toast({ title: "User removed", description: `${u.name} has been deleted.`, variant: "warning" })}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                      No users match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Roles & Permissions tab */}
        <TabsContent value="roles">
          <Card className="overflow-hidden">
            <div className="border-b p-4">
              <h3 className="text-base font-semibold">Permission Matrix</h3>
              <p className="text-sm text-muted-foreground">Module access by role across TransitOps.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr>
                    <th className="h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Module
                    </th>
                    {ROLES.map((r) => (
                      <th
                        key={r}
                        className="h-11 px-4 text-center align-middle text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                      >
                        {r}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {MODULES.map((m) => (
                    <tr key={m} className="border-b transition-colors hover:bg-muted/50">
                      <td className="px-4 py-3 align-middle font-medium">{m}</td>
                      {ROLES.map((r) => (
                        <td key={r} className="px-4 py-3 text-center align-middle">
                          {PERMISSIONS[r][m] ? (
                            <Check className="mx-auto size-4 text-emerald" />
                          ) : (
                            <X className="mx-auto size-4 text-muted-foreground/40" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <UserForm open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}

function UserForm({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { toast } = useToast();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenChange(false);
    toast({ title: "User added", description: "New team member invited to TransitOps.", variant: "success" });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Add User</DialogTitle>
        <DialogDescription>Invite a new team member and assign a role.</DialogDescription>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input placeholder="Jane Cooper" />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" placeholder="jane@company.com" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Role</Label>
            <Select defaultValue="Fleet Manager">
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select defaultValue="active">
              {["active", "inactive"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient">
            <Plus /> Add User
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
