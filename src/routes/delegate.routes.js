const express = require("express");
const router = express.Router();

const aydController = require("../controllers/ayd.controller");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { publicFormLimiter } = require("../middlewares/rateLimit");
const { createDelegateSchema } = require("../validators/ayd.validator");

router.get("/", protect, aydController.getDelegates);
router.get("/:id", protect, aydController.getDelegate);
router.post(
  "/new",
  publicFormLimiter,
  validate(createDelegateSchema),
  aydController.createDelegate
);
router.post(
  "/",
  publicFormLimiter,
  validate(createDelegateSchema),
  aydController.createDelegate
);
router.delete("/:id", protect, authorize("Admin"), aydController.deleteDelegate);

module.exports = router;
