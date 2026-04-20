const express = require("express");
const router = express.Router();

const aydController = require("../controllers/ayd.controller");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { publicFormLimiter } = require("../middlewares/rateLimit");
const {
  createAydSchema,
  updateAydSchema,
  createDelegateSchema,
} = require("../validators/ayd.validator");

router.get("/", aydController.getAydList);
router.get("/active", aydController.getActiveAyd);
router.get("/:id", aydController.getAyd);
router.post(
  "/",
  protect,
  authorize("Admin"),
  validate(createAydSchema),
  aydController.createAyd
);
router.post(
  "/new",
  protect,
  authorize("Admin"),
  validate(createAydSchema),
  aydController.createAyd
);
router.put(
  "/:id",
  protect,
  authorize("Admin"),
  validate(updateAydSchema),
  aydController.updateAyd
);
router.delete("/:id", protect, authorize("Admin"), aydController.deleteAyd);

module.exports = router;
