const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user.model");
const Role = require("../models/role.model");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  // Fail loud at boot rather than at first request.
  throw new Error("JWT_SECRET env var is required.");
}

const extractToken = (req) => {
  const header = req.headers.authorization || req.headers.Authorization;
  if (header && header.startsWith("Bearer ")) return header.slice(7).trim();
  if (req.headers.token) return req.headers.token;
  return null;
};

const protect = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) return next(new ErrorResponse("Not authenticated", 401));

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (_e) {
    return next(new ErrorResponse("Invalid or expired token", 401));
  }

  const user = await User.findByPk(decoded.id, {
    include: [{ model: Role }],
    attributes: { exclude: ["password"] },
  });
  if (!user) return next(new ErrorResponse("User no longer exists", 401));

  req.user = user;
  req.auth = decoded;
  next();
});

const authorize = (...roles) =>
  asyncHandler(async (req, _res, next) => {
    if (!req.user) return next(new ErrorResponse("Not authenticated", 401));
    const roleName = req.user.Role?.name;
    if (!roleName || !roles.includes(roleName)) {
      return next(new ErrorResponse("Forbidden", 403));
    }
    next();
  });

const signToken = (user) =>
  jwt.sign(
    { id: user.id, roleId: user.roleId },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "5h" }
  );

module.exports = { protect, authorize, signToken };
