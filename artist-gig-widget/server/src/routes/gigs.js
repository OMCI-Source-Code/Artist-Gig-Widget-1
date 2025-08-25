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
    const {
      title,
      date_time,
      end_time,
      venue,
      description,
      link,
      directions,
      private: isPrivate,
      eaPublicOnly,
      pPublicOnly,
    } = req.body;

    if (!title || !date_time || !venue) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { rows } = await query(
      `INSERT INTO gigs 
        (artist_id, title, date_time, end_time, venue, description, link, directions, private, ea_public_only, p_public_only)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        req.user.id,
        title,
        date_time,
        end_time || null,
        venue,
        description || null,
        link || null,
        directions || null,
        isPrivate || false,
        eaPublicOnly || false,
        pPublicOnly || false,
      ]
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
    const {
      title,
      date_time,
      end_time,
      venue,
      description,
      link,
      directions,
      private: isPrivate,
      eaPublicOnly,
      pPublicOnly,
    } = req.body;

    const { rows } = await query(
      `UPDATE gigs
       SET title=$1,
           date_time=$2,
           end_time=$3,
           venue=$4,
           description=$5,
           link=$6,
           directions=$7,
           private=$8,
           ea_public_only=$9,
           p_public_only=$10
       WHERE id=$11 AND artist_id=$12
       RETURNING *`,
      [
        title,
        date_time,
        end_time || null,
        venue,
        description || null,
        link || null,
        directions || null,
        isPrivate || false,
        eaPublicOnly || false,
        pPublicOnly || false,
        id,
        req.user.id,
      ]
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

// ✅ Public gigs for widget
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
