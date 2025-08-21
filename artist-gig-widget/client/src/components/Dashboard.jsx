import React, { useEffect, useState } from "react";
import { apiFetch } from "../api.js";
import Protected from "./ProtectedRoute.jsx";
import GigForm from "./GigForm.jsx";

export default function Dashboard() {
  return (
    <Protected>
      <Inner />
    </Protected>
  );
}

function Inner() {
  const artist = JSON.parse(localStorage.getItem("artist") || "null");
  const [gigs, setGigs] = useState([]);
  const [editing, setEditing] = useState(null);

  async function load() {
    try {
      const rows = await apiFetch("/gigs/mine"); // ✅ no extra /api
      setGigs(rows);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
  }, []);

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

  return (
    <div>
      <h2>Dashboard</h2>
      <p>
        Artist: <strong>{artist?.name}</strong> (ID: {artist?.id})
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        <div>
          <h3>{editing ? "Edit Gig" : "Create Gig"}</h3>
          <GigForm
            initial={editing || {}}
            onSave={(body) =>
              editing ? handleUpdate(editing.id, body) : handleCreate(body)
            }
          />
        </div>

        <div>
          <h3>Your Gigs</h3>
          {!gigs.length && <p>No gigs yet.</p>}
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gap: 12,
            }}
          >
            {gigs.map((g) => (
              <li
                key={g.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{g.title}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {new Date(g.date_time).toLocaleString()} · {g.venue}{" "}
                      {g.private ? "· 🔒 Private" : "· 🌐 Public"}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setEditing(g)}>Edit</button>
                    <button onClick={() => handleDelete(g.id)}>Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr style={{ margin: "24px 0" }} />
      <h3>Embed Snippets</h3>
      <pre>{`<div data-gig-widget data-type="artist" data-artist-id="${artist?.id}" data-view="list"></div>
<script src="${window.location.origin}/embed.js"></script>`}</pre>

      <p>Global widget:</p>
      <pre>{`<div data-gig-widget data-type="global" data-view="calendar"></div>
<script src="${window.location.origin}/embed.js"></script>`}</pre>
    </div>
  );
}
