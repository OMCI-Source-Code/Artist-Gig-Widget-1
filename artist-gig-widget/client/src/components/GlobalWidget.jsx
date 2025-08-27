import React, { useEffect, useState } from "react";
import { fetchPublicGigs } from "../api";
import "../styles/globalWidget.css";

export default function WidgetGlobal() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="loading">Loading gigs…</div>;
  if (!gigs.length) return <div className="empty">No gigs yet.</div>;

  return (
    <div className="gig-widget">
      <div className="card-container">

        {gigs.map((gig) => (
          <div key={gig.id} className="gig-card">
            <div className="card-content">
              <h3 className="gig-title">{gig.title}</h3>

              {/* Date + End Time */}
              <p className="gig-datetime">
                {new Date(gig.date_time).toLocaleString()}
              </p>

              {/* Artist */}
              <p className="gig-artist">
                <em>By {gig.artist_name}</em>
              </p>

              {/* Description */}
              {gig.description && (
                <p className="gig-description">{gig.description}</p>
              )}

              {/* Directions */}
              {gig.directions && (
                <p className="gig-directions">🧭 {gig.directions}</p>
              )}

              {/* Flags (only show for public gigs) */}
              <div className="gig-flags">
                {gig.ea_public_only && (
                  <span className="flag ea">3 EA CEP</span>
                )}
                {gig.p_public_only && (
                  <span className="flag p">3P</span>
                )}
              </div>
            </div>

            {/* Event Link */}
            {gig.link && (
              <div className="card-footer">
                <a href={gig.link} target="_blank" rel="noreferrer">
                  Event Link
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
