// src/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import { createArtist, findArtistByEmail, signToken } from '../auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, website, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing required fields' });

    const exists = await findArtistByEmail(email);
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const artist = await createArtist({ name, website, email, password });
    const token = signToken(artist);
    res.json({ artist, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const artist = await findArtistByEmail(email);
    if (!artist) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, artist.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(artist);
    const { password_hash, ...safe } = artist;
    res.json({ artist: safe, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
