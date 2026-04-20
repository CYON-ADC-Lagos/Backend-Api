const express = require("express");
const executiveController = require("../controllers/executive.controller");
const upload = require("../middlewares/storage.middleware");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  createExecutiveSchema,
  updateExecutiveSchema,
} = require("../validators/executive.validator");

const router = express.Router();

router.get("/", executiveController.getExecutives);
router.get("/all", executiveController.getExecutives);
router.get("/adcExecutives", executiveController.getAdcExecutives);
router.get("/:id", executiveController.getExecutive);

router.post(
  "/",
  protect,
  authorize("Admin", "Executive"),
  upload.single("picture"),
  validate(createExecutiveSchema),
  executiveController.createExecutive
);
router.post(
  "/new",
  protect,
  authorize("Admin", "Executive"),
  upload.single("picture"),
  validate(createExecutiveSchema),
  executiveController.createExecutive
);

router.put(
  "/:id",
  protect,
  authorize("Admin", "Executive"),
  upload.single("picture"),
  validate(updateExecutiveSchema),
  executiveController.updateExecutive
);

router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  executiveController.deleteExecutive
);

module.exports = router;
