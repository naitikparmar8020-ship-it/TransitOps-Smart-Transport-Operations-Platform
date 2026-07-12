-- ============================================================================
-- TransitOps — SEED DATA
-- ----------------------------------------------------------------------------
-- Run AFTER schema.sql (Supabase SQL Editor). Re-runnable (clears first).
-- Generates: 25 vehicles, 40 drivers, 120 trips, 50 fuel logs,
--            30 maintenance records, 80 expenses, 28 documents, 8 notifications.
-- ============================================================================

-- Clear (children first for FK safety)
delete from public.notifications;
delete from public.documents;
delete from public.expenses;
delete from public.maintenance;
delete from public.fuel_logs;
delete from public.trips;
delete from public.drivers;
delete from public.vehicles;

-- ---------------------------------------------------------------------------
-- VEHICLES (25)
-- ---------------------------------------------------------------------------
insert into public.vehicles
  (id,"registrationNumber",name,model,type,"maxLoadKg",odometer,"acquisitionCost",status,region,"purchaseDate","fuelEfficiency","imageColor")
select
  'VH-'||lpad(g::text,3,'0'),
  (array['TX','CA','NY','FL','WA'])[1+floor(random()*5)]||'-'||(10+floor(random()*89))::int::text||(array['AB','KM','ZR','LP','QT'])[1+floor(random()*5)]||'-'||(1000+floor(random()*8999))::int::text,
  (array['Truck','Van','Trailer','Pickup','Tanker','Bus'])[1+((g-1)%6)]||' '||chr(65+((g-1)%26))||g::text,
  (array['Volvo FH16','Scania R500','Ford Transit','Mercedes Sprinter','Utility 3000R','Ford F-150','Kenworth T880','Volvo 9700'])[1+floor(random()*8)],
  (array['Truck','Van','Trailer','Pickup','Tanker','Bus'])[1+((g-1)%6)]::vehicle_type,
  ((2+floor(random()*38))*500)::int,
  (15000+floor(random()*305000))::int,
  ((35+floor(random()*145))*1000)::int,
  (array['available','available','on-trip','in-shop','retired'])[1+floor(random()*5)]::vehicle_status,
  (array['North','South','East','West','Central'])[1+((g-1)%5)],
  current_date - (120+floor(random()*2080))::int,
  round((3.5+random()*8.5)::numeric,1),
  (array['#2563EB','#10B981','#8B5CF6','#F59E0B','#EF4444','#06B6D4','#EC4899','#14B8A6'])[1+((g-1)%8)]
from generate_series(1,25) g;

-- ---------------------------------------------------------------------------
-- DRIVERS (40)
-- ---------------------------------------------------------------------------
insert into public.drivers
  (id,name,"licenseNumber","licenseCategory","licenseExpiry",phone,email,"safetyScore",status,region,"totalTrips",rating,"joinedDate","avatarColor")
select
  'DR-'||lpad(g::text,3,'0'),
  (array['James','Maria','Robert','Aisha','David','Priya','Michael','Sofia','Daniel','Elena','Omar','Grace','Liam','Nina','Carlos','Yuki'])[1+floor(random()*16)]
    ||' '||(array['Anderson','Kim','Silva','Khan','Patel','Johnson','Garcia','Nguyen','Muller','Rossi','Haddad','Okafor'])[1+floor(random()*12)],
  'DL'||(100000+floor(random()*899999))::int::text,
  (array['Class A','Class B','Class C','Class A + HazMat'])[1+floor(random()*4)],
  case when random()>0.75 then current_date+(5+floor(random()*40))::int else current_date+(90+floor(random()*900))::int end,
  '+1 '||(200+floor(random()*789))::int::text||'-'||(200+floor(random()*799))::int::text||'-'||(1000+floor(random()*8999))::int::text,
  'driver'||g::text||'@transitops.io',
  (62+floor(random()*37))::int,
  (array['available','available','on-trip','off-duty','suspended'])[1+floor(random()*5)]::driver_status,
  (array['North','South','East','West','Central'])[1+floor(random()*5)],
  (12+floor(random()*468))::int,
  round((3.4+random()*1.6)::numeric,1),
  current_date-(60+floor(random()*1940))::int,
  (array['#2563EB','#10B981','#8B5CF6','#F59E0B','#EF4444','#06B6D4','#EC4899','#14B8A6'])[1+((g-1)%8)]
from generate_series(1,40) g;

-- ---------------------------------------------------------------------------
-- TRIPS (120)
-- ---------------------------------------------------------------------------
insert into public.trips
  (id,code,source,destination,"vehicleId","driverId","cargoWeightKg","distanceKm",status,"startDate","endDate","fuelUsedL",expense,revenue)
select
  'TR-'||lpad(g::text,4,'0'),
  'TRIP-2026'||lpad(g::text,3,'0'),
  (array['Metro City','Northgate','Port Harbor','Lakeside','Redwood','Stonebridge','Fairview','Grandport'])[1+floor(random()*8)],
  (array['Silvervale','Easthaven','Westfield','Sunridge','Cedar Falls','Bayview','Ironwood','Crestwood'])[1+floor(random()*8)],
  'VH-'||lpad((1+floor(random()*25))::int::text,3,'0'),
  'DR-'||lpad((1+floor(random()*40))::int::text,3,'0'),
  (200+floor(random()*21800))::int,
  (45+floor(random()*1555))::int,
  (array['completed','completed','dispatched','draft','cancelled'])[1+floor(random()*5)]::trip_status,
  current_date-(1+floor(random()*180))::int,
  case when random()>0.4 then current_date-(floor(random()*3))::int else null end,
  round((50+random()*400)::numeric,1),
  (200+floor(random()*4000))::int,
  (800+floor(random()*8200))::int
