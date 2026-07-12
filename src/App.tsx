import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Vehicles from "@/pages/Vehicles";
import Drivers from "@/pages/Drivers";
import DriverProfile from "@/pages/DriverProfile";
import Trips from "@/pages/Trips";
import TripDetail from "@/pages/TripDetail";
import Maintenance from "@/pages/Maintenance";
import Fuel from "@/pages/Fuel";
import Expenses from "@/pages/Expenses";
import Reports from "@/pages/Reports";
import Analytics from "@/pages/Analytics";
import Documents from "@/pages/Documents";
import Users from "@/pages/Users";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/login" element={<Login />} />

      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="drivers" element={<Drivers />} />
        <Route path="drivers/:id" element={<DriverProfile />} />
        <Route path="trips" element={<Trips />} />
        <Route path="trips/:id" element={<TripDetail />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="fuel" element={<Fuel />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="reports" element={<Reports />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="documents" element={<Documents />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
