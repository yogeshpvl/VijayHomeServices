const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Booking = require("../serviceBooking/bookings");

const Payment = sequelize.define(
  "Payment",
  {
    payment_date: DataTypes.DATEONLY,
    paymen_type: DataTypes.TEXT,
    payment_mode: DataTypes.TEXT,
    amount: DataTypes.DECIMAL(10, 2),
    comment: DataTypes.TEXT,
    service_date: DataTypes.DATEONLY,
    customer_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
  },
  {
    tableName: "payments",
    timestamps: true,
  }
);
Payment.belongsTo(Booking, {
  foreignKey: "service_id",
  as: "bookingService",
});

module.exports = Payment;
