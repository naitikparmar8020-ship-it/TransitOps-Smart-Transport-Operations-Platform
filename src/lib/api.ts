// ============================================================================
// TransitOps — BACKEND DATA LAYER
// ----------------------------------------------------------------------------
// Typed CRUD helpers over Supabase. Pages import from here instead of "@/data".
// Because DB columns are camelCase, the rows returned already match the
// TypeScript types in src/types — no field mapping required.
//
// Every function throws on error (so you can try/catch or use the
// useSupabaseQuery hook which captures the error for you).
// ============================================================================
import { supabase } from "./supabaseClient";
import type {
  Vehicle,
  Driver,
  Trip,
  FuelLog,
  MaintenanceRecord,
  Expense,
  DocumentRecord,
  AppNotification,
  AppUser,
} from "@/types";

async function unwrap<T>(promise: PromiseLike<{ data: T | null; error: any }>): Promise<T> {
  const { data, error } = await promise;
  if (error) throw new Error(error.message ?? "Supabase request failed");
  return data as T;
}

/* ----------------------------- VEHICLES ---------------------------------- */
export const vehiclesApi = {
  list: () =>
    unwrap<Vehicle[]>(supabase.from("vehicles").select("*").order("registrationNumber")),
  get: (id: string) =>
    unwrap<Vehicle>(supabase.from("vehicles").select("*").eq("id", id).single()),
  create: (v: Omit<Vehicle, "id"> & { id?: string }) =>
    unwrap<Vehicle>(
      supabase
        .from("vehicles")
        .insert({ id: v.id ?? `VH-${crypto.randomUUID().slice(0, 8)}`, ...v })
        .select()
        .single(),
    ),
  update: (id: string, patch: Partial<Vehicle>) =>
    unwrap<Vehicle>(supabase.from("vehicles").update(patch).eq("id", id).select().single()),
  remove: (id: string) => unwrap(supabase.from("vehicles").delete().eq("id", id)),
};

/* ------------------------------ DRIVERS ---------------------------------- */
export const driversApi = {
  list: () => unwrap<Driver[]>(supabase.from("drivers").select("*").order("name")),
  get: (id: string) =>
    unwrap<Driver>(supabase.from("drivers").select("*").eq("id", id).single()),
  create: (d: Omit<Driver, "id"> & { id?: string }) =>
    unwrap<Driver>(
      supabase
        .from("drivers")
        .insert({ id: d.id ?? `DR-${crypto.randomUUID().slice(0, 8)}`, ...d })
        .select()
        .single(),
    ),
  update: (id: string, patch: Partial<Driver>) =>
    unwrap<Driver>(supabase.from("drivers").update(patch).eq("id", id).select().single()),
  remove: (id: string) => unwrap(supabase.from("drivers").delete().eq("id", id)),
};

/* ------------------------------- TRIPS ----------------------------------- */
export const tripsApi = {
  list: () => unwrap<Trip[]>(supabase.from("trips").select("*").order("startDate", { ascending: false })),
  get: (id: string) => unwrap<Trip>(supabase.from("trips").select("*").eq("id", id).single()),
  byDriver: (driverId: string) =>
    unwrap<Trip[]>(supabase.from("trips").select("*").eq("driverId", driverId)),
  create: (t: Omit<Trip, "id"> & { id?: string }) =>
    unwrap<Trip>(
      supabase
        .from("trips")
        .insert({ id: t.id ?? `TR-${crypto.randomUUID().slice(0, 8)}`, ...t })
        .select()
        .single(),
    ),
  update: (id: string, patch: Partial<Trip>) =>
    unwrap<Trip>(supabase.from("trips").update(patch).eq("id", id).select().single()),
  remove: (id: string) => unwrap(supabase.from("trips").delete().eq("id", id)),
};

