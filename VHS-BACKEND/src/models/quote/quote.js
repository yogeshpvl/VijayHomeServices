const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Quotation = sequelize.define(
  "Quotation",
  {
    quotation_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    enquiryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "enquiry_id", // ✅ tells Sequelize the actual column name in DB
    },

    project_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    gst: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    adjustment: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    grand_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quotation_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    quotation_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    booked_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sales_executive: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    executive_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exe_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adv_payment_date: {
      type: DataTypes.STRING,
    },
    adv_amount: {
      type: DataTypes.STRING,
    },
    adv_comment: {
      type: DataTypes.STRING,
    },
    adv_payment_mode: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "quotations",
    timestamps: true,
  }
);

module.exports = Quotation;
