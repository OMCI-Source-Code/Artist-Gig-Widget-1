import React, { useEffect, useState } from "react";
import { apiFetch } from "../api.js";
import Protected from "./ProtectedRoute.jsx";
import GigForm from "./GigForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/dashboard.css";
const WIDGET_ORIGIN = import.meta.env.VITE_WIDGET_ORIGIN;
import copy from "../../dist/copy.png"

export default function Dashboard() {
  return (
    <Protected>
      <Inner />
    </Protected>
  );
}

function Inner() {
  const { user } = useAuth();
  const artist = user?.artist;
  const [gigs, setGigs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [copying, setCopying] = useState(null);
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [filter, setFilter] = useState("upcoming");



  async function load() {
    try {
      const rows = await apiFetch("/gigs/mine");
      setGigs(rows);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
  }, []);


  const now = new Date();
  const filteredGigs = gigs.filter((g) => {
    const start = new Date(g.date_time);
    if (filter === "upcoming") return start >= now;
    if (filter === "past") return start < now;
    return true;
  });

  const handleCopy = (gig) => {
    const { id, approved, ...rest } = gig;

    setEditing(null);
    setCopying(rest);

    setShowCopiedToast(true);

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      setShowCopiedToast(false);
    }, 2000);
  };

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
    try {
      await apiFetch(`/gigs/${id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete gig.");
      return;
    }
  };

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
    ]);

    const csvContent =
      [headers, ...rows]
        .map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const filename = `${artist?.artist_name || "artist"}-gigs-${filter}.csv`;

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p className="user-info">
        <strong>{artist?.artist_name}</strong>
      </p>

      <div className="dashboard-grid">
        <div className="card">
          <h3>{editing ? "Edit Gig" : "Create Gig"}</h3>
          <GigForm
            initial={editing || copying || {}}
            onSave={(body) => {
              if (editing) {
                return handleUpdate(editing.id, body);
              } else {
                setCopying(null);
                return handleCreate(body);
              }
            }}
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
            {filteredGigs.length === 0 ? (
              <div className="empty-state">
                No {filter} gigs found.
              </div>
            ) : (
              filteredGigs.map((g) => {
                const isFuture = new Date(g.end_time || g.date_time) > new Date();

                return (
                  <li key={g.id}
                    className={`gig-item ${new Date(g.date_time) < new Date() ? "past" : ""
                      }`}>
                    <div className="gig-header">
                      <div>
                        <div className="gig-title truncate">{g.title}</div>
                        <div className="gig-meta">
                          <span>
                            📅 {new Date(g.date_time).toLocaleString()}
                            {g.end_time
                              // TODO: make this so that if the end date is the 
                              // same as the start date, don't show the end date only show end time
                              ? " - " + new Date(g.end_time).toLocaleString()
                              : ""}
                          </span>
                          <span className="truncate">📍 {g.venue}</span>
                          <span>{g.private ? "🔒 Private" : "🌐 Public"}</span>
                        </div>

                        {g.description && (
                          <div className="gig-description truncate-multiline">📝 {g.description}</div>
                        )}
                        {g.link && (
                          <div className="gig-link">
                            🔗{" "}
                            <a href={g.link} target="_blank" rel="noreferrer">
                              Event link
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
                        {/* ✅ ALWAYS SHOW COPY */}
                        <img
                          src={copy}
                          width={24}
                          height={24}
                          style={{ cursor: "pointer", alignSelf: "center" }}
                          onClick={() => handleCopy(g)}
                        />


                        {isFuture && (
                          <>
                            <button className="edit-btn" onClick={() => setEditing(g)}>
                              Edit
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(g.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>

      <hr style={{ margin: "24px 0" }} />
      <h3>Tools</h3>
      <button onClick={exportCSV}>⬇️ Export My Gigs (CSV)</button>

      <hr style={{ margin: "24px 0" }} />
      <h3>Embed Snippets</h3>
      <pre>{`<div data-gig-widget data-type="artist" data-artist-id="${artist?.id}" data-view="list"></div>
<script src="${WIDGET_ORIGIN}/embed.js"></script>`}</pre>
      {showCopiedToast && (
        <div className="toast">
          Copied!
        </div>
      )}
    </div>
  );
}
