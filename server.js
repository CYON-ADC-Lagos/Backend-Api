require("dotenv").config();
const express = require("express");
const path = require("path");

const sequelize = require("./src/config/db.config");
const userRoutes = require("./src/routes/user.routes");
const rolesRoutes = require("./src/routes/roles.routes");
const parishRoutes = require("./src/routes/parish.routes");
const deaneryRoutes = require("./src/routes/deanery.routes");


const app = express();
const PORT = 5000;
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/role", rolesRoutes);
app.use("/api/v1/deanery", deaneryRoutes);
app.use("/api/v1/parish", parishRoutes);

sequelize
  .sync({ alter: true })
  .then((result) => {
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
