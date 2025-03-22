const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const TermsSection1 = sequelize.define(
  "TermsSection1",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    tableName: "termsandcondtionssection1",
    timestamps: false,
  }
);

module.exports = TermsSection1;
