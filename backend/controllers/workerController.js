import mongoose from "mongoose";
import Worker from "../models/Worker.js";
import Category from "../models/Category.js";
import ContactRequest from "../models/ContactRequest.js";
import { uploadToImageKit } from "../config/imagekit.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

// @desc    Search / list workers, optionally sorted by distance from a given point
// @route   GET /api/workers
// @query   lat, lng, radius(km, default 10), category, keyword, sortBy(nearest|rating|wage_low|availability),
//          minExperience, verifiedOnly, page, limit
// @access  Public
export const getWorkers = asyncHandler(async (req, res) => {
  const {
    lat, lng, radius = 10, category, keyword,
    sortBy = "nearest", minExperience, verifiedOnly,
    page = 1, limit = 12,
  } = req.query;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Number(limit));

  const matchStage = { isSuspended: false };
  if (category) matchStage.occupation = category;
  if (minExperience) matchStage.experience = { $gte: Number(minExperience) };
  if (verifiedOnly === "true") matchStage.isVerified = true;
  if (keyword) {
    matchStage.$or = [
      { fullName: { $regex: keyword, $options: "i" } },
      { occupation: { $regex: keyword, $options: "i" } },
      { skills: { $regex: keyword, $options: "i" } },
    ];
  }

  // Track category popularity for the admin "Most Searched Category" stat
  if (category) {
    Category.updateOne({ name: category }, { $inc: { searchCount: 1 } }, { upsert: true }).catch(() => {});
  }

  let workers;
  let total;

  if (lat && lng) {
    // $geoNear must be the first stage in the pipeline; it also computes
    // distance in meters for every matched document
    const pipeline = [
      {
        $geoNear: {
          near: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          distanceField: "distanceMeters",
          maxDistance: Number(radius) * 1000,
          spherical: true,
          query: matchStage,
        },
      },
      { $addFields: { distanceKm: { $round: [{ $divide: ["$distanceMeters", 1000] }, 2] } } },
    ];

    if (sortBy === "rating") pipeline.push({ $sort: { rating: -1 } });
    else if (sortBy === "wage_low") pipeline.push({ $sort: { dailyWage: 1 } });
    else if (sortBy === "availability") pipeline.push({ $sort: { availability: 1, distanceMeters: 1 } });
    else pipeline.push({ $sort: { distanceMeters: 1 } }); // nearest first (default)

    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await Worker.aggregate(countPipeline);
    total = countResult[0]?.total || 0;

    pipeline.push({ $skip: (pageNum - 1) * limitNum }, { $limit: limitNum });
    workers = await Worker.aggregate(pipeline);
  } else {
    // No location provided - plain filtered list (e.g. "Enter City" flow
    // should geocode the city first on the frontend, or fall back to district match)
    let sort = { createdAt: -1 };
    if (sortBy === "rating") sort = { rating: -1 };
    else if (sortBy === "wage_low") sort = { dailyWage: 1 };

    total = await Worker.countDocuments(matchStage);
    workers = await Worker.find(matchStage)
      .sort(sort)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
  }

  res.json({
    success: true,
    count: workers.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    workers,
  });
});

// @desc    Get single worker profile (increments profile view count)
// @route   GET /api/workers/:id
// @access  Public
export const getWorkerById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ success: false, message: "Worker not found" });
  }
  const worker = await Worker.findById(req.params.id);
  if (!worker) {
    return res.status(404).json({ success: false, message: "Worker not found" });
  }

  worker.profileViews += 1;
  await worker.save();

  await ContactRequest.create({ worker: worker._id, type: "view", customer: req.userId || null });

  res.json({ success: true, worker });
});

// @desc    Update logged-in worker's own profile
// @route   PUT /api/workers/update
// @access  Private (worker)
export const updateWorker = asyncHandler(async (req, res) => {
  const allowedFields = [
    "fullName", "email", "occupation", "experience", "dailyWage", "hourlyWage",
    "address", "district", "state", "pincode", "availability", "workingHours",
    "languagesSpoken", "description", "skills",
  ];

  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  if (req.body.latitude && req.body.longitude) {
    updates.location = { type: "Point", coordinates: [Number(req.body.longitude), Number(req.body.latitude)] };
  }

  if (req.file) {
   const result = await uploadToImageKit(req.file.buffer, req.file.originalname, "/workerconnect/profiles");
   updates.profilePhoto = result.url;
  }

  updates.lastActiveAt = new Date();

  const worker = await Worker.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true });
  res.json({ success: true, worker });
});

// @desc    Update availability only (quick toggle from dashboard)
// @route   PUT /api/workers/availability
// @access  Private (worker)
export const updateAvailability = asyncHandler(async (req, res) => {
  const { availability } = req.body;
  if (!["Available Now", "Busy", "Offline"].includes(availability)) {
    return res.status(400).json({ success: false, message: "Invalid availability value" });
  }
  const worker = await Worker.findByIdAndUpdate(
    req.userId,
    { availability, lastActiveAt: new Date() },
    { new: true }
  );
  res.json({ success: true, worker });
});

// @desc    Delete logged-in worker's own account
// @route   DELETE /api/workers
// @access  Private (worker)
export const deleteWorker = asyncHandler(async (req, res) => {
  await Worker.findByIdAndDelete(req.userId);
  res.json({ success: true, message: "Account deleted" });
});

// @desc    Worker dashboard stats: profile views, contact requests, notifications
// @route   GET /api/workers/dashboard
// @access  Private (worker)
export const getDashboard = asyncHandler(async (req, res) => {
  const worker = await Worker.findById(req.userId);
  const recentActivity = await ContactRequest.find({ worker: req.userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("customer", "fullName");

  const unreadCount = await ContactRequest.countDocuments({ worker: req.userId, isRead: false });

  res.json({
    success: true,
    stats: {
      profileViews: worker.profileViews,
      rating: worker.rating,
      reviewCount: worker.reviewCount,
      unreadNotifications: unreadCount,
    },
    recentActivity,
  });
});

// @desc    Log a call/whatsapp click from a customer (used for worker notifications)
// @route   POST /api/workers/:id/contact
// @access  Public
export const logContact = asyncHandler(async (req, res) => {
  const { type } = req.body; // "call" | "whatsapp"
  if (!["call", "whatsapp"].includes(type)) {
    return res.status(400).json({ success: false, message: "Invalid contact type" });
  }
  await ContactRequest.create({ worker: req.params.id, type, customer: req.userId || null });
  res.json({ success: true });
});

// @desc    Get featured / top-rated workers for homepage
// @route   GET /api/workers/featured
// @access  Public
export const getFeaturedWorkers = asyncHandler(async (req, res) => {
  const workers = await Worker.find({ isSuspended: false, rating: { $gte: 4 } })
    .sort({ rating: -1, reviewCount: -1 })
    .limit(8);
  res.json({ success: true, workers });
});
