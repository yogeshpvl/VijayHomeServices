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
    amt_date: { type: DataTypes.DATE, allowNull: false },

    customer_feedback: {
      type: DataTypes.TEXT,
    },
    start_date_time: {
      type: DataTypes.TEXT,
    },
    end_date_time: {
      type: DataTypes.TEXT,
    },
    before_service_img: {
      type: DataTypes.TEXT,
    },
    after_service_img: {
      type: DataTypes.TEXT,
    },
    worker_names: {
      type: DataTypes.TEXT,
    },
    day_to_complete: {
      type: DataTypes.TEXT,
    },
    job_complete: {
      type: DataTypes.STRING,
    },
    tech_comment: {
      type: DataTypes.TEXT,
    },
    worker_amount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    vendor_id: {
      type: DataTypes.STRING,
    },
    vendor_name: {
      type: DataTypes.STRING,
    },
    cancel_reason: {
      type: DataTypes.STRING,
    },
    status: { type: DataTypes.STRING, defaultValue: "NOT ASSIGNED" },
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
