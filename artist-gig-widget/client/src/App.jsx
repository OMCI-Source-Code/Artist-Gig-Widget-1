import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import ArtistWidget from "./components/ArtistWidget.jsx";
import GlobalWidget from "./components/GlobalWidget.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";

import "./styles/global.css";

export default function App() {
  const { user, logout } = useAuth();
  console.log(user)

  return (
    <div className="container">
      <nav className="navbar">
        <div>
          <Link to="/global">Gigs</Link>

          {user?.role === "admin" && (
            <Link to="/admin-dashboard">Admin Dashboard</Link>
          )}

          {user?.role === "artist" && (
            <Link to="/dashboard">Dashboard</Link>
          )}
        </div>

        <div>
          
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <button onClick={logout}>Logout</button>
          )}
          
        </div>
      </nav>

      <Routes>
        {/* Root */}
        <Route index element={<Navigate to="/login" replace />} />

        {/* Public pages */}
        <Route path="/global" element={<GlobalWidget />} />
        <Route path="/artist/:artistId" element={<ArtistWidget />} />

        {/* Login */}
        <Route
          path="/login"
          element={
            user?.role === "artist"
              ? <Navigate to="/dashboard" replace />
              : user?.role === "admin"
              ? <Navigate to="/admin-dashboard" replace />
              : <Login />
          }
        />

        {/* Artist Dashboard */}
        <Route
          path="/dashboard"
          element={
            user?.role === "artist"
              ? <Dashboard />
              : user?.role === "admin"
              ? <Navigate to="/admin-dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />
        

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            user?.role === "admin"
              ? <AdminDashboard />
              : <Navigate to="/admin/login" replace />
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}
