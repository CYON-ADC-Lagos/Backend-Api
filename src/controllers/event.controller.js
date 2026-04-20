const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");
const { parsePagination, buildPaginated } = require("../utils/pagination");
const Event = require("../models/event.model");
const Deanery = require("../models/deanery.model");

const ADC_MARKER = "Lagos";

exports.getEvents = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const where = {};
  if (req.query.deaneryId) where.deaneryId = req.query.deaneryId;
  const result = await Event.findAndCountAll({
    where,
    limit,
    offset,
    order: [["date", "DESC"]],
    include: [{ model: Deanery, attributes: ["id", "name"] }],
  });
  return sendResponse(res, 200, buildPaginated(result, { page, limit }));
});

exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id, {
    include: [{ model: Deanery, attributes: ["id", "name"] }],
  });
  if (!event) return next(new ErrorResponse("Event not found", 404));
  return sendResponse(res, 200, event);
});

exports.getAdcEvents = asyncHandler(async (_req, res) => {
  const events = await Event.findAll({
    where: { adcId: ADC_MARKER },
    order: [["date", "DESC"]],
  });
  return sendResponse(res, 200, events);
});

exports.createEvent = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (!data.deaneryId) data.adcId = ADC_MARKER;
  if (req.file) data.bannerImage = req.file.filename;
  const event = await Event.create(data);
  return sendResponse(res, 201, event, "Event created");
});

exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);
  if (!event) return next(new ErrorResponse("Event not found", 404));
  const updates = { ...req.body };
  if (req.file) updates.bannerImage = req.file.filename;
  await event.update(updates);
  return sendResponse(res, 200, event, "Event updated");
});

exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);
  if (!event) return next(new ErrorResponse("Event not found", 404));
  await event.destroy();
  return sendResponse(res, 200, null, "Event deleted");
});
