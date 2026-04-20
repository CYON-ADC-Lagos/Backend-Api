const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const GalleryItem = sequelize.define("GalleryItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
  },
  caption: {
    type: DataTypes.STRING,
  },
  album: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = GalleryItem;
