import React, { useEffect, useState } from "react";
import { apiFetch } from "../api.js";
import AdminProtected from "./AdminProtected.jsx";
import GigForm from "./GigForm.jsx";
import "../styles/dashboard.css";

export default function AdminDashboard() {
  return (
    <AdminProtected>
      <Inner />
    </AdminProtected>
  );
}

function Inner() {
  const [gigs, setGigs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("upcoming"); // ✅ filter state

  async function load() {
    try {
      const rows = await apiFetch("/gigs/all");
      setGigs(rows);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // ✅ filter gigs like in public widget
  const now = new Date();
  const filteredGigs = gigs.filter((g) => {
    const start = new Date(g.date_time);
    if (filter === "upcoming") return start >= now;
    if (filter === "past") return start < now;
    return true; // all
  });

  const handleCreate = async (gig) => {
    const newGig = await apiFetch("/gigs", {
      method: "POST",
      body: JSON.stringify(gig),
    });
    setGigs([...gigs, newGig]);
  };

  const handleUpdate = async (id, body) => {
    await apiFetch(`/gigs/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    setEditing(null);
    await load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete gig?")) return;
    await apiFetch(`/gigs/${id}`, { method: "DELETE" });
    await load();
  };
  
  const toggleApprove = async (gig) => {
    try {
      await apiFetch(`/gigs/${gig.id}`, {
        method: "PUT",
        body: JSON.stringify({ 
          ...gig,
          approved: !gig.approved
         }),
      });

      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to update approval status.");
    }
  };

  //✅ CSV Export with filters
  const exportCSV = () => {
    if (!filteredGigs.length) {
      alert("No gigs to export.");
      return;
    }

    const headers = [
      "Title",
      "Start Date & Time",
      "End Time",
      "Venue",
      "Description",
      "Directions",
      "Link",
      "Private?",
      "3 EA CEP?",
      "3P?",
      "approved"
    ];

    const rows = filteredGigs.map((g) => [
      g.title,
      new Date(g.date_time).toISOString(),
      g.end_time ? new Date(g.end_time).toISOString() : "",
      g.venue || "",
      g.description || "",
      g.directions || "",
      g.link || "",
      g.private ? "Yes" : "No",
      g.ea_public_only ? "Yes" : "No",
      g.p_public_only ? "Yes" : "No",
      g.approved ? true : false
    ]);

    const csvContent =
      [headers, ...rows]
        .map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const filename = `all-gigs-${today}.csv`;

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <p className="artist-info">
        {/* Artist: <strong>{artist?.name}</strong> (ID: {artist?.id}) */}
      </p>

      <div className="dashboard-grid">
        <div className="card">
          <h3>{editing ? "Edit Gig" : "Create Gig"}</h3>
          <GigForm
            initial={editing || {}}
            onSave={(body) =>
              editing ? handleUpdate(editing.id, body) : handleCreate(body)
            }
            onCancel={() => setEditing(null)}
          />
        </div>

        <div className="card">
          <div className="filter-bar">
            <button
              className={filter === "upcoming" ? "active" : ""}
              onClick={() => setFilter("upcoming")}
            >
              Upcoming
            </button>
            <button
              className={filter === "past" ? "active" : ""}
              onClick={() => setFilter("past")}
            >
              Past
            </button>
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              All
            </button>
          </div>

          {/* ✅ scrollable gigs list */}
          <ul className="gigs-list scrollable">
            {filteredGigs.map((g) => (
              <li key={g.id} className="gig-item">
                <div className="gig-header">
                  <div>
                    <div className="gig-title">{g.title}</div>
                    <div className="gig-meta">
                      <span>
                        📅 {new Date(g.date_time).toLocaleString()}
                        {g.end_time
                          ? " - " + new Date(g.end_time).toLocaleTimeString()
                          : ""}
                      </span>
                      <span>📍 {g.venue}</span>
                      <span>{g.private ? "🔒 Private" : "🌐 Public"}</span>
                    </div>

                    {g.description && (
                      <div className="gig-description">📝 {g.description}</div>
                    )}
                    {g.link && (
                      <div>
                        🔗{" "}
                        <a href={g.link} target="_blank" rel="noreferrer">
                          {g.link}
                        </a>
                      </div>
                    )}
                    {g.directions && (
                      <div className="gig-directions">🧭 {g.directions}</div>
                    )}

                    <div className="gig-flags">
                      {g.ea_public_only && (
                        <span className="flag ea">3 EA CEP</span>
                      )}
                      {g.p_public_only && (
                        <span className="flag p">3P</span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="edit-btn" onClick={() => setEditing(g)}>
                      Edit
                    </button>

                    <button
                      className="approve-btn"
                      style={{
                        background: g.approved ? "#c62828" : "#2e7d32",
                        color: "white"
                      }}
                      onClick={() => toggleApprove(g)}
                    >
                      {g.approved ? "Unapprove" : "Approve"}
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(g.id)}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr style={{ margin: "24px 0" }} />
      <h3>Tools</h3>
      <button onClick={exportCSV}>⬇️ Export My Gigs (CSV)</button>

      <hr style={{ margin: "24px 0" }} />
      {/* <h3>Embed Snippets</h3>
      <pre>{`<div data-gig-widget data-type="artist" data-artist-id="${artist?.id}" data-view="list"></div>
<script src="${window.location.origin}/embed.js"></script>`}</pre> */}
    </div>
  );
}
