import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchPublicGigs } from "../api";

export default function WidgetGlobal() {
  const location = useLocation();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  // optional view param (list or cards)
  const params = new URLSearchParams(location.search);
  const view = params.get("view") || "list";

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPublicGigs();
        setGigs(data);
      } catch (err) {
        console.error("Failed to load public gigs:", err);
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
              <strong>{gig.title}</strong> — {new Date(gig.date_time).toLocaleString()}  
              @ {gig.venue} <em>by {gig.artist_name}</em>
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
              <p><em>By {gig.artist_name}</em></p>
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
