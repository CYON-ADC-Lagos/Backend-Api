const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Deanery = require("./deanery.model");

const Chaplain = sequelize.define("Chaplain", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
  },

  deaneryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Deanery.hasMany(Chaplain, { foreignKey: "deaneryId" });
Chaplain.belongsTo(Deanery, { foreignKey: "deaneryId" });

module.exports = Chaplain;
