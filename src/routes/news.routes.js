const express = require("express");
const router = express.Router();

const newsController = require("../controllers/news.controller");
const upload = require("../middlewares/storage.middleware");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  createNewsSchema,
  updateNewsSchema,
} = require("../validators/cms.validator");

router.get("/", newsController.getNewsList);
router.get("/:id", newsController.getNews);
router.post(
  "/",
  protect,
  authorize("Admin", "Executive"),
  upload.single("image"),
  validate(createNewsSchema),
  newsController.createNews
);
router.put(
  "/:id",
  protect,
  authorize("Admin", "Executive"),
  upload.single("image"),
  validate(updateNewsSchema),
  newsController.updateNews
);
router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  newsController.deleteNews
);

module.exports = router;
