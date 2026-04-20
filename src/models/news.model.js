const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const News = sequelize.define("News", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  summary: {
    type: DataTypes.STRING,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
  source: {
    type: DataTypes.STRING,
  },
  externalUrl: {
    type: DataTypes.STRING,
  },
  publishedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = News;
