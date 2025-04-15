const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const BookingService = require("./bookingServices");

const TechReschedule = sequelize.define(
  "TechReschedule",
  {
    reschedule_date: DataTypes.DATE,
    reason: DataTypes.TEXT,
    vendor_name: DataTypes.TEXT,
    service_id: DataTypes.TEXT,
    vendor_id: DataTypes.INTEGER,
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
    tableName: "techreschedule",
    timestamps: false,
  }
);

module.exports = TechReschedule;
