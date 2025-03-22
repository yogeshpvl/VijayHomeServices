const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const BankDetail = sequelize.define(
  "BankDetail",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_holder_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ifsc_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    branch_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    upi_number: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    tableName: "bankdetails",
  }
);

module.exports = BankDetail;
