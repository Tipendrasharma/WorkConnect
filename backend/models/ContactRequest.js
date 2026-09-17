import mongoose from "mongoose";

// Logs every time a customer views/calls/WhatsApps a worker, so the worker
// dashboard can show "Someone viewed your profile" style notifications
const contactRequestSchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
    type: { type: String, enum: ["view", "call", "whatsapp", "rating"], required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // null for anonymous
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

contactRequestSchema.index({ worker: 1, createdAt: -1 });

export default mongoose.model("ContactRequest", contactRequestSchema);
