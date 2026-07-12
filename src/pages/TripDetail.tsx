import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Truck,
  Phone,
  ShieldCheck,
  Weight,
  Gauge,
  Fuel,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { trips, vehicleById, driverById } from "@/data";
import type { TripStatus } from "@/types";
import { formatCurrency, formatDate, formatNumber, cn } from "@/lib/utils";

const TIMELINE: { key: TripStatus | "in-transit"; label: string }[] = [
  { key: "draft", label: "Draft" },
  { key: "dispatched", label: "Dispatched" },
  { key: "in-transit", label: "In Transit" },
  { key: "completed", label: "Completed" },
];

/** Index of the current stage in the timeline for a given trip status. */
function currentStageIndex(status: TripStatus) {
  switch (status) {
    case "draft":
      return 0;
    case "dispatched":
      return 2; // dispatched trips are considered in-transit
    case "completed":
      return 3;
    case "cancelled":
      return 1;
    default:
      return 0;
  }
}

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const trip = trips.find((t) => t.id === id);

  if (!trip) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <MapPin className="size-12 text-muted-foreground" />
        <div>
          <h2 className="text-xl font-semibold">Trip not found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The trip you are looking for does not exist.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/app/trips")}>
          <ArrowLeft /> Back to Trips
        </Button>
      </div>
    );
  }

  const vehicle = vehicleById(trip.vehicleId);
  const driver = driverById(trip.driverId);
  const profit = trip.revenue - trip.expense;
  const profitable = profit >= 0;
  const stage = currentStageIndex(trip.status);

  const metrics = [
    { icon: Weight, label: "Cargo Weight", value: `${formatNumber(trip.cargoWeightKg)} kg` },
    { icon: Gauge, label: "Distance", value: `${formatNumber(trip.distanceKm)} km` },
    { icon: Fuel, label: "Fuel Used", value: `${formatNumber(trip.fuelUsedL)} L` },
    { icon: DollarSign, label: "Expense", value: formatCurrency(trip.expense) },
    { icon: DollarSign, label: "Revenue", value: formatCurrency(trip.revenue) },
  ];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2 w-fit" onClick={() => navigate("/app/trips")}>
        <ArrowLeft /> Back to Trips
      </Button>

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <PageHeader title={trip.code} description={`${trip.source} → ${trip.destination}`}>
          <StatusBadge status={trip.status} />
        </PageHeader>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Route map placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Route Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="relative h-72 overflow-hidden rounded-xl border"
                style={{
                  backgroundColor: "hsl(var(--muted))",
                  backgroundImage:
                    "linear-gradient(135deg, hsl(var(--primary)/0.08), hsl(var(--emerald)/0.08)), linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
                  backgroundSize: "100% 100%, 32px 32px, 32px 32px",
                }}
              >
                {/* dashed route line */}
                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                  <line
                    x1="18%"
                    y1="30%"
                    x2="82%"
                    y2="72%"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    strokeDasharray="8 6"
                  />
                </svg>

                {/* start marker */}
                <div className="absolute left-[18%] top-[30%] -translate-x-1/2 -translate-y-full">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-primary p-1.5 text-primary-foreground shadow-md">
                      <MapPin className="size-4" />
                    </div>
                    <span className="mt-1 rounded-md bg-card/90 px-2 py-0.5 text-xs font-medium shadow-sm">
                      {trip.source}
                    </span>
                  </div>
                </div>

                {/* end marker */}
                <div className="absolute left-[82%] top-[72%] -translate-x-1/2 -translate-y-full">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-emerald p-1.5 text-emerald-foreground shadow-md">
                      <MapPin className="size-4" />
                    </div>
                    <span className="mt-1 rounded-md bg-card/90 px-2 py-0.5 text-xs font-medium shadow-sm">
                      {trip.destination}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-card/90 px-3 py-1 text-xs text-muted-foreground shadow-sm">
                  Live GPS tracking (demo)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Trip Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-6 pl-6">
                <div className="absolute left-[7px] top-1 h-[calc(100%-1rem)] w-px bg-border" />
                {TIMELINE.map((s, i) => {
                  const done = i < stage;
                  const active = i === stage;
                  const dateLabel =
                    s.key === "draft" || s.key === "dispatched"
                      ? formatDate(trip.startDate)
                      : s.key === "completed" && trip.endDate
                        ? formatDate(trip.endDate)
                        : done || active
                          ? formatDate(trip.startDate)
                          : "Pending";
                  return (
                    <li key={s.key} className="relative">
                      <span
                        className={cn(
                          "absolute -left-6 top-0.5 size-3.5 rounded-full ring-4 ring-background",
                          done
                            ? "bg-emerald"
                            : active
                              ? "bg-primary"
                              : "bg-muted-foreground/40",
                        )}
                      />
                      <p
                        className={cn(
                          "text-sm font-medium",
                          done || active ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {s.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{dateLabel}</p>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Vehicle */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vehicle</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicle ? (
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-12 items-center justify-center rounded-xl text-white"
                    style={{ background: vehicle.imageColor }}
                  >
                    <Truck className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{vehicle.name}</p>
                    <p className="text-xs text-muted-foreground">{vehicle.model}</p>
                    <p className="text-xs text-muted-foreground">{vehicle.registrationNumber}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No vehicle assigned.</p>
              )}
            </CardContent>
          </Card>

          {/* Driver */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Driver</CardTitle>
            </CardHeader>
            <CardContent>
              {driver ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={driver.name} color={driver.avatarColor} size="lg" />
                    <div>
                      <p className="font-semibold">{driver.name}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="size-3" /> {driver.phone}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <ShieldCheck className="size-3.5" /> Safety Score
                      </span>
                      <span className="font-semibold">{driver.safetyScore}</span>
                    </div>
                    <Progress
                      value={driver.safetyScore}
                      className="h-1.5"
                      indicatorClassName={
                        driver.safetyScore >= 80
                          ? "bg-emerald"
                          : driver.safetyScore >= 65
                            ? "bg-amber-500"
                            : "bg-destructive"
                      }
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No driver assigned.</p>
              )}
            </CardContent>
          </Card>

          {/* Cargo & Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cargo & Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.map((m) => (
                <div key={m.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <m.icon className="size-4" /> {m.label}
                  </span>
                  <span className="font-medium">{m.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t pt-3 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  {profitable ? (
                    <TrendingUp className="size-4 text-emerald" />
                  ) : (
                    <TrendingDown className="size-4 text-destructive" />
                  )}
                  Profit
                </span>
                <span className={cn("font-semibold", profitable ? "text-emerald" : "text-destructive")}>
                  {formatCurrency(profit)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
