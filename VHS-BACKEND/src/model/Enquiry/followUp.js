const mongoose = require("mongoose");

const followUpSchema = new mongoose.Schema(
  {
    EnquiryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EnquiryAdd", // Reference to Enquiry Model
      required: true,
      index: true,
    },
    date: {
      type: String,
    },
    response: {
      type: String,
      enum: ["Call Later", "Survey", "Not Interested", "Confirmed"], // Only these values allowed
      required: true,
    },
  },
  { timestamps: true }
);

const FollowUpModel = mongoose.model("FollowUp", followUpSchema);
module.exports = FollowUpModel;
