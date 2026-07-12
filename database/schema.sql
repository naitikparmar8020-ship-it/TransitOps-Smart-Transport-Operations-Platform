-- ============================================================================
-- TransitOps — DATABASE SCHEMA (Supabase / Postgres)
-- ----------------------------------------------------------------------------
-- Run this in: Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Then run supabase/seed.sql to populate demo data.
--
-- Column names are kept in camelCase (quoted) so the JSON returned by the
-- Supabase REST API matches the TypeScript types in src/types/index.ts
-- exactly — no field mapping needed in the frontend.
-- ============================================================================

-- Optional hard reset — UNCOMMENT to wipe & recreate everything:
-- drop table if exists notifications, documents, expenses, maintenance,
--   fuel_logs, trips, drivers, vehicles, profiles cascade;
-- drop type if exists vehicle_status, vehicle_type, driver_status, trip_status,
--   maintenance_status, expense_type, document_type, document_status, user_role cascade;

-- ---------------------------------------------------------------------------
-- ENUM TYPES (idempotent)
-- ---------------------------------------------------------------------------
do $$ begin create type vehicle_status as enum ('available','on-trip','in-shop','retired'); exception when duplicate_object then null; end $$;
do $$ begin create type vehicle_type as enum ('Truck','Van','Trailer','Pickup','Tanker','Bus'); exception when duplicate_object then null; end $$;
do $$ begin create type driver_status as enum ('available','on-trip','off-duty','suspended'); exception when duplicate_object then null; end $$;
do $$ begin create type trip_status as enum ('draft','dispatched','completed','cancelled'); exception when duplicate_object then null; end $$;
do $$ begin create type maintenance_status as enum ('scheduled','in-progress','completed'); exception when duplicate_object then null; end $$;
do $$ begin create type expense_type as enum ('Fuel','Maintenance','Toll','Insurance','Salary','Other'); exception when duplicate_object then null; end $$;
do $$ begin create type document_type as enum ('Vehicle Insurance','RC Book','Fitness','Permit','Driver License','Medical Certificate'); exception when duplicate_object then null; end $$;
do $$ begin create type document_status as enum ('valid','expiring','expired'); exception when duplicate_object then null; end $$;
do $$ begin create type user_role as enum ('Admin','Fleet Manager','Driver','Safety Officer','Financial Analyst'); exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- PROFILES  (1 row per auth user — holds role, name, avatar)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  name         text,
  role         user_role     not null default 'Fleet Manager',
  "avatarColor" text         not null default '#2563EB',
  status       text          not null default 'active',
  "lastActive" timestamptz   not null default now(),
  created_at   timestamptz   not null default now()
);

