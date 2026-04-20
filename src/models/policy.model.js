const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const Policy = sequelize.define("Policy", {
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
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Policy;
