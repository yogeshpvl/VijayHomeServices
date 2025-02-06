const Paymentgetwaymodel = require("../../model/paymentgatway/ccAvenue");
const { v4: uuidv4 } = require("uuid");

const sPaymentmodel = require("../../model/paymentgatway/servicePayment");
const technicianmodel = require("../../model/master/technician");
const servicedetailsmodel = require("../../model/servicedetails");
const customerModel = require("../../model/customer");
const PaymentModal = require("../../model/payment");
const moment = require("moment");
const ccavUtil = require("../../config/ccavutil");

const addServiceDetails1 = async (data, transactionId) => {
  let {
    customerData,
    dCategory,
    cardNo,
    contractType,
    service,
    planName,
    slots, // this 03-10
    serviceId,
    serviceCharge,
    dateofService,
    desc,
    firstserviceDate,
    serviceFrequency,
    startDate,
    category,
    expiryDate,
    date,
    time,
    dividedDates,
    dividedCharges,
    dividedamtDates,
    dividedamtCharges,
    oneCommunity,
    communityId,
    BackofficeExecutive,
    // deliveryAddress,
    type,
    userId,
    selectedSlotText,
    AddOns,
    TotalAmt,
    GrandTotal,
    totalSaved,
    discAmt,
    couponCode,
    city,
    paymentMode,
    status,
    customerName,
    email,
    EnquiryId,
    complaint,
    ctechName,
    markerCoordinate,
  } = data;

  const deliveryAddress = {
    address: data["deliveryAddress.address"],
    landmark: data["deliveryAddress.landmark"],
    platNo: data["deliveryAddress.platNo"],
    userId: data["deliveryAddress.userId"],
  };

  // console.log("deliveryAddress-------", deliveryAddress);
  try {
    let dividedDateObjects = [];
    let dividedamtDateObjects = [];
    let dividedamtChargeObjects = [];

    if (contractType === "AMC") {
      if (dividedDates) {
        dividedDateObjects = dividedDates.map((date) => {
          const uniqueId = uuidv4(); // Generate a UUID for the date
          return { id: uniqueId, date: date };
        });
      }

      if (dividedamtDates) {
        dividedamtDateObjects = dividedamtDates.map((date) => {
          const uniqueId = uuidv4(); // Generate a UUID for the date
          return { id: uniqueId, date: date };
        });
      }

      if (dividedamtCharges) {
        dividedamtChargeObjects = dividedamtCharges.map((charge) => {
          const uniqueId = uuidv4(); // Generate a UUID for the charge
          return { id: uniqueId, charge };
        });
      }
    } else {
      if (dividedDates) {
        dividedDateObjects = dividedDates.map((date) => {
          const uniqueId = uuidv4(); // Generate a UUID for the date
          return { id: uniqueId, date: date };
        });
      }
      if (dividedamtDates) {
        dividedamtDateObjects = dividedamtDates.map((date) => {
          const uniqueId = uuidv4(); // Generate a UUID for the date
          return { id: uniqueId, date: date };
        });
      }
      if (dividedamtCharges) {
        dividedamtChargeObjects = dividedamtCharges.map((charge) => {
          const uniqueId = uuidv4(); // Generate a UUID for the charge
          return { id: uniqueId, charge };
        });
      }
    }
    const userUpdate = {};

    if (customerName) {
      userUpdate.customerName = customerName;
    }

    if (city) {
      userUpdate.city = city;
    }

    if (category) {
      userUpdate.category = category;
    }

    if (email) {
      userUpdate.email = email;
    }

    let discAmtNumber = 0;

    let percentage = 0;

    if (GrandTotal >= 1500) {
      percentage = GrandTotal * 0.02;
    }
    if (discAmt) {
      discAmtNumber = parseFloat(discAmt) - percentage;
    }

    const user = await customerModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: userUpdate,
        $inc: { wAmount: discAmt ? -discAmtNumber : percentage },
      },
      { new: true }
    );

    let add = new servicedetailsmodel({
      customerData: {
        _id: user?._id,
        EnquiryId: user?.EnquiryId,
        customerName: user?.customerName,
        category: user?.category,
        mainContact: user?.mainContact,
        email: user?.email,
        approach: user?.approach,
      },
      cardNo: cardNo,
      dCategory,
      planName: planName,
      category: category,
      contractType: contractType,
      service: service,
      serviceId: serviceId,
      slots: slots,
      serviceCharge: serviceCharge,
      dateofService: dateofService,
      desc: desc,
      serviceFrequency: serviceFrequency,
      startDate: startDate,
      expiryDate: expiryDate,
      firstserviceDate: firstserviceDate,
      date: date,
      time: time,
      dividedDates: dividedDateObjects, // Store the array of objects with IDs and dates
      dividedCharges,
      dividedamtDates: dividedamtDateObjects,
      dividedamtCharges: dividedamtChargeObjects,
      oneCommunity,
      communityId,
      BackofficeExecutive,
      deliveryAddress,
      type,
      userId,
      selectedSlotText,

      AddOns,
      GrandTotal,
      totalSaved,
      discAmt,
      couponCode,
      city,
      paymentMode: "Try to booking",
      TotalAmt,
      status,
      EnquiryId,
      complaint,
      ctechName,
      markerCoordinate,
      transactionId: transactionId,
    });

    let save = await add.save();

    if (save) {
      console.log("successfully", save);

      return res.json({
        success: "Added successfully",
        data: save,
        user: user,
      });
    }
  } catch (error) {
    console.log("error", error.message);
    // return res.status(500).json({ error: "An error occurred" });
  }
};

