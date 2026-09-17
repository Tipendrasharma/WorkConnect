import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.set("trust proxy", 1);
// --- Security & core middleware ---
// app.use(helmet());
// app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
// app.use(express.json({ limit: "10mb" }));
app.use(helmet());

// CLIENT_URL can be a single origin or a comma-separated list (e.g. for
// staging + production). We trim each entry defensively because a stray
// trailing space or newline pasted into a hosting dashboard's env var UI
// (common on Render/Vercel) produces an invalid Access-Control-Allow-Origin
// header and crashes every request with ERR_INVALID_CHAR.
const allowedOrigins = (process.env.CLIENT_URL || "*")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (curl, server-to-server, health checks) with no Origin header
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn(`CORS blocked request from origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

// Rate limiting on all API routes to prevent abuse
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// --- Routes ---
app.get("/api/health", (req, res) => res.json({ success: true, message: "WorkerConnect API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`WorkerConnect API running on port ${PORT} [${process.env.NODE_ENV || "development"}]`));
