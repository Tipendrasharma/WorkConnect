import {
  FaPaintRoller, FaBolt, FaWrench, FaCarSide, FaHammer, FaFire,
  FaThLarge, FaLayerGroup, FaHardHat, FaSnowflake, FaBroom, FaLeaf,
  FaHome, FaCarAlt, FaTools,
} from "react-icons/fa";

export const OCCUPATIONS = [
  "Painter", "Rajmistri", "Electrician", "Plumber", "Mechanic",
  "Carpenter", "Welder", "Tile Worker", "POP Worker", "Labour",
  "AC Technician", "Cleaning Worker", "Gardener", "House Maid", "Driver",
];

export const OCCUPATION_ICONS = {
  Painter: FaPaintRoller,
  Rajmistri: FaTools,
  Electrician: FaBolt,
  Plumber: FaWrench,
  Mechanic: FaCarSide,
  Carpenter: FaHammer,
  Welder: FaFire,
  "Tile Worker": FaThLarge,
  "POP Worker": FaLayerGroup,
  Labour: FaHardHat,
  "AC Technician": FaSnowflake,
  "Cleaning Worker": FaBroom,
  Gardener: FaLeaf,
  "House Maid": FaHome,
  Driver: FaCarAlt,
};

export const RADIUS_OPTIONS = [5, 10, 20, 50];

export const AVAILABILITY_COLORS = {
  "Available Now": "bg-accent/15 text-accent",
  Busy: "bg-amber-100 text-amber-700",
  Offline: "bg-slate-200 text-slate-600",
};
