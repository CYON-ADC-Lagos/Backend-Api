require("dotenv").config();

const ssl = {
  require: true,
  rejectUnauthorized: false,
};

module.exports = {
  development: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: { ssl },
  },
  test: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: { ssl },
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: { ssl },
  },
};
