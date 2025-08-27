import React, { useState, useEffect } from "react";

const defaultPostShow = {
    ticket_sales: 0,
    audience_amt: 0,
    audience_reaction: "",
    description: "",
};

export default function PostShowForm({ initial = {}, onSave, onCancel }) {
    const [form, setForm] = useState(defaultPostShow);

    useEffect(() => {
        setForm({ ...defaultPostShow, ...initial });
    }, [initial]);

    function update(k, v) {
        setForm(prev => ({ ...prev, [k]: v }));
    }

    async function submit(e) {
        e.preventDefault();
        try {
            await onSave({ ...form });
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
                    onChange={e => update("ticket_sales", Number(e.target.value))}
                />
            </label>

            <label>
                Audience Amount
                <input
                    type="number"
                    value={form.audience_amt}
                    onChange={e => update("audience_amt", Number(e.target.value))}
                />
            </label>

            <label>
                Audience Reaction
                <input
                    placeholder="Exuberant cheering!"
                    value={form.audience_reaction}
                    onChange={e => update("audience_reaction", e.target.value)}
                />
            </label>

            <label>
                Description
                <textarea
                    placeholder="Post-show details..."
                    value={form.description}
                    onChange={e => update("description", e.target.value)}
                    rows={3}
                />
            </label>

            <div className="actions">
                <button type="submit" className="postShowSave" style={{ margin: "15px 10px 0 0" }}>
                    {initial?.id ? "Update" : "Save"}
                </button>
                <button
                    type="button"
                    className="postShowCancel"
                    style={{ margin: "15px 10px 0 0" }}
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
