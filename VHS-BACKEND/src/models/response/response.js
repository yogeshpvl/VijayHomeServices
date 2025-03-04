const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Response = sequelize.define(
  "Response",
  {
    response_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    response_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    template: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false, // ✅ Disables createdAt and updatedAt
    tableName: "responses", // ✅ Ensures correct table name
  }
);

module.exports = Response;
