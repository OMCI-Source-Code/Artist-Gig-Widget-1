import React, { useState, useEffect } from "react";

export default function PostShowForm({ initial = {}, onSave, onCancel }) {
    const emptyForm = {
        ticket_sales: "",
        audience_amt: "",
        audience_reaction: "",
        description: "",
    };

    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        setForm({
            ticket_sales: initial.ticket_sales || "",
            audience_amt: initial.audience_amt || "",
            audience_reaction: initial.audience_reaction || "",
            description: initial.description || "",
        });
    }, [initial]);

    function update(k, v) {
        setForm((prev) => ({ ...prev, [k]: v }));
    }

    function resetForm() {
        setForm(emptyForm);
    }

    async function submit(e) {
        e.preventDefault();
        try {
            await onSave({ ...form });
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
                    placeholder="Exuberant cheering!"
                    value={form.audience_reaction}
                    onChange={(e) => update("audience_reaction", e.target.value)}
                />
            </label>

            <label>
                Description
                <textarea
                    placeholder="Post-show details..."
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    rows={3}
                />
            </label>

            <div className="actions">
                <button type="submit" className="postShowSave" style={{ margin: "15px 10px 0 0" }}>
                    {initial?.id ? "Update" : "Save"}
                </button>
                {initial?.id && (
                    <button
                        type="button"
                        className="postShowCancel"
                        style={{ margin: "15px 10px 0 0" }}
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
