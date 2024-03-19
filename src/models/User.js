const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const User = sequelize.define("user", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  firstName: {
    type: DataTypes.STRING,
  },

  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    require: true,
  },

  password: { type: DataTypes.STRING, allowNull: false },

  baptismalName: {
    type: DataTypes.STRING,
  },
  phoneNumber: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
  },
  deanery: {
    type: DataTypes.STRING,
  },
  parish: {
    type: DataTypes.STRING,
  },
  membershipId: {
    type: DataTypes.STRING,
  },
  position: {
    type: DataTypes.STRING,
  },
  dateOfBirth: {
    type: DataTypes.DATE,
  },
  roleId: {
    type: DataTypes.INTEGER,
  },
  password: {
    type: DataTypes.STRING,
  },
  picture: {
    type: DataTypes.STRING,
  },
});

module.exports = User;
