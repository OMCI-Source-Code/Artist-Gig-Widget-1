import express from "express";
import { query } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const defaultPostShow = {
    ticket_sales: 0,
    audience_amt: 0,
    audience_reaction: "",
    description: "",
};

// ✅ Get gigs for the logged-in artist
router.get("/mine", authMiddleware, async (req, res) => {
    try {
        const { rows } = await query(
            `SELECT gigs.*, post_show
             FROM gigs
             WHERE artist_id = $1
             ORDER BY date_time ASC`,
            [req.user.id]
        );

        // normalize post_show to defaults if empty
        const gigsWithDefaults = rows.map(g => ({
            ...g,
            post_show: { ...defaultPostShow, ...g.post_show },
        }));

        res.json(gigsWithDefaults);
    } catch (err) {
        console.error("Error fetching gigs:", err);
        res.status(500).json({ error: "Failed to fetch gigs" });
    }
});

// ✅ Create a new gig
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, date_time, venue, private: isPrivate } = req.body;

        if (!title || !date_time || !venue) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const { rows } = await query(
            `INSERT INTO gigs (artist_id, title, date_time, venue, private, post_show)
             VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING *`,
            [req.user.id, title, date_time, venue, isPrivate || false, defaultPostShow]
        );

        res.json(rows[0]);
    } catch (err) {
        console.error("Error creating gig:", err);
        res.status(500).json({ error: "Failed to create gig" });
    }
});

// ✅ Update post_show info
router.put("/:id/postshow", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { post_show } = req.body;

        const sanitized = { ...defaultPostShow, ...post_show };

        const { rows } = await query(
            `UPDATE gigs
             SET post_show = $1, updated_at = NOW()
             WHERE id=$2 AND artist_id=$3
             RETURNING *`,
            [sanitized, id, req.user.id]
        );

        if (!rows.length) return res.status(404).json({ error: "Gig not found" });

        res.json(rows[0]);
    } catch (err) {
        console.error("Error updating post_show:", err);
        res.status(500).json({ error: "Failed to update post_show" });
    }
});

export default router;
