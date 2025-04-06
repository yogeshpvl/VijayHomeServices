const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.Enquiry = require("./enquiry/enquiry");
db.Quotation = require("./quote/quote");
db.QuoteFollowup = require("./quote/quoteFollowup");
db.QuotationItem = require("./quote/quotationItem");
db.Booking = require("./serviceBooking/bookings");
db.BookingService = require("./serviceBooking/bookingServices");
db.User = require("./customer/customer");
db.Payment = require("./payments/payments");

// Setup associations

// Enquiry ↔ Quotation
db.Enquiry.hasMany(db.Quotation, { foreignKey: "enquiryId", as: "quotations" });
db.Quotation.belongsTo(db.Enquiry, { foreignKey: "enquiryId", as: "enquiry" });

// Enquiry ↔ QuoteFollowup
db.QuoteFollowup.belongsTo(db.Enquiry, {
  foreignKey: "enquiryId",
  as: "enquiry",
});

// Quotation ↔ QuoteFollowup
db.Quotation.hasMany(db.QuoteFollowup, {
  foreignKey: "enquiry_id",
  sourceKey: "enquiryId",
  as: "QuoteFollowups",
});
db.QuoteFollowup.belongsTo(db.Quotation, {
  foreignKey: "enquiry_id",
  targetKey: "enquiryId",
  as: "quotation",
});

// Quotation ↔ QuotationItem
db.Quotation.hasMany(db.QuotationItem, {
  as: "quotationItems",
  foreignKey: "enquiry_id",
  sourceKey: "enquiryId",
});
db.QuotationItem.belongsTo(db.Quotation, {
  as: "quotation",
  foreignKey: "enquiry_id",
  targetKey: "enquiryId",
});

// Booking ↔ Quotation
// ✅ Make sure this is used with alias "quotation"
db.Booking.hasOne(db.Quotation, {
  foreignKey: "enquiry_id",
  sourceKey: "enquiryId",
  as: "quotation",
});
db.Quotation.belongsTo(db.Booking, {
  foreignKey: "enquiry_id",
  targetKey: "enquiryId",
  as: "booking",
});

// ✅ BookingService ↔ Payment
db.Booking.hasMany(db.Payment, {
  foreignKey: "service_id",
  as: "payments",
});
db.Payment.belongsTo(db.Booking, {
  foreignKey: "id",
  as: "Booking",
});

module.exports = db;
