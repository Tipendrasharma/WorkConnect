import Worker from "../models/Worker.js";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { uploadToImageKit } from "../config/imagekit.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

// @desc    Register a new worker
// @route   POST /api/auth/register/worker
// @access  Public
export const registerWorker = asyncHandler(async (req, res) => {
  const {
    fullName, mobile, email, password, occupation, experience,
    dailyWage, hourlyWage, address, district, state, pincode,
    latitude, longitude, availability, workingHours,
    languagesSpoken, description, skills,
  } = req.body;

  const existing = await Worker.findOne({ mobile });
  if (existing) {
    return res.status(400).json({ success: false, message: "Mobile number already registered" });
  }

  let profilePhotoUrl = "";
  if (req.file) {
  const result = await uploadToImageKit(req.file.buffer, req.file.originalname, "/workerconnect/profiles");
  profilePhotoUrl = result.url;
  }

  const worker = await Worker.create({
    fullName, mobile, email, password, occupation,
    experience, dailyWage, hourlyWage, address, district, state, pincode,
    location: { type: "Point", coordinates: [Number(longitude), Number(latitude)] },
    availability, workingHours,
    languagesSpoken: Array.isArray(languagesSpoken) ? languagesSpoken : (languagesSpoken ? languagesSpoken.split(",").map(s => s.trim()) : []),
    description,
    skills: Array.isArray(skills) ? skills : (skills ? skills.split(",").map(s => s.trim()) : []),
    profilePhoto: profilePhotoUrl,
  });

  const token = generateToken(worker._id, "worker");
  res.status(201).json({ success: true, token, user: worker, userType: "worker" });
});

// @desc    Register a new customer
// @route   POST /api/auth/register/customer
// @access  Public
export const registerCustomer = asyncHandler(async (req, res) => {
  const { fullName, mobile, email, password } = req.body;

  const existing = await User.findOne({ mobile });
  if (existing) {
    return res.status(400).json({ success: false, message: "Mobile number already registered" });
  }

  const user = await User.create({ fullName, mobile, email, password });
  const token = generateToken(user._id, "customer");
  res.status(201).json({ success: true, token, user, userType: "customer" });
});

// @desc    Login (worker or customer) using mobile + password
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { mobile, password, userType } = req.body; // userType: "worker" | "customer"

  const Model = userType === "worker" ? Worker : User;
  const account = await Model.findOne({ mobile }).select("+password");

  if (!account || !(await account.comparePassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid mobile number or password" });
  }
  if (account.isSuspended) {
    return res.status(403).json({ success: false, message: "This account has been suspended" });
  }

  const token = generateToken(account._id, userType === "worker" ? "worker" : "customer");
  account.password = undefined;
  res.json({ success: true, token, user: account, userType: userType === "worker" ? "worker" : "customer" });
});

// @desc    Get currently logged-in account
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user, userType: req.userType });
});

// NOTE: OTP login and forgot-password flows require an SMS/email provider
// (e.g. Twilio, MSG91, or SendGrid). Wire up your provider's API key in .env
// and generate/verify a 6-digit OTP stored with a short TTL (e.g. in Redis or
// a Mongo collection with a TTL index) before enabling these in production.
export const requestOtp = asyncHandler(async (req, res) => {
  res.status(501).json({ success: false, message: "OTP provider not configured. Add Twilio/MSG91 credentials to enable." });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  res.status(501).json({ success: false, message: "Email/SMS provider not configured. Add SendGrid/Twilio credentials to enable." });
});
