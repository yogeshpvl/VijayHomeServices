const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const User = require("../../models/customer/customer");

const Booking = sequelize.define(
  "Booking",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    enquiry_id: { type: DataTypes.INTEGER, defaultValue: 0 },
    user_id: { type: DataTypes.INTEGER },
    selected_slot_text: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    contract_type: { type: DataTypes.STRING(50) },
    service: { type: DataTypes.STRING },
    service_id: { type: DataTypes.STRING },
    plan_name: { type: DataTypes.STRING },
    service_charge: { type: DataTypes.STRING(50) },
    date_of_service: { type: DataTypes.ARRAY(DataTypes.TEXT) },
    delivery_address: { type: DataTypes.JSONB },
    description: { type: DataTypes.TEXT },
    marker_coordinate: { type: DataTypes.JSONB },
    service_frequency: { type: DataTypes.STRING(50) },
    start_date: { type: DataTypes.DATE },
    expiry_date: { type: DataTypes.DATE },
    close_project: { type: DataTypes.STRING(50) },
    close_date: { type: DataTypes.DATE },
    backoffice_executive: { type: DataTypes.STRING },
    one_community: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING(50) },
    payment_mode: { type: DataTypes.STRING(50) },
    grand_total: { type: DataTypes.STRING(50) },
    add_ons: { type: DataTypes.JSONB },
    discount_amount: { type: DataTypes.STRING(50) },
    coupon_code: { type: DataTypes.STRING(50) },
    total_saved: { type: DataTypes.STRING(50) },
    total_amount: { type: DataTypes.STRING(50) },
    city: { type: DataTypes.STRING },
    cancel_officer_name: { type: DataTypes.STRING },
    cancel_offer_number: { type: DataTypes.STRING(50) },
    cancel_reason: { type: DataTypes.TEXT },
    cancel_date: { type: DataTypes.DATE },
    complaint: { type: DataTypes.TEXT },
    latitude: {
      type: DataTypes.DECIMAL(9, 6),
      defaultValue: 0,
      validate: { isDecimal: true },
    },

    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      defaultValue: 0,
      validate: { isDecimal: true },
    },
    reference: { type: DataTypes.STRING },
    community_id: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "bookings", timestamps: false }
);

// In Booking model
Booking.belongsTo(User, { foreignKey: "user_id", as: "customer" });

module.exports = Booking;
