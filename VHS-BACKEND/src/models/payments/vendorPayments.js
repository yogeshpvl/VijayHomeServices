const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Vendor = require("../master/vendors");

const vendorPayment = sequelize.define(
  "Payment",
  {
    payment_date: DataTypes.DATEONLY,
    payment_type: DataTypes.TEXT,
    payment_mode: DataTypes.TEXT,
    amount: DataTypes.DECIMAL(10, 2),
    comment: DataTypes.TEXT,
    vendor_id: DataTypes.INTEGER,
  },
  {
    tableName: "vendor_payments",
    timestamps: false,
  }
);

vendorPayment.belongsTo(Vendor, {
  foreignKey: "vendor_id",
  as: "vendors",
});

module.exports = vendorPayment;
