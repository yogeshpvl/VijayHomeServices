// model/termsandcondtionssection2.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const TermsAndConditionsSection2 = sequelize.define(
  "termsandcondtionssection2",
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
    header: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "termsandcondtionssection2",
    timestamps: false,
  }
);

module.exports = TermsAndConditionsSection2;
