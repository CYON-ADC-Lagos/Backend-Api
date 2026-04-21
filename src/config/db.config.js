// require("pg");
// const Sequelize = require("sequelize");

// const dialect = process.env.DB_DIALECT || "mysql";

// let sequelize;

// if (dialect === "sqlite") {
//   // sequelize = new Sequelize({
//   //   dialect: "sqlite",
//   //   storage: process.env.DB_STORAGE || ":memory:",
//   //   logging: false,
//   // });

//   sequelize = new Sequelize({
//     dialect: "postgres",
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false, // required for Neon
//       },
//     },
//     logging: false,
//   });
// } else {
//   const name = process.env.DB_NAME || process.env.DB_Name;
//   const user = process.env.DB_USER || process.env.DB_User;
//   const password = process.env.DB_PASSWORD || process.env.DB_Password;
//   const host = process.env.DB_HOST || process.env.DB_Host;
//   const port = Number(process.env.DB_PORT) || 3306;

//   if (!name || !user || !password || !host) {
//     throw new Error(
//       "Database env vars missing. Required: DB_NAME, DB_USER, DB_PASSWORD, DB_HOST. See .env.example.",
//     );
//   }

//   sequelize = new Sequelize(name, user, password, {
//     host,
//     port,
//     dialect,
//     logging: process.env.NODE_ENV === "production" ? false : false,
//     pool: {
//       max: 10,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//   });
// }

// module.exports = sequelize;

require("pg");
const { Sequelize } = require("sequelize");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required.");
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 10000,
    idle: 1000,
  },
  logging: false,
});

module.exports = sequelize;
