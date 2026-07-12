-- TransitOps: Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ============================================================
-- VEHICLES
-- ============================================================
CREATE TABLE IF NOT EXISTS vehicles (
  id                  TEXT PRIMARY KEY,
  registration_number TEXT NOT NULL,
  name                TEXT NOT NULL,
  model               TEXT NOT NULL,
  type                TEXT NOT NULL,
  max_load_kg         INTEGER NOT NULL DEFAULT 0,
  odometer            INTEGER NOT NULL DEFAULT 0,
  acquisition_cost    INTEGER NOT NULL DEFAULT 0,
  status              TEXT NOT NULL DEFAULT 'available',
  region              TEXT NOT NULL DEFAULT '',
  purchase_date       TEXT NOT NULL DEFAULT '',
  fuel_efficiency     REAL NOT NULL DEFAULT 0,
  image_color         TEXT NOT NULL DEFAULT '#2563EB'
);

-- ============================================================
-- DRIVERS
-- ============================================================
CREATE TABLE IF NOT EXISTS drivers (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  license_number    TEXT NOT NULL,
  license_category  TEXT NOT NULL DEFAULT '',
  license_expiry    TEXT NOT NULL DEFAULT '',
  phone             TEXT NOT NULL DEFAULT '',
  email             TEXT NOT NULL DEFAULT '',
  safety_score      INTEGER NOT NULL DEFAULT 80,
  status            TEXT NOT NULL DEFAULT 'available',
  region            TEXT NOT NULL DEFAULT '',
  total_trips       INTEGER NOT NULL DEFAULT 0,
  rating            REAL NOT NULL DEFAULT 5.0,
  joined_date       TEXT NOT NULL DEFAULT '',
  avatar_color      TEXT NOT NULL DEFAULT '#2563EB'
);

-- ============================================================
-- TRIPS
-- ============================================================
CREATE TABLE IF NOT EXISTS trips (
  id               TEXT PRIMARY KEY,
  code             TEXT NOT NULL,
  source           TEXT NOT NULL,
  destination      TEXT NOT NULL,
  vehicle_id       TEXT NOT NULL,
  driver_id        TEXT NOT NULL,
  cargo_weight_kg  INTEGER NOT NULL DEFAULT 0,
  distance_km      INTEGER NOT NULL DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'draft',
  start_date       TEXT NOT NULL DEFAULT '',
  end_date         TEXT,
  fuel_used_l      REAL NOT NULL DEFAULT 0,
  expense          INTEGER NOT NULL DEFAULT 0,
  revenue          INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- FUEL LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS fuel_logs (
  id          TEXT PRIMARY KEY,
  vehicle_id  TEXT NOT NULL,
  date        TEXT NOT NULL,
  liters      INTEGER NOT NULL DEFAULT 0,
  cost        REAL NOT NULL DEFAULT 0,
  odometer    INTEGER NOT NULL DEFAULT 0,
  efficiency  REAL NOT NULL DEFAULT 0,
  station     TEXT NOT NULL DEFAULT ''
);

-- ============================================================
-- MAINTENANCE
-- ============================================================
CREATE TABLE IF NOT EXISTS maintenance (
  id          TEXT PRIMARY KEY,
  vehicle_id  TEXT NOT NULL,
  issue       TEXT NOT NULL,
  mechanic    TEXT NOT NULL DEFAULT '',
  start_date  TEXT NOT NULL DEFAULT '',
  end_date    TEXT,
  cost        INTEGER NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'scheduled',
  category    TEXT NOT NULL DEFAULT ''
);

-- ============================================================
-- EXPENSES
-- ============================================================
CREATE TABLE IF NOT EXISTS expenses (
  id          TEXT PRIMARY KEY,
  type        TEXT NOT NULL,
  amount      INTEGER NOT NULL DEFAULT 0,
  vehicle_id  TEXT,
  date        TEXT NOT NULL DEFAULT '',
  notes       TEXT NOT NULL DEFAULT '',
  approved    BOOLEAN NOT NULL DEFAULT FALSE
);

-- ============================================================
-- DOCUMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS documents (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  type           TEXT NOT NULL,
  linked_to      TEXT NOT NULL DEFAULT '',
  uploaded_date  TEXT NOT NULL DEFAULT '',
  expiry_date    TEXT NOT NULL DEFAULT '',
  size_kb        INTEGER NOT NULL DEFAULT 0,
  status         TEXT NOT NULL DEFAULT 'valid'
);

-- ============================================================
-- APP USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS app_users (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'Driver',
  status        TEXT NOT NULL DEFAULT 'active',
  last_active   TEXT NOT NULL DEFAULT '',
  avatar_color  TEXT NOT NULL DEFAULT '#2563EB'
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id       TEXT PRIMARY KEY,
  type     TEXT NOT NULL,
  title    TEXT NOT NULL,
  message  TEXT NOT NULL DEFAULT '',
  time     TEXT NOT NULL DEFAULT '',
  read     BOOLEAN NOT NULL DEFAULT FALSE
);

-- ============================================================
-- Disable RLS for demo (enable in production!)
-- ============================================================
ALTER TABLE vehicles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips       ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_logs   ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents   ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_users   ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for demo
CREATE POLICY "Allow all for anon" ON vehicles    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON drivers     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON trips       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON fuel_logs   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON maintenance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON expenses    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON documents   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON app_users   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for anon" ON notifications FOR ALL USING (true) WITH CHECK (true);
