// client/src/pages/WidgetArtist.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchArtistGigs } from "../api";

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

  if (loading) return <div>Loading gigs…</div>;
  if (!gigs.length) return <div>No gigs yet.</div>;

  return (
    <div className="gig-widget">
      {view === "list" ? (
        <ul>
          {gigs.map((gig) => (
            <li key={gig.id}>
              <strong>{gig.title}</strong> — {new Date(gig.date_time).toLocaleString()} @ {gig.venue}
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
// Note: This component assumes the API endpoint fetchArtistGigs is defined in api.js
// and returns gigs for a specific artist based on the artistId query parameter.    