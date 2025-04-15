const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const CustomerWalletHistory = sequelize.define(
  "CustomerWalletHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    wamt: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "customer_wallet_histories",
    timestamps: false,
  }
);

module.exports = CustomerWalletHistory;
