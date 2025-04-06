const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Manpower = sequelize.define(
  "Manpower",
  {
    mandate: DataTypes.TEXT,
    mandesc: DataTypes.TEXT,
    service_id: DataTypes.INTEGER,
  },
  {
    tableName: "manpower",
    timestamps: false,
  }
);

module.exports = Manpower;
