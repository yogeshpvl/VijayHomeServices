const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Booking = require("./bookings"); // Import Booking model

const BookingService = sequelize.define(
  "BookingService",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Booking, key: "id" },
    },
    service_name: { type: DataTypes.STRING, allowNull: false },
    service_id: { type: DataTypes.STRING, allowNull: false },
    service_charge: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    service_date: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "Pending" }, // Status: Pending, Completed, Canceled
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "booking_services", timestamps: false }
);

Booking.hasMany(BookingService, {
  foreignKey: "booking_id",
  onDelete: "CASCADE",
});
BookingService.belongsTo(Booking, { foreignKey: "booking_id" });

module.exports = BookingService;
