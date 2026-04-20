const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Deanery = require("./deanery.model");

const Executive = sequelize.define("Executive", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
  },
  phoneNumber: {
    type: DataTypes.STRING,
  },
  picture: {
    type: DataTypes.STRING,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  adcId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deaneryId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

Deanery.hasMany(Executive, { foreignKey: "deaneryId" });
Executive.belongsTo(Deanery, { foreignKey: "deaneryId" });

module.exports = Executive;
