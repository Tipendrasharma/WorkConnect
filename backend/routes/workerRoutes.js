import express from "express";
import {
  getWorkers, getWorkerById, updateWorker, updateAvailability,
  deleteWorker, getDashboard, logContact, getFeaturedWorkers,
} from "../controllers/workerController.js";
import { protect, optionalAuth, requireRole } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public
router.get("/", getWorkers);
router.get("/featured", getFeaturedWorkers);
router.get("/:id", optionalAuth, getWorkerById);
router.post("/:id/contact", optionalAuth, logContact);

// Private (worker only) - specific routes before "/:id" wildcard-like usage
router.get("/dashboard/me", protect, requireRole("worker"), getDashboard);
router.put("/update", protect, requireRole("worker"), upload.single("profilePhoto"), updateWorker);
router.put("/availability", protect, requireRole("worker"), updateAvailability);
router.delete("/", protect, requireRole("worker"), deleteWorker);

export default router;
