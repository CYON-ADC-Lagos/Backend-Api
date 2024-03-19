const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Deanery = sequelize.define("Deanery", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
  },
  meetingDay: {
    type: DataTypes.STRING,
  },
  time: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Deanery;
