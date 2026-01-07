import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import ArtistWidget from './components/ArtistWidget.jsx';
import GlobalWidget from './components/GlobalWidget.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import "./styles/global.css";
import { Navigate } from 'react-router-dom';


export default function App() {
  const { role, logout } = useAuth();
  return (
    <div className="container">
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/global">Global Widget</Link>
        <Link to="/login">Login</Link>
        <Link to="/admin/login">Admin Login</Link>

        {/* conditional dashboard */}
        {role === "admin" && <Link to="/admin-dashboard">Admin Dashboard</Link>}
        {role === "user" && <Link to="/dashboard">Dashboard</Link>}

        {role && <button onClick={logout}>Logout</button>}
      </nav>

      <Routes>
        <Route index element={<Home />} />

        <Route path="/artist/:artistId" element={<ArtistWidget />} />
        <Route path="/global" element={<GlobalWidget />} />

        {/* login pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* user dashboard */}
        <Route
          path="/dashboard"
          element={role === "user" ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* admin dashboard */}
        <Route
          path="/admin-dashboard"
          element={role === "admin" ? <AdminDashboard /> : <Navigate to="/admin/login" />}
        />
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1>Gig Widgets</h1>
      <p>Use the links above to view widgets or log in to the dashboard.</p>
      {/* <h3>Embed examples</h3>
      <code>
        {`<div data-gig-widget data-type="artist" data-artist-id="1" data-view="list"></div>
<script src="https://artist-gig-widget-server.vercel.app/embed.js"></script>`}
      </code> */}
    </div>
  );
}
