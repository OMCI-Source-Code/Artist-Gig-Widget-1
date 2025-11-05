import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import gigsRouter from "./routes/gigs.js";
import authRouter from "./routes/auth.js";
import artistsRouter from "./routes/artists.js";

dotenv.config();

const app = express();

// helpers to resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ point to client/dist (outside server folder)
const distPath = path.resolve(__dirname, "../../client/dist");

// Middleware
app.use(cors({ origin: "*" })); 
app.use(express.json());

// Routes
app.use("/api/gigs", gigsRouter);
app.use("/api/auth", authRouter);
app.use("/api/artists", artistsRouter);

// Serve frontend
app.use(express.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

export default app;
