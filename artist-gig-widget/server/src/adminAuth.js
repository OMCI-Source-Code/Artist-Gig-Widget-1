import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import { query } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export function signToken(admin) {
      return jwt.sign({ id: admin.id, name: admin.name, email: admin.email }, JWT_SECRET, { expiresIn: '7d' });
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

export async function createAdmin(name, email, password){
  const hash = await bcrypt.hashSync(password, 12);
  const { rows } = await query(
    `INSERT INTO admins(name, email, password_hash)
    VALUES ($1, $2, $3) RETURNING id, name, email, created_at`,
    [name, email, hash]
  );
  return rows[0];
}

export async function findAdminByEmail(email){
      const { rows } = await query('SELECT * FROM admins WHERE email=$1', [email]);
      return rows[0];
}