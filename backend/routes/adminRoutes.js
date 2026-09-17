import express from "express";
import {
  getAdminDashboard, adminSearchWorkers, approveWorker,
  suspendWorker, reinstateWorker, deleteWorkerAdmin,
} from "../controllers/adminController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Every route here requires a logged-in User with role="admin"
router.use(protect, requireRole("admin"));

router.get("/dashboard", getAdminDashboard);
router.get("/workers", adminSearchWorkers);
router.put("/workers/:id/approve", approveWorker);
router.put("/workers/:id/suspend", suspendWorker);
router.put("/workers/:id/reinstate", reinstateWorker);
router.delete("/workers/:id", deleteWorkerAdmin);

export default router;
