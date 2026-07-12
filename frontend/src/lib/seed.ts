/**
 * Seed script — run once to populate Supabase tables with demo data.
 * 
 * Usage:  Open your app in the browser, open the DevTools console, and run:
 *   import('/src/lib/seed.ts').then(m => m.seedAll())
 * 
 * Or call seedAll() from a temporary button in the UI.
 */
import {
  vehicleService,
  driverService,
  tripService,
  fuelLogService,
  maintenanceService,
  expenseService,
  documentService,
  userService,
  notificationService,
} from "./services";
import {
  vehicles,
  drivers,
  trips,
  fuelLogs,
  maintenance,
  expenses,
  documents,
  users,
  notifications,
} from "@/data";

export async function seedAll() {
  console.log("🌱 Seeding Supabase tables...");
  try {
    console.log("  → vehicles...");
    await vehicleService.upsertMany(vehicles);

    console.log("  → drivers...");
    await driverService.upsertMany(drivers);

    console.log("  → trips...");
    await tripService.upsertMany(trips);

    console.log("  → fuel_logs...");
    await fuelLogService.upsertMany(fuelLogs);

    console.log("  → maintenance...");
    await maintenanceService.upsertMany(maintenance);

    console.log("  → expenses...");
    await expenseService.upsertMany(expenses);

    console.log("  → documents...");
    await documentService.upsertMany(documents);

    console.log("  → app_users...");
    await userService.upsertMany(users);

    console.log("  → notifications...");
    await notificationService.upsertMany(notifications);

    console.log("✅ All tables seeded successfully!");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    throw err;
  }
}
