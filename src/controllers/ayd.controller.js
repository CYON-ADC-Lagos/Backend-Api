const { Op } = require("sequelize");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");
const { parsePagination, buildPaginated } = require("../utils/pagination");
const Ayd = require("../models/ayd.model");
const Delegate = require("../models/delegate.model");
const Deanery = require("../models/deanery.model");
const Parish = require("../models/parish.model");

const delegateCountSql = (aydId) => ({
  model: Delegate,
  attributes: [],
  where: { aydId },
  required: false,
});

exports.getAydList = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const result = await Ayd.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  const items = await Promise.all(
    result.rows.map(async (ayd) => {
      const totalDelegates = await Delegate.count({ where: { aydId: ayd.id } });
      const paidParishIds = await Delegate.findAll({
        where: { aydId: ayd.id },
        attributes: ["parishId"],
        group: ["parishId"],
      });
      return {
        ...ayd.toJSON(),
        totalDelegates,
        totalPaidParish: paidParishIds.length,
      };
    })
  );

  return sendResponse(res, 200, buildPaginated({ rows: items, count: result.count }, { page, limit }));
});

exports.getAyd = asyncHandler(async (req, res, next) => {
  const ayd = await Ayd.findByPk(req.params.id);
  if (!ayd) return next(new ErrorResponse("AYD not found", 404));
  const totalDelegates = await Delegate.count({ where: { aydId: ayd.id } });
  return sendResponse(res, 200, { ...ayd.toJSON(), totalDelegates });
});

exports.getActiveAyd = asyncHandler(async (_req, res, next) => {
  const ayd = await Ayd.findOne({
    where: { isActive: true },
    order: [["createdAt", "DESC"]],
  });
  if (!ayd) return next(new ErrorResponse("No active AYD", 404));
  return sendResponse(res, 200, ayd);
});

exports.createAyd = asyncHandler(async (req, res) => {
  const ayd = await Ayd.create(req.body);
  return sendResponse(res, 201, ayd, "AYD created");
});

exports.updateAyd = asyncHandler(async (req, res, next) => {
  const ayd = await Ayd.findByPk(req.params.id);
  if (!ayd) return next(new ErrorResponse("AYD not found", 404));
  await ayd.update(req.body);
  return sendResponse(res, 200, ayd, "AYD updated");
});

exports.deleteAyd = asyncHandler(async (req, res, next) => {
  const ayd = await Ayd.findByPk(req.params.id);
  if (!ayd) return next(new ErrorResponse("AYD not found", 404));
  await ayd.destroy();
  return sendResponse(res, 200, null, "AYD deleted");
});

exports.getDelegates = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query, { limit: 50 });
  const where = {};
  if (req.query.aydId) where.aydId = req.query.aydId;
  if (req.query.deaneryId) where.deaneryId = req.query.deaneryId;
  if (req.query.parishId) where.parishId = req.query.parishId;
  if (req.query.gender) where.gender = req.query.gender;
  if (req.query.search) {
    const q = `%${req.query.search}%`;
    where[Op.or] = [
      { firstName: { [Op.like]: q } },
      { lastName: { [Op.like]: q } },
      { email: { [Op.like]: q } },
    ];
  }
  const result = await Delegate.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      { model: Deanery, attributes: ["id", "name"] },
      { model: Parish, attributes: ["id", "name"] },
    ],
  });
  return sendResponse(res, 200, buildPaginated(result, { page, limit }));
});

exports.getDelegate = asyncHandler(async (req, res, next) => {
  const delegate = await Delegate.findByPk(req.params.id, {
    include: [
      { model: Deanery, attributes: ["id", "name"] },
      { model: Parish, attributes: ["id", "name"] },
      { model: Ayd, attributes: ["id", "theme"] },
    ],
  });
  if (!delegate) return next(new ErrorResponse("Delegate not found", 404));
  return sendResponse(res, 200, delegate);
});

exports.createDelegate = asyncHandler(async (req, res, next) => {
  const { aydId, deaneryId, parishId, email } = req.body;

  const [ayd, deanery, parish] = await Promise.all([
    Ayd.findByPk(aydId),
    Deanery.findByPk(deaneryId),
    Parish.findByPk(parishId),
  ]);
  if (!ayd) return next(new ErrorResponse("Invalid aydId", 400));
  if (!deanery) return next(new ErrorResponse("Invalid deaneryId", 400));
  if (!parish) return next(new ErrorResponse("Invalid parishId", 400));
  if (parish.deaneryId !== deaneryId) {
    return next(new ErrorResponse("Parish does not belong to deanery", 400));
  }
  if (!parish.hasPaid) {
    return next(new ErrorResponse("Parish has not paid for this AYD", 402));
  }

  const existing = await Delegate.findOne({ where: { email, aydId } });
  if (existing) return next(new ErrorResponse("Already registered for this AYD", 409));

  const delegate = await Delegate.create(req.body);
  return sendResponse(res, 201, delegate, "Delegate registered");
});

exports.deleteDelegate = asyncHandler(async (req, res, next) => {
  const delegate = await Delegate.findByPk(req.params.id);
  if (!delegate) return next(new ErrorResponse("Delegate not found", 404));
  await delegate.destroy();
  return sendResponse(res, 200, null, "Delegate removed");
});
