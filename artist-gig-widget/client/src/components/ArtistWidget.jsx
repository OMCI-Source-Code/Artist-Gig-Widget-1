// client/src/pages/WidgetArtist.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchArtistGigs } from "../api";
import "../styles/widget.css";   

export default function WidgetArtist() {
  const location = useLocation();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pull query params from iframe URL
  const params = new URLSearchParams(location.search);
  const artistId = params.get("artistId");
  const view = params.get("view") || "list";

  useEffect(() => {
    async function load() {
      try {
        if (!artistId) {
          setGigs([]);
          return;
        }
        const data = await fetchArtistGigs(artistId);
        setGigs(data);
      } catch (err) {
        console.error("Failed to load gigs:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [artistId]);

  if (loading) return <div className="gig-widget">Loading gigs…</div>;
  if (!gigs.length) return <div className="gig-widget">No gigs yet.</div>;

  return (
    <div className="gig-widget">
      {gigs.map((gig) => (
        <div key={gig.id} className="gig-card">
          <h3 className="gig-title">{gig.title}</h3>
          <div className="gig-meta">
            <time>{new Date(gig.date_time).toLocaleString()}</time>
            <span> — {gig.venue}</span>
            <span>{gig.private ? " 🔒 Private" : " 🌐 Public"}</span>
          </div>
          {gig.description && <p className="gig-description">{gig.description}</p>}
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
  );
}
