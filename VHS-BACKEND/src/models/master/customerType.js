const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const CustomerType = sequelize.define(
  "CustomerType",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customertype: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
    tableName: "customertypes",
  }
);

module.exports = CustomerType;
