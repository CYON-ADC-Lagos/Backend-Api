const pino = require("pino");

const isDev = process.env.NODE_ENV !== "production";

const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
  transport: isDev
    ? { target: "pino-pretty", options: { colorize: true, translateTime: "SYS:standard" } }
    : undefined,
  redact: {
    paths: ["req.headers.authorization", "req.headers.token", "*.password", "*.Password"],
    remove: true,
  },
});

module.exports = logger;
