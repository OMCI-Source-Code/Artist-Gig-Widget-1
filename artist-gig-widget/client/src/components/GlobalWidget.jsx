// client/src/pages/WidgetGlobal.jsx
import React, { useEffect, useState } from "react";
import { fetchPublicGigs } from "../api";
import "../styles/globalWidget.css";

export default function WidgetGlobal() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming"); 
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("soonest");
  const [startDate, setStartDate] = useState("");

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


// Define max height 
const MAX_HEIGHT = 600;

useEffect(() => {
  function sendHeight() {
    const widget = document.querySelector(".gig-widget");
    if (widget) {
      const height = Math.min(widget.scrollHeight, MAX_HEIGHT);
      window.parent.postMessage({ type: "resizeWidget", height }, "*");
    }
  }

  sendHeight();

  window.addEventListener("resize", sendHeight);
  return () => window.removeEventListener("resize", sendHeight);
}, [gigs, filter, search, sort, startDate]);


 function applyFilter(gigs) {
  const now = new Date();
  let result = [...gigs];



  if (filter === "upcoming") {
    result = result.filter((g) => new Date(g.date_time) >= now);
  } else if (filter === "past") {
    result = result.filter((g) => new Date(g.date_time) < now);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.venue.toLowerCase().includes(q) ||
        g.artist_name.toLowerCase().includes(q) ||
        (g.description || "").toLowerCase().includes(q) ||
        (g.directions || "").toLowerCase().includes(q)
    );
  }

  if (startDate) {
    const chosen = new Date(startDate);
    result = result.filter((g) => new Date(g.date_time) >= chosen);
  }

  if (sort === "soonest") {
    result.sort((a, b) => new Date(a.date_time) - new Date(b.date_time));
  } else if (sort === "latest") {
    result.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));
  }

  return result;
}


  if (loading) return <div className="loading">Loading gigs…</div>;
  if (!gigs.length) return <div className="empty">No Gigs Scheduled.</div>;

  const filtered = applyFilter(gigs);

  return (
    <div className="g-gig-widget">
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

        <input
          type="date"
          className="gig-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      {/* Cards */}
      <div className="card-container">
        {filtered.map((gig) => (
          <div key={gig.id} className="gig-card">
            <div className="card-content">
              <h3 className="gig-title">{gig.title}</h3>

              {/* Date + End Time */}
              <p className="gig-datetime">
                {new Date(gig.date_time).toLocaleString()}
                {gig.end_time
                  ? " - " + new Date(gig.end_time).toLocaleTimeString()
                  : ""}{" "}
                — {gig.venue}
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

              {/* Flags */}
              <div className="gig-flags">
                {gig.ea_public_only && (
                  <span className="flag ea">3 EA CEP</span>
                )}
                {gig.p_public_only && <span className="flag p">3P</span>}
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
