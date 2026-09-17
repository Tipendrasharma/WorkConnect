import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const workerSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },

    profilePhoto: { type: String, default: "" }, // ImageKit URL
    occupation: {
      type: String,
      required: true,
      enum: [
        "Painter", "Rajmistri", "Electrician", "Plumber", "Mechanic",
        "Carpenter", "Welder", "Tile Worker", "POP Worker", "Labour",
        "AC Technician", "Cleaning Worker", "Gardener", "House Maid", "Driver",
      ],
    },
    experience: { type: Number, required: true, min: 0 }, // years
    dailyWage: { type: Number, required: true, min: 0 },
    hourlyWage: { type: Number, min: 0 },

    address: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },

    // GeoJSON point for MongoDB geospatial queries (2dsphere index)
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },

    availability: {
      type: String,
      enum: ["Available Now", "Busy", "Offline"],
      default: "Available Now",
    },
    workingHours: { type: String, default: "9:00 AM - 6:00 PM" },
    languagesSpoken: [{ type: String }],
    description: { type: String, maxlength: 1000 },
    skills: [{ type: String }],
    governmentId: { type: String, default: "" }, // optional uploaded doc URL

    isVerified: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    lastActiveAt: { type: Date, default: Date.now },

    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 2dsphere index enables $near / $geoNear queries for "nearest workers"
workerSchema.index({ location: "2dsphere" });
workerSchema.index({ occupation: 1 });
workerSchema.index({ fullName: "text", occupation: "text", skills: "text" });

// Hash password before saving
workerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

workerSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Never send password hash to the client
workerSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("Worker", workerSchema);
