const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const ReferenceType = sequelize.define(
  "Reference",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    timestamps: false,
    tableName: "reference",
  }
);

module.exports = ReferenceType;
