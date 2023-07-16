const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const User = sequelize.define("user", {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  FirstName: {
    type: DataTypes.STRING,
  },

  LastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    require: true,
  },

  Password: { type: DataTypes.STRING, allowNull: false },

  BaptismalName: {
    type: DataTypes.STRING,
  },
  PhoneNumber: {
    type: DataTypes.STRING,
  },
  IsActive: {
    type: DataTypes.BOOLEAN,
  },
  DeaneryId: {
    type: DataTypes.INTEGER,
  },
  ParishId: {
    type: DataTypes.INTEGER,
  },
  MembershipId: {
    type: DataTypes.STRING,
  },
  Position: {
    type: DataTypes.STRING,
  },
  DateOfBirth: {
    type: DataTypes.DATE,
  },
  RoleId: {
    type: DataTypes.INTEGER,
  },
  Password: {
    type: DataTypes.STRING,
  },
  Picture: {
    type: DataTypes.STRING,
  },
});

module.exports = User;
