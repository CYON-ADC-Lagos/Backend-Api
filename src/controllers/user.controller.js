const crypto = require("crypto");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");
const logger = require("../utils/logger");
const { parsePagination, buildPaginated } = require("../utils/pagination");
const { signToken } = require("../middlewares/auth");
const userService = require("../services/user.service");
const User = require("../models/user.model");

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1h
const hashToken = (raw) => crypto.createHash("sha256").update(raw).digest("hex");

exports.register = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (req.file) payload.picture = req.file.filename;

  const user = await userService.createUser(payload);
  const token = signToken(user);
  return sendResponse(res, 201, { token, user }, "Registered");
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userService.findByEmail(email);
  if (!user) return next(new ErrorResponse("Invalid credentials", 401));

  const ok = await userService.verifyPassword(password, user.password);
  if (!ok) return next(new ErrorResponse("Invalid credentials", 401));

  const token = signToken(user);
  const fullUser = await User.findByPk(user.id, {
    attributes: userService.PUBLIC_ATTRS,
    include: userService.publicInclude,
  });
  return sendResponse(res, 200, { token, user: fullUser }, "Login successful");
});

exports.getUsers = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const result = await User.findAndCountAll({
    attributes: userService.PUBLIC_ATTRS,
    include: userService.publicInclude,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });
  return sendResponse(res, 200, buildPaginated(result, { page, limit }));
});

exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id, {
    attributes: userService.PUBLIC_ATTRS,
    include: userService.publicInclude,
  });
  if (!user) return next(new ErrorResponse("User not found", 404));
  return sendResponse(res, 200, user);
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: userService.PUBLIC_ATTRS,
    include: userService.publicInclude,
  });
  return sendResponse(res, 200, user);
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return next(new ErrorResponse("User not found", 404));

  const isSelf = req.user.id === user.id;
  const isAdmin = req.user.Role?.name === "Admin";
  if (!isSelf && !isAdmin) return next(new ErrorResponse("Forbidden", 403));

  const updates = { ...req.body };
  if (req.file) updates.picture = req.file.filename;
  if (!isAdmin) {
    delete updates.roleId;
    delete updates.isActive;
  }

  await user.update(updates);
  const fresh = await User.findByPk(user.id, {
    attributes: userService.PUBLIC_ATTRS,
    include: userService.publicInclude,
  });
  return sendResponse(res, 200, fresh, "User updated");
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return next(new ErrorResponse("User not found", 404));
  await user.destroy();
  return sendResponse(res, 200, null, "User deleted");
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const user = await userService.findByEmail(req.body.email);
  // Always respond 200 so callers can't enumerate accounts.
  const response = sendResponse(
    res,
    200,
    null,
    "If an account exists for that email, a reset link has been sent."
  );
  if (!user) return response;

  const rawToken = crypto.randomBytes(32).toString("hex");
  await user.update({
    resetTokenHash: hashToken(rawToken),
    resetTokenExpiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
  });

  // Integration point for an email provider. Logged for now.
  logger.info(
    { userId: user.id, resetToken: rawToken },
    "Password reset token issued (deliver via email)"
  );
  return response;
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    where: { resetTokenHash: hashToken(token) },
  });
  if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
    return next(new ErrorResponse("Invalid or expired reset token", 400));
  }

  await user.update({
    password: await userService.hashPassword(password),
    resetTokenHash: null,
    resetTokenExpiresAt: null,
  });
  return sendResponse(res, 200, null, "Password reset");
});

exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id);
  if (!user) return next(new ErrorResponse("User not found", 404));

  const ok = await userService.verifyPassword(currentPassword, user.password);
  if (!ok) return next(new ErrorResponse("Current password is incorrect", 401));

  await user.update({ password: await userService.hashPassword(newPassword) });
  return sendResponse(res, 200, null, "Password changed");
});
