const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");
const { parsePagination, buildPaginated } = require("../utils/pagination");
const Parish = require("../models/parish.model");
const Deanery = require("../models/deanery.model");
const User = require("../models/user.model");

const USER_ATTRS = ["id", "firstName", "lastName", "email", "phoneNumber"];

exports.getParishes = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const where = {};
  if (req.query.deaneryId) where.deaneryId = req.query.deaneryId;
  if (req.query.hasPaid !== undefined)
    where.hasPaid = req.query.hasPaid === "true";

  const result = await Parish.findAndCountAll({
    where,
    limit,
    offset,
    order: [["name", "ASC"]],
    include: [{ model: Deanery, attributes: ["id", "name"] }],
  });
  return sendResponse(res, 200, buildPaginated(result, { page, limit }));
});

exports.getPaidParishes = asyncHandler(async (_req, res) => {
  const parishes = await Parish.findAll({
    where: { hasPaid: true },
    order: [["name", "ASC"]],
    include: [{ model: Deanery, attributes: ["id", "name"] }],
  });
  return sendResponse(res, 200, parishes);
});

exports.getParish = asyncHandler(async (req, res, next) => {
  const parish = await Parish.findByPk(req.params.parishId, {
    include: [{ model: Deanery, attributes: ["id", "name"] }],
  });
  if (!parish) return next(new ErrorResponse("Parish not found", 404));
  return sendResponse(res, 200, parish);
});

exports.createParish = asyncHandler(async (req, res, next) => {
  const deanery = await Deanery.findByPk(req.body.deaneryId);
  if (!deanery) return next(new ErrorResponse("Invalid deaneryId", 400));

  // if (req.body.email) {
  //   const d = await Parish.findOne({ where: { email: req.body.email } });
  //   if (d) return next(new ErrorResponse("Parish email already exists", 409));
  // }

  const duplicate = await Parish.findOne({ where: { email: req.body.email } });
  if (duplicate)
    return next(new ErrorResponse("Parish email already exists", 409));

  const parish = await Parish.create(req.body);
  return sendResponse(res, 201, parish, "Parish created");
});

exports.updateParish = asyncHandler(async (req, res, next) => {
  const parish = await Parish.findByPk(req.params.parishId);
  if (!parish) return next(new ErrorResponse("Parish not found", 404));
  if (req.body.deaneryId) {
    const d = await Deanery.findByPk(req.body.deaneryId);
    if (!d) return next(new ErrorResponse("Invalid deaneryId", 400));
  }
  await parish.update(req.body);
  return sendResponse(res, 200, parish, "Parish updated");
});

exports.deleteParish = asyncHandler(async (req, res, next) => {
  const parish = await Parish.findByPk(req.params.parishId);
  if (!parish) return next(new ErrorResponse("Parish not found", 404));
  await parish.destroy();
  return sendResponse(res, 200, null, "Parish deleted");
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  const parish = await Parish.findByPk(req.params.parishId);
  if (!parish) return next(new ErrorResponse("Parish not found", 404));
  const users = await User.findAll({
    where: { parishId: parish.id },
    attributes: USER_ATTRS,
    order: [["lastName", "ASC"]],
  });
  return sendResponse(res, 200, users);
});
