import * as React from "react";
import type { UserRole } from "@/types";

interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
  avatarColor: string;
}
interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}
const AuthContext = React.createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "transitops-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  const login = (email: string, role: UserRole) => {
    const name = email
      .split("@")[0]
      .split(/[._]/)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
    const u: AuthUser = { name: name || "Fleet Admin", email, role, avatarColor: "#2563EB" };
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
