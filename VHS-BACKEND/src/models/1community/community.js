const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Community = sequelize.define(
  "Community",
  {
    appartmentname: DataTypes.TEXT,
    communityn: DataTypes.TEXT,
    percentage: DataTypes.DECIMAL(5, 2),
    projectmanager: DataTypes.TEXT,
    contactperson: DataTypes.TEXT,
    contactno: DataTypes.TEXT,
    email: DataTypes.TEXT,
    login: DataTypes.TEXT,
    password: DataTypes.TEXT,
  },
  {
    tableName: "communities",
    timestamps: true,
  }
);

module.exports = Community;
