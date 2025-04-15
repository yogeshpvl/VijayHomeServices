const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const BookingService = require("./bookingServices");

const Techcancel = sequelize.define(
  "Techcancel",
  {
    reason: DataTypes.TEXT,
    vendor_name: DataTypes.TEXT,
    service_id: DataTypes.TEXT,
    vendor_id: DataTypes.INTEGER,
    cancel: DataTypes.BOOLEAN,
    booking_service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: BookingService,
        key: "id",
      },
    },
  },
  {
    tableName: "techcancel",
    timestamps: false,
  }
);

module.exports = Techcancel;
