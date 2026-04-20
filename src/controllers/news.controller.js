const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");
const { parsePagination, buildPaginated } = require("../utils/pagination");
const News = require("../models/news.model");

exports.getNewsList = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const result = await News.findAndCountAll({
    limit,
    offset,
    order: [["publishedAt", "DESC"]],
  });
  return sendResponse(res, 200, buildPaginated(result, { page, limit }));
});

exports.getNews = asyncHandler(async (req, res, next) => {
  const news = await News.findByPk(req.params.id);
  if (!news) return next(new ErrorResponse("News not found", 404));
  return sendResponse(res, 200, news);
});

exports.createNews = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) data.image = req.file.filename;
  const news = await News.create(data);
  return sendResponse(res, 201, news, "News created");
});

exports.updateNews = asyncHandler(async (req, res, next) => {
  const news = await News.findByPk(req.params.id);
  if (!news) return next(new ErrorResponse("News not found", 404));
  const updates = { ...req.body };
  if (req.file) updates.image = req.file.filename;
  await news.update(updates);
  return sendResponse(res, 200, news, "News updated");
});

exports.deleteNews = asyncHandler(async (req, res, next) => {
  const news = await News.findByPk(req.params.id);
  if (!news) return next(new ErrorResponse("News not found", 404));
  await news.destroy();
  return sendResponse(res, 200, null, "News deleted");
});
