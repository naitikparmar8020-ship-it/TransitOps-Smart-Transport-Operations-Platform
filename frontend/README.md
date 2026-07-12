# TransitOps — Smart Transport Operations Platform

A modern, premium, enterprise-grade **frontend** for a Transport / Fleet Management System.
Built for the hackathon with a professional logistics-SaaS look (SAP / Oracle Fleet / Uber Fleet vibe).

> Frontend only — all data is realistic **dummy JSON** generated in `src/data`. No backend required.

## ✨ Tech Stack

- **React 18 + TypeScript**
- **Vite** (dev server & build)
- **Tailwind CSS** (with CSS-variable theming + dark mode)
- **shadcn-style UI kit** (hand-built, self-contained — no Radix runtime needed)
- **Framer Motion** (page transitions, animated counters, micro-interactions)
- **Recharts** (line / bar / area / pie / heatmap)
- **Lucide React** (icons)
- **React Router v6**

## 🎨 Design

- Blue `#2563EB` + Emerald `#10B981` accent system, white / light-gray surfaces
- Full **dark mode** (toggle in navbar or Settings → Appearance)
- Glassmorphism, 16px rounded corners, soft shadows, smooth animations
- Fully **responsive** — desktop, tablet, mobile (collapsible sidebar + drawers)
- **Inter** typeface

## 🚀 Getting Started

> ⚠️ **Node.js is required and was not installed on this machine.**
> Install **Node.js 18+ (LTS)** from https://nodejs.org first, then:

```bash
# from the project root (D:\hackathon)
npm install
npm run dev
```

Open the URL Vite prints (default http://localhost:5173).

Other scripts:

```bash
npm run build     # type-check + production build to /dist
npm run preview   # preview the production build
```

### Demo login

The login page is pre-filled. Just pick a role and click **Sign in** (any valid-looking
email + 6-char password works — it's a mock auth stored in localStorage).

## 📁 Project Structure

```
src/
├─ main.tsx                # entry — Theme/Auth/Toast providers + Router
├─ App.tsx                 # route table (login + /app/* layout)
├─ index.css               # Tailwind + design tokens (light/dark CSS vars)
├─ lib/utils.ts            # cn(), formatters, helpers
├─ types/index.ts          # all TS domain types
├─ data/index.ts           # seeded dummy data (25 vehicles, 40 drivers, 120 trips, …)
├─ context/                # ThemeContext, AuthContext
├─ components/
│  ├─ ui/                  # button, card, badge, table, dialog, sheet, tabs, toast, …
│  ├─ common/              # KpiCard, ChartCard, PageHeader, StatusBadge, Avatar, Logo, AnimatedCounter
│  ├─ charts/              # ChartTooltip
│  └─ layout/              # AppLayout, Sidebar, Navbar, NotificationPanel, GlobalSearch
└─ pages/                  # Login, Dashboard, Vehicles, Drivers, Trips, Maintenance,
                           # Fuel, Expenses, Reports, Analytics, Documents, Users, Settings, …
```

## 🧭 Features / Pages

- **Login** — split-screen, gradient, role selector, validation, loading state, Google button
- **Dashboard** — 8 KPI cards, 5 charts, recent trips, latest maintenance/expenses, quick actions
- **Vehicles** — data table, filters/sort/search, detail drawer, add form, CSV import/export, pagination
- **Drivers** — card + table views, driver profile (documents / trips / ratings / history)
- **Trips** — table, 3-step creation wizard, trip detail with map placeholder + status timeline
- **Maintenance** — dashboard cards, cost chart, records table, new/close maintenance
- **Fuel Logs** — KPIs, consumption & efficiency charts, log table, add fuel log
- **Expenses** — KPIs, breakdown pie + trend, filters, expense table
- **Reports** — revenue vs cost, ROI, utilization, expense trend + CSV/PDF/Print
- **Analytics** — BI dashboard with activity heatmap, filters, mixed chart types
- **Documents** — category tiles, upload dialog, table with preview drawer
- **Users** — RBAC user table + roles & permissions matrix
- **Settings** — profile, company, appearance (theme/language), notifications, security
- **Global search** (⌘K / Ctrl+K), **notification center**, **toasts**, **dark mode**

## 📊 Dummy Data

Deterministically generated (seeded) in `src/data/index.ts`:
25 vehicles · 40 drivers · 120 trips · 50 fuel logs · 30 maintenance records · 80 expenses · documents · users · notifications.

---

Built with ❤️ for the hackathon.
