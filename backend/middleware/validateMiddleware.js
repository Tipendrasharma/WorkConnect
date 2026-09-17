import { validationResult } from "express-validator";

// Runs after express-validator's body()/query() checks and returns a clean
// 400 response listing every validation failure
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};
