const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const servicePaymentmodel = new Schema({
  userId: {
    type: ObjectId,
  },
  success: Boolean,
  code: String,
  message: String,
  data: {
    merchantId: String,
    merchantTransactionId: String,
    transactionId: String,
    amount: Number,
    state: String,
    responseCode: String,
    paymentInstrument: {
      type: Object,
    },
  },
  base64: String,
  sha256encode: String,

  amount: {
    type: String,
  },
  serviceId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  cardNumber: { type: String },
  expiryDate: { type: String },
  cvv: { type: String },
});
const sPaymentmodel = mongoose.model("servicePayment", servicePaymentmodel);
module.exports = sPaymentmodel;
