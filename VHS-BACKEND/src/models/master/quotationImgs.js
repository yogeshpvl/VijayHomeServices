const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const QuotationHeaderFooterIm = sequelize.define(
  "QuotationHeaderFooterIm",
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
    type: {
      type: DataTypes.ENUM("header", "footer"),
      allowNull: false,
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "quotationheaderfooterims",
  }
);

module.exports = QuotationHeaderFooterIm;