from generate_series(1,120) g;

-- ---------------------------------------------------------------------------
-- FUEL LOGS (50)
-- ---------------------------------------------------------------------------
insert into public.fuel_logs
  (id,"vehicleId",date,liters,cost,odometer,efficiency,station)
select
  'FL-'||lpad(g::text,3,'0'),
  'VH-'||lpad((1+floor(random()*25))::int::text,3,'0'),
  current_date-(1+floor(random()*120))::int,
  round((30+random()*290)::numeric,1),
  round((40+random()*520)::numeric,2),
  (15000+floor(random()*305000))::int,
  round((3.5+random()*7.5)::numeric,1),
  (array['Shell','BP','TotalEnergies','Petron','Chevron','Esso'])[1+floor(random()*6)]
from generate_series(1,50) g;

-- ---------------------------------------------------------------------------
-- MAINTENANCE (30)
-- ---------------------------------------------------------------------------
insert into public.maintenance
  (id,"vehicleId",issue,mechanic,"startDate","endDate",cost,status,category)
select
  'MT-'||lpad(g::text,3,'0'),
  'VH-'||lpad((1+floor(random()*25))::int::text,3,'0'),
  (array['Engine oil change','Brake pad replacement','Tire rotation','Transmission repair','Battery replacement','AC compressor fix','Suspension overhaul','Coolant flush'])[1+floor(random()*8)],
  (array['AutoCare Center','FleetFix Garage','ProMech Services','SpeedWorks','TruckMedic','PitStop Pro'])[1+floor(random()*6)],
  current_date-(1+floor(random()*90))::int,
  case when random()>0.5 then current_date-(floor(random()*5))::int else null end,
  (120+floor(random()*4680))::int,
  (array['completed','completed','in-progress','scheduled'])[1+floor(random()*4)]::maintenance_status,
  (array['Preventive','Corrective','Inspection','Emergency'])[1+floor(random()*4)]
from generate_series(1,30) g;

-- ---------------------------------------------------------------------------
-- EXPENSES (80)
-- ---------------------------------------------------------------------------
insert into public.expenses
  (id,type,amount,"vehicleId",date,notes,approved)
select
  'EX-'||lpad(g::text,3,'0'),
  (array['Fuel','Maintenance','Toll','Insurance','Salary','Other'])[1+((g-1)%6)]::expense_type,
  (40+floor(random()*6160))::int,
  case when random()>0.2 then 'VH-'||lpad((1+floor(random()*25))::int::text,3,'0') else null end,
  current_date-(1+floor(random()*150))::int,
  (array['Diesel refill','Brake service','Highway toll','Quarterly premium','Driver payout','Parking','Cleaning','Permit fee'])[1+floor(random()*8)],
  random()>0.25
from generate_series(1,80) g;

-- ---------------------------------------------------------------------------
-- DOCUMENTS (28)
-- ---------------------------------------------------------------------------
insert into public.documents
  (id,name,type,"linkedTo","uploadedDate","expiryDate","sizeKb",status)
select
  'DOC-'||lpad(g::text,3,'0'),
  replace((array['Vehicle Insurance','RC Book','Fitness','Permit','Driver License','Medical Certificate'])[1+((g-1)%6)],' ','_')||'_'||g::text||'.pdf',
  (array['Vehicle Insurance','RC Book','Fitness','Permit','Driver License','Medical Certificate'])[1+((g-1)%6)]::document_type,
  case when ((g-1)%6) in (4,5)
       then 'DR-'||lpad((1+floor(random()*40))::int::text,3,'0')
       else 'VH-'||lpad((1+floor(random()*25))::int::text,3,'0') end,
  current_date-(30+floor(random()*670))::int,
  current_date + d.exp,
  (120+floor(random()*4080))::int,
  (case when d.exp < 0 then 'expired' when d.exp < 30 then 'expiring' else 'valid' end)::document_status
from generate_series(1,28) g
cross join lateral (select (array[-20,12,25,120,300,600])[1+floor(random()*6)] as exp) d;

-- ---------------------------------------------------------------------------
-- NOTIFICATIONS (8)
-- ---------------------------------------------------------------------------
insert into public.notifications (id,type,title,message,time,read) values
  ('N1','license','License expiring soon','A driver license expires in 12 days','10m ago',false),
  ('N2','maintenance','Maintenance due','A vehicle is scheduled for service tomorrow','42m ago',false),
  ('N3','trip','Trip assigned','TRIP-2026002 dispatched to a driver','1h ago',false),
  ('N4','fuel','Fuel log added','Fuel logged for a vehicle','3h ago',true),
  ('N5','expense','Expense approved','Maintenance expense of $1,240 approved','5h ago',true),
  ('N6','maintenance','Service completed','A vehicle is back on the road','8h ago',true),
  ('N7','license','Document expired','A vehicle permit has expired','1d ago',true),
  ('N8','trip','Trip completed','A trip arrived at its destination','1d ago',true);

-- ============================================================================
-- Done. Verify: select count(*) from public.trips;  -> 120
-- ============================================================================
