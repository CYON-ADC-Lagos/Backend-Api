const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");
const { parsePagination, buildPaginated } = require("../utils/pagination");
const Chaplain = require("../models/chaplain.model");
const Deanery = require("../models/deanery.model");
const Parish = require("../models/parish.model");

exports.getChaplains = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const where = {};
  if (req.query.deaneryId) where.deaneryId = req.query.deaneryId;
  if (req.query.parishId) where.parishId = req.query.parishId;

  const result = await Chaplain.findAndCountAll({
    where,
    limit,
    offset,
    order: [["lastName", "ASC"]],
    include: [
      { model: Deanery, attributes: ["id", "name"] },
      { model: Parish, attributes: ["id", "name"] },
    ],
  });
  return sendResponse(res, 200, buildPaginated(result, { page, limit }));
});

exports.getChaplain = asyncHandler(async (req, res, next) => {
  const chaplain = await Chaplain.findByPk(req.params.id, {
    include: [
      { model: Deanery, attributes: ["id", "name"] },
      { model: Parish, attributes: ["id", "name"] },
    ],
  });
  if (!chaplain) return next(new ErrorResponse("Chaplain not found", 404));
  return sendResponse(res, 200, chaplain);
});

exports.createChaplain = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.image = req.file.filename;
  const chaplain = await Chaplain.create(data);
  return sendResponse(res, 201, chaplain, "Chaplain created");
});

exports.updateChaplain = asyncHandler(async (req, res, next) => {
  const chaplain = await Chaplain.findByPk(req.params.id);
  if (!chaplain) return next(new ErrorResponse("Chaplain not found", 404));
  const updates = { ...req.body };
  if (req.file) updates.image = req.file.filename;
  await chaplain.update(updates);
  return sendResponse(res, 200, chaplain, "Chaplain updated");
});

exports.deleteChaplain = asyncHandler(async (req, res, next) => {
  const chaplain = await Chaplain.findByPk(req.params.id);
  if (!chaplain) return next(new ErrorResponse("Chaplain not found", 404));
  await chaplain.destroy();
  return sendResponse(res, 200, null, "Chaplain deleted");
});
