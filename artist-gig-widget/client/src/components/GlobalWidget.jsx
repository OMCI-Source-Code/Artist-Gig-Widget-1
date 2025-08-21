// client/src/pages/WidgetGlobal.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchAllGigs } from "../api";

export default function WidgetGlobal() {
  const location = useLocation();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(location.search);
  const view = params.get("view") || "list";

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchAllGigs();
        setGigs(data);
      } catch (err) {
        console.error("Failed to load gigs:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Loading gigs…</div>;
  if (!gigs.length) return <div>No gigs yet.</div>;

  return (
    <div className="gig-widget">
      {view === "list" ? (
        <ul>
          {gigs.map((gig) => (
            <li key={gig.id}>
              <strong>{gig.title}</strong> —{" "}
              {new Date(gig.date_time).toLocaleString()} @ {gig.venue}
            </li>
          ))}
        </ul>
      ) : (
        <div>
          {gigs.map((gig) => (
            <div key={gig.id} style={{ marginBottom: "1rem" }}>
              <h3>{gig.title}</h3>
              <p>
                {new Date(gig.date_time).toLocaleString()} — {gig.venue}
              </p>
              <p>{gig.description}</p>
              {gig.link && (
                <p>
                  <a href={gig.link} target="_blank" rel="noreferrer">
                    Event Link
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// Note: This component assumes the API endpoint fetchAllGigs is defined in api.js
// and returns all gigs, regardless of artist or privacy status.    