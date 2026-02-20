// src/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import { createArtist, findUserByEmail, signToken } from '../userAuth.js';
import { authMiddleware } from '../middleware/auth.js';
import { query } from '../db.js';

const router = express.Router();

// Register for artists
router.post('/register', async (req, res) => {
  try {
    const { name, website, artist_name, email, password } = req.body;
    if (!name || !email || !artist_name || !password) return res.status(400).json({ error: 'Missing required fields' });

    const exists = await findUserByEmail(email);
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const user = await createArtist({name, website, artist_name, email, password});
    const token = signToken(user);
    res.json({ user, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// login for users (admin and artist)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user)
      return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: "Invalid password" });

    const token = signToken(user);
    const { password_hash, ...safe } = user;
    res.json({ user: safe, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await query(
      `
      SELECT u.id, u.name, u.email, u.user_role,
             a.id as artist_id, a.artist_name, a.website,
             ad.id as admin_id
      FROM users u
      LEFT JOIN artists a ON a.user_id = u.id
      LEFT JOIN admins ad ON ad.user_id = u.id
      WHERE u.id = $1
      `,
      [req.user.id]
    );

    if (!user.rows.length)
      return res.status(404).json({ error: "User not found" });

    const row = user.rows[0];

    res.json({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.user_role,
      artist: row.artist_id
        ? {
            id: row.artist_id,
            artist_name: row.artist_name,
            website: row.website,
          }
        : null,
      admin: row.admin_id
        ? {
            id: row.admin_id,
          }
        : null,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});




export default router;
