import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null); // "admin" | "user" | null

  // Load persisted role on startup
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) setRole(savedRole);
  }, []);

  const login = (newRole) => {
    setRole(newRole);
    localStorage.setItem("role", newRole);
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem("role")
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Easy consume hook
export function useAuth() {
  return useContext(AuthContext);
}
