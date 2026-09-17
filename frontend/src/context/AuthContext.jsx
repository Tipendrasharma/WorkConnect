import React, { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // "worker" | "customer" | "admin"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("wc_token");
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then(({ data }) => {
        setUser(data.user);
        setUserType(data.user.role === "admin" ? "admin" : data.userType);
      })
      .catch(() => {
        localStorage.removeItem("wc_token");
        localStorage.removeItem("wc_user");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData, type) => {
    localStorage.setItem("wc_token", token);
    localStorage.setItem("wc_user", JSON.stringify(userData));
    setUser(userData);
    setUserType(userData.role === "admin" ? "admin" : type);
  };

  const logout = () => {
    localStorage.removeItem("wc_token");
    localStorage.removeItem("wc_user");
    setUser(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ user, userType, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