-- ---------------------------------------------------------------------------
-- VEHICLES
-- ---------------------------------------------------------------------------
create table if not exists public.vehicles (
  id                  text primary key,
  "registrationNumber" text not null,
  name                text not null,
  model               text,
  type                vehicle_type not null,
  "maxLoadKg"         integer not null default 0,
  odometer            integer not null default 0,
  "acquisitionCost"   integer not null default 0,
  status              vehicle_status not null default 'available',
  region              text,
  "purchaseDate"      date,
  "fuelEfficiency"    double precision not null default 0,
  "imageColor"        text not null default '#2563EB',
  created_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- DRIVERS
-- ---------------------------------------------------------------------------
create table if not exists public.drivers (
  id                text primary key,
  name              text not null,
  "licenseNumber"   text not null,
  "licenseCategory" text,
  "licenseExpiry"   date,
  phone             text,
  email             text,
  "safetyScore"     integer not null default 0,
  status            driver_status not null default 'available',
  region            text,
  "totalTrips"      integer not null default 0,
  rating            double precision not null default 0,
  "joinedDate"      date,
  "avatarColor"     text not null default '#2563EB',
  created_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- TRIPS
-- ---------------------------------------------------------------------------
create table if not exists public.trips (
  id              text primary key,
  code            text not null,
  source          text not null,
  destination     text not null,
  "vehicleId"     text references public.vehicles(id) on delete set null,
  "driverId"      text references public.drivers(id) on delete set null,
  "cargoWeightKg" integer not null default 0,
  "distanceKm"    integer not null default 0,
  status          trip_status not null default 'draft',
  "startDate"     date,
  "endDate"       date,
  "fuelUsedL"     double precision not null default 0,
  expense         integer not null default 0,
  revenue         integer not null default 0,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- FUEL LOGS
-- ---------------------------------------------------------------------------
create table if not exists public.fuel_logs (
  id          text primary key,
  "vehicleId" text references public.vehicles(id) on delete cascade,
  date        date,
  liters      double precision not null default 0,
  cost        double precision not null default 0,
  odometer    integer not null default 0,
  efficiency  double precision not null default 0,
  station     text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- MAINTENANCE
-- ---------------------------------------------------------------------------
create table if not exists public.maintenance (
  id          text primary key,
  "vehicleId" text references public.vehicles(id) on delete cascade,
  issue       text,
  mechanic    text,
  "startDate" date,
  "endDate"   date,
  cost        integer not null default 0,
  status      maintenance_status not null default 'scheduled',
  category    text,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- EXPENSES
-- ---------------------------------------------------------------------------
create table if not exists public.expenses (
  id          text primary key,
  type        expense_type not null,
  amount      integer not null default 0,
  "vehicleId" text references public.vehicles(id) on delete set null,
  date        date,
  notes       text,
  approved    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- DOCUMENTS
-- ---------------------------------------------------------------------------
create table if not exists public.documents (
  id             text primary key,
  name           text not null,
  type           document_type not null,
  "linkedTo"     text,
  "uploadedDate" date,
  "expiryDate"   date,
  "sizeKb"       integer not null default 0,
  status         document_status not null default 'valid',
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- NOTIFICATIONS
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id         text primary key,
  type       text not null,
  title      text not null,
  message    text,
  time       text,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
create index if not exists idx_trips_vehicle on public.trips("vehicleId");
create index if not exists idx_trips_driver  on public.trips("driverId");
create index if not exists idx_trips_status  on public.trips(status);
create index if not exists idx_fuel_vehicle  on public.fuel_logs("vehicleId");
create index if not exists idx_maint_vehicle on public.maintenance("vehicleId");
create index if not exists idx_exp_type      on public.expenses(type);

-- ---------------------------------------------------------------------------
-- AUTH → PROFILE trigger: auto-create a profile row when a user signs up.
-- Reads name/role/avatarColor from the signup metadata.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role, "avatarColor")
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'Fleet Manager'),
    coalesce(new.raw_user_meta_data->>'avatarColor', '#2563EB')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- Hackathon policy: any signed-in (authenticated) user can read & write fleet
-- data; profiles are readable by all signed-in users but only self-updatable.
-- Tighten these per-role before production.
-- ---------------------------------------------------------------------------
alter table public.profiles      enable row level security;
alter table public.vehicles      enable row level security;
alter table public.drivers       enable row level security;
alter table public.trips         enable row level security;
alter table public.fuel_logs     enable row level security;
alter table public.maintenance   enable row level security;
alter table public.expenses      enable row level security;
alter table public.documents     enable row level security;
alter table public.notifications enable row level security;

-- profiles
drop policy if exists "profiles read"   on public.profiles;
drop policy if exists "profiles update" on public.profiles;
create policy "profiles read"   on public.profiles for select to authenticated using (true);
create policy "profiles update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- helper: apply full CRUD-to-authenticated on a table
do $$
declare t text;
begin
  foreach t in array array['vehicles','drivers','trips','fuel_logs','maintenance','expenses','documents','notifications']
  loop
    execute format('drop policy if exists "auth read %1$s" on public.%1$s;', t);
    execute format('drop policy if exists "auth write %1$s" on public.%1$s;', t);
    execute format('create policy "auth read %1$s"  on public.%1$s for select to authenticated using (true);', t);
    execute format('create policy "auth write %1$s" on public.%1$s for all   to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- ============================================================================
-- Done. Next: run supabase/seed.sql
-- ============================================================================
