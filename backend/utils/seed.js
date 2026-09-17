// Seeds the Categories collection with the standard occupation list.
// Run with: npm run seed
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";

dotenv.config();

const CATEGORIES = [
  { name: "Painter", icon: "FaPaintRoller" },
  { name: "Rajmistri", icon: "FaTrowel" },
  { name: "Electrician", icon: "FaBolt" },
  { name: "Plumber", icon: "FaWrench" },
  { name: "Mechanic", icon: "FaCarSide" },
  { name: "Carpenter", icon: "FaHammer" },
  { name: "Welder", icon: "FaFire" },
  { name: "Tile Worker", icon: "FaThLarge" },
  { name: "POP Worker", icon: "FaLayerGroup" },
  { name: "Labour", icon: "FaHardHat" },
  { name: "AC Technician", icon: "FaSnowflake" },
  { name: "Cleaning Worker", icon: "FaBroom" },
  { name: "Gardener", icon: "FaLeaf" },
  { name: "House Maid", icon: "FaHome" },
  { name: "Driver", icon: "FaCarAlt" },
];

const run = async () => {
  await connectDB();
  for (const cat of CATEGORIES) {
    await Category.updateOne({ name: cat.name }, { $setOnInsert: cat }, { upsert: true });
  }
  console.log(`Seeded ${CATEGORIES.length} categories`);
  await mongoose.disconnect();
  process.exit(0);
};

run();
