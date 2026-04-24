require("dotenv").config();

const sequelize = require("../src/config/db.config");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database ✓");

    await sequelize.query(
      'ALTER TABLE "Parishes" ALTER COLUMN "email" DROP NOT NULL;'
    );

    console.log('Parish email column is now nullable ✓');
    process.exit(0);
  } catch (err) {
    console.error("Failed to make parish email optional:", err);
    process.exit(1);
  }
})();
