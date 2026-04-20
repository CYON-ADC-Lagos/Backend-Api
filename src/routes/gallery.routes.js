const express = require("express");
const router = express.Router();

const galleryController = require("../controllers/gallery.controller");
const upload = require("../middlewares/storage.middleware");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { createGalleryItemSchema } = require("../validators/cms.validator");

router.get("/", galleryController.getGallery);
router.post(
  "/",
  protect,
  authorize("Admin", "Executive"),
  upload.single("image"),
  validate(createGalleryItemSchema),
  galleryController.createGalleryItem
);
router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  galleryController.deleteGalleryItem
);

module.exports = router;
