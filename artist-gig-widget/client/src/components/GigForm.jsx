import React, { useState, useEffect } from "react";
import "../styles/gigForm.css";
import { useAuth } from "../context/AuthContext.jsx";

export default function GigForm({ initial = {}, onSave, onCancel }) {
  const { user } = useAuth();
  const [errors, setErrors] = useState({});
  const emptyForm = {
    title: "",
    date_time: "",
    end_time: "",
    venue: "",
    description: "",
    link: "",
    directions: "",
    private: false,
    ea_public_only: false,
    p_public_only: false,
    share_with_coop: false,
    show_in_personal: false,
    share_with_external: false,
    age_restriction: "",
    coop_event: false,
    approved: false
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initial && Object.keys(initial).length > 0) {
      setForm({
        title: initial.title || "",
        date_time: initial.date_time ? initial.date_time.slice(0, 16) : "",
        end_time: initial.end_time ? initial.end_time.slice(0, 16) : "",
        venue: initial.venue || "",
        description: initial.description || "",
        link: initial.link || "",
        directions: initial.directions || "",
        private: initial.private || false,
        ea_public_only: initial.ea_public_only || false,
        p_public_only: initial.p_public_only || false,
        share_with_coop: initial.share_with_coop || false,
        show_in_personal: initial.show_in_personal || false,
        share_with_external: initial.share_with_external || false,
        age_restriction: initial.age_restriction || "",
        coop_event: initial.coop_event || false,
        approved: false
      });
    } else {
      setForm(emptyForm);
    }
  }, [initial]);

  function update(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function resetForm() {
    setForm({ ...emptyForm });
  }


  async function submit(e) {
    e.preventDefault();

    const validationErrors = validateForm();

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
    const body = {
      ...form,
      date_time: new Date(form.date_time).toISOString(),
      end_time: form.end_time ? new Date(form.end_time).toISOString() : null,
    };

    try {
      console.log("Submitting " + body)
      await onSave(body);
      resetForm();
    } catch (err) {
      console.error("Save failed:", err);
    }
  }

  function validateForm() {
    const errors = {};

    const selectedDate = new Date(form.date_time);
    const now = new Date();

    if (selectedDate <= now) {
      errors.date_time = "Gig date and time must be in the future";
    }

    if (form.end_time) {
      const endDate = new Date(form.end_time);

      if (endDate <= selectedDate) {
        errors.end_time = "End time must be after start time";
      }
    }

    return errors;
  }

  const isPrivateSelected = form.private;

  const isAnyPublicSelected =
    form.share_with_coop ||
    form.show_in_personal ||
    form.share_with_external ||
    form.coop_event;

  return (
    <form className="gig-form" onSubmit={submit}>
      <label>
        Title
        <input
          placeholder="Summer Festival"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />
      </label>

      <label>
        Start Date & Time
        <input
          type="datetime-local"
          value={form.date_time}
          min={new Date().toISOString().slice(0, 16)}
          onChange={(e) => update("date_time", e.target.value)}
          required
        />
        {errors.date_time && (
          <p className="error">{errors.date_time}</p>
        )}
      </label>

      <label>
        End Date & Time
        <input
          type="datetime-local"
          value={form.end_time}
          onChange={(e) => update("end_time", e.target.value)}
        />
        {errors.end_time && (
          <p className="error">{errors.end_time}</p>
        )}
      </label>

      <label>
        Venue
        <input
          placeholder="Madison Square Garden"
          value={form.venue}
          onChange={(e) => update("venue", e.target.value)}
          required
        />
      </label>

      <label>
        Age Restriction
        <input
          placeholder="All Ages"
          value={form.age_restriction}
          onChange={(e) => update("age_restriction", e.target.value)}
        />
      </label>

      <label>
        Description
        <textarea
          placeholder="Short details about the gig..."
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={3}
        />
      </label>

      <label>
        Ticket/Info Link (Optional)
        <input
          placeholder="https://example.com"
          value={form.link}
          onChange={(e) => update("link", e.target.value)}
          onBlur={(e) => {
            const value = e.target.value.trim();
            if (!value) return;

            const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/;

            if (!urlRegex.test(value)) {
              alert("Please enter a valid website URL");
              update("link", "");
            }
          }}
        />
      </label>

      <label>
        Directions (Optional)
        <input
          placeholder="Parking info, gate numbers, special entry details..."
          value={form.directions}
          onChange={(e) => update("directions", e.target.value)}
        />
      </label>



      <div className="checkboxContainer">
        <label>
          Display Options
        </label>

        {user?.role === "admin" && (
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.coop_event}
              onChange={(e) => {
                update("coop_event", e.target.checked)
              }}
              disabled={isPrivateSelected}
            />
            Coop Event
          </label>
        )}

        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.private}
            onChange={(e) => {
              update("private", e.target.checked)
            }}
            disabled={isAnyPublicSelected}
          />
          PRIVATE (Do not display)
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.show_in_personal}
            onChange={(e) => {
              update("show_in_personal", e.target.checked)
            }}
            disabled={isPrivateSelected} />
          MY ARTIST CALENDAR
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.share_with_coop}
            onChange={(e) => {
              update("share_with_coop", e.target.checked)
            }}
            disabled={isPrivateSelected}
          />
          CO-OP CALENDAR
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.share_with_external}
            onChange={(e) => {
              update("share_with_external", e.target.checked)
            }}
            disabled={isPrivateSelected} />
          EXTERNAL/SYNDICATED CALENDARS
        </label>

        <label>
          Additional Info (optional)
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.ea_public_only}
            onChange={(e) => {
              update("ea_public_only", e.target.checked)
            }}
          />
          Emerging Artist CEP
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.p_public_only}
            onChange={(e) => {
              update("p_public_only", e.target.checked)
            }} />
          Pre-Professional CEP
        </label>
      </div>

      <div className="actions">
        <button type="submit" className="save">
          {initial?.id ? "Update" : "Save"}
        </button>
        {initial?.id && (
          <button
            type="button"
            className="cancel"
            onClick={() => {
              resetForm();
              onCancel?.();
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

