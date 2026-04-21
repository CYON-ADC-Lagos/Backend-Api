// require("pg");
// require("dotenv").config();

// const express = require("express");
// const path = require("path");
// const cors = require("cors");
// const helmet = require("helmet");
// const swaggerUi = require("swagger-ui-express");
// const YAML = require("yamljs");

// const sequelize = require("./src/config/db.config");
// const { seed } = require("./src/config/seed");
// const logger = require("./src/utils/logger");
// const requestLogger = require("./src/middlewares/requestLogger");
// const { notFound, errorHandler } = require("./src/middlewares/error");
// const { authLimiter, writeLimiter } = require("./src/middlewares/rateLimit");
// const { UPLOAD_ROOT } = require("./src/middlewares/storage.middleware");

// // Load all models so Sequelize associations register before sync.
// require("./src/models/role.model");
// require("./src/models/deanery.model");
// require("./src/models/parish.model");
// require("./src/models/user.model");
// require("./src/models/event.model");
// require("./src/models/executive.model");
// require("./src/models/chaplain.model");
// require("./src/models/ayd.model");
// require("./src/models/delegate.model");
// require("./src/models/news.model");
// require("./src/models/gallery.model");
// require("./src/models/feedback.model");
// require("./src/models/policy.model");
// require("./src/models/payment.model");
// require("./src/models/module.model");
// require("./src/models/applicationSettings.model");

// const userRoutes = require("./src/routes/user.routes");
// const rolesRoutes = require("./src/routes/roles.routes");
// const parishRoutes = require("./src/routes/parish.routes");
// const deaneryRoutes = require("./src/routes/deanery.routes");
// const eventRoutes = require("./src/routes/event.route");
// const executiveRoutes = require("./src/routes/executive.route");
// const chaplainRoutes = require("./src/routes/chaplain.routes");
// const aydRoutes = require("./src/routes/ayd.routes");
// const delegateRoutes = require("./src/routes/delegate.routes");
// const newsRoutes = require("./src/routes/news.routes");
// const galleryRoutes = require("./src/routes/gallery.routes");
// const feedbackRoutes = require("./src/routes/feedback.routes");
// const policyRoutes = require("./src/routes/policy.routes");
// const paymentRoutes = require("./src/routes/payment.routes");

// const app = express();
// const PORT = Number(process.env.PORT) || 5000;

// app.set("trust proxy", 1);

// const allowedOrigins = (process.env.CORS_ORIGINS || "")
//   .split(",")
//   .map((o) => o.trim())
//   .filter(Boolean);

// const isDevLocalhost = (origin) =>
//   process.env.NODE_ENV !== "production" &&
//   /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

// const isOriginAllowed = (origin) => {
//   if (!origin) return true;
//   if (allowedOrigins.length === 0) return true;
//   if (allowedOrigins.includes(origin)) return true;
//   if (isDevLocalhost(origin)) return true;
//   return false;
// };

// app.use(
//   cors({
//     origin: (origin, cb) => {
//       if (isOriginAllowed(origin)) return cb(null, true);
//       // Return false instead of throwing so the request gets a clean
//       // CORS block (no Access-Control-Allow-Origin header) rather than
//       // surfacing as a 500 from our error middleware.
//       logger.warn({ origin }, "CORS: origin rejected");
//       return cb(null, false);
//     },
//     credentials: true,
//   }),
// );

// app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
// app.use(express.json({ limit: "1mb" }));
// app.use(express.urlencoded({ extended: true, limit: "1mb" }));
// app.use(requestLogger);

// app.use(express.static(path.join(__dirname, "public")));
// app.use("/uploads", express.static(UPLOAD_ROOT));

// app.get("/health", (_req, res) =>
//   res
//     .status(200)
//     .json({ success: true, status: "ok", time: new Date().toISOString() }),
// );

// try {
//   const openapiDoc = YAML.load(path.join(__dirname, "openapi.yaml"));
//   app.get("/docs.json", (_req, res) => res.json(openapiDoc));
//   app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDoc));
// } catch (err) {
//   logger.warn({ err: err.message }, "OpenAPI docs unavailable");
// }

// // Auth-heavy endpoints get tighter limits.
// app.use("/api/v1/user/login", authLimiter);
// app.use("/api/v1/user/register", authLimiter);

// app.use("/api/v1/user", userRoutes);
// app.use("/api/v1/role", rolesRoutes);
// app.use("/api/v1/deanery", deaneryRoutes);
// app.use("/api/v1/parish", parishRoutes);
// app.use("/api/v1/event", eventRoutes);
// app.use("/api/v1/executive", executiveRoutes);
// app.use("/api/v1/chaplain", chaplainRoutes);
// app.use("/api/v1/ayd", aydRoutes);
// app.use("/api/v1/delegate", delegateRoutes);
// app.use("/api/v1/news", newsRoutes);
// app.use("/api/v1/gallery", galleryRoutes);
// app.use("/api/v1/feedback", feedbackRoutes);
// app.use("/api/v1/policy", policyRoutes);
// app.use("/api/v1/payment", paymentRoutes);

// app.use(notFound);
// app.use(errorHandler);

// process.on("unhandledRejection", (reason) => {
//   logger.error({ err: reason }, "Unhandled rejection");
// });
// process.on("uncaughtException", (err) => {
//   logger.error({ err }, "Uncaught exception");
//   process.exit(1);
// });

// const syncStrategy = () => {
//   if (process.env.NODE_ENV === "production") return {};
//   if (process.env.DB_SYNC === "force") return { force: true };
//   if (process.env.DB_SYNC === "alter") return { alter: true };
//   return {};
// };

