require("dotenv").config();
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

const sequelize = require("../src/config/db.config");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to Neon ✓");
    await sequelize.sync({ alter: true });
    console.log("All tables synced ✓");
    process.exit(0);
  } catch (err) {
    console.error("Sync failed:", err);
    process.exit(1);
  }
})();
