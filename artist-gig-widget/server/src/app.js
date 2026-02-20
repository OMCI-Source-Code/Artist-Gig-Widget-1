import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import gigsRouter from "./routes/gigs.js";
import authRouter from "./routes/auth.js";


dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.resolve(__dirname, "../../client/dist");

app.use(cors({ origin: "*" })); 
app.use(express.json());

app.use("/api/gigs", gigsRouter);
app.use("/api/auth", authRouter);

app.get("/api/auth/me-test", (req, res) => {
  res.json({ ok: true });
});
app.use(express.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

export default app;
