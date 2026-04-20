const ErrorResponse = require("../utils/errorResponse");
const logger = require("../utils/logger");

const notFound = (req, _res, next) => {
  next(new ErrorResponse(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    statusCode = 400;
    message = err.errors?.map((e) => e.message).join("; ") || message;
  } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid or expired token";
  } else if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 413;
    message = "Uploaded file exceeds size limit";
  }

  if (statusCode >= 500) {
    logger.error({ err, path: req.originalUrl, method: req.method }, "Unhandled error");
  } else {
    logger.warn({ err: err.message, path: req.originalUrl, method: req.method }, "Request error");
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { notFound, errorHandler };
