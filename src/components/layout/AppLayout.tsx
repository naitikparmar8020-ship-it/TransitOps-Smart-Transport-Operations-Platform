import * as React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { NotificationPanel, seedNotifications } from "./NotificationPanel";
import { GlobalSearch } from "./GlobalSearch";
import { useAuth } from "@/context/AuthContext";
import type { AppNotification } from "@/types";

export function AppLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [notifs, setNotifs] = React.useState<AppNotification[]>(seedNotifications);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Loading your workspace…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const unread = notifs.filter((n) => !n.read).length;

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          onMenuClick={() => setMobileOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
          onNotifClick={() => setNotifOpen(true)}
          unread={unread}
        />

        <main className="flex-1 p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <NotificationPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        items={notifs}
        onMarkAll={() => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))}
      />
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
