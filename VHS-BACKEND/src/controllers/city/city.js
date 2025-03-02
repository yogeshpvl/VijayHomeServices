const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const city = sequelize.define(
  "city",
  {
    cityId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cityName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "cities",
  }
);

module.exports = city;
