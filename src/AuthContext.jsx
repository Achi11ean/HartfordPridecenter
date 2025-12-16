import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("prideToken"));
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("prideRole"));
  const [prideId, setPrideId] = useState(null);

  // 🔓 Decode token (auth + role only)
  useEffect(() => {
    if (!token) {
      setUser(null);
      setRole(null);
      setPrideId(null);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setPrideId(decoded.pride_id || null);

      if (decoded.is_pride_admin) setRole("admin");
      else if (decoded.is_pride_staff) setRole("staff");

    } catch (err) {
      console.error("Invalid token", err);
      logout();
    }
  }, [token]);

  // 👤 Rehydrate user profile from storage
  useEffect(() => {
    const storedUser = localStorage.getItem("prideUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // 🔐 Login
  const login = ({ token, role, user }) => {
    localStorage.setItem("prideToken", token);
    localStorage.setItem("prideRole", role);
    localStorage.setItem("prideUser", JSON.stringify(user));

    setToken(token);
    setRole(role);
    setUser(user);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("prideToken");
    localStorage.removeItem("prideRole");
    localStorage.removeItem("prideUser");

    setToken(null);
    setUser(null);
    setRole(null);
    setPrideId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        prideId,
        isAdmin: role === "admin",
        isStaff: role === "staff",
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
