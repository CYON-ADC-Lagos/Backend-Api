const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");


const Module = sequelize.define("Module", {
  id: {
<<<<<<< HEAD:src/models/module.model.js
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
=======
    type: DataTypes.INTEGER,
    autoIncrement: true,
>>>>>>> a870fe1 (updated file):src/models/Module.js
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
  },

  isActive: {
    type: DataTypes.BOOLEAN,
  },
});

module.exports = Module;
