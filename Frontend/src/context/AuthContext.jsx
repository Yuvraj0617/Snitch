import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("snitch_user") || "null"),
  );
  const [isLoading, setIsLoading] = useState(false);
  const persistSession = ({ user: nextUser, accessToken }) => {
    localStorage.setItem("snitch_user", JSON.stringify(nextUser));
    localStorage.setItem("snitch_access_token", accessToken);
    setUser(nextUser);
  };
  const authenticate = async (mode, values) => {
    setIsLoading(true);
    try {
      const { data } = await api.post(
        mode === "login" ? "/login" : "/users",
        values,
      );
      persistSession(data.data);
      return data;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      /* Session may already be expired. */
    }
    localStorage.removeItem("snitch_user");
    localStorage.removeItem("snitch_access_token");
    setUser(null);
  };
  useEffect(() => {
    document.title = user
      ? `Snitch | ${user.username || user.email}`
      : "Snitch";
  }, [user]);
  useEffect(() => {
    const clearSession = () => setUser(null);
    window.addEventListener("snitch:session-expired", clearSession);
    return () =>
      window.removeEventListener("snitch:session-expired", clearSession);
  }, []);
  return (
    <AuthContext.Provider value={{ user, isLoading, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
