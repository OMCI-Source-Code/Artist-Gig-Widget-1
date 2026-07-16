import express from "express";
import { query } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// maybe remove this?
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const { rows } = await query(
      "SELECT * FROM gigs WHERE created_by_user_id = $1 ORDER BY date_time ASC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching gigs:", err);
    res.status(500).json({ error: "Failed to fetch gigs" });
  }
});


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
      ea_public_only,
      p_public_only,
      share_with_coop,
      show_in_personal,
      share_with_external,
      age_restriction,
      coop_event
    } = req.body;

    const isCoopEvent = req.user.user_role === "admin" ? coop_event || false : false;

    if (!title || !date_time || !venue) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { rows } = await query(
      `INSERT INTO gigs 
        (created_by_user_id, title, date_time, end_time, venue, description, link, directions, private, ea_public_only, p_public_only, share_with_coop, show_in_personal, share_with_external, age_restriction,coop_event)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
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
        ea_public_only || false,
        p_public_only || false,
        share_with_coop || false,
        show_in_personal || false,
        share_with_external || false,
        age_restriction || null,
        isCoopEvent
      ]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("Error creating gig:", err);
    res.status(500).json({ error: "Failed to create gig" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const gigResult = await query(
      "SELECT * FROM gigs WHERE id=$1",
      [id]
    );

    if (!gigResult.rows.length) {
      return res.status(404).json({ error: "Gig not found" });
    }

    const gig = gigResult.rows[0];

    if (
      req.user.user_role !== "admin" &&
      gig.created_by_user_id !== req.user.id
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const {
      title,
      date_time,
      end_time,
      venue,
      description,
      link,
      directions,
      private: isPrivate,
      ea_public_only,
      p_public_only,
      share_with_coop,
      show_in_personal,
      share_with_external,
      age_restriction,
      coop_event,
      approved,
    } = req.body;

    const updatedCoop =
      req.user.user_role === "admin" ? coop_event : gig.coop_event;

    const updatedApproved =
      req.user.user_role === "admin" ? approved : gig.approved;

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
           p_public_only=$10,
           share_with_coop=$11,
           show_in_personal=$12,
           share_with_external=$13,
           age_restriction=$14,
           coop_event=$15,
           approved=$16
       WHERE id=$17
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
        ea_public_only || false,
        p_public_only || false,
        share_with_coop || false,
        show_in_personal || false,
        share_with_external || false,
        age_restriction || null,
        updatedCoop,
        updatedApproved,
        id,
      ]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating gig:", err);
    res.status(500).json({ error: "Failed to update gig" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const gigResult = await query(
      "SELECT * FROM gigs WHERE id=$1",
      [id]
    );

    if (!gigResult.rows.length) {
      return res.status(404).json({ error: "Gig not found" });
    }

    const gig = gigResult.rows[0];

    if (
      req.user.user_role !== "admin" &&
      gig.created_by_user_id !== req.user.id
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await query("DELETE FROM gigs WHERE id=$1", [id]);

    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting gig:", err);
    res.status(500).json({ error: "Failed to delete gig" });
  }
});


// Public gigs for widget
router.get("/public", async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT gigs.*, artists.artist_name
        FROM gigs
        JOIN artists ON artists.user_id = gigs.created_by_user_id
        WHERE gigs.private = false 
          AND gigs.approved = true 
          AND (
            gigs.share_with_coop = true
            OR gigs.share_with_external = true
          )
      ORDER BY date_time ASC;`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching public gigs:", err);
    res.status(500).json({ error: "Failed to fetch gigs" });
  }
});

router.get("/all", async (req, res) => {
  // if (req.user.user_role !== "admin") {
  //   return res.status(403).json({ error: "Admins only" });
  // }
  try {
    const { rows } = await query(
      `SELECT * FROM gigs ORDER BY date_time ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching public gigs:", err);
    res.status(500).json({ error: "Failed to fetch gigs" });
  }
});

router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await query(
      "SELECT * FROM gigs WHERE created_by_user_id = $1 ORDER BY date_time ASC",
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching artist gigs:", err);
    res.status(500).json({ error: "Failed to fetch gigs" });
  }
});

router.get("/admin/gigs", async (req, res) =>{
  try{
    const { rows } = await query(
      `SELECT gigs.*, artists.artist_name AS artist_name, artists.website AS artist_website
      FROM gigs 
      LEFT JOIN users 
      ON gigs.created_by_user_id = users.id
      LEFT JOIN artists
      ON users.id = artists.user_id
      ORDER BY gigs.date_time ASC;
      `
    ); 
    res.json(rows);
  }catch(err){
    console.log("Error Fetching Gigs - ", err)
    res.status(500).json({error: "Failed to fetch gigs", err})
  }
})

export default router;
