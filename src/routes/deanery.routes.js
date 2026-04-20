const express = require("express");
const deaneryController = require("../controllers/deanery.controller");
const upload = require("../middlewares/storage.middleware");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  createDeanerySchema,
  updateDeanerySchema,
} = require("../validators/deanery.validator");

const route = express.Router();

route.get("/", deaneryController.getDeaneries);
route.get("/:deaneryId", deaneryController.getDeanery);
route.get("/:deaneryId/parishes", deaneryController.getParishes);
route.get("/:deaneryId/paid-parishes", deaneryController.getPaidParishes);
route.get("/:deaneryId/users", protect, deaneryController.getUsers);
route.get("/:deaneryId/events", deaneryController.getEvents);
route.get("/:deaneryId/executives", deaneryController.getExecutives);

route.post(
  "/new",
  protect,
  authorize("Admin", "Executive"),
  upload.single("banner"),
  validate(createDeanerySchema),
  deaneryController.createDeanery
);
route.post(
  "/",
  protect,
  authorize("Admin", "Executive"),
  upload.single("banner"),
  validate(createDeanerySchema),
  deaneryController.createDeanery
);

route.put(
  "/:deaneryId",
  protect,
  authorize("Admin", "Executive"),
  upload.single("banner"),
  validate(updateDeanerySchema),
  deaneryController.updateDeanery
);

route.delete(
  "/:deaneryId",
  protect,
  authorize("Admin"),
  deaneryController.deleteDeanery
);

module.exports = route;
