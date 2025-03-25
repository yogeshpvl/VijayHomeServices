const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Booking = require("./bookings");
const Vendor = require("../master/vendors");

const VendorAssignment = sequelize.define(
  "VendorAssignment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Booking, key: "id" },
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Vendor, key: "id" },
    },
    status: { type: DataTypes.STRING, defaultValue: "Assigned" },
    assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { timestamps: false }
);

Booking.hasMany(VendorAssignment, {
  foreignKey: "booking_id",
  as: "assignments",
});
Vendor.hasMany(VendorAssignment, {
  foreignKey: "vendor_id",
  as: "assignments",
});

module.exports = VendorAssignment;