/* ------------------------------ FUEL LOGS -------------------------------- */
export const fuelApi = {
  list: () => unwrap<FuelLog[]>(supabase.from("fuel_logs").select("*").order("date", { ascending: false })),
  create: (f: Omit<FuelLog, "id"> & { id?: string }) =>
    unwrap<FuelLog>(
      supabase
        .from("fuel_logs")
        .insert({ id: f.id ?? `FL-${crypto.randomUUID().slice(0, 8)}`, ...f })
        .select()
        .single(),
    ),
  remove: (id: string) => unwrap(supabase.from("fuel_logs").delete().eq("id", id)),
};

/* ---------------------------- MAINTENANCE -------------------------------- */
export const maintenanceApi = {
  list: () =>
    unwrap<MaintenanceRecord[]>(supabase.from("maintenance").select("*").order("startDate", { ascending: false })),
  create: (m: Omit<MaintenanceRecord, "id"> & { id?: string }) =>
    unwrap<MaintenanceRecord>(
      supabase
        .from("maintenance")
        .insert({ id: m.id ?? `MT-${crypto.randomUUID().slice(0, 8)}`, ...m })
        .select()
        .single(),
    ),
  update: (id: string, patch: Partial<MaintenanceRecord>) =>
    unwrap<MaintenanceRecord>(
      supabase.from("maintenance").update(patch).eq("id", id).select().single(),
    ),
  remove: (id: string) => unwrap(supabase.from("maintenance").delete().eq("id", id)),
};

/* ------------------------------ EXPENSES --------------------------------- */
export const expensesApi = {
  list: () => unwrap<Expense[]>(supabase.from("expenses").select("*").order("date", { ascending: false })),
  create: (e: Omit<Expense, "id"> & { id?: string }) =>
    unwrap<Expense>(
      supabase
        .from("expenses")
        .insert({ id: e.id ?? `EX-${crypto.randomUUID().slice(0, 8)}`, ...e })
        .select()
        .single(),
    ),
  update: (id: string, patch: Partial<Expense>) =>
    unwrap<Expense>(supabase.from("expenses").update(patch).eq("id", id).select().single()),
  remove: (id: string) => unwrap(supabase.from("expenses").delete().eq("id", id)),
};

/* ------------------------------ DOCUMENTS -------------------------------- */
export const documentsApi = {
  list: () =>
    unwrap<DocumentRecord[]>(supabase.from("documents").select("*").order("uploadedDate", { ascending: false })),
  create: (d: Omit<DocumentRecord, "id"> & { id?: string }) =>
    unwrap<DocumentRecord>(
      supabase
        .from("documents")
        .insert({ id: d.id ?? `DOC-${crypto.randomUUID().slice(0, 8)}`, ...d })
        .select()
        .single(),
    ),
  remove: (id: string) => unwrap(supabase.from("documents").delete().eq("id", id)),
};

/* ---------------------------- NOTIFICATIONS ------------------------------ */
export const notificationsApi = {
  list: () =>
    unwrap<AppNotification[]>(
      supabase.from("notifications").select("*").order("created_at", { ascending: false }),
    ),
  markAllRead: () => unwrap(supabase.from("notifications").update({ read: true }).neq("id", "")),
};

/* ------------------------------- USERS ----------------------------------- */
export const usersApi = {
  list: () => unwrap<AppUser[]>(supabase.from("profiles").select("*").order("name")),
};

/* -------------------------- DASHBOARD METRICS ---------------------------- *
 * Convenience aggregate — fetches everything the dashboard needs at once.
 * Compute derived KPIs/chart series on the client from these arrays.
 * -------------------------------------------------------------------------- */
export async function getDashboardData() {
  const [vehicles, drivers, trips, expenses, maintenance] = await Promise.all([
    vehiclesApi.list(),
    driversApi.list(),
    tripsApi.list(),
    expensesApi.list(),
    maintenanceApi.list(),
  ]);
  return { vehicles, drivers, trips, expenses, maintenance };
}
