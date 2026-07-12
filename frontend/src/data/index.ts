import type {
  Vehicle,
  VehicleStatus,
  VehicleType,
  Driver,
  DriverStatus,
  Trip,
  TripStatus,
  FuelLog,
  MaintenanceRecord,
  MaintenanceStatus,
  Expense,
  ExpenseType,
  DocumentRecord,
  DocumentType,
  AppUser,
  UserRole,
  AppNotification,
} from "@/types";

/* ------------------------------------------------------------------ */
/* Seeded RNG so the demo data stays stable between renders            */
/* ------------------------------------------------------------------ */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260712);

const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
const randInt = (min: number, max: number) =>
  Math.floor(rng() * (max - min + 1)) + min;
const randFloat = (min: number, max: number, dp = 1) =>
  parseFloat((rng() * (max - min) + min).toFixed(dp));

function daysAgo(days: number) {
  const d = new Date("2026-07-12T00:00:00");
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}
function daysAhead(days: number) {
  return daysAgo(-days);
}

/* ------------------------------------------------------------------ */
/* Reference pools                                                     */
/* ------------------------------------------------------------------ */
const REGIONS = ["North", "South", "East", "West", "Central"];
const COLORS = [
  "#2563EB",
  "#10B981",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#EC4899",
  "#14B8A6",
];
const VEHICLE_TYPES: VehicleType[] = [
  "Truck",
  "Van",
  "Trailer",
  "Pickup",
  "Tanker",
  "Bus",
];
const VEHICLE_MODELS: Record<VehicleType, string[]> = {
  Truck: ["Volvo FH16", "Scania R500", "MAN TGX", "Freightliner Cascadia"],
  Van: ["Ford Transit", "Mercedes Sprinter", "Renault Master"],
  Trailer: ["Utility 3000R", "Great Dane Everest", "Wabash DuraPlate"],
  Pickup: ["Ford F-150", "Toyota Hilux", "RAM 1500"],
  Tanker: ["Kenworth T880", "Peterbilt 579", "International HX"],
  Bus: ["Volvo 9700", "Scania Touring", "MAN Lion's Coach"],
};
const FIRST = [
  "James", "Maria", "Robert", "Aisha", "David", "Priya", "Michael", "Sofia",
  "Daniel", "Elena", "Omar", "Grace", "Liam", "Nina", "Carlos", "Yuki",
  "Ahmed", "Laura", "Victor", "Chen", "Ravi", "Fatima", "Noah", "Ivy",
  "Marcus", "Zara", "Diego", "Hana", "Peter", "Amara", "Leo", "Mei",
  "Samuel", "Olga", "Tariq", "Bella", "George", "Nadia", "Frank", "Rosa",
];
const LAST = [
  "Anderson", "Kim", "Silva", "Khan", "Patel", "Johnson", "Garcia", "Nguyen",
  "Muller", "Rossi", "Haddad", "Okafor", "Walsh", "Ivanov", "Torres", "Tanaka",
  "Cohen", "Bauer", "Costa", "Wang", "Sharma", "Ali", "Brooks", "Fischer",
];
const CITIES = [
  "Metro City", "Northgate", "Port Harbor", "Lakeside", "Redwood", "Stonebridge",
  "Fairview", "Grandport", "Silvervale", "Easthaven", "Westfield", "Sunridge",
  "Cedar Falls", "Bayview", "Ironwood", "Crestwood",
];
const MECHANICS = [
  "AutoCare Center", "FleetFix Garage", "ProMech Services", "SpeedWorks",
  "TruckMedic", "PitStop Pro",
];
const ISSUES = [
  "Engine oil change", "Brake pad replacement", "Tire rotation", "Transmission repair",
  "Clutch replacement", "Battery replacement", "AC compressor fix", "Suspension overhaul",
  "Coolant flush", "Electrical wiring fix", "Wheel alignment", "Exhaust repair",
];
const MAINT_CAT = ["Preventive", "Corrective", "Inspection", "Emergency"];
const STATIONS = ["Shell", "BP", "TotalEnergies", "Petron", "Chevron", "Esso"];

const fullName = () => `${pick(FIRST)} ${pick(LAST)}`;

/* ------------------------------------------------------------------ */
/* Vehicles (25)                                                       */
/* ------------------------------------------------------------------ */
const vehicleStatuses: VehicleStatus[] = [
  ...Array(11).fill("available"),
  ...Array(7).fill("on-trip"),
  ...Array(4).fill("in-shop"),
  ...Array(3).fill("retired"),
];

