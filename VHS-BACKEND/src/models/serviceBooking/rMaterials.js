const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const RMaterial = sequelize.define(
  "RMaterial",
  {
    work_date: DataTypes.DATEONLY,
    work_mile_stone: DataTypes.TEXT,
    work_material_use: DataTypes.TEXT,
    work_details: DataTypes.TEXT,
    work_remark: DataTypes.TEXT,
    customer_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
  },
  {
    tableName: "rmaterial",
    timestamps: false,
  }
);

module.exports = RMaterial;
