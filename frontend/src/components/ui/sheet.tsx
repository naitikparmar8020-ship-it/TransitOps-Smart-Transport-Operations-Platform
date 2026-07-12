import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: "right" | "left";
  className?: string;
  title?: string;
  description?: string;
}

export function Sheet({
  open,
  onOpenChange,
  children,
  side = "right",
  className,
  title,
  description,
}: SheetProps) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const x = side === "right" ? "100%" : "-100%";

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ x }}
            animate={{ x: 0 }}
            exit={{ x }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className={cn(
              "absolute top-0 flex h-full w-full max-w-md flex-col border-l bg-card shadow-2xl",
              side === "right" ? "right-0" : "left-0 border-l-0 border-r",
              className,
            )}
          >
            {(title || description) && (
              <div className="flex items-start justify-between border-b p-6">
                <div className="space-y-1 pr-8">
                  {title && <h2 className="text-lg font-semibold">{title}</h2>}
                  {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                  )}
                </div>
              </div>
            )}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-5 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="size-4" />
            </button>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
