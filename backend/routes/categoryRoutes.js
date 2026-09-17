import express from "express";
import Category from "../models/Category.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

const router = express.Router();

// @desc Get all categories (for homepage grid + search dropdown)
router.get("/", asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ success: true, categories });
}));

export default router;
