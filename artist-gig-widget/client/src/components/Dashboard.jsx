import React, { useEffect, useState } from "react";
import { fetchMyGigs, createGig, updateGig, deleteGig } from "../api.js";
import Protected from "./ProtectedRoute.jsx";
import GigForm from "./GigForm.jsx";
import PostShowForm from "./PostShowForm.jsx";
import "../styles/dashboard.css";

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
    const [activePostShowGig, setActivePostShowGig] = useState(null);

    async function load() {
        try {
            const rows = await fetchMyGigs();
            // ensure each gig has post_show, even if null
            const gigsWithPostShow = rows.map(g => ({ ...g, post_show: g.post_show || {} }));
            setGigs(gigsWithPostShow);
        } catch (err) {
            console.error(err);
        }
    }


    useEffect(() => {
        load();
    }, []);

    const handleCreate = async (gig) => {
        try {
            const newGig = await createGig(gig);
            setGigs([...gigs, newGig]);
        } catch (err) {
            console.error("Save failed:", err);
            alert(JSON.stringify(gig));
        }
    };

    const handleUpdate = async (id, body) => {
        try {
            const fullBody = { ...editing, ...body };
            await updateGig(id, fullBody);
            setEditing(null);
            await load();
        } catch (err) {
            console.error("Error updating gig:", err);
            alert(JSON.stringify(body));
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete gig?")) return;
        await deleteGig(id);
        await load();
    };

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            <p className="artist-info">
                Artist: <strong>{artist?.name}</strong> (ID: {artist?.id})
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
                    <h3>Your Gigs</h3>

                    {!gigs.length && <p>No gigs yet.</p>}
                    <ul className="gigs-list">
                        {gigs.map((g) => (
                            <li key={g.id} className="gig-item">
                                <div className="gig-header">
                                    <div>
                                        <div className="gig-title">{g.title}</div>
                                        <div className="gig-meta">
                                            <span>📅 {new Date(g.date_time).toLocaleString()}</span>
                                            <span>📍 {g.venue}</span>
                                            <span>{g.private ? "🔒 Private" : "🌐 Public"}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button className="edit-btn" onClick={() => setEditing(g)}>
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(g.id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActivePostShowGig(
                                                    activePostShowGig?.id === g.id ? null : g
                                                )
                                            }
                                        >
                                            {activePostShowGig?.id === g.id
                                                ? "Hide Post-show Form"
                                                : g.post_show
                                                    ? "Edit Post-show"
                                                    : "Add Post-show"}
                                        </button>
                                    </div>
                                </div>

                                {activePostShowGig?.id === g.id && (
                                    <PostShowForm
                                        initial={g.post_show || {}}
                                        onSave={async (body) => {
                                            const fullUpdate = { ...g, post_show: body };
                                            await updateGig(g.id, fullUpdate);
                                            setActivePostShowGig(null);
                                            await load();
                                        }}
                                        onCancel={() => setActivePostShowGig(null)}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <hr style={{ margin: "24px 0" }} />
            <h3>Embed Snippets</h3>
            <pre>{`<div data-gig-widget data-type="artist" data-artist-id="${artist?.id}" data-view="list"></div>
<script src="${window.location.origin}/embed.js"></script>`}</pre>
        </div>
    );
}