export const vehicles: Vehicle[] = Array.from({ length: 25 }, (_, i) => {
  const type = VEHICLE_TYPES[i % VEHICLE_TYPES.length];
  const status = vehicleStatuses[i] ?? "available";
  const region = REGIONS[i % REGIONS.length];
  return {
    id: `VH-${String(i + 1).padStart(3, "0")}`,
    registrationNumber: `${pick(["TX", "CA", "NY", "FL", "WA"])}-${randInt(10, 99)}${pick(["AB", "KM", "ZR", "LP", "QT"])}-${randInt(1000, 9999)}`,
    name: `${type} ${String.fromCharCode(65 + (i % 26))}${i + 1}`,
    model: pick(VEHICLE_MODELS[type]),
    type,
    maxLoadKg: randInt(2, 40) * 500,
    odometer: randInt(15000, 320000),
    acquisitionCost: randInt(35, 180) * 1000,
    status,
    region,
    purchaseDate: daysAgo(randInt(120, 2200)),
    fuelEfficiency: randFloat(3.5, 12, 1),
    imageColor: COLORS[i % COLORS.length],
  };
});

/* ------------------------------------------------------------------ */
/* Drivers (40)                                                        */
/* ------------------------------------------------------------------ */
const driverStatuses: DriverStatus[] = [
  ...Array(15).fill("available"),
  ...Array(12).fill("on-trip"),
  ...Array(9).fill("off-duty"),
  ...Array(4).fill("suspended"),
];

export const drivers: Driver[] = Array.from({ length: 40 }, (_, i) => {
  const name = fullName();
  return {
    id: `DR-${String(i + 1).padStart(3, "0")}`,
    name,
    licenseNumber: `DL${randInt(100000, 999999)}${pick(["A", "B", "C", "D"])}`,
    licenseCategory: pick(["Class A", "Class B", "Class C", "Class A + HazMat"]),
    licenseExpiry: rng() > 0.75 ? daysAhead(randInt(5, 45)) : daysAhead(randInt(90, 1000)),
    phone: `+1 ${randInt(200, 989)}-${randInt(200, 999)}-${randInt(1000, 9999)}`,
    email: `${name.toLowerCase().replace(/[^a-z]/g, ".")}@transitops.io`,
    safetyScore: randInt(62, 99),
    status: driverStatuses[i] ?? "available",
    region: pick(REGIONS),
    totalTrips: randInt(12, 480),
    rating: randFloat(3.4, 5, 1),
    joinedDate: daysAgo(randInt(60, 2000)),
    avatarColor: COLORS[i % COLORS.length],
  };
});

/* ------------------------------------------------------------------ */
/* Trips (120)                                                         */
/* ------------------------------------------------------------------ */
const tripStatuses: TripStatus[] = [
  ...Array(64).fill("completed"),
  ...Array(30).fill("dispatched"),
  ...Array(16).fill("draft"),
  ...Array(10).fill("cancelled"),
];

export const trips: Trip[] = Array.from({ length: 120 }, (_, i) => {
  const status = tripStatuses[i % tripStatuses.length];
  const distance = randInt(45, 1600);
  const started = randInt(1, 180);
  let src = pick(CITIES);
  let dst = pick(CITIES);
  while (dst === src) dst = pick(CITIES);
  const fuelUsed = parseFloat((distance / randFloat(3.5, 10)).toFixed(1));
  return {
    id: `TR-${String(i + 1).padStart(4, "0")}`,
    code: `TRIP-${2026}${String(i + 1).padStart(3, "0")}`,
    source: src,
    destination: dst,
    vehicleId: vehicles[i % vehicles.length].id,
    driverId: drivers[i % drivers.length].id,
    cargoWeightKg: randInt(200, 22000),
    distanceKm: distance,
    status,
    startDate: daysAgo(started),
    endDate: status === "completed" ? daysAgo(started - randInt(0, 3)) : null,
    fuelUsedL: fuelUsed,
    expense: randInt(200, 4200),
    revenue: randInt(800, 9000),
  };
});

/* ------------------------------------------------------------------ */
/* Fuel logs (50)                                                      */
/* ------------------------------------------------------------------ */
export const fuelLogs: FuelLog[] = Array.from({ length: 50 }, (_, i) => {
  const liters = randInt(30, 320);
  const pricePerL = randFloat(1.1, 1.9, 2);
  return {
    id: `FL-${String(i + 1).padStart(3, "0")}`,
    vehicleId: vehicles[i % vehicles.length].id,
    date: daysAgo(randInt(1, 120)),
    liters,
    cost: parseFloat((liters * pricePerL).toFixed(2)),
    odometer: randInt(15000, 320000),
    efficiency: randFloat(3.5, 11, 1),
    station: pick(STATIONS),
  };
});

/* ------------------------------------------------------------------ */
/* Maintenance (30)                                                    */
/* ------------------------------------------------------------------ */
const maintStatuses: MaintenanceStatus[] = [
  ...Array(16).fill("completed"),
  ...Array(8).fill("in-progress"),
  ...Array(6).fill("scheduled"),
];

