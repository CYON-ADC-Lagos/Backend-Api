const rateLimit = require("express-rate-limit");

const noop = (_req, _res, next) => next();

const make = (opts) =>
  process.env.NODE_ENV === "test"
    ? noop
    : rateLimit({ standardHeaders: true, legacyHeaders: false, ...opts });

const authLimiter = make({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many attempts; try again later." },
});

const writeLimiter = make({
  windowMs: 60 * 1000,
  max: 60,
  message: { success: false, message: "Too many requests." },
});

const publicFormLimiter = make({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many submissions from this IP." },
});

module.exports = { authLimiter, writeLimiter, publicFormLimiter };
