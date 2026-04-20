const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");
const { parsePagination, buildPaginated } = require("../utils/pagination");
const Deanery = require("../models/deanery.model");
const Parish = require("../models/parish.model");
const User = require("../models/user.model");
const Event = require("../models/event.model");
const Executive = require("../models/executive.model");

const PARISH_ATTRS = ["id", "name", "email", "location", "meetingDay", "time", "hasPaid"];
const USER_ATTRS = ["id", "firstName", "lastName", "email", "phoneNumber"];

exports.getDeaneries = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const result = await Deanery.findAndCountAll({
    limit,
    offset,
    order: [["name", "ASC"]],
  });
  return sendResponse(res, 200, buildPaginated(result, { page, limit }));
});

exports.getDeanery = asyncHandler(async (req, res, next) => {
  const deanery = await Deanery.findByPk(req.params.deaneryId);
  if (!deanery) return next(new ErrorResponse("Deanery not found", 404));
  return sendResponse(res, 200, deanery);
});

exports.createDeanery = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.banner = req.file.filename;
  const deanery = await Deanery.create(data);
  return sendResponse(res, 201, deanery, "Deanery created");
});

exports.updateDeanery = asyncHandler(async (req, res, next) => {
  const deanery = await Deanery.findByPk(req.params.deaneryId);
  if (!deanery) return next(new ErrorResponse("Deanery not found", 404));
  const updates = { ...req.body };
  if (req.file) updates.banner = req.file.filename;
  await deanery.update(updates);
  return sendResponse(res, 200, deanery, "Deanery updated");
});

exports.deleteDeanery = asyncHandler(async (req, res, next) => {
  const deanery = await Deanery.findByPk(req.params.deaneryId);
  if (!deanery) return next(new ErrorResponse("Deanery not found", 404));
  await deanery.destroy();
  return sendResponse(res, 200, null, "Deanery deleted");
});

exports.getParishes = asyncHandler(async (req, res, next) => {
  const deanery = await Deanery.findByPk(req.params.deaneryId);
  if (!deanery) return next(new ErrorResponse("Deanery not found", 404));
  const parishes = await Parish.findAll({
    where: { deaneryId: deanery.id },
    attributes: PARISH_ATTRS,
    order: [["name", "ASC"]],
  });
  return sendResponse(res, 200, parishes);
});

exports.getPaidParishes = asyncHandler(async (req, res, next) => {
  const deanery = await Deanery.findByPk(req.params.deaneryId);
  if (!deanery) return next(new ErrorResponse("Deanery not found", 404));
  const parishes = await Parish.findAll({
    where: { deaneryId: deanery.id, hasPaid: true },
    attributes: PARISH_ATTRS,
    order: [["name", "ASC"]],
  });
  return sendResponse(res, 200, parishes);
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  const deanery = await Deanery.findByPk(req.params.deaneryId);
  if (!deanery) return next(new ErrorResponse("Deanery not found", 404));
  const users = await User.findAll({
    where: { deaneryId: deanery.id },
    attributes: USER_ATTRS,
    order: [["lastName", "ASC"]],
  });
  return sendResponse(res, 200, users);
});

exports.getEvents = asyncHandler(async (req, res, next) => {
  const deanery = await Deanery.findByPk(req.params.deaneryId);
  if (!deanery) return next(new ErrorResponse("Deanery not found", 404));
  const events = await Event.findAll({
    where: { deaneryId: deanery.id },
    order: [["date", "DESC"]],
  });
  return sendResponse(res, 200, events);
});

exports.getExecutives = asyncHandler(async (req, res, next) => {
  const deanery = await Deanery.findByPk(req.params.deaneryId);
  if (!deanery) return next(new ErrorResponse("Deanery not found", 404));
  const executives = await Executive.findAll({
    where: { deaneryId: deanery.id },
    order: [["order", "ASC"], ["lastName", "ASC"]],
  });
  return sendResponse(res, 200, executives);
});
