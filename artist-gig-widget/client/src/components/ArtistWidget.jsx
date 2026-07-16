import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchArtistGigs } from "../api";
import "../styles/widget.css";

export default function WidgetArtist() {
  const location = useLocation();
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filter, setFilter] = useState("upcoming");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("soonest");
  const [startDate, setStartDate] = useState("");

  const params = new URLSearchParams(location.search);
  const artistId = params.get("artistUId");
  //console.log(artistId)
  const view = params.get("view") || "list";

  useEffect(() => {
    async function load() {
      try {
        if (!artistId) {
          setGigs([]);
          return;
        }
        const data = await fetchArtistGigs(artistId);
        console.log("Fetched gigs:", data);
        setGigs(data);
      } catch (err) {
        console.error("Failed to load gigs:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [artistId]);

  const refreshGigs = () => {
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
  }

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

    result = result.filter((g) => !g.ea_public_only && !g.p_public_only);

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

  if (loading) return (
    <div className="gig-status-container">
      <p className="gig-status-message">Loading gigs…</p>
    </div>
  );
  if (!gigs.length) return (
    <div className="gig-status-container">
      <p className="gig-status-message"> No gigs .</p>
    </div>
  );

  const filtered = applyFilter(gigs);

  return (
    <div className="gig-widget">
      <div className="gig-controls">
        <div className="gig-filters">

          <label className={`filter-pill ${filter === "all" ? "active" : ""}`}>
            <input
              type="radio"
              name="gigFilter"
              checked={filter === "all"}
              onChange={() => setFilter("all")}
            />
            All
          </label>

          <label className={`filter-pill ${filter === "upcoming" ? "active" : ""}`}>
            <input
              type="radio"
              name="gigFilter"
              checked={filter === "upcoming"}
              onChange={() => setFilter("upcoming")}
            />
            Upcoming
          </label>

          <label className={`filter-pill ${filter === "past" ? "active" : ""}`}>
            <input
              type="radio"
              name="gigFilter"
              checked={filter === "past"}
              onChange={() => setFilter("past")}
            />
            Previous
          </label>

          <button
            className="refresh-btn"
            onClick={refreshGigs}
            type="button"
          >
            ⟳
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

      <div className="card-container">
        {filtered.map((gig) => (
          <div key={gig.id} className="gig-card">

            <div className="gig-header">
              <h3>{gig.title}</h3>
            </div>

            <div className="gig-meta">

              <div className="meta-row">
                <span>📅</span>
                <span>
                  {new Date(gig.date_time).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="meta-row">
                <span>🕒</span>
                <span>
                  {new Date(gig.date_time).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}

                  {gig.end_time &&
                    ` - ${new Date(gig.end_time).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}`}
                </span>
              </div>

              <div className="meta-row">
                <span>📍</span>
                <span>{gig.venue}</span>
              </div>

              {gig.age_restriction && (
                <div className="meta-row">
                  <span>🔞</span>
                  <span>{gig.age_restriction}</span>
                </div>
              )}

            </div>

            {gig.description && (
              <div className="gig-section">
                <h4>Description</h4>
                <p>{gig.description}</p>
              </div>
            )}

            {gig.directions && (
              <div className="gig-section">
                <h4>Directions</h4>
                <p>{gig.directions}</p>
              </div>
            )}

            {gig.link && (
              <div className="gig-footer">
                <a
                  href={gig.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Event →
                </a>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