export const maintenance: MaintenanceRecord[] = Array.from({ length: 30 }, (_, i) => {
  const status = maintStatuses[i % maintStatuses.length];
  const start = randInt(1, 90);
  return {
    id: `MT-${String(i + 1).padStart(3, "0")}`,
    vehicleId: vehicles[i % vehicles.length].id,
    issue: pick(ISSUES),
    mechanic: pick(MECHANICS),
    startDate: status === "scheduled" ? daysAhead(randInt(1, 20)) : daysAgo(start),
    endDate: status === "completed" ? daysAgo(start - randInt(1, 5)) : null,
    cost: randInt(120, 4800),
    status,
    category: pick(MAINT_CAT),
  };
});

/* ------------------------------------------------------------------ */
/* Expenses (80)                                                       */
/* ------------------------------------------------------------------ */
const EXPENSE_TYPES: ExpenseType[] = [
  "Fuel", "Maintenance", "Toll", "Insurance", "Salary", "Other",
];
const NOTE_MAP: Record<ExpenseType, string[]> = {
  Fuel: ["Diesel refill", "Long-haul fuel", "Fleet fuel card"],
  Maintenance: ["Brake service", "Tire replacement", "Engine repair"],
  Toll: ["Highway toll", "Bridge toll", "Interstate pass"],
  Insurance: ["Quarterly premium", "Fleet coverage", "Liability renewal"],
  Salary: ["Driver payout", "Bonus", "Overtime"],
  Other: ["Parking", "Cleaning", "Permit fee", "Misc supplies"],
};

export const expenses: Expense[] = Array.from({ length: 80 }, (_, i) => {
  const type = EXPENSE_TYPES[i % EXPENSE_TYPES.length];
  return {
    id: `EX-${String(i + 1).padStart(3, "0")}`,
    type,
    amount: randInt(40, 6200),
    vehicleId: rng() > 0.2 ? vehicles[i % vehicles.length].id : null,
    date: daysAgo(randInt(1, 150)),
    notes: pick(NOTE_MAP[type]),
    approved: rng() > 0.25,
  };
});

/* ------------------------------------------------------------------ */
/* Documents                                                           */
/* ------------------------------------------------------------------ */
const DOC_TYPES: DocumentType[] = [
  "Vehicle Insurance", "RC Book", "Fitness", "Permit",
  "Driver License", "Medical Certificate",
];

export const documents: DocumentRecord[] = Array.from({ length: 28 }, (_, i) => {
  const type = DOC_TYPES[i % DOC_TYPES.length];
  const isDriverDoc = type === "Driver License" || type === "Medical Certificate";
  const linked = isDriverDoc ? drivers[i % drivers.length].id : vehicles[i % vehicles.length].id;
  const expDays = pick([-20, 12, 25, 120, 300, 600]);
  return {
    id: `DOC-${String(i + 1).padStart(3, "0")}`,
    name: `${type.replace(/\s/g, "_")}_${linked}.pdf`,
    type,
    linkedTo: linked,
    uploadedDate: daysAgo(randInt(30, 700)),
    expiryDate: daysAhead(expDays),
    sizeKb: randInt(120, 4200),
    status: expDays < 0 ? "expired" : expDays < 30 ? "expiring" : "valid",
  };
});

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */
const ROLES: UserRole[] = [
  "Admin", "Fleet Manager", "Driver", "Safety Officer", "Financial Analyst",
];

export const users: AppUser[] = Array.from({ length: 14 }, (_, i) => {
  const name = fullName();
  return {
    id: `USR-${String(i + 1).padStart(3, "0")}`,
    name,
    email: `${name.toLowerCase().replace(/[^a-z]/g, ".")}@transitops.io`,
    role: i === 0 ? "Admin" : pick(ROLES),
    status: rng() > 0.2 ? "active" : "inactive",
    lastActive: daysAgo(randInt(0, 30)),
    avatarColor: COLORS[i % COLORS.length],
  };
});

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */
export const notifications: AppNotification[] = [
  { id: "N1", type: "license", title: "License expiring soon", message: `${drivers[3].name}'s license expires in 12 days`, time: "10m ago", read: false },
  { id: "N2", type: "maintenance", title: "Maintenance due", message: `${vehicles[8].name} is scheduled for service tomorrow`, time: "42m ago", read: false },
  { id: "N3", type: "trip", title: "Trip assigned", message: `${trips[1].code} dispatched to ${drivers[1].name}`, time: "1h ago", read: false },
  { id: "N4", type: "fuel", title: "Fuel log added", message: `${fuelLogs[0].liters}L logged for ${vehicles[0].name}`, time: "3h ago", read: true },
  { id: "N5", type: "expense", title: "Expense approved", message: `Maintenance expense of $1,240 approved`, time: "5h ago", read: true },
  { id: "N6", type: "maintenance", title: "Service completed", message: `${vehicles[2].name} is back on the road`, time: "8h ago", read: true },
  { id: "N7", type: "license", title: "Document expired", message: `Permit for ${vehicles[5].name} has expired`, time: "1d ago", read: true },
  { id: "N8", type: "trip", title: "Trip completed", message: `${trips[0].code} arrived at ${trips[0].destination}`, time: "1d ago", read: true },
];

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */
export const vehicleById = (id: string) => vehicles.find((v) => v.id === id);
export const driverById = (id: string) => drivers.find((d) => d.id === id);