const workingKey = "26BEB2F2DF6FEB5A6BF29F7259679061"; // Replace with your Working Key
const accessCode = "AVHX01LG55AF47XHFA"; // Replace with your Access Code
const merchant_id = "3663823";

class CCAVuenuPaymentgetway {
  async CCAvenueUserApppayment(req, res) {
    const { updateddata } = req.body;

    const orderId = "T" + Date.now();
    const currency = "INR";
    const transactionId = "T" + Date.now();

    const redirectUrl = `https://api.vijayhomeservicebengaluru.in/api/CCAvenue/CCAvenueUserAppstatus/${transactionId}/${updateddata.userId}/${updateddata.serviceID}`;
    const cancelUrl = "myapp://failure";
    const language = "EN";

    const payment_string = `merchant_id=${merchant_id}&order_id=${orderId}&currency=${currency}&amount=${updateddata.GrandTotal}&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}&language=${language}`;

    if (!payment_string) {
      return res.status(400).json({ error: "Payment string is required" });
    }

    try {
      // Encrypt the request
      const encRequest = encodeURIComponent(
        ccavUtil.encrypt(payment_string, workingKey)
      );

      await addServiceDetails1(updateddata, transactionId);

      const baseUrl =
        "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction";
      res.status(200).json({
        url: `${baseUrl}&encRequest=${encRequest}&access_code=${accessCode}`,
      });
    } catch (error) {
      console.error("Error initiating transaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async CCAvenueUserAppStatus(req, res) {
    const { encResp } = req.body;
    const { transactionId, userId, serviceID } = req.params;
    console.log("transactionId:", transactionId);

    if (!encResp) {
      console.error("encResp is undefined");
      return res.status(400).json({ error: "encResp is required" });
    }

    try {
      const decryptedResponse = ccavUtil.decrypt(encResp, workingKey);
      const responseObject = decryptedResponse
        .split("&")
        .reduce((acc, keyValueString) => {
          const [key, value] = keyValueString.split("=");
          acc[key] = decodeURIComponent(value);
          return acc;
        }, {});

      console.log("Decrypted Response:", responseObject);

      if (responseObject.order_status === "Success") {
        const updateResult = await servicedetailsmodel.findOneAndUpdate(
          { transactionId: transactionId },
          { paymentMode: "online" },
          { new: true }
        );

        if (!updateResult) {
          console.error(
            "Service details not found for transactionId:",
            transactionId
          );
          return res.redirect("myapp://failure");
        }

        const responseData = new sPaymentmodel({
          userId: userId,
          code: "success",
          serviceID: serviceID,
          data: {
            merchantId: responseObject?.merchant_id,
            merchantTransactionId: responseObject?.order_id,
            transactionId: responseObject?.tracking_id,
            amount: responseObject?.amount,
            state: responseObject?.order_status,
            responseCode: responseObject?.status_code,
            paymentInstrument: JSON.stringify(responseObject),
          },
          message: responseObject?.status_message,
          success: responseObject?.order_status === "Success",
        });

        const savedPayment = new PaymentModal({
          paymentDate: moment().format("DD-MM-YYYY"),
          paymentType: "Customer",
          paymentMode: "online",
          amount: responseObject?.amount,
          Comment: "user app",
          customer: userId,
          serviceId: serviceID,
        });

        await savedPayment.save();
        console.log("Saved Payment:", savedPayment);

        await responseData.save();
        console.log("Payment data saved successfully.");
        return res.redirect("myapp://paymentSuccess");
      } else {
        console.log("Payment failed with status:", responseObject.order_status);
        return res.redirect("myapp://failure");
      }
    } catch (error) {
      console.error("Error handling payment status:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async CCAvenueUserApppaymentAfterService(req, res) {
    const { transactionId, userId, serviceId, amount } = req.body;

    const orderId = "T" + Date.now();
    const currency = "INR";

    const redirectUrl = `https://api.vijayhomeservicebengaluru.in/api/CCAvenue/CCAvenueUserAppstatusAfterBook/${transactionId}/${userId}/${serviceId}/${amount}`;
    const cancelUrl = "myapp://failure";
    const language = "EN";

    const payment_string = `merchant_id=${merchant_id}&order_id=${orderId}&currency=${currency}&amount=${amount}&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}&language=${language}`;

    if (!payment_string) {
      return res.status(400).json({ error: "Payment string is required" });
    }

    try {
      // Encrypt the request
      const encRequest = encodeURIComponent(
        ccavUtil.encrypt(payment_string, workingKey)
      );

      const baseUrl =
        "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction";
      res.status(200).json({
        url: `${baseUrl}&encRequest=${encRequest}&access_code=${accessCode}`,
      });
    } catch (error) {
      console.error("Error initiating transaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async CCAvenueUserAppStatusAfterService(req, res) {
    const { encResp } = req.body;
    const transactionId = req.params.transactionId;
    const userId = req.params.userId;
    const serviceID = req.params.serviceID;
    const GrandTotal = req.params.amount;

    console.log("serviceID", serviceID);

    if (!encResp) {
      console.error("encResp is undefined");
      return res.status(400).json({ error: "encResp is required" });
    }

    try {
      const decryptedResponse = ccavUtil.decrypt(encResp, workingKey);
      const responseObject = decryptedResponse
        .split("&")
        .reduce((acc, keyValueString) => {
          const [key, value] = keyValueString.split("=");
          acc[key] = decodeURIComponent(value);
          return acc;
        }, {});

      if (responseObject.order_status === "Success") {
        await servicedetailsmodel.findOneAndUpdate(
          { _id: serviceID },
          { paymentMode: "online" }
        );

        const responseData = new sPaymentmodel({
          userId: userId,
          code: "success", // Fixed to use responseObject
          serviceID: serviceID,
          data: {
            merchantId: responseObject?.merchant_id, // Fixed keys for nested data
            merchantTransactionId: responseObject?.order_id,
            transactionId: responseObject?.tracking_id,
            amount: responseObject?.amount,
            state: responseObject?.order_status,
            responseCode: responseObject?.status_code,
            paymentInstrument: JSON.stringify(responseObject), // Stringify the full responseObject for now
          },
          message: responseObject?.status_message,
          success: responseObject?.order_status === "Success",
        });
        let add = new PaymentModal({
          paymentDate: moment().format("DD-MM-YYYY"),
          paymentType: "Customer",
          paymentMode: "online",
          amount: GrandTotal,
          Comment: "user app",
          customer: userId,
          serviceId: serviceID,
          // serviceDate: startDate,
        });
        await add.save();

        await responseData.save();
        console.log("Payment data saved successfully.");
        res.redirect("myapp://paymentSuccess");
      } else {
        return res.redirect("myapp://failure");
      }
    } catch (error) {
      console.error("Error handling payment status:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

const CCavenuepaymentgetwaycontroller = new CCAVuenuPaymentgetway();
module.exports = CCavenuepaymentgetwaycontroller;
