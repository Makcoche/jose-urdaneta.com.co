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

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("lms_user", JSON.stringify(data.user));
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, error: data.error || "Error de inicio de sesión" };
      }
    } catch (err: any) {
      console.warn("Falling back to client-side login simulation:", err);
      // Client-side authentication fallback
      try {
        const normalizedEmail = email.toLowerCase().trim();
        const cached = localStorage.getItem("app_db_data");
        const db = cached ? JSON.parse(cached) : null;
        const users = db?.users || [];
        
        let foundUser = users.find((u: any) => u.email.toLowerCase().trim() === normalizedEmail);
        
        // Auto-create admin if logging in with known admin emails
        const isAdminEmail = normalizedEmail === "josegregoriourdanetaguadama@gmail.com" || normalizedEmail === "admin@joseurdaneta.com";
        if (!foundUser && isAdminEmail) {
          foundUser = {
            id: "user_admin",
            name: "Jose Urdaneta (Admin Demo)",
            email: normalizedEmail,
            role: "admin",
            activeMembership: {
              level: "Avanzado",
              expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            },
            completedLessons: [],
            createdAt: new Date().toISOString()
          };
          // Save to local db
          const currentDb = db || { users: [] };
          currentDb.users = [...(currentDb.users || []), foundUser];
          localStorage.setItem("app_db_data", JSON.stringify(currentDb));
        }

        if (!foundUser) {
          return { success: false, error: "Usuario no registrado. Regístrate para ingresar." };
        }

        // Simulating login
        setUser(foundUser);
        localStorage.setItem("lms_user", JSON.stringify(foundUser));
        return { success: true };
      } catch (e) {
        return { success: false, error: "Error de inicio de sesión local" };
      }
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem("lms_user", JSON.stringify(data.user));
        return { success: true };
      } else {
        const data = await res.json();
        return { success: false, error: data.error || "Error de registro" };
      }
    } catch (err: any) {
      console.warn("Falling back to client-side registration simulation:", err);
      try {
        const normalizedEmail = email.toLowerCase().trim();
        const cached = localStorage.getItem("app_db_data");
        const db = cached ? JSON.parse(cached) : { users: [] };
        const users = db.users || [];

        const existingUser = users.find((u: any) => u.email.toLowerCase().trim() === normalizedEmail);
        if (existingUser) {
          return { success: false, error: "El correo electrónico ya está registrado localmente." };
        }

        const isAdminEmail = normalizedEmail === "josegregoriourdanetaguadama@gmail.com" || normalizedEmail === "admin@joseurdaneta.com";
        const role = (users.length === 0 || isAdminEmail) ? "admin" : "student";

        const newUser = {
          id: "user_" + Date.now(),
          name: name.trim(),
          email: normalizedEmail,
          role,
          activeMembership: {
            level: isAdminEmail ? "Avanzado" : null,
            expiresAt: isAdminEmail ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null
          },
          completedLessons: [],
          createdAt: new Date().toISOString()
        };

        db.users = [...users, newUser];
        localStorage.setItem("app_db_data", JSON.stringify(db));

        setUser(newUser);
        localStorage.setItem("lms_user", JSON.stringify(newUser));
        return { success: true };
      } catch (e) {
        return { success: false, error: "Error de conexión" };
      }
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

      if (!res.ok) throw new Error("Progress update failed on server");

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
      console.warn("Falling back to local lesson progress update:", err);
      try {
        let currentCompleted = [...(user.completedLessons || [])];
        if (completed) {
          if (!currentCompleted.includes(lessonId)) {
            currentCompleted.push(lessonId);
          }
        } else {
          currentCompleted = currentCompleted.filter(id => id !== lessonId);
        }

        const updatedUser = {
          ...user,
          completedLessons: currentCompleted
        };

        // Update session
        setUser(updatedUser);
        localStorage.setItem("lms_user", JSON.stringify(updatedUser));

        // Update local database in localStorage
        const cached = localStorage.getItem("app_db_data");
        if (cached) {
          const db = JSON.parse(cached);
          const updatedUsers = (db.users || []).map((item: any) => {
            if (item.id === user.id) {
              return { ...item, completedLessons: currentCompleted };
            }
            return item;
          });
          localStorage.setItem("app_db_data", JSON.stringify({ ...db, users: updatedUsers }));
        }

        return true;
      } catch (e) {
        console.error("Local progress update error:", e);
        return false;
      }
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
