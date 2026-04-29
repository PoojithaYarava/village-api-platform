import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Role = "admin" | "client";

type UserSession = {
  email: string;
  role: Role;
  name: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type AuthContextValue = {
  user: UserSession | null;
  login: (input: LoginInput) => { success: boolean; error?: string };
  logout: () => void;
};

const STORAGE_KEY = "village-api-demo-session";

const demoUsers = [
  {
    email: "admin@villageapi.local",
    password: "Admin@123",
    role: "admin" as const,
    name: "Platform Admin",
  },
  {
    email: "client@villageapi.local",
    password: "Client@123",
    role: "client" as const,
    name: "Demo Client",
  },
];

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored) as UserSession);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: ({ email, password }) => {
        const match = demoUsers.find(
          (item) =>
            item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
        );

        if (!match) {
          return { success: false, error: "Invalid demo email or password" };
        }

        const session = {
          email: match.email,
          role: match.role,
          name: match.name,
        };

        setUser(session);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        return { success: true };
      },
      logout: () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
