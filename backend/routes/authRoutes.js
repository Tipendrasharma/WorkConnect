import express from "express";
import { body } from "express-validator";
import {
  registerWorker, registerCustomer, login, getMe, requestOtp, forgotPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post(
  "/register/worker",
  upload.single("profilePhoto"),
  [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("mobile").isMobilePhone("any").withMessage("Valid mobile number is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("occupation").notEmpty().withMessage("Occupation is required"),
    body("dailyWage").isNumeric().withMessage("Daily wage must be a number"),
    body("latitude").notEmpty().withMessage("Latitude is required (enable location access)"),
    body("longitude").notEmpty().withMessage("Longitude is required (enable location access)"),
  ],
  validate,
  registerWorker
);

router.post(
  "/register/customer",
  [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("mobile").isMobilePhone("any").withMessage("Valid mobile number is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  registerCustomer
);

router.post(
  "/login",
  [
    body("mobile").notEmpty().withMessage("Mobile number is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.get("/me", protect, getMe);
router.post("/otp/request", requestOtp);
router.post("/forgot-password", forgotPassword);

export default router;
