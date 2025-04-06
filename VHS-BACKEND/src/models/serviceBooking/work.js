const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const WorkMaterial = sequelize.define(
  "WorkMaterial",
  {
    materialdate: DataTypes.DATEONLY,
    materialdesc: DataTypes.TEXT,
    service_id: DataTypes.INTEGER,
  },
  {
    tableName: "work_materials",
    timestamps: false,
  }
);

module.exports = WorkMaterial;
