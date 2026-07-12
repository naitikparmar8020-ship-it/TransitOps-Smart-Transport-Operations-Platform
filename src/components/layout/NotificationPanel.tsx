import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  X,
  CreditCard,
  Wrench,
  Route,
  Fuel,
  Receipt,
  CheckCheck,
} from "lucide-react";
import { notifications as seed } from "@/data";
import type { AppNotification, NotificationType } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const iconMap: Record<NotificationType, typeof Bell> = {
  license: CreditCard,
  maintenance: Wrench,
  trip: Route,
  fuel: Fuel,
  expense: Receipt,
};
const colorMap: Record<NotificationType, string> = {
  license: "bg-amber-500/10 text-amber-500",
  maintenance: "bg-violet-500/10 text-violet-500",
  trip: "bg-primary/10 text-primary",
  fuel: "bg-emerald/10 text-emerald",
  expense: "bg-cyan-500/10 text-cyan-500",
};

export function NotificationPanel({
  open,
  onClose,
  items,
  onMarkAll,
}: {
  open: boolean;
  onClose: () => void;
  items: AppNotification[];
  onMarkAll: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[95]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col border-l bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b p-5">
              <div className="flex items-center gap-2">
                <Bell className="size-5 text-primary" />
                <h2 className="text-lg font-semibold">Notifications</h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex items-center justify-between border-b px-5 py-2.5">
              <span className="text-xs text-muted-foreground">
                {items.filter((i) => !i.read).length} unread
              </span>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onMarkAll}>
                <CheckCheck className="size-3.5" /> Mark all read
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {items.map((n) => {
                const Icon = iconMap[n.type];
                return (
                  <div
                    key={n.id}
                    className={cn(
                      "mb-1 flex gap-3 rounded-xl p-3 transition-colors hover:bg-accent",
                      !n.read && "bg-primary/[0.04]",
                    )}
                  >
                    <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", colorMap[n.type])}>
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{n.title}</p>
                        {!n.read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{n.message}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground/70">{n.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

export { seed as seedNotifications };
