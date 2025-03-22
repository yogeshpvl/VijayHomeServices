const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Region = sequelize.define(
  "Region",
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
    region: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "regions",
  }
);

module.exports = Region;
