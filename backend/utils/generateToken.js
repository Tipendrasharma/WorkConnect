import jwt from "jsonwebtoken";

// type is "worker" or "customer" - lets the auth middleware know which
// collection to look the account up in
export const generateToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};
