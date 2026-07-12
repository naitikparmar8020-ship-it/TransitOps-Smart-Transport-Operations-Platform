import * as React from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import type { UserRole } from "@/types";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarColor: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

function toUser(session: Session | null): AuthUser | null {
  const u = session?.user;
  if (!u) return null;
  const meta = (u.user_metadata ?? {}) as Record<string, string>;
  const fallbackName = u.email ? u.email.split("@")[0] : "User";
  return {
    id: u.id,
    email: u.email ?? "",
    name: meta.name || fallbackName,
    role: (meta.role as UserRole) || "Fleet Manager",
    avatarColor: meta.avatarColor || "#2563EB",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // 1) Load any existing session on mount
    supabase.auth.getSession().then(({ data }) => {
      setUser(toUser(data.session));
      setLoading(false);
    });
    // 2) Keep in sync with sign-in / sign-out / token refresh
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toUser(session));
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const signUp = async (email: string, password: string, role: UserRole, name?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split("@")[0],
          role,
          avatarColor: "#2563EB",
        },
      },
    });
    if (error) throw new Error(error.message);
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/app/dashboard` },
    });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signInWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
