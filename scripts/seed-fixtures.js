#!/usr/bin/env node
require("dotenv").config();

const sequelize = require("../src/config/db.config");
const logger = require("../src/utils/logger");
const { seed } = require("../src/config/seed");
const { seedAll } = require("../src/config/fixtures");

// Load all models so associations register before sync.
require("../src/models/role.model");
require("../src/models/deanery.model");
require("../src/models/parish.model");
require("../src/models/user.model");
require("../src/models/event.model");
require("../src/models/executive.model");
require("../src/models/chaplain.model");
require("../src/models/ayd.model");
require("../src/models/delegate.model");
require("../src/models/news.model");
require("../src/models/gallery.model");
require("../src/models/feedback.model");
require("../src/models/policy.model");
require("../src/models/payment.model");
require("../src/models/module.model");
require("../src/models/applicationSettings.model");

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await seed();
    await seedAll();
    logger.info("Fixtures seeded");
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    logger.error({ err }, "Fixture seeding failed");
    process.exit(1);
  }
})();
