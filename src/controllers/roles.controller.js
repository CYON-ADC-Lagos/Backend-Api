const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");
const Role = require("../models/role.model");

exports.getRoles = asyncHandler(async (_req, res) => {
  const roles = await Role.findAll({ order: [["name", "ASC"]] });
  return sendResponse(res, 200, roles);
});

exports.createRole = asyncHandler(async (req, res, next) => {
  const existing = await Role.findOne({ where: { name: req.body.name } });
  if (existing) return next(new ErrorResponse("Role already exists", 409));
  const role = await Role.create(req.body);
  return sendResponse(res, 201, role, "Role created");
});

exports.deleteRole = asyncHandler(async (req, res, next) => {
  const role = await Role.findByPk(req.params.id);
  if (!role) return next(new ErrorResponse("Role not found", 404));
  await role.destroy();
  return sendResponse(res, 200, null, "Role deleted");
});
