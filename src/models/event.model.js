const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Deanery = require("./deanery.model");


const Event = sequelize.define("Event", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bannerImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  venue: {
    type: DataTypes.STRING,
    allowNull: true
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

Deanery.hasMany(Event, { foreignKey: 'deaneryId' });
Event.belongsTo(Deanery, { foreignKey: 'deaneryId' });

module.exports = Event;
