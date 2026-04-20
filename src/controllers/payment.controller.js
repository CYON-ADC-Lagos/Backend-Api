const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");
const { parsePagination, buildPaginated } = require("../utils/pagination");
const Payment = require("../models/payment.model");
const Parish = require("../models/parish.model");
const Ayd = require("../models/ayd.model");

const syncParishPaid = async (parishId) => {
  const confirmed = await Payment.count({
    where: { parishId, status: "confirmed" },
  });
  await Parish.update({ hasPaid: confirmed > 0 }, { where: { id: parishId } });
};

exports.getParishPayments = asyncHandler(async (req, res, next) => {
  const parish = await Parish.findByPk(req.params.parishId);
  if (!parish) return next(new ErrorResponse("Parish not found", 404));

  const { page, limit, offset } = parsePagination(req.query);
  const result = await Payment.findAndCountAll({
    where: { parishId: parish.id },
    limit,
    offset,
    order: [["paidAt", "DESC"]],
    include: [{ model: Ayd, attributes: ["id", "theme"] }],
  });
  return sendResponse(res, 200, buildPaginated(result, { page, limit }));
});

exports.createParishPayment = asyncHandler(async (req, res, next) => {
  const parish = await Parish.findByPk(req.params.parishId);
  if (!parish) return next(new ErrorResponse("Parish not found", 404));

  if (req.body.aydId) {
    const ayd = await Ayd.findByPk(req.body.aydId);
    if (!ayd) return next(new ErrorResponse("Invalid aydId", 400));
  }

  const duplicate = await Payment.findOne({ where: { reference: req.body.reference } });
  if (duplicate) return next(new ErrorResponse("Payment reference already recorded", 409));

  const payment = await Payment.create({
    ...req.body,
    parishId: parish.id,
    recordedBy: req.user.id,
  });

  await syncParishPaid(parish.id);
  return sendResponse(res, 201, payment, "Payment recorded");
});

exports.updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findByPk(req.params.paymentId);
  if (!payment) return next(new ErrorResponse("Payment not found", 404));
  await payment.update({ status: req.body.status });
  await syncParishPaid(payment.parishId);
  return sendResponse(res, 200, payment, "Payment updated");
});

exports.deletePayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findByPk(req.params.paymentId);
  if (!payment) return next(new ErrorResponse("Payment not found", 404));
  const parishId = payment.parishId;
  await payment.destroy();
  await syncParishPaid(parishId);
  return sendResponse(res, 200, null, "Payment deleted");
});

exports.listAllPayments = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const where = {};
  if (req.query.parishId) where.parishId = req.query.parishId;
  if (req.query.aydId) where.aydId = req.query.aydId;
  if (req.query.status) where.status = req.query.status;

  const result = await Payment.findAndCountAll({
    where,
    limit,
    offset,
    order: [["paidAt", "DESC"]],
    include: [
      { model: Parish, attributes: ["id", "name", "deaneryId"] },
      { model: Ayd, attributes: ["id", "theme"] },
    ],
  });
  return sendResponse(res, 200, buildPaginated(result, { page, limit }));
});
