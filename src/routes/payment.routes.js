const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment.controller");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { updatePaymentStatusSchema } = require("../validators/payment.validator");

router.get(
  "/",
  protect,
  authorize("Admin", "Executive"),
  paymentController.listAllPayments
);
router.patch(
  "/:paymentId/status",
  protect,
  authorize("Admin"),
  validate(updatePaymentStatusSchema),
  paymentController.updatePaymentStatus
);
router.delete(
  "/:paymentId",
  protect,
  authorize("Admin"),
  paymentController.deletePayment
);

module.exports = router;
