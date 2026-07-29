import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { query } from './db.js';
import { createHash } from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function signToken(user) {
      return jwt.sign({ id: user.id, user_role: user.user_role }, JWT_SECRET, { expiresIn: '7d' });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const token = header.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: payload.id,
      user_role: payload.user_role
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export async function createUser(name, email, password, user_role) {
      if (!["admin", "artist"].includes(user_role)) {
    throw new Error("Invalid role");
  }
  const hash = await bcrypt.hash(password, 12);

  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash, user_role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, user_role`,
    [name, email, hash, user_role]
  );

  return rows[0];
}
export async function createAdminForUser(userId) {
  const { rows } = await query(
    `INSERT INTO admins (user_id)
     VALUES ($1)
     RETURNING id, user_id`,
    [userId]
  );

  return rows[0];
}

export async function createArtistForUser(userId, website, artist_name) {
  const { rows } = await query(
    `INSERT INTO artists (user_id, website, artist_name)
     VALUES ($1, $2, $3)
     RETURNING id, user_id, website, artist_name`,
    [userId, website, artist_name]
  );

  return rows[0];
}

export async function findUserByEmail(email){
      const { rows } = await query('SELECT * FROM users WHERE email=$1', [email]);
      return rows[0];
}

export async function validateResetToken(token) {
  const hashedToken = createHash("sha256").update(token).digest("hex");
  const { rows } = await query(
    'SELECT * FROM users WHERE reset_token=$1 AND reset_token_expires > NOW()',[hashedToken]
  )

  if (rows.length === 0) {
    return res.status(400).json({ error: "Invalid reset token" });
  }else{
    return rows[0];
  }
}
export async function createAdmin({name, email, password}) {
  const user = await createUser(name, email, password, "admin");
  const admin = await createAdminForUser(user.id);

  return {
    user,
    admin
  };
}
export async function createArtist({name, website, artist_name, email, password}) {
  const user = await createUser(name, email, password, "artist");
  const artist = await createArtistForUser(user.id, website, artist_name);

  return {
    user,
    artist
  };
}



