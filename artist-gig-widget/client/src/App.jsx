import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ArtistWidget from './components/ArtistWidget.jsx';
import GlobalWidget from './components/GlobalWidget.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import "./styles/global.css";

export default function App() {
  return (
    <div className="container">
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/global">Global Widget</Link>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route index element={<Home />} />
        <Route path="/artist/:artistId" element={<ArtistWidget />} />
        <Route path="/global" element={<GlobalWidget />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

function Home() {
  function getQueryParam(name) {
  if (typeof window === "undefined") return null;
  return new URL(window.location.href).searchParams.get(name);
}

// Build base API URL
let base =
  getQueryParam("api") ||
  window.GIG_WIDGET_API ||
  import.meta.env.VITE_API_URL ||
  "https://artist-gig-widget-server.onrender.com/api";

queryThing = getQueryParam("api");
windowThing = window.GIG_WIDGET_API;
envVar = import.meta.env.VITE_API_URL;

console.log("queryThing:", queryThing);
console.log("windowThing:", windowThing);
console.log("envVar:", envVar);
  console.log("Api url:", base);
  return (
    <div>
      <h1>Gig Widgets</h1>
      <p>Use the links above to view widgets or log in to the dashboard.</p>
      <h3>Embed examples</h3>
      <code>
        {`<div data-gig-widget data-type="artist" data-artist-id="1" data-view="list"></div>
<script src="https://artist-gig-widget-server.vercel.app/embed.js"></script>`}
      </code>
      <p>{queryThing} {windowThing} {envVar} {base}</p>
    </div>
  );
}
