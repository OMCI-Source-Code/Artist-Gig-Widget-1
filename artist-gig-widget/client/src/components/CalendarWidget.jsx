import React, { useEffect, useState } from "react";

export default function CalendarWidget() {
  const params = new URLSearchParams(window.location.search);
  const api = params.get("api");

  const [gigs, setGigs] = useState([]);
  const [current, setCurrent] = useState(new Date());

  useEffect(() => {
    fetch(`${api}/gigs/public`)
      .then((res) => res.json())
      .then((data) => {
        // Only approved gigs
        const approved = data.filter((g) => g.approved === true);
        setGigs(approved);
      })
      .catch((err) => console.error("Calendar fetch err:", err));
  }, [api]);

  // Resize iframe height
  useEffect(() => {
    const sendHeight = () => {
      window.parent.postMessage(
        { type: "resizeWidget", height: document.body.scrollHeight },
        "*"
      );
    };
    sendHeight();

    const obs = new MutationObserver(sendHeight);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, []);

  // Calendar helpers
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonth = () => {
    setCurrent(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrent(new Date(year, month + 1, 1));
  };

  // Build calendar cells
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push(null); // empty cell
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }

  return (
    <div className="calendar-widget">
      <div className="cal-header">
        <button onClick={prevMonth}>←</button>
        <h2>
          {current.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button onClick={nextMonth}>→</button>
      </div>

      <div className="cal-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="day-name">{d}</div>
        ))}

        {cells.map((day, idx) => {
          const gigsForDay = gigs.filter((g) => {
            const gigDate = new Date(g.date_time);
            return (
              gigDate.getFullYear() === year &&
              gigDate.getMonth() === month &&
              gigDate.getDate() === day
            );
          });

          return (
            <div key={idx} className="day-cell">
              {day && <div className="day-number">{day}</div>}

              {gigsForDay.map((gig) => (
                <div key={gig.id} className="gig">
                  {gig.event_title || "Gig"}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
