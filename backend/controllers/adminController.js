import Worker from "../models/Worker.js";
import Category from "../models/Category.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

// @desc    Admin dashboard summary stats
// @route   GET /api/admin/dashboard
// @access  Private (admin)
export const getAdminDashboard = asyncHandler(async (req, res) => {
  const totalWorkers = await Worker.countDocuments();
  const totalCategories = await Category.countDocuments();
  const suspendedWorkers = await Worker.countDocuments({ isSuspended: true });
  const unverifiedWorkers = await Worker.countDocuments({ isVerified: false });

  const mostSearchedCategory = await Category.findOne().sort({ searchCount: -1 });

  res.json({
    success: true,
    stats: {
      totalWorkers,
      totalCategories,
      suspendedWorkers,
      unverifiedWorkers,
      mostSearchedCategory: mostSearchedCategory?.name || "N/A",
    },
  });
});

// @desc    Search/list workers for moderation (with pagination)
// @route   GET /api/admin/workers?keyword=&page=&limit=
// @access  Private (admin)
export const adminSearchWorkers = asyncHandler(async (req, res) => {
  const { keyword, page = 1, limit = 20 } = req.query;
  const query = keyword
    ? { $or: [{ fullName: { $regex: keyword, $options: "i" } }, { mobile: { $regex: keyword, $options: "i" } }] }
    : {};

  const total = await Worker.countDocuments(query);
  const workers = await Worker.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), workers });
});

// @desc    Approve / verify a worker
// @route   PUT /api/admin/workers/:id/approve
// @access  Private (admin)
export const approveWorker = asyncHandler(async (req, res) => {
  const worker = await Worker.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
  if (!worker) return res.status(404).json({ success: false, message: "Worker not found" });
  res.json({ success: true, worker });
});

// @desc    Suspend a worker
// @route   PUT /api/admin/workers/:id/suspend
// @access  Private (admin)
export const suspendWorker = asyncHandler(async (req, res) => {
  const worker = await Worker.findByIdAndUpdate(req.params.id, { isSuspended: true }, { new: true });
  if (!worker) return res.status(404).json({ success: false, message: "Worker not found" });
  res.json({ success: true, worker });
});

// @desc    Reinstate a suspended worker
// @route   PUT /api/admin/workers/:id/reinstate
// @access  Private (admin)
export const reinstateWorker = asyncHandler(async (req, res) => {
  const worker = await Worker.findByIdAndUpdate(req.params.id, { isSuspended: false }, { new: true });
  if (!worker) return res.status(404).json({ success: false, message: "Worker not found" });
  res.json({ success: true, worker });
});

// @desc    Delete a fake/spam worker account permanently
// @route   DELETE /api/admin/workers/:id
// @access  Private (admin)
export const deleteWorkerAdmin = asyncHandler(async (req, res) => {
  const worker = await Worker.findByIdAndDelete(req.params.id);
  if (!worker) return res.status(404).json({ success: false, message: "Worker not found" });
  res.json({ success: true, message: "Worker account deleted" });
});
