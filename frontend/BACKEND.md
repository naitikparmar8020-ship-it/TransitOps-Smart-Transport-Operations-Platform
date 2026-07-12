# TransitOps — Backend (Supabase) Guide

This app uses **Supabase directly from the frontend** — no separate Node server.
Supabase gives you a Postgres database **plus** an auto-generated secure REST API
**plus** authentication. The React app talks to it through one client.

---

## 🧩 The two layers you asked for

| Layer | File(s) | What it is |
|---|---|---|
| **Database** | [`supabase/schema.sql`](supabase/schema.sql) + [`supabase/seed.sql`](supabase/seed.sql) | Tables, enums, relationships, security rules (RLS), and demo data. Runs inside Supabase. |
| **Backend / data layer** | [`src/lib/supabaseClient.ts`](src/lib/supabaseClient.ts) + [`src/lib/api.ts`](src/lib/api.ts) | The typed functions the React app calls to read/write data + auth. |

Supporting files:
- [`src/context/AuthContext.tsx`](src/context/AuthContext.tsx) — real login/session (Supabase Auth)
- [`src/lib/useSupabaseQuery.ts`](src/lib/useSupabaseQuery.ts) — tiny hook for loading/error state
- [`.env.example`](.env.example) — the two keys you paste in

---

## 🔗 How everything connects

```
┌──────────────────────────────────────────────────────────────────┐
│                        REACT FRONTEND (browser)                     │
│                                                                     │
│   Pages (Dashboard, Vehicles, Trips …)                              │
│        │  call typed functions                                      │
│        ▼                                                            │
│   src/lib/api.ts            ── vehiclesApi.list(), tripsApi.create()│
│        │  uses                                                      │
│        ▼                                                            │
│   src/lib/supabaseClient.ts ── one createClient(URL, ANON_KEY)      │
│        │                                                            │
│   src/context/AuthContext   ── supabase.auth.signIn / session       │
└────────┼────────────────────────────────────────────────────────── ┘
         │  HTTPS (REST) + JWT of the logged-in user
         ▼
┌──────────────────────────────────────────────────────────────────┐
│                            SUPABASE                                 │
│                                                                     │
│   Auth  ──►  auth.users        (email/password, Google)             │
│                 │ trigger on signup                                 │
│                 ▼                                                   │
│   Postgres DB ► profiles, vehicles, drivers, trips, fuel_logs,      │
│                 maintenance, expenses, documents, notifications     │
│                                                                     │
│   RLS policies decide what each logged-in user may read/write       │
└──────────────────────────────────────────────────────────────────┘
```

**The chain in one sentence:** a page calls `api.ts` → which uses the shared
`supabaseClient` → which sends an authenticated HTTPS request to Supabase →
Postgres checks the **RLS policy** using the logged-in user's JWT → returns JSON
whose fields already match the TypeScript types in `src/types`.

**Why column names are camelCase:** the DB columns are quoted camelCase
(`"registrationNumber"`, `"maxLoadKg"`…), so the JSON Supabase returns is a
drop-in match for the `Vehicle` / `Driver` / `Trip` types — no mapping code.

---

## ⚙️ Setup (5 steps)

1. **Create a Supabase project** at https://supabase.com (free tier is fine).

2. **Run the schema:** Supabase Dashboard → **SQL Editor** → New query →
   paste all of `supabase/schema.sql` → **Run**.

3. **Seed demo data:** New query → paste `supabase/seed.sql` → **Run**.
   Verify: `select count(*) from trips;` → `120`.

4. **Add your keys:** Dashboard → **Settings → API**. Copy **Project URL** and the
   **anon public** key. In the project root create **`.env.local`**:

   ```
   VITE_SUPABASE_URL=https://YOUR-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

   > This is what you meant by "database URL" — for the browser we use the
   > **Project URL + anon key**, *not* the Postgres connection string.

5. **Install & run:**
   ```bash
   npm install        # pulls in @supabase/supabase-js
   npm run dev
   ```

### Auth note (important for the demo)
By default Supabase requires **email confirmation** on sign-up. For a smooth demo:
Dashboard → **Authentication → Providers → Email** → turn **"Confirm email" OFF**.
Then "Create account" logs you straight in. (For Google: enable the Google provider
and add your OAuth credentials.)

---

## 🔌 Connecting a page to real data

Pages currently import dummy data from `@/data`. To make one live, swap the import
for an `api.ts` call via the hook. Example for **Vehicles**:

```tsx
// BEFORE (dummy)
import { vehicles as seed } from "@/data";
const [data] = React.useState(seed);

// AFTER (live Supabase)
import { vehiclesApi } from "@/lib/api";
import { useSupabaseQuery } from "@/lib/useSupabaseQuery";

const { data: vehicles, loading, error, refetch } = useSupabaseQuery(
  () => vehiclesApi.list(),
);
const data = vehicles ?? [];
// show a spinner while `loading`, an error banner if `error`
```

Creating / updating / deleting:

```tsx
await vehiclesApi.create({ registrationNumber, name, type, /* … */ });
await vehiclesApi.update("VH-001", { status: "in-shop" });
await vehiclesApi.remove("VH-001");
refetch(); // reload the list
```

Available modules in `api.ts`:
`vehiclesApi`, `driversApi`, `tripsApi`, `fuelApi`, `maintenanceApi`,
`expensesApi`, `documentsApi`, `notificationsApi`, `usersApi`, and
`getDashboardData()`.

---

## 🔐 Security model (RLS)

Row Level Security is **ON** for every table. The hackathon policy is:
*any signed-in user can read & write fleet data; profiles are read by all but
only self-editable.* Because RLS blocks everything by default, the anon key in the
browser is safe. Tighten policies per role (e.g. only `Financial Analyst` writes
expenses) before production — edit the `create policy` blocks in `schema.sql`.

---

## ✅ Quick checklist
- [ ] schema.sql run (tables exist)
- [ ] seed.sql run (120 trips)
- [ ] `.env.local` filled with Project URL + anon key
- [ ] Email confirmation OFF (for demo) / Google provider configured
- [ ] `npm install && npm run dev`
- [ ] Create account → lands on Dashboard
