const express = require("express");
const parishController = require("../controllers/parish.controller");
const paymentController = require("../controllers/payment.controller");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  createParishSchema,
  updateParishSchema,
} = require("../validators/parish.validator");
const { createPaymentSchema } = require("../validators/payment.validator");

const route = express.Router();

route.get("/", parishController.getParishes);
route.get("/paid-parishes", parishController.getPaidParishes);
route.get("/:parishId", parishController.getParish);
route.get("/:parishId/users", protect, parishController.getUsers);
route.get(
  "/:parishId/payments",
  protect,
  authorize("Admin", "Executive"),
  paymentController.getParishPayments
);
route.post(
  "/:parishId/payments",
  protect,
  authorize("Admin", "Executive"),
  validate(createPaymentSchema),
  paymentController.createParishPayment
);

route.post(
  "/new",
  protect,
  authorize("Admin", "Executive"),
  validate(createParishSchema),
  parishController.createParish
);
route.post(
  "/",
  protect,
  authorize("Admin", "Executive"),
  validate(createParishSchema),
  parishController.createParish
);

route.put(
  "/:parishId",
  protect,
  authorize("Admin", "Executive"),
  validate(updateParishSchema),
  parishController.updateParish
);

route.delete(
  "/:parishId",
  protect,
  authorize("Admin"),
  parishController.deleteParish
);

module.exports = route;
