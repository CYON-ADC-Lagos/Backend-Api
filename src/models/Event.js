const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Event = sequelize.define("Event", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bannerImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
  },
  venue: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Event;
