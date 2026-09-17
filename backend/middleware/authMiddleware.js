import jwt from "jsonwebtoken";
import Worker from "../models/Worker.js";
import User from "../models/User.js";

// Verifies JWT sent in Authorization: Bearer <token> header.
// Attaches req.userId, req.userType ("worker" | "customer" | "admin"), req.user
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let account;
    if (decoded.type === "worker") {
      account = await Worker.findById(decoded.id);
    } else {
      account = await User.findById(decoded.id);
    }

    if (!account) {
      return res.status(401).json({ success: false, message: "Account no longer exists" });
    }
    if (account.isSuspended) {
      return res.status(403).json({ success: false, message: "Account suspended" });
    }

    req.user = account;
    req.userId = decoded.id;
    req.userType = decoded.type;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized, invalid or expired token" });
  }
};

// Restricts a route to specific account types, e.g. requireRole("worker") or requireRole("admin")
export const requireRole = (...roles) => (req, res, next) => {
  const role = req.userType === "customer" ? req.user.role : req.userType; // admin is a User with role="admin"
  if (!roles.includes(role) && !roles.includes(req.userType)) {
    return res.status(403).json({ success: false, message: "Forbidden: insufficient permissions" });
  }
  next();
};

// Attaches req.user if a valid token is present, but doesn't block the request otherwise.
// Used on public routes (e.g. logging a profile view) that behave slightly differently for logged-in users.
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return next();
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type === "worker") {
      req.user = await Worker.findById(decoded.id);
    } else {
      req.user = await User.findById(decoded.id);
    }
    req.userId = decoded.id;
    req.userType = decoded.type;
  } catch (_) {
    // Invalid token on an optional route just means "treat as anonymous"
  }
  next();
};
