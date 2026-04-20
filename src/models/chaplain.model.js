const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Deanery = require("./deanery.model");
const Parish = require("./parish.model");

const Chaplain = sequelize.define("Chaplain", {
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
  email: {
    type: DataTypes.STRING,
  },
  phoneNumber: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  deaneryId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  parishId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

Deanery.hasMany(Chaplain, { foreignKey: "deaneryId" });
Chaplain.belongsTo(Deanery, { foreignKey: "deaneryId" });
Parish.hasMany(Chaplain, { foreignKey: "parishId" });
Chaplain.belongsTo(Parish, { foreignKey: "parishId" });

module.exports = Chaplain;
