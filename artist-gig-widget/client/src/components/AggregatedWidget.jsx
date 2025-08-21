import { useEffect, useState } from "react";
import { fetchAllGigs } from "../api";

export default function AggregatedWidget() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllGigs()
      .then((data) => setGigs(data.filter((g) => !g.private)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading gigs…</p>;

  return (
    <div className="aggregated-widget" style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h2>🌍 All Upcoming Gigs</h2>
      {gigs.length === 0 ? (
        <p>No gigs scheduled.</p>
      ) : (
        <ul>
          {gigs.map((gig) => (
            <li key={gig.id} style={{ marginBottom: "1rem" }}>
              <strong>{gig.title}</strong> <br />
              {new Date(gig.date_time).toLocaleString()} <br />
              {gig.venue} <br />
              Artist ID: {gig.artist_id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