/* ------------------------------------------------------------------ */
/* Dashboard derived metrics + chart data                             */
/* ------------------------------------------------------------------ */
export const fleetStats = {
  active: vehicles.filter((v) => v.status === "on-trip").length,
  available: vehicles.filter((v) => v.status === "available").length,
  inShop: vehicles.filter((v) => v.status === "in-shop").length,
  retired: vehicles.filter((v) => v.status === "retired").length,
  activeTrips: trips.filter((t) => t.status === "dispatched").length,
  pendingTrips: trips.filter((t) => t.status === "draft").length,
  driversOnDuty: drivers.filter((d) => d.status === "on-trip").length,
  get utilization() {
    return Math.round((this.active / (vehicles.length - this.retired)) * 100);
  },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const utilizationTrend = MONTHS.slice(0, 12).map((m, i) => ({
  month: m,
  utilization: randInt(58, 92),
  target: 80,
}));

export const tripsOverview = MONTHS.slice(0, 12).map((m) => ({
  month: m,
  completed: randInt(20, 60),
  cancelled: randInt(1, 10),
  dispatched: randInt(10, 35),
}));

export const fuelConsumption = MONTHS.slice(0, 12).map((m) => ({
  month: m,
  liters: randInt(8000, 22000),
  cost: randInt(12000, 34000),
}));

export const vehicleStatusPie = [
  { name: "Available", value: fleetStats.available, color: "#10B981" },
  { name: "On Trip", value: fleetStats.active, color: "#2563EB" },
  { name: "In Shop", value: fleetStats.inShop, color: "#F59E0B" },
  { name: "Retired", value: fleetStats.retired, color: "#94A3B8" },
];

export const monthlyExpenses = MONTHS.slice(0, 12).map((m) => ({
  month: m,
  fuel: randInt(8000, 20000),
  maintenance: randInt(3000, 12000),
  other: randInt(2000, 9000),
}));

export const expenseByType = EXPENSE_TYPES.map((type, i) => ({
  name: type,
  value: expenses.filter((e) => e.type === type).reduce((s, e) => s + e.amount, 0),
  color: COLORS[i % COLORS.length],
}));

export const revenueVsCost = MONTHS.slice(0, 12).map((m) => {
  const revenue = randInt(40000, 95000);
  const cost = randInt(25000, 70000);
  return { month: m, revenue, cost, profit: revenue - cost };
});

export const regionActivity = REGIONS.map((region) => ({
  region,
  trips: trips.filter((t) => vehicleById(t.vehicleId)?.region === region).length,
  vehicles: vehicles.filter((v) => v.region === region).length,
}));

// heatmap: trips per weekday x hour-bucket
export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const HOUR_BUCKETS = ["00-04", "04-08", "08-12", "12-16", "16-20", "20-24"];
export const activityHeatmap = WEEKDAYS.map((day) => ({
  day,
  values: HOUR_BUCKETS.map((bucket) => ({ bucket, value: randInt(0, 100) })),
}));

export const fuelEfficiencyByType = VEHICLE_TYPES.map((type, i) => ({
  name: type,
  efficiency: parseFloat(
    (
      vehicles.filter((v) => v.type === type).reduce((s, v) => s + v.fuelEfficiency, 0) /
        Math.max(1, vehicles.filter((v) => v.type === type).length)
    ).toFixed(1),
  ),
  color: COLORS[i % COLORS.length],
}));

export const KPIS = {
  totalVehicles: vehicles.length,
  totalDrivers: drivers.length,
  totalTrips: trips.length,
  totalRevenue: revenueVsCost.reduce((s, r) => s + r.revenue, 0),
  totalCost: revenueVsCost.reduce((s, r) => s + r.cost, 0),
  totalFuelCost: expenses.filter((e) => e.type === "Fuel").reduce((s, e) => s + e.amount, 0),
  totalMaintenanceCost: expenses
    .filter((e) => e.type === "Maintenance")
    .reduce((s, e) => s + e.amount, 0),
};
