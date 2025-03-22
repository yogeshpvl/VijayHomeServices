const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const B2BType = sequelize.define(
  "B2BType",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    b2btype: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
    tableName: "b2btypes",
  }
);

module.exports = B2BType;
