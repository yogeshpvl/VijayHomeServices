const mongoose = require("mongoose");

const adminAuthSchema = new mongoose.Schema(
  {
    displayname: {
      type: String,
      unique: true,
    },
    contactno: {
      type: String,
      unique: true,
    },
    loginnameOrEmail: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },

    newPasswordChane: {
      type: Boolean,
    },

    home: {
      type: Boolean,
    },
    master: {
      type: Boolean,
    },
    enquiry: {
      type: Boolean,
    },
    enquiryAdd: {
      type: Boolean,
    },
    enquiryFollowup: {
      type: Boolean,
    },
    survey: {
      type: Boolean,
    },
    quote: {
      type: Boolean,
    },
    customer: {
      type: Boolean,
    },
    quoteFollowup: {
      type: Boolean,
    },
    MissDSRDATA: {
      type: Boolean,
    },
    dsr: {
      type: Boolean,
    },
    runningProjects: {
      type: Boolean,
    },
    closeProjects: {
      type: Boolean,
    },
    b2b: {
      type: Boolean,
    },
    TryToBook: {
      type: Boolean,
    },
    community: {
      type: Boolean,
    },
    reports: {
      type: Boolean,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    paymentReport: {
      type: Boolean,
    },

    category: {
      type: Array,
    },
    city: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const adminAuthmodel = mongoose.model("masterAdmin", adminAuthSchema);
module.exports = adminAuthmodel;
