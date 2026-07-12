import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, LogIn } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-6">
      {/* Soft gradient backdrop (lighter take on the login left panel) */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-emerald/10" />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, hsl(var(--primary)) 1px, transparent 1px), radial-gradient(circle at 70% 60%, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "48px 48px, 64px 64px",
        }}
      />
      <motion.div
        animate={{ y: [0, -24, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-16 top-24 size-64 rounded-full bg-emerald/20 blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-10 bottom-16 size-72 rounded-full bg-primary/20 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 240 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <Logo className="mb-10" />

        <h1 className="bg-gradient-to-r from-primary to-emerald bg-clip-text text-8xl font-extrabold tracking-tight text-transparent sm:text-9xl">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Page not found</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          The page you're looking for doesn't exist or may have been moved. Let's get you back on
          the road.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="gradient" size="lg" onClick={() => navigate("/app/dashboard")}>
            <Home /> Back to Dashboard
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate("/login")}>
            <LogIn /> Go to Login
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
