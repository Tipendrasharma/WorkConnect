import Review from "../models/Review.js";
import Worker from "../models/Worker.js";
import ContactRequest from "../models/ContactRequest.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

// Recalculates and stores a worker's average rating + review count
const recalculateWorkerRating = async (workerId) => {
  const stats = await Review.aggregate([
    { $match: { worker: workerId } },
    { $group: { _id: "$worker", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const { avgRating = 0, count = 0 } = stats[0] || {};
  await Worker.findByIdAndUpdate(workerId, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: count,
  });
};

// @desc    Create a review for a worker
// @route   POST /api/reviews
// @access  Private (customer)
export const createReview = asyncHandler(async (req, res) => {
  const { workerId, rating, comment } = req.body;

  const existing = await Review.findOne({ worker: workerId, customer: req.userId });
  if (existing) {
    return res.status(400).json({ success: false, message: "You already reviewed this worker" });
  }

  const review = await Review.create({ worker: workerId, customer: req.userId, rating, comment });
  await recalculateWorkerRating(workerId);
  await ContactRequest.create({ worker: workerId, type: "rating", customer: req.userId });

  res.status(201).json({ success: true, review });
});

// @desc    Get all reviews for a worker
// @route   GET /api/reviews/:workerId
// @access  Public
export const getWorkerReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ worker: req.params.workerId, isReported: false })
    .sort({ createdAt: -1 })
    .populate("customer", "fullName");
  res.json({ success: true, count: reviews.length, reviews });
});

// @desc    Like a review
// @route   PUT /api/reviews/:id/like
// @access  Private (customer)
export const likeReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: "Review not found" });

  const alreadyLiked = review.likes.some((id) => id.toString() === req.userId);
  if (alreadyLiked) {
    review.likes = review.likes.filter((id) => id.toString() !== req.userId);
  } else {
    review.likes.push(req.userId);
  }
  await review.save();
  res.json({ success: true, likes: review.likes.length, liked: !alreadyLiked });
});

// @desc    Report a review / fake worker
// @route   PUT /api/reviews/:id/report
// @access  Private (customer)
export const reportReview = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isReported: true, reportReason: reason || "Not specified" },
    { new: true }
  );
  if (!review) return res.status(404).json({ success: false, message: "Review not found" });
  res.json({ success: true, message: "Review reported for moderation" });
});
