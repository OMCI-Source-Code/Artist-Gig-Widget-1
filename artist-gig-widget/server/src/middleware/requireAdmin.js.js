import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header)
    return res.status(401).json({ error: "Missing Authorization header" });

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // Attach admin info
    req.admin = payload;

    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
