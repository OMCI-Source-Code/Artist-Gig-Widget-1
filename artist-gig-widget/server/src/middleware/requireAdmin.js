
export function requireAdmin(req, res, next) {


  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

    if (req.user.user_role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    next();
}
