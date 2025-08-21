// server/src/routes/artists.js
import express from "express";
import { query } from "../db.js";

const router = express.Router();

// Public: Get gigs for a specific artist
router.get("/:id/gigs", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await query(
      "SELECT * FROM gigs WHERE artist_id = $1 AND private = false ORDER BY date_time ASC",
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching artist gigs:", err);
    res.status(500).json({ error: "Failed to fetch gigs" });
  }
});

export default router;