// const start = async () => {
//   try {
//     await sequelize.authenticate();
//     logger.info("Database connection OK");
//     await sequelize.sync(syncStrategy());
//     await seed();
//     app.listen(PORT, () => logger.info({ port: PORT }, "Server listening"));
//   } catch (err) {
//     logger.error({ err }, "Failed to start server");
//     process.exit(1);
//   }
// };

// if (require.main === module) start();

// module.exports = app;

require("pg");
require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const sequelize = require("./src/config/db.config");
const { seed } = require("./src/config/seed");
const logger = require("./src/utils/logger");
const requestLogger = require("./src/middlewares/requestLogger");
const { notFound, errorHandler } = require("./src/middlewares/error");
const { authLimiter } = require("./src/middlewares/rateLimit");
const { UPLOAD_ROOT } = require("./src/middlewares/storage.middleware");

require("./src/models/role.model");
require("./src/models/deanery.model");
require("./src/models/parish.model");
require("./src/models/user.model");
require("./src/models/event.model");
require("./src/models/executive.model");
require("./src/models/chaplain.model");
require("./src/models/ayd.model");
require("./src/models/delegate.model");
require("./src/models/news.model");
require("./src/models/gallery.model");
require("./src/models/feedback.model");
require("./src/models/policy.model");
require("./src/models/payment.model");
require("./src/models/module.model");
require("./src/models/applicationSettings.model");

const userRoutes = require("./src/routes/user.routes");
const rolesRoutes = require("./src/routes/roles.routes");
const parishRoutes = require("./src/routes/parish.routes");
const deaneryRoutes = require("./src/routes/deanery.routes");
const eventRoutes = require("./src/routes/event.route");
const executiveRoutes = require("./src/routes/executive.route");
const chaplainRoutes = require("./src/routes/chaplain.routes");
const aydRoutes = require("./src/routes/ayd.routes");
const delegateRoutes = require("./src/routes/delegate.routes");
const newsRoutes = require("./src/routes/news.routes");
const galleryRoutes = require("./src/routes/gallery.routes");
const feedbackRoutes = require("./src/routes/feedback.routes");
const policyRoutes = require("./src/routes/policy.routes");
const paymentRoutes = require("./src/routes/payment.routes");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const IS_VERCEL = !!process.env.VERCEL;

app.set("trust proxy", 1);

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const isDevLocalhost = (origin) =>
  process.env.NODE_ENV !== "production" &&
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.length === 0) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (isDevLocalhost(origin)) return true;
  return false;
};

app.use(
  cors({
    origin: (origin, cb) => {
      if (isOriginAllowed(origin)) return cb(null, true);
      logger.warn({ origin }, "CORS: origin rejected");
      return cb(null, false);
    },
    credentials: true,
  }),
);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(requestLogger);

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(UPLOAD_ROOT));

app.get("/health", (_req, res) =>
  res
    .status(200)
    .json({ success: true, status: "ok", time: new Date().toISOString() }),
);

try {
  const openapiDoc = YAML.load(path.join(__dirname, "openapi.yaml"));
  app.get("/docs.json", (_req, res) => res.json(openapiDoc));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDoc));
} catch (err) {
  logger.warn({ err: err.message }, "OpenAPI docs unavailable");
}

app.use("/api/v1/user/login", authLimiter);
app.use("/api/v1/user/register", authLimiter);

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/role", rolesRoutes);
app.use("/api/v1/deanery", deaneryRoutes);
app.use("/api/v1/parish", parishRoutes);
app.use("/api/v1/event", eventRoutes);
app.use("/api/v1/executive", executiveRoutes);
app.use("/api/v1/chaplain", chaplainRoutes);
app.use("/api/v1/ayd", aydRoutes);
app.use("/api/v1/delegate", delegateRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/gallery", galleryRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/policy", policyRoutes);
app.use("/api/v1/payment", paymentRoutes);

app.use(notFound);
app.use(errorHandler);

process.on("unhandledRejection", (reason) => {
  logger.error({ err: reason }, "Unhandled rejection");
});
process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaught exception");
  process.exit(1);
});

const syncStrategy = () => {
  if (process.env.NODE_ENV === "production") return {};
  if (process.env.DB_SYNC === "force") return { force: true };
  if (process.env.DB_SYNC === "alter") return { alter: true };
  return {};
};

// const start = async () => {
//   try {
//     await sequelize.authenticate();
//     logger.info("Database connection OK");
//     await sequelize.sync(syncStrategy());
//     logger.info("Database synced");
//     await seed();

//     // Don't call app.listen() on Vercel — it manages the server itself
//     if (!IS_VERCEL) {
//       app.listen(PORT, () => logger.info({ port: PORT }, "Server listening"));
//     }
//   } catch (err) {
//     logger.error({ err }, "Failed to start server");
//     process.exit(1);
//   }
// };

const start = async () => {
  try {
    // Skip authenticate/sync/seed on Vercel — too slow for serverless cold starts
    if (!IS_VERCEL) {
      await sequelize.authenticate();
      logger.info("Database connection OK");
      await sequelize.sync(syncStrategy());
      logger.info("Database synced");
      await seed();
      app.listen(PORT, () => logger.info({ port: PORT }, "Server listening"));
    }
  } catch (err) {
    logger.error({ err }, "Failed to start server");
    process.exit(1);
  }
};

// Always run start() so sync() and seed() run on Vercel too
start();

module.exports = app;
