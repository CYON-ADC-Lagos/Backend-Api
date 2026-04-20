const express = require("express");
const userController = require("../controllers/user.controller");
const upload = require("../middlewares/storage.middleware");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { authLimiter } = require("../middlewares/rateLimit");
const {
  registerSchema,
  loginSchema,
  updateUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require("../validators/user.validator");

const route = express.Router();

route.post("/login", authLimiter, validate(loginSchema), userController.loginUser);
route.post(
  "/register",
  authLimiter,
  upload.single("picture"),
  validate(registerSchema),
  userController.register
);

route.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordSchema),
  userController.forgotPassword
);
route.post(
  "/reset-password",
  authLimiter,
  validate(resetPasswordSchema),
  userController.resetPassword
);
route.post(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  userController.changePassword
);

route.get("/", protect, authorize("Admin"), userController.getUsers);
route.get("/all", protect, authorize("Admin"), userController.getUsers);
route.get("/me", protect, userController.getMe);
route.get("/:id", protect, userController.getUserById);
route.put(
  "/:id",
  protect,
  upload.single("picture"),
  validate(updateUserSchema),
  userController.updateUser
);
route.delete("/:id", protect, authorize("Admin"), userController.deleteUser);

module.exports = route;
