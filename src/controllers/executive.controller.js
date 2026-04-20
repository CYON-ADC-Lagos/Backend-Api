const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");
const { parsePagination, buildPaginated } = require("../utils/pagination");
const Executive = require("../models/executive.model");
const Deanery = require("../models/deanery.model");

const ADC_MARKER = "Lagos";

exports.getExecutives = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query, { limit: 50 });
  const where = {};
  if (req.query.deaneryId) where.deaneryId = req.query.deaneryId;
  const result = await Executive.findAndCountAll({
    where,
    limit,
    offset,
    order: [["order", "ASC"], ["lastName", "ASC"]],
    include: [{ model: Deanery, attributes: ["id", "name"] }],
  });
  return sendResponse(res, 200, buildPaginated(result, { page, limit }));
});

exports.getAdcExecutives = asyncHandler(async (_req, res) => {
  const executives = await Executive.findAll({
    where: { adcId: ADC_MARKER },
    order: [["order", "ASC"], ["lastName", "ASC"]],
  });
  return sendResponse(res, 200, executives);
});

exports.getExecutive = asyncHandler(async (req, res, next) => {
  const executive = await Executive.findByPk(req.params.id, {
    include: [{ model: Deanery, attributes: ["id", "name"] }],
  });
  if (!executive) return next(new ErrorResponse("Executive not found", 404));
  return sendResponse(res, 200, executive);
});

exports.createExecutive = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (!data.deaneryId) data.adcId = ADC_MARKER;
  if (req.file) data.picture = req.file.filename;
  const executive = await Executive.create(data);
  return sendResponse(res, 201, executive, "Executive created");
});

exports.updateExecutive = asyncHandler(async (req, res, next) => {
  const executive = await Executive.findByPk(req.params.id);
  if (!executive) return next(new ErrorResponse("Executive not found", 404));
  const updates = { ...req.body };
  if (req.file) updates.picture = req.file.filename;
  await executive.update(updates);
  return sendResponse(res, 200, executive, "Executive updated");
});

exports.deleteExecutive = asyncHandler(async (req, res, next) => {
  const executive = await Executive.findByPk(req.params.id);
  if (!executive) return next(new ErrorResponse("Executive not found", 404));
  await executive.destroy();
  return sendResponse(res, 200, null, "Executive deleted");
});
