import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { token, user } = useContext(AuthContext);

  // Not logged in → redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Admin route but user is not admin → redirect to dashboard
  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Intern trying to access dashboard/logs but is admin → redirect to admin
  if (!adminOnly && user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
}