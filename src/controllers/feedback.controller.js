const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");
const { parsePagination, buildPaginated } = require("../utils/pagination");
const Feedback = require("../models/feedback.model");

exports.createFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.create(req.body);
  return sendResponse(res, 201, { id: feedback.id }, "Feedback received");
});

exports.getFeedback = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const where = {};
  if (req.query.status) where.status = req.query.status;
  const result = await Feedback.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });
  return sendResponse(res, 200, buildPaginated(result, { page, limit }));
});

exports.getFeedbackItem = asyncHandler(async (req, res, next) => {
  const feedback = await Feedback.findByPk(req.params.id);
  if (!feedback) return next(new ErrorResponse("Feedback not found", 404));
  return sendResponse(res, 200, feedback);
});

exports.updateFeedbackStatus = asyncHandler(async (req, res, next) => {
  const feedback = await Feedback.findByPk(req.params.id);
  if (!feedback) return next(new ErrorResponse("Feedback not found", 404));
  const allowed = ["new", "in_progress", "resolved"];
  if (!allowed.includes(req.body.status)) {
    return next(new ErrorResponse("Invalid status", 400));
  }
  await feedback.update({ status: req.body.status });
  return sendResponse(res, 200, feedback, "Status updated");
});

exports.deleteFeedback = asyncHandler(async (req, res, next) => {
  const feedback = await Feedback.findByPk(req.params.id);
  if (!feedback) return next(new ErrorResponse("Feedback not found", 404));
  await feedback.destroy();
  return sendResponse(res, 200, null, "Feedback deleted");
});
