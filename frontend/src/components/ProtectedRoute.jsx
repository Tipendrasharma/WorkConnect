import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Guards routes that require a logged-in account of a specific type.
// Usage: <ProtectedRoute allow={["worker"]}><WorkerDashboard /></ProtectedRoute>
const ProtectedRoute = ({ children, allow = [] }) => {
  const { user, userType, loading } = useAuth();

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (allow.length && !allow.includes(userType)) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
