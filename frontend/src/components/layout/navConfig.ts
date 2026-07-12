import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  Receipt,
  FileBarChart,
  BarChart3,
  FileText,
  UserCog,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", to: "/app/dashboard", icon: LayoutDashboard },
  { label: "Vehicles", to: "/app/vehicles", icon: Truck },
  { label: "Drivers", to: "/app/drivers", icon: Users },
  { label: "Trips", to: "/app/trips", icon: Route },
  { label: "Maintenance", to: "/app/maintenance", icon: Wrench },
  { label: "Fuel Logs", to: "/app/fuel", icon: Fuel },
  { label: "Expenses", to: "/app/expenses", icon: Receipt },
  { label: "Reports", to: "/app/reports", icon: FileBarChart },
  { label: "Analytics", to: "/app/analytics", icon: BarChart3 },
  { label: "Documents", to: "/app/documents", icon: FileText },
  { label: "Users", to: "/app/users", icon: UserCog },
  { label: "Settings", to: "/app/settings", icon: Settings },
];
