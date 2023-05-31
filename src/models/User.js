const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const User = sequelize.define("User", {
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

  phoneNumber:{
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
    require: false
  },

  password: { type: DataTypes.STRING, allowNull: false },
});

module.exports = User;