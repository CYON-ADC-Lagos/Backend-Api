const express = require("express");
const rolesController = require("../controllers/roles.controller");
const { protect, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { createRoleSchema } = require("../validators/role.validator");

const route = express.Router();

route.get("/", rolesController.getRoles);
route.post(
  "/new",
  protect,
  authorize("Admin"),
  validate(createRoleSchema),
  rolesController.createRole
);
route.post(
  "/",
  protect,
  authorize("Admin"),
  validate(createRoleSchema),
  rolesController.createRole
);
route.delete(
  "/:id",
  protect,
  authorize("Admin"),
  rolesController.deleteRole
);

module.exports = route;
