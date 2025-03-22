const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Job = sequelize.define(
  "Job",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    material: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qty_desc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "jobs",
  }
);

module.exports = Job;
