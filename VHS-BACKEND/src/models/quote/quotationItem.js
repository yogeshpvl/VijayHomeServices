const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const QuotationItem = sequelize.define(
  "QuotationItem",
  {
    item_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    enquiry_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "Enquiries", // Referring to the Enquiry model
        key: "enquiryId",
      },
      allowNull: false,
    },

    region: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    material: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    job: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "quotation_items", // Name of the table
    timestamps: false, // Add createdAt and updatedAt columns
  }
);

module.exports = QuotationItem;
