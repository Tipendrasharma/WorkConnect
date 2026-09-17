import express from "express";
import { body } from "express-validator";
import { createReview, getWorkerReviews, likeReview, reportReview } from "../controllers/reviewController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  requireRole("customer"),
  [
    body("workerId").notEmpty().withMessage("workerId is required"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),
  ],
  validate,
  createReview
);

router.get("/:workerId", getWorkerReviews);
router.put("/:id/like", protect, requireRole("customer"), likeReview);
router.put("/:id/report", protect, requireRole("customer"), reportReview);

export default router;
