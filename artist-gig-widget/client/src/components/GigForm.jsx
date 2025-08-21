import React, { useState, useEffect } from "react";

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

  // 👇 load initial data into form when editing
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
    const body = { ...form, date_time: new Date(form.date_time).toISOString() };

    try {
      await onSave(body); // wait for save/update to succeed
      resetForm();        // reset fields
    } catch (err) {
      console.error("Save failed:", err);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
        required
      />
      <input
        type="datetime-local"
        value={form.date_time}
        onChange={(e) => update("date_time", e.target.value)}
        required
      />
      <input
        placeholder="Venue"
        value={form.venue}
        onChange={(e) => update("venue", e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        rows={3}
      />
      <input
        placeholder="Link (optional)"
        value={form.link}
        onChange={(e) => update("link", e.target.value)}
      />
      <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          type="checkbox"
          checked={form.private}
          onChange={(e) => update("private", e.target.checked)}
        />
        Private (show only on your widget)
      </label>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit">
          {initial?.id ? "Update" : "Save"}
        </button>
        {initial?.id && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              onCancel?.(); // notify parent to exit edit mode
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
