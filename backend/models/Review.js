import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 1000 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isReported: { type: Boolean, default: false },
    reportReason: { type: String, default: "" },
  },
  { timestamps: true }
);

// One review per customer per worker
reviewSchema.index({ worker: 1, customer: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
