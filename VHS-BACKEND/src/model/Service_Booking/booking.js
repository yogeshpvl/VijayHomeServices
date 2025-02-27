const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    customerData: {
      type: Array,
    },
    EnquiryId: {
      type: Number,
      default: 0,
    },
    km: {
      type: Number,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    selectedSlotText: {
      type: String,
    },
    cardNo: {
      type: Number,
    },
    category: {
      type: String,
    },
    contractType: {
      type: String,
    },
    service: {
      type: String,
    },
    serviceID: {
      type: String,
    },
    status: {
      type: String,
    },
    planName: {
      type: String,
    },
    serviceCharge: {
      type: String,
    },
    dateofService: {
      type: Array,
      default: "00-00-0000",
    },
    deliveryAddress: {
      type: Object,
    },
    desc: {
      type: String,
    },
    markerCoordinate: {
      type: Object,
    },
    serviceFrequency: {
      type: String,
    },
    startDate: {
      type: String,
      default: "00-00-0000",
    },
    expiryDate: {
      type: String,
      default: "00-00-0000",
    },
    firstserviceDate: {
      type: String,
      default: "00-00-0000",
    },
    dividedDates: [
      {
        date: { type: String, required: true }, // Ensure the date is provided
        TechorPMorVendorID: { type: String, required: false }, // Optional field for vendor assignment
        jobComplete: { type: String, default: "NO" }, // Status of the job
        inSignDateTime: { type: String },
        outSignDateTime: { type: String },
        totalCharges: { type: String },
        TechorPMorVendorName: { type: String },
        WorkerName: { type: String },
        WorkerAmount: { type: String },
        priorityLevel: { type: String },
        customerFeedback: { type: String },
        backofficerExe: { type: String },
        sendSms: { type: String },
        startJobTime: { type: String },
        endJobTime: { type: String },
        endJobReason: { type: String },
        jobAmount: {
          type: String,
        },
        paymentType: {
          type: String,
        },
        chemicals: {
          type: String,
        },
        remarkOrComments: {
          type: String,
        },
        BackofficeExecutive: {
          type: String,
        },
        cancelOfficerName: {
          type: String,
        },
        cancelOfferNumber: {
          type: String,
        },
        reason: {
          type: String,
        },
        cancelDate: {
          type: String,
        },
        Tcancelreason: {
          type: String,
        },
        Tcanceldate: {
          type: String,
        },
        jobStatus: {
          type: String,
        },
        Tcancelname: {
          type: String,
        },
        rescheduledate: {
          type: String,
        },
        reschedulereason: {
          type: String,
        },
        Tname: {
          type: String,
        },
        rescheduletime: {
          type: String,
        },
        vendorAmt: {
          type: Number,
        },
        vendorChargeAmount: {
          type: String,
        },
        vVendor: {
          type: String,
        },
        sImg: {
          type: String,
        },
        bImg: {
          type: String,
        },
      },
    ],
    dividedamtDates: {
      type: Array,
    },
    dividedamtCharges: {
      type: Array,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    closeProject: {
      type: String,
    },
    closeDate: {
      type: String,
    },
    BackofficeExecutive: {
      type: String,
    },
    oneCommunity: {
      type: String,
    },

    status: {
      type: String,
    },
    appoDate: {
      type: String,
    },
    appotime: {
      type: String,
    },
    ResheduleUser: {
      type: String,
    },
    ResheduleUsernumber: {
      type: String,
    },
    reason: {
      type: String,
    },
    resDate: {
      type: String,
    },
    type: {
      type: String,
    },
    paymentMode: {
      type: String,
    },
    GrandTotal: {
      type: String,
    },
    AddOns: {
      type: Array,
    },
    discAmt: {
      type: String,
    },
    couponCode: {
      type: String,
    },
    totalSaved: {
      type: String,
    },
    TotalAmt: {
      type: String,
    },
    city: {
      type: String,
    },
    slots: {
      type: String, //03-10
    },

    cancelOfficerName: {
      type: String,
    },
    cancelOfferNumber: {
      type: String,
    },
    creason: {
      type: String,
    },

    cancelDate: {
      type: String,
    },

    complaint: {
      type: String,
    },
    ctechName: {
      type: String,
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
    reference: {
      type: String,
    },
    communityId: { type: mongoose.Schema.Types.ObjectId, ref: "community" },
  },
  {
    timestamps: true,
  }
);
servicedetailsmodel.collection.createIndex({
  contractType: 1,
  serviceFrequency: 1,
  category: 1,
  closeProject: 1,
});

const servicedetailsmodel = mongoose.model("servicedetails", serviceSchema);
module.exports = servicedetailsmodel;
