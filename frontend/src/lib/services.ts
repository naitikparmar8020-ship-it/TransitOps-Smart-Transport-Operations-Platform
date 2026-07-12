import { supabase } from "./supabase";
import { fromDb, fromDbArray, toDb } from "./mappers";
import type {
  Vehicle,
  Driver,
  Trip,
  FuelLog,
  MaintenanceRecord,
  Expense,
  DocumentRecord,
  AppUser,
  AppNotification,
} from "@/types";

/* ------------------------------------------------------------------ */
/* Generic helper                                                      */
/* ------------------------------------------------------------------ */
function createService<T extends { id: string }>(table: string) {
  return {
    async getAll(): Promise<T[]> {
      const { data, error } = await supabase.from(table).select("*");
      if (error) throw error;
      return fromDbArray<T>(data ?? []);
    },

    async getById(id: string): Promise<T | null> {
      const { data, error } = await supabase.from(table).select("*").eq("id", id).single();
      if (error) return null;
      return fromDb<T>(data);
    },

    async create(item: T): Promise<T> {
      const row = toDb(item as unknown as Record<string, unknown>);
      const { data, error } = await supabase.from(table).insert(row).select().single();
      if (error) throw error;
      return fromDb<T>(data);
    },

    async update(id: string, partial: Partial<T>): Promise<T> {
      const row = toDb(partial as unknown as Record<string, unknown>);
      const { data, error } = await supabase.from(table).update(row).eq("id", id).select().single();
      if (error) throw error;
      return fromDb<T>(data);
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },

    async upsertMany(items: T[]): Promise<void> {
      const rows = items.map((i) => toDb(i as unknown as Record<string, unknown>));
      const { error } = await supabase.from(table).upsert(rows);
      if (error) throw error;
    },
  };
}

/* ------------------------------------------------------------------ */
/* Typed services for each entity                                      */
/* ------------------------------------------------------------------ */
export const vehicleService      = createService<Vehicle>("vehicles");
export const driverService       = createService<Driver>("drivers");
export const tripService         = createService<Trip>("trips");
export const fuelLogService      = createService<FuelLog>("fuel_logs");
export const maintenanceService  = createService<MaintenanceRecord>("maintenance");
export const expenseService      = createService<Expense>("expenses");
export const documentService     = createService<DocumentRecord>("documents");
export const userService         = createService<AppUser>("app_users");
export const notificationService = createService<AppNotification>("notifications");
