const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");
const Parish = require("./parish.model");
const Ayd = require("./ayd.model");

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(8),
    allowNull: false,
    defaultValue: "NGN",
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  method: {
    type: DataTypes.ENUM("cash", "transfer", "card", "pos", "other"),
    defaultValue: "transfer",
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "reversed"),
    defaultValue: "confirmed",
  },
  paidAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  note: {
    type: DataTypes.STRING,
  },
  parishId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  aydId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  recordedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

Parish.hasMany(Payment, { foreignKey: "parishId" });
Payment.belongsTo(Parish, { foreignKey: "parishId" });

Ayd.hasMany(Payment, { foreignKey: "aydId" });
Payment.belongsTo(Ayd, { foreignKey: "aydId" });

module.exports = Payment;
