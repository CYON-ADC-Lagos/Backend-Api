const express = require("express");
const router = express.Router();

const chaplainController = require("../controllers/chaplain.controller");
const upload = require("../middlewares/storage.middleware");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  createChaplainSchema,
  updateChaplainSchema,
} = require("../validators/chaplain.validator");

router.get("/", chaplainController.getChaplains);
router.get("/:id", chaplainController.getChaplain);
router.post(
  "/",
  protect,
  authorize("Admin", "Executive"),
  upload.single("image"),
  validate(createChaplainSchema),
  chaplainController.createChaplain
);
router.put(
  "/:id",
  protect,
  authorize("Admin", "Executive"),
  upload.single("image"),
  validate(updateChaplainSchema),
  chaplainController.updateChaplain
);
router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  chaplainController.deleteChaplain
);

module.exports = router;
