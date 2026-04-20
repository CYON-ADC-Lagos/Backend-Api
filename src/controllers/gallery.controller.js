const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");
const sendResponse = require("../utils/sendResponse");
const { parsePagination, buildPaginated } = require("../utils/pagination");
const GalleryItem = require("../models/gallery.model");

exports.getGallery = asyncHandler(async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query, { limit: 60 });
  const where = {};
  if (req.query.album) where.album = req.query.album;
  const result = await GalleryItem.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });
  return sendResponse(res, 200, buildPaginated(result, { page, limit }));
});

exports.createGalleryItem = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new ErrorResponse("image file is required", 400));
  const item = await GalleryItem.create({
    ...req.body,
    image: req.file.filename,
  });
  return sendResponse(res, 201, item, "Item uploaded");
});

exports.deleteGalleryItem = asyncHandler(async (req, res, next) => {
  const item = await GalleryItem.findByPk(req.params.id);
  if (!item) return next(new ErrorResponse("Item not found", 404));
  await item.destroy();
  return sendResponse(res, 200, null, "Item deleted");
});
