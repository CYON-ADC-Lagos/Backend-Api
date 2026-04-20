const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");
const Policy = require("../models/policy.model");

exports.getPolicies = asyncHandler(async (_req, res) => {
  const policies = await Policy.findAll({
    where: { isPublished: true },
    order: [["title", "ASC"]],
  });
  return sendResponse(res, 200, policies);
});

exports.getPolicyBySlug = asyncHandler(async (req, res, next) => {
  const policy = await Policy.findOne({
    where: { slug: req.params.slug, isPublished: true },
  });
  if (!policy) return next(new ErrorResponse("Policy not found", 404));
  return sendResponse(res, 200, policy);
});

exports.createPolicy = asyncHandler(async (req, res, next) => {
  const existing = await Policy.findOne({ where: { slug: req.body.slug } });
  if (existing) return next(new ErrorResponse("Slug already exists", 409));
  const policy = await Policy.create(req.body);
  return sendResponse(res, 201, policy, "Policy created");
});

exports.updatePolicy = asyncHandler(async (req, res, next) => {
  const policy = await Policy.findByPk(req.params.id);
  if (!policy) return next(new ErrorResponse("Policy not found", 404));
  await policy.update(req.body);
  return sendResponse(res, 200, policy, "Policy updated");
});

exports.deletePolicy = asyncHandler(async (req, res, next) => {
  const policy = await Policy.findByPk(req.params.id);
  if (!policy) return next(new ErrorResponse("Policy not found", 404));
  await policy.destroy();
  return sendResponse(res, 200, null, "Policy deleted");
});
