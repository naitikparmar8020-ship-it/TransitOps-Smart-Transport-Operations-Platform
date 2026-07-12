export type VehicleStatus = "available" | "on-trip" | "in-shop" | "retired";
export type VehicleType = "Truck" | "Van" | "Trailer" | "Pickup" | "Tanker" | "Bus";

export interface Vehicle {
  id: string;
  registrationNumber: string;
  name: string;
  model: string;
  type: VehicleType;
  maxLoadKg: number;
  odometer: number;
  acquisitionCost: number;
  status: VehicleStatus;
  region: string;
  purchaseDate: string;
  fuelEfficiency: number; // km/L
  imageColor: string;
}

export type DriverStatus = "available" | "on-trip" | "off-duty" | "suspended";

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  phone: string;
  email: string;
  safetyScore: number;
  status: DriverStatus;
  region: string;
  totalTrips: number;
  rating: number;
  joinedDate: string;
  avatarColor: string;
}

export type TripStatus = "draft" | "dispatched" | "completed" | "cancelled";

export interface Trip {
  id: string;
  code: string;
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeightKg: number;
  distanceKm: number;
  status: TripStatus;
  startDate: string;
  endDate: string | null;
  fuelUsedL: number;
  expense: number;
  revenue: number;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  date: string;
  liters: number;
  cost: number;
  odometer: number;
  efficiency: number; // km/L
  station: string;
}

export type MaintenanceStatus = "scheduled" | "in-progress" | "completed";

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  issue: string;
  mechanic: string;
  startDate: string;
  endDate: string | null;
  cost: number;
  status: MaintenanceStatus;
  category: string;
}

export type ExpenseType = "Fuel" | "Maintenance" | "Toll" | "Insurance" | "Salary" | "Other";

export interface Expense {
  id: string;
  type: ExpenseType;
  amount: number;
  vehicleId: string | null;
  date: string;
  notes: string;
  approved: boolean;
}

export type DocumentType =
  | "Vehicle Insurance"
  | "RC Book"
  | "Fitness"
  | "Permit"
  | "Driver License"
  | "Medical Certificate";

export interface DocumentRecord {
  id: string;
  name: string;
  type: DocumentType;
  linkedTo: string;
  uploadedDate: string;
  expiryDate: string;
  sizeKb: number;
  status: "valid" | "expiring" | "expired";
}

export type UserRole =
  | "Admin"
  | "Fleet Manager"
  | "Driver"
  | "Safety Officer"
  | "Financial Analyst";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  lastActive: string;
  avatarColor: string;
}

export type NotificationType =
  | "license"
  | "maintenance"
  | "trip"
  | "fuel"
  | "expense";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}
