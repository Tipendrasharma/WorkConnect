import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String, default: "" }, // icon name (react-icons) for the frontend grid
    searchCount: { type: Number, default: 0 }, // incremented on every search, powers "Most Searched Category"
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
