import * as React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Truck,
  ShieldCheck,
  BarChart3,
  Wrench,
  UserCog,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

const roles: { role: UserRole; icon: typeof Truck; desc: string }[] = [
  { role: "Fleet Manager", icon: Truck, desc: "Full operations control" },
  { role: "Driver", icon: UserCog, desc: "Trips & assignments" },
  { role: "Safety Officer", icon: ShieldCheck, desc: "Compliance & safety" },
  { role: "Financial Analyst", icon: Wallet, desc: "Costs & revenue" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("example@example.com");
  const [password, setPassword] = React.useState("demo1234");
  const [showPw, setShowPw] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [role, setRole] = React.useState<UserRole>("Fleet Manager");
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    if (password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      login(email, role);
      navigate("/app/dashboard");
    }, 1200);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand / illustration */}
      <div className="relative hidden overflow-hidden bg-slate-950 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/40 to-emerald/60" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)",
            backgroundSize: "48px 48px, 64px 64px",
          }}
        />
        {/* floating orbs */}
        <motion.div
          animate={{ y: [0, -24, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-16 top-24 size-64 rounded-full bg-emerald/30 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-10 bottom-16 size-72 rounded-full bg-primary/40 blur-3xl"
        />

        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <Logo className="[&_p]:text-white" />

          <div className="max-w-md">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-extrabold leading-tight"
            >
              Smart Transport Operations Platform
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-lg text-white/80"
            >
              Manage Vehicles, Drivers, Trips, Maintenance &amp; Analytics — all in one
              enterprise-grade control center.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 grid grid-cols-2 gap-4"
            >
              {[
                { icon: Truck, label: "25+ Vehicles tracked" },
                { icon: BarChart3, label: "Real-time analytics" },
                { icon: Wrench, label: "Maintenance alerts" },
                { icon: ShieldCheck, label: "Driver safety scores" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-md"
                >
                  <f.icon className="size-5 shrink-0" />
                  <span className="text-sm font-medium">{f.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <p className="text-sm text-white/60">© 2026 TransitOps. All rights reserved.</p>
        </div>
      </div>

      {/* Right — login card */}
      <div className="flex items-center justify-center bg-background p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your TransitOps control center
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn("pl-9", errors.email && "border-destructive focus-visible:ring-destructive")}
                  placeholder="you@company.com"
                />
              </div>
              {errors.email && <p className="text-xs font-medium text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn("pl-9 pr-9", errors.password && "border-destructive focus-visible:ring-destructive")}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Sign in as</Label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r.role}
                    onClick={() => setRole(r.role)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all",
                      role === r.role
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-input hover:border-primary/40 hover:bg-accent",
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-8 items-center justify-center rounded-lg",
                        role === r.role ? "bg-primary text-white" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <r.icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold">{r.role}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-4 rounded border-input text-primary focus:ring-ring"
              />
              <span className="text-muted-foreground">Remember me for 30 days</span>
            </label>

            <Button type="submit" size="lg" variant="gradient" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">or continue with</span>
              </div>
            </div>

            <Button type="button" variant="outline" size="lg" className="w-full" onClick={submit}>
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                />
              </svg>
              Google
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button className="font-semibold text-primary hover:underline">Request access</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
