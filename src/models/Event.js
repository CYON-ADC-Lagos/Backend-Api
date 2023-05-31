const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Event = sequelize.define("Event", {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  Name: {
    type: DataTypes.STRING,
  },

  Description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  BannerImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  IsActive: {
    type: DataTypes.BOOLEAN
  },
  Venue: {
    type: DataTypes.STRING,
    allowNull: true
  },
});

module.exports = Event;
