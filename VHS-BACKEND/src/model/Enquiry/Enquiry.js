const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const enquiryaddSchema = new mongoose.Schema(
  {
    EnquiryId: {
      type: Number,
      default: 0,
      index: true, // Index for fast lookup
    },
    date: {
      type: String,
    },
    Time: {
      type: String,
    },
    executive: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
      index: true,
    },
    contact2: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    reference1: {
      type: String,
    },
    reference2: {
      type: String,
    },
    reference3: {
      type: String,
    },
    comment: {
      type: String,
    },
    interestedFor: {
      type: String,
    },

    desc: {
      type: String,
    },

    serviceID: {
      type: String,
    },
    followUps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FollowUp",
      },
    ],
  },
  {
    timestamps: true,
  }
);
// ✅ Apply Auto-Increment to EnquiryId
enquiryaddSchema.plugin(AutoIncrement, { inc_field: "EnquiryId" });
// Adding compound index for fast lookup of enquiries
enquiryaddSchema.index({ EnquiryId: 1, mobile: 1 });

const EnquiryAddModel = mongoose.model("EnquiryAdd", enquiryaddSchema);
module.exports = EnquiryAddModel;
