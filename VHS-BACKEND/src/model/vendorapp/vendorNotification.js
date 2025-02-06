const mongoose = require("mongoose");

const vendorNotificationSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      // required: true
    },
    date: {
      type: String,
      // required: true
    },
    desc: {
      type: String,
    },
    amount: {
      type: String,
    },
    expire_at: {
      type: Date,
      default: function () {
        // Set expiry date to 3 days from now
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 3);
        return expireDate;
      },
      expires: "3d", // Automatically expire documents 3 days after the `expire_at` field value
    },
  },
  {
    timestamps: true,
  }
);

const vendorNotificationmodel = mongoose.model(
  "vendorNotification",
  vendorNotificationSchema
);

module.exports = vendorNotificationmodel;
