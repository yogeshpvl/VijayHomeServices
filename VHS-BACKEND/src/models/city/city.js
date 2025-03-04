const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const City = sequelize.define(
  "City",
  {
    city_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    city_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "cities",
    timestamps: false,
  }
);

module.exports = City;
