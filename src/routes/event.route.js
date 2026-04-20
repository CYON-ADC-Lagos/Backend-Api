const express = require("express");
const eventController = require("../controllers/event.controller");
const upload = require("../middlewares/storage.middleware");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  createEventSchema,
  updateEventSchema,
} = require("../validators/event.validator");

const router = express.Router();

router.get("/", eventController.getEvents);
router.get("/all", eventController.getEvents);
router.get("/adcEvents", eventController.getAdcEvents);
router.get("/:id", eventController.getEvent);

router.post(
  "/",
  protect,
  authorize("Admin", "Executive"),
  upload.single("bannerImage"),
  validate(createEventSchema),
  eventController.createEvent
);
router.post(
  "/new",
  protect,
  authorize("Admin", "Executive"),
  upload.single("bannerImage"),
  validate(createEventSchema),
  eventController.createEvent
);

router.put(
  "/:id",
  protect,
  authorize("Admin", "Executive"),
  upload.single("bannerImage"),
  validate(updateEventSchema),
  eventController.updateEvent
);

router.delete(
  "/:id",
  protect,
  authorize("Admin"),
  eventController.deleteEvent
);

module.exports = router;
