const express = require("express");
const router = express.Router();

const feedbackController = require("../controllers/feedback.controller");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { publicFormLimiter } = require("../middlewares/rateLimit");
const { createFeedbackSchema } = require("../validators/cms.validator");

router.post(
  "/",
  publicFormLimiter,
  validate(createFeedbackSchema),
  feedbackController.createFeedback
);

router.get("/", protect, authorize("Admin"), feedbackController.getFeedback);
router.get("/:id", protect, authorize("Admin"), feedbackController.getFeedbackItem);
router.patch(
  "/:id/status",
  protect,
  authorize("Admin"),
  feedbackController.updateFeedbackStatus
);
router.delete("/:id", protect, authorize("Admin"), feedbackController.deleteFeedback);

module.exports = router;
