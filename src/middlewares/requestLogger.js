const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const ms = Number((process.hrtime.bigint() - start) / 1000000n);
    const line = {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      ms,
    };
    if (res.statusCode >= 500) logger.error(line);
    else if (res.statusCode >= 400) logger.warn(line);
    else logger.info(line);
  });
  next();
};

module.exports = requestLogger;
