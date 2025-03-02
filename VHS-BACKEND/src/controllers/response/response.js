const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const response = sequelize.define(
  "response",
  {
    responseId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    responseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    template: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "response",
  }
);

module.exports = response;
