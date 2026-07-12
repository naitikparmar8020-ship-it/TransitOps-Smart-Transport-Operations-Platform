import * as React from "react";
import {
  Camera,
  Save,
  Sun,
  Moon,
  Check,
  Bell,
  Laptop,
  Smartphone,
  Tablet,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function Settings() {
  return (
    <div>
      <PageHeader title="Settings" description="Manage your workspace preferences" />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="company">
          <CompanyTab />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceTab />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileTab() {
  const { toast } = useToast();
  const { user } = useAuth();
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Profile saved", description: "Your profile has been updated.", variant: "success" });
  };
  return (
    <div className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
          <CardDescription>Update your personal details and contact info.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={user?.name ?? "Fleet Admin"} color={user?.avatarColor} size="xl" />
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toast({ title: "Change photo", description: "Photo uploader opened (demo).", variant: "info" })}
                >
                  <Camera /> Change Photo
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">JPG, GIF or PNG. Max size 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue={user?.name ?? ""} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" defaultValue={user?.email ?? ""} placeholder="you@company.com" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input type="tel" placeholder="+1 555 010 2030" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input defaultValue={user?.role ?? ""} disabled />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="gradient">
                <Save /> Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function CompanyTab() {
  const { toast } = useToast();
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Company updated", description: "Workspace details have been saved.", variant: "success" });
  };
  return (
    <div className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company Details</CardTitle>
          <CardDescription>Configure your organization and regional settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input defaultValue="TransitOps Logistics" placeholder="Company name" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Industry</Label>
                <Select defaultValue="Logistics & Transport">
                  {["Logistics & Transport", "Retail Distribution", "Construction", "Food & Beverage", "Other"].map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select defaultValue="UTC+00:00 London">
                  {["UTC-08:00 Pacific", "UTC-05:00 Eastern", "UTC+00:00 London", "UTC+05:30 India", "UTC+08:00 Singapore"].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea placeholder="Street, city, state, postal code" defaultValue="120 Freight Ave, Springfield, IL 62704" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select defaultValue="USD — US Dollar">
                  {["USD — US Dollar", "EUR — Euro", "GBP — British Pound", "INR — Indian Rupee", "SGD — Singapore Dollar"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="gradient">
                <Save /> Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = React.useState("English");
  const [compact, setCompact] = React.useState(false);

  const themeCards = [
    { key: "light" as const, label: "Light", icon: Sun, desc: "Bright and clean interface" },
    { key: "dark" as const, label: "Dark", icon: Moon, desc: "Easy on the eyes at night" },
  ];

  return (
    <div className="max-w-3xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Theme</CardTitle>
          <CardDescription>Choose how TransitOps looks to you.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {themeCards.map((t) => {
              const active = theme === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTheme(t.key)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                    active
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-input hover:border-primary/40 hover:bg-accent",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-lg",
                      active ? "bg-primary text-white" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <t.icon className="size-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                  {active && <Check className="size-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
          <CardDescription>Language and layout density.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select value={language} onChange={(e) => setLanguage(e.target.value)} className="sm:w-64">
              {["English", "Spanish", "French", "German", "Hindi"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="text-sm font-medium">Compact mode</p>
              <p className="text-xs text-muted-foreground">Reduce spacing for a denser layout.</p>
            </div>
            <Switch checked={compact} onCheckedChange={setCompact} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const NOTIFICATION_ROWS = [
  { key: "emailAlerts", label: "Email alerts", desc: "General account and activity emails." },
  { key: "licenseExpiry", label: "License expiry", desc: "Alerts when driver licenses near expiry." },
  { key: "maintenanceDue", label: "Maintenance due", desc: "Reminders for scheduled vehicle service." },
  { key: "tripUpdates", label: "Trip updates", desc: "Status changes on dispatched trips." },
  { key: "fuelLogs", label: "Fuel logs", desc: "Notifications when fuel entries are added." },
  { key: "weeklyReport", label: "Weekly report", desc: "A summary of fleet performance each week." },
] as const;

function NotificationsTab() {
  const { toast } = useToast();
  const [prefs, setPrefs] = React.useState<Record<string, boolean>>({
    emailAlerts: true,
    licenseExpiry: true,
    maintenanceDue: true,
    tripUpdates: false,
    fuelLogs: false,
    weeklyReport: true,
  });

  const save = () =>
    toast({ title: "Preferences saved", description: "Notification settings updated.", variant: "success" });

  return (
    <div className="max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notifications</CardTitle>
          <CardDescription>Choose what you want to be notified about.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {NOTIFICATION_ROWS.map((row) => (
            <div key={row.key} className="flex items-center justify-between rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bell className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{row.label}</p>
                  <p className="text-xs text-muted-foreground">{row.desc}</p>
                </div>
              </div>
              <Switch
                checked={prefs[row.key]}
                onCheckedChange={(v) => setPrefs((p) => ({ ...p, [row.key]: v }))}
              />
            </div>
          ))}
          <div className="flex justify-end pt-1">
            <Button variant="gradient" onClick={save}>
              <Save /> Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const SESSIONS = [
  { id: "s1", device: "MacBook Pro · Chrome", icon: Laptop, location: "Springfield, US", time: "Active now" },
  { id: "s2", device: "iPhone 15 · Safari", icon: Smartphone, location: "Chicago, US", time: "2 hours ago" },
  { id: "s3", device: "iPad Air · Safari", icon: Tablet, location: "Denver, US", time: "Yesterday" },
];

function SecurityTab() {
  const { toast } = useToast();
  const [twoFactor, setTwoFactor] = React.useState(false);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Password updated", description: "Your password has been changed.", variant: "success" });
  };

  return (
    <div className="max-w-3xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Change Password</CardTitle>
          <CardDescription>Use a strong password you don't reuse elsewhere.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="gradient">
                <Save /> Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="text-sm font-medium">Authenticator app</p>
              <p className="text-xs text-muted-foreground">Require a one-time code at sign-in.</p>
            </div>
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Sessions</CardTitle>
          <CardDescription>Devices currently signed in to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {SESSIONS.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <s.icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{s.device}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.location} · {s.time}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast({ title: "Session revoked", description: `${s.device} signed out.`, variant: "warning" })}
              >
                Revoke
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
