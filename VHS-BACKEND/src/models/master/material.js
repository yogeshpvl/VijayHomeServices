const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Material = sequelize.define(
  "Material",
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
    benefits: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "materials",
  }
);

module.exports = Material;
