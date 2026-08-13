import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import gigsRouter from "./routes/gigs.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://gigboard.canadianmusicians.coop",
  "https://canadianmusicians.coop",
  "https://www.canadianmusicians.coop",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/gigs", gigsRouter);
app.use("/api/auth", authRouter);

app.get("/api/auth/me-test", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "GigBoard API",
    environment: process.env.NODE_ENV || "development",
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`GigBoard API running on port ${PORT}`);
});

export default app;