import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggleLessonComplete: (lessonId: string, completed: boolean) => Promise<boolean>;
  updateUserMembership: (level: "Principiante" | "Intermedio" | "Avanzado" | null) => void;
  isAdmin: boolean;
  hasAccessToLevel: (requiredLevel: "Principiante" | "Intermedio" | "Avanzado" | "Todos") => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const savedUser = localStorage.getItem("lms_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to parse saved user:", err);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Error de inicio de sesión" };
      }

      setUser(data.user);
      localStorage.setItem("lms_user", JSON.stringify(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Error de conexión" };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Error de registro" };
      }

      setUser(data.user);
      localStorage.setItem("lms_user", JSON.stringify(data.user));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Error de conexión" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lms_user");
  };

  const toggleLessonComplete = async (lessonId: string, completed: boolean) => {
    if (!user) return false;

    try {
      const res = await fetch("/api/users/update-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, lessonId, completed }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      if (data.success) {
        const updatedUser = {
          ...user,
          completedLessons: data.completedLessons
        };
        setUser(updatedUser);
        localStorage.setItem("lms_user", JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating lesson progress:", err);
      return false;
    }
  };

  const updateUserMembership = (level: "Principiante" | "Intermedio" | "Avanzado" | null) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      activeMembership: {
        level,
        expiresAt: level ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
      }
    };
    setUser(updatedUser);
    localStorage.setItem("lms_user", JSON.stringify(updatedUser));
  };

  const isAdmin = user?.role === "admin";

  // Tiered membership verification
  const hasAccessToLevel = (requiredLevel: "Principiante" | "Intermedio" | "Avanzado" | "Todos") => {
    if (!requiredLevel || requiredLevel === "Todos") return true;
    if (!user) return false;
    if (user.role === "admin") return true; // Admins get total access!

    const userLevel = user.activeMembership?.level;
    if (!userLevel) return false;

    const tiers = {
      "Principiante": 1,
      "Intermedio": 2,
      "Avanzado": 3
    };

    const userTier = tiers[userLevel] || 0;
    const requiredTier = tiers[requiredLevel as "Principiante" | "Intermedio" | "Avanzado"] || 0;

    return userTier >= requiredTier;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        toggleLessonComplete,
        updateUserMembership,
        isAdmin,
        hasAccessToLevel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
