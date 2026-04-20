const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Ayd = require("./ayd.model");
const Deanery = require("./deanery.model");
const Parish = require("./parish.model");

const Delegate = sequelize.define(
  "Delegate",
  {
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female"),
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
    },
    aydId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    deaneryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    parishId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    indexes: [
      { unique: true, fields: ["email", "aydId"] },
    ],
  }
);

Ayd.hasMany(Delegate, { foreignKey: "aydId" });
Delegate.belongsTo(Ayd, { foreignKey: "aydId" });

Deanery.hasMany(Delegate, { foreignKey: "deaneryId" });
Delegate.belongsTo(Deanery, { foreignKey: "deaneryId" });

Parish.hasMany(Delegate, { foreignKey: "parishId" });
Delegate.belongsTo(Parish, { foreignKey: "parishId" });

module.exports = Delegate;
