import React, { useState, useEffect } from "react";
import "../styles/gigForm.css";

export default function GigForm({ initial = {}, onSave, onCancel }) {
  const emptyForm = {
    title: "",
    date_time: "",
    venue: "",
    description: "",
    link: "",
    private: false,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initial && Object.keys(initial).length > 0) {
      setForm({
        title: initial.title || "",
        date_time: initial.date_time ? initial.date_time.slice(0, 16) : "",
        venue: initial.venue || "",
        description: initial.description || "",
        link: initial.link || "",
        private: initial.private || false,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initial]);

  function update(k, v) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  function resetForm() {
    setForm(emptyForm);
  }

  async function submit(e) {
    e.preventDefault();
    const body = {
      ...form,
      date_time: new Date(form.date_time).toISOString(),
    };

    try {
      await onSave(body);
      resetForm();
    } catch (err) {
      console.error("Save failed:", err);
    }
  }

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
          onChange={(e) => update("date_time", e.target.value)}
          required
        />
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
        />
      </label>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={form.private}
          onChange={(e) => update("private", e.target.checked)}
        />
        Private (show only on your widget)
      </label>

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
