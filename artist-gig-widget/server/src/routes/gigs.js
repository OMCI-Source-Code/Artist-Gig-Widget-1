// server/src/routes/gigs.js
import express from "express";
import { query } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ✅ Get gigs for the logged-in artist
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT * FROM gigs WHERE artist_id = $1 ORDER BY date_time ASC",
      [req.user.id]
    );
    res.json(rows);
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
      `INSERT INTO gigs (artist_id, title, date_time, venue, private)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, title, date_time, venue, isPrivate || false]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("Error creating gig:", err);
    res.status(500).json({ error: "Failed to create gig" });
  }
});

// ✅ Update a gig
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date_time, venue, private: isPrivate } = req.body;

    const { rows } = await query(
      `UPDATE gigs
       SET title=$1, date_time=$2, venue=$3, private=$4
       WHERE id=$5 AND artist_id=$6
       RETURNING *`,
      [title, date_time, venue, isPrivate || false, id, req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Gig not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating gig:", err);
    res.status(500).json({ error: "Failed to update gig" });
  }
});

// ✅ Delete a gig
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await query(
      "DELETE FROM gigs WHERE id=$1 AND artist_id=$2 RETURNING id",
      [id, req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Gig not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting gig:", err);
    res.status(500).json({ error: "Failed to delete gig" });
  }
});

// ✅ Public: all gigs (for global widget)
router.get("/public", async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT gigs.*, artists.name AS artist_name
       FROM gigs
       JOIN artists ON gigs.artist_id = artists.id
       WHERE gigs.private = false
       ORDER BY date_time ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching public gigs:", err);
    res.status(500).json({ error: "Failed to fetch gigs" });
  }
});

export default router;
