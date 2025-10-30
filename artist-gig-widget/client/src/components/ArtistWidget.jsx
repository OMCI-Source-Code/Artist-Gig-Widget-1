// client/src/pages/WidgetArtist.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchArtistGigs } from "../api";
import "../styles/widget.css";

export default function WidgetArtist({ embedArtistId, embedView }) {
  const artistId = embedArtistId || new URLSearchParams(window.location.search).get("artistId");
  const view = embedView || (new URLSearchParams(window.location.search).get("view") || "list");
  const location = useLocation();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filter, setFilter] = useState("upcoming"); // default upcoming
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("soonest");
  const [startDate, setStartDate] = useState("");

  // query params (from iframe embed)
  const params = new URLSearchParams(location.search);

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

// Define max height 
const MAX_HEIGHT = 600;

useEffect(() => {
  function sendHeight() {
    const widget = document.querySelector(".gig-widget");
    if (widget) {
      // Take the visible height or scrollHeight, whichever is smaller
      const height = Math.min(widget.scrollHeight, MAX_HEIGHT);
      window.parent.postMessage({ type: "resizeWidget", height }, "*");
    }
  }

  // Send height initially and whenever dependencies change
  sendHeight();

  // Also update on window resize
  window.addEventListener("resize", sendHeight);
  return () => window.removeEventListener("resize", sendHeight);
}, [gigs, filter, search, sort, startDate]);



  // --- filtering ---
  function applyFilter(gigs) {
    const now = new Date();
    let result = [...gigs];

    result = result.filter((g) => !g.ea_public_only && !g.p_public_only); 

    // upcoming/past/all
    if (filter === "upcoming") {
      result = result.filter((g) => new Date(g.date_time) >= now);
    } else if (filter === "past") {
      result = result.filter((g) => new Date(g.date_time) < now);
    }

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.venue.toLowerCase().includes(q) ||
          (g.description || "").toLowerCase().includes(q) ||
          (g.directions || "").toLowerCase().includes(q)
      );
    }

    // start date filter
    if (startDate) {
      const chosen = new Date(startDate);
      result = result.filter((g) => new Date(g.date_time) >= chosen);
    }

    // sort
    if (sort === "soonest") {
      result.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
    } else if (sort === "latest") {
      result.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
    }

    return result;
  }

  if (loading) return <div>Loading gigs…</div>;
  if (!gigs.length) return <div>No gigs yet.</div>;

  const filtered = applyFilter(gigs);

  return (
    <div className="gig-widget">
      {/* Controls */}
      <div className="gig-controls">
        <div className="gig-filters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>
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
        </div>

        <input
          type="text"
          className="gig-search"
          placeholder="Search gigs…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="gig-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="soonest">Soonest First</option>
          <option value="latest">Latest First</option>
        </select>

        {/* Date filter */}
        <input
          type="date"
          className="gig-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      {/* Cards like public widget */}
      <div className="card-container">
        {filtered.map((gig) => (
          <div key={gig.id} className="gig-card">
            <div className="card-content">
              <h3 className="gig-title">{gig.title}</h3>
              <p className="gig-datetime">
                {new Date(gig.date_time).toLocaleString()}
                {gig.end_time
                  ? " - " + new Date(gig.end_time).toLocaleTimeString()
                  : ""}{" "}
                — {gig.venue}
              </p>

              {gig.description && (
                <p className="gig-description">{gig.description}</p>
              )}
              {gig.directions && (
                <p className="gig-directions">🧭 {gig.directions}</p>
              )}

              {/* Flags */}
              <div className="gig-flags">
                {gig.ea_public_only && (
                  <span className="flag ea">3 EA CEP</span>
                )}
                {gig.p_public_only && <span className="flag p">3P</span>}
              </div>
            </div>

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
