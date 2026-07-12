import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Route,
  CalendarClock,
  MapPin,
  Calendar,
  Phone,
  Mail,
  FileText,
  Download,
  Award,
  UserPlus,
  RefreshCw,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { drivers, trips } from "@/data";
import { cn, formatDate, formatNumber, daysUntil } from "@/lib/utils";

function scoreBar(score: number) {
  if (score >= 85) return "bg-emerald";
  if (score >= 70) return "bg-amber-500";
  return "bg-destructive";
}

function Stars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "size-5" : size === "sm" ? "size-3.5" : "size-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(sizeClass, i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")}
        />
      ))}
    </div>
  );
}

export default function DriverProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const driver = drivers.find((d) => d.id === id);

  if (!driver) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold">Driver not found</p>
        <p className="text-sm text-muted-foreground">The driver you are looking for does not exist.</p>
        <Button variant="outline" onClick={() => navigate("/app/drivers")}>
          <ArrowLeft /> Back to Drivers
        </Button>
      </div>
    );
  }

  const driverTrips = trips.filter((t) => t.driverId === driver.id).slice(0, 8);
  const licenseDays = daysUntil(driver.licenseExpiry);

  const documents = [
    { name: "Driver License", type: driver.licenseCategory, expiry: driver.licenseExpiry, status: licenseDays < 30 ? "expiring" : "valid" },
    { name: "Medical Certificate", type: "Class II Medical", expiry: "2027-03-18", status: "valid" },
    { name: "ID Proof", type: "National ID", expiry: "2029-11-02", status: "valid" },
    { name: "Training Certificate", type: "Defensive Driving", expiry: "2026-08-30", status: "expiring" },
  ];

  const reviews = [
    { reviewer: "Fleet Manager", rating: 5, comment: "Consistently on time and communicates clearly on every dispatch." },
    { reviewer: "Safety Officer", rating: driver.safetyScore >= 85 ? 5 : 4, comment: "Strong safety record with clean inspection logs this quarter." },
    { reviewer: "Dispatch Lead", rating: 4, comment: "Reliable on long-haul routes, handles route changes well." },
    { reviewer: "Operations", rating: 5, comment: "Great vehicle care and accurate trip reporting." },
  ];

  const history = [
    { icon: UserPlus, date: driver.joinedDate, title: "Joined TransitOps", description: "Onboarded as a fleet driver in the " + driver.region + " region." },
    { icon: Route, date: "2024-02-14", title: "First trip completed", description: "Completed inaugural dispatch without incident." },
    { icon: Award, date: "2024-09-05", title: "Safety award", description: "Recognized for maintaining a top-tier safety score." },
    { icon: RefreshCw, date: "2025-06-21", title: "License renewal", description: "Renewed " + driver.licenseCategory + " license and cleared medical review." },
    { icon: TrendingUp, date: "2026-01-12", title: "Promotion", description: "Promoted to senior driver for long-haul operations." },
  ];

  const statTiles: { icon: LucideIcon; label: string; value: string; progress?: number }[] = [
    { icon: ShieldCheck, label: "Safety Score", value: `${driver.safetyScore}%`, progress: driver.safetyScore },
    { icon: Route, label: "Total Trips", value: formatNumber(driver.totalTrips) },
    { icon: Star, label: "Rating", value: driver.rating.toFixed(1) },
    { icon: CalendarClock, label: "License Expiry", value: formatDate(driver.licenseExpiry) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/app/drivers")}>
          <ArrowLeft /> Back to Drivers
        </Button>
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Card className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar name={driver.name} color={driver.avatarColor} size="xl" />
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">{driver.name}</h1>
                  <StatusBadge status={driver.status} />
                  <Badge variant="outline">{driver.licenseCategory}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {driver.region}</span>
                  <span className="flex items-center gap-1"><Star className="size-3.5 fill-amber-400 text-amber-400" /> {driver.rating.toFixed(1)}</span>
                  <span className="flex items-center gap-1"><Calendar className="size-3.5" /> Joined {formatDate(driver.joinedDate)}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Phone className="size-3.5" /> {driver.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="size-3.5" /> {driver.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {statTiles.map((s) => (
              <div key={s.label} className="rounded-xl border p-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <s.icon className="size-3.5" /> {s.label}
                </div>
                <p className="mt-1 text-xl font-bold">{s.value}</p>
                {s.progress !== undefined && (
                  <Progress value={s.progress} className="mt-2 h-1.5" indicatorClassName={scoreBar(s.progress)} />
                )}
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="documents">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="trips">Trips</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Documents */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {documents.map((doc) => (
                <div key={doc.name} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.type} · Expires {formatDate(doc.expiry)}
                    </p>
                  </div>
                  <StatusBadge status={doc.status} />
                  <Button variant="ghost" size="icon-sm">
                    <Download />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trips */}
        <TabsContent value="trips">
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Trip</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Distance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {driverTrips.map((t) => (
                  <TableRow key={t.id} className="cursor-pointer" onClick={() => navigate(`/app/trips/${t.id}`)}>
                    <TableCell className="font-medium">{t.code}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {t.source} → {t.destination}
                    </TableCell>
                    <TableCell>{formatNumber(t.distanceKm)} km</TableCell>
                    <TableCell>
                      <StatusBadge status={t.status} />
                    </TableCell>
                  </TableRow>
                ))}
                {driverTrips.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                      No trips recorded for this driver yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Ratings */}
        <TabsContent value="ratings">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-5xl font-bold tracking-tight">{driver.rating.toFixed(1)}</p>
              <div className="mt-3">
                <Stars rating={driver.rating} size="lg" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Overall rating · {formatNumber(driver.totalTrips)} trips</p>
            </Card>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-2">
              {reviews.map((r, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{r.reviewer}</p>
                    <Stars rating={r.rating} size="sm" />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-6 border-l pl-6">
                {history.map((h, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[31px] flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-background">
                      <h.icon className="size-3.5" />
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDate(h.date)}</p>
                    <p className="text-sm font-semibold">{h.title}</p>
                    <p className="text-sm text-muted-foreground">{h.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
