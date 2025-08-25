import React, { useState, useEffect } from "react";
import "../styles/gigForm.css";
// TODO: ^ consider changing

export default function PostShowForm({ initial = {}, onSave, onCancel }) {
    const emptyForm = {
        ticket_sales: "",
        audience_amt: "",
        audience_reaction: "",
        description: "",
    };

    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (initial && Object.keys(initial).length > 0) {
            setForm({
                ticket_sales: initial.ticket_sales || "",
                audience_amt: initial.audience_amt || "",
                audience_reaction: initial.audience_reaction || "",
                description: initial.description || "",
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
            await onSave(body);
            resetForm();
        } catch (err) {
            console.error("Save failed:", err);
        }
    }

    return (
        <form className="post-show-form" onSubmit={submit}>
            <label>
                Ticket Sales
                <input
                    type="number"
                    value={form.ticket_sales}
                    onChange={(e) => update("ticket_sales", e.target.value)}
                />
            </label>

            <label>
                Audience Amount
                <input
                    type="number"
                    value={form.audience_amt}
                    onChange={(e) => update("audience_amt", e.target.value)}
                />
            </label>

            <label>
                Audience Reaction
                <input
                    placeholder="Madison Square Garden"
                    value={form.venue}
                    onChange={(e) => update("venue", e.target.value)}
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
