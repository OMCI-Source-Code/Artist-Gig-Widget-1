import express from "express";
import bcrypt from "bcryptjs";
import { findAdminByEmail, signToken } from "../adminAuth.js"; 

let router = express.Router(); 

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await findAdminByEmail(email);
    if (!admin)
      return res.status(404).json({ error: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match)
      return res.status(401).json({ error: "Invalid password" });

    const token = signToken(admin);

    const { password_hash, ...safe } = admin;
    res.json({ admin: safe, token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
