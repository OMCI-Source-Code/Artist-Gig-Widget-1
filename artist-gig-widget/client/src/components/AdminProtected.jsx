import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminProtected({ children }) {
  const { role } = useAuth();
  const token = localStorage.getItem("token");

  if (!token || role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
