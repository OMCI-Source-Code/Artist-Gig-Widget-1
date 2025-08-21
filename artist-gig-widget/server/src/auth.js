import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { query } from './db.js';


const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';


export function signToken(artist) {
return jwt.sign({ id: artist.id, name: artist.name, email: artist.email }, JWT_SECRET, { expiresIn: '7d' });
}


export function requireAuth(req, res, next) {
const header = req.headers.authorization;
if (!header) return res.status(401).json({ error: 'Missing Authorization header' });
const token = header.split(' ')[1];
try {
const payload = jwt.verify(token, JWT_SECRET);
req.user = payload;
next();
} catch (e) {
return res.status(401).json({ error: 'Invalid token' });
}
}


export async function findArtistByEmail(email) {
const { rows } = await query('SELECT * FROM artists WHERE email=$1', [email]);
return rows[0];
}


export async function createArtist({ name, website, email, password }) {
const hash = await bcrypt.hash(password, 10);
const { rows } = await query(
`INSERT INTO artists(name, website, email, password_hash)
VALUES ($1, $2, $3, $4) RETURNING id, name, website, email, created_at`,
[name, website, email, hash]
);
return rows[0];
}