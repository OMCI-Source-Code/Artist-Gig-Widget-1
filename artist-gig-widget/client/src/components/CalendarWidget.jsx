import React, { useEffect, useState } from "react";
import "../styles/calendar.css"
import "../styles/modal.css"
import { fetchGigs } from "../api";
import Modal from "./Modal";
import { Link } from "react-router-dom";


export default function CalendarWidget() {
  const [gigs, setGigs] = useState([]);
  const [currentGig, setCurrentGig] = useState(null);
  const [current, setCurrent] = useState(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [currentModal, setCurrentModal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGigs();
        const approved = data.filter((g) => g.approved === true);
        setGigs(approved);
      } catch (err) {
        console.error("Calendar fetch err:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }
  const gigsForSelectedDate = selectedDate
    ? gigs.filter((g) => {
        const d = new Date(g.date_time);
        return (
          d.getFullYear() === selectedDate.getFullYear() &&
          d.getMonth() === selectedDate.getMonth() &&
          d.getDate() === selectedDate.getDate()
        );
      })
    : [];

    const closeModal = () => {
    setCurrentModal(null);
    setCurrentGig(null);
    setSelectedDate(null);
  };

  return (
    <div className="calendar-widget">

      <div className="header">
        <h1>Upcoming Events</h1>
      </div>

      <div className="cal-header">
        <button onClick={prevMonth}>←</button>
        <h2>
          {current.toLocaleString("default", { month: "long" })} {year}
        </h2>

        <button onClick={nextMonth}>→</button>
      </div>
      <div className="day-name-container">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <p key={d} className="day-name">{d}</p>
        ))}
      </div>
      {currentModal === "gig" && <Modal closeModal={closeModal}>
        <div>
          <h1>{currentGig.title}</h1>
          <p>{currentGig.venue}</p>
          <p>
            {new Date(currentGig.date_time).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p>{currentGig.description}</p>
          <p>{currentGig.artist_id}</p>
          {currentGig.link ? <Link to={currentGig.link}><button >Event Details</button></Link> : <></>}
        </div>
      </Modal>}
      {currentModal === "dayView" && selectedDate && (
        <Modal closeModal={closeModal}>
          <div>
            <h2>{selectedDate.toDateString()}</h2>

            {gigsForSelectedDate.map((gig) => (
              <div
                key={gig.id}
                className="gigDayView"
                onClick={() => {
                  setCurrentGig(gig);
                  setCurrentModal("gig");
                }}
              >
                {gig.title}
              </div>
            ))}
          </div>
        </Modal>
      )}

      <div className="cal-grid">
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
              {gigsForDay.slice(0, 3).map((gig) => (
                <div key={gig.id} className="gig" onClick={() => {
                  setCurrentGig(gig)
                  setOpenModal(true)
                  setCurrentModal("gig")
                }}>
                 
                  {gig.title || "Gig"}

                </div>
              ))}
              {gigsForDay.length > 3 && <p onClick={() => {
                setCurrentModal("dayView")
                setSelectedDate(new Date(year, month, day))
              }}> 
                + {gigsForDay.length - 3} more
              </p>
              }

            </div>
          );
        })}
      </div>
    </div>
  );
}
