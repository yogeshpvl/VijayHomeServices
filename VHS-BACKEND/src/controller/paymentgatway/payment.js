const axios = require("axios");
const sha256 = require("sha256");
const Paymentgetwaymodel = require("../../model/paymentgatway/payment");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const sPaymentmodel = require("../../model/paymentgatway/servicePayment");
const technicianmodel = require("../../model/master/technician");
const servicedetailsmodel = require("../../model/servicedetails");
const customerModel = require("../../model/customer");
const PaymentModal = require("../../model/payment");
const moment = require("moment");
const ccavUtil = require("../../config/ccavutil");

const generateQueryString = (obj, prefix = "") => {
  const queryStringArray = [];

  const serializeValue = (value, key) => {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          serializeValue(item, `${key}[${index}]`);
        });
      } else {
        Object.keys(value).forEach((subKey) => {
          serializeValue(value[subKey], `${key}.${subKey}`);
        });
      }
    } else {
      queryStringArray.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      );
    }
  };

  Object.keys(obj).forEach((key) => {
    serializeValue(obj[key], prefix ? `${prefix}.${key}` : key);
  });

  return queryStringArray.join("&");
};

const addServiceDetails = async (data) => {
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
      paymentMode: "online",
      TotalAmt,
      status,
      EnquiryId,
      complaint,
      ctechName,
      markerCoordinate,
    });

    let save = await add.save();

    if (save) {
      console.log("successfully", save);

      let add = new PaymentModal({
        paymentDate: moment(startDate).format("DD-MM-YYYY"),
        paymentType: "Customer",
        paymentMode: "online",
        amount: GrandTotal,
        Comment: "website",
        customer: userId,
        serviceId: save?._id,
        serviceDate: startDate,
      });
      const savedPayment = await add.save();

      console.log(savedPayment, "savedPayment");
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

const addServiceDetails1 = async (data) => {
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
    transactionId,
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
      transactionId,
    });

    let save = await add.save();

    if (save) {
      console.log("successfully", save);

      let add = new PaymentModal({
        paymentDate: moment(startDate).format("DD-MM-YYYY"),
        paymentType: "Customer",
        paymentMode: "online",
        amount: GrandTotal,
        Comment: "user app",
        customer: userId,
        serviceId: save?._id,
        serviceDate: startDate,
      });
      const savedPayment = await add.save();

      console.log(savedPayment, "savedPayment");
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

class Paymentgetway {
  async yogipayment(req, res) {
    const merchantTransactionId = uuidv4();
    const { amount, number, MUID, transactionId } = req.body;

    const saltkey = "a01d076b-dc15-4c1f-bac8-c53852439d04";
    const MerchantId = "M1PX7BZG1R4G";
    console.log("merchantTransactionId", merchantTransactionId);

    // Ensure latitude and longitude are numbers
    if (req.body.markerCoordinate) {
      req.body.markerCoordinate.latitude = parseFloat(
        req.body.markerCoordinate.latitude
      );
      req.body.markerCoordinate.longitude = parseFloat(
        req.body.markerCoordinate.longitude
      );
    }
    if (req.body.deliveryAddress && req.body.deliveryAddress.markerCoordinate) {
      req.body.deliveryAddress.markerCoordinate.latitude = parseFloat(
        req.body.deliveryAddress.markerCoordinate.latitude
      );
      req.body.deliveryAddress.markerCoordinate.longitude = parseFloat(
        req.body.deliveryAddress.markerCoordinate.longitude
      );
    }

    const data = {
      merchantId: MerchantId,
      merchantTransactionId: transactionId,
      merchantUserId: MUID,
      amount: 100,
      redirectUrl: `https://api.vijayhomeservicebengaluru.in/api/payment/yogistatus/${transactionId}?${generateQueryString(
        req.body
      )}`,
      redirectMode: "POST",
      mobileNumber: number,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + saltkey;

    const sha256hash = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256hash + "###" + keyIndex;

    const prodUrl = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
    const options = {
      method: "POST",
      url: prodUrl,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    try {
      const response = await axios.request(options);
      const redirectUrl =
        response.data.data.instrumentResponse.redirectInfo.url;
      console.log(redirectUrl);
      return res.json({ redirectUrl });
    } catch (error) {
      console.error("Error initiating payment:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async yogiStatus(req, res) {
    const { transactionId } = req.params;
    let { userId, serviceId } = req.query;

    console.log("userId-----", userId, serviceId);
    const keyIndex = 1;
    const saltkey = "a01d076b-dc15-4c1f-bac8-c53852439d04";
    const string = `/pg/v1/status/M1PX7BZG1R4G/${transactionId}` + saltkey;
    const sha256hash = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256hash + "###" + keyIndex;

    const options = {
      method: "GET",
      url: `https://api.phonepe.com/apis/hermes/pg/v1/status/M1PX7BZG1R4G/${transactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": `M1PX7BZG1R4G`,
      },
    };

    try {
      const response = await axios.request(options);
      if (response.data.success === true) {
        addServiceDetails(req.query);
        console.log("response----", response.data);

        const responseData = new sPaymentmodel({
          userId: userId,
          code: response?.data?.code,
          serviceId: serviceId,
          data: {
            merchantId: response?.data?.data?.merchantId,
            merchantTransactionId: response?.data?.data?.merchantTransactionId,
            transactionId: response?.data?.data?.transactionId,
            amount: response?.data?.data?.amount,
            state: response?.data?.data?.state,
            responseCode: response?.data?.data?.responseCode,
            paymentInstrument: JSON.stringify(
              response?.data?.data?.paymentInstrument
            ), // Stringify this field
          },
          message: response?.data?.message,
          success: response?.data?.success,
        });

        await responseData.save();
        console.log("Payment data saved successfully.");
        return res.redirect("http://localhost:3000/Paymentsuccess");
      } else {
        console.log("payment failure: ", response.data.message);
        return res.redirect("http://localhost:3000/Paymentfailure");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async CCAvenueVendorpayment(req, res) {
    const { vendorId, amount, transactionId } = req.body;

    const orderId = transactionId;
    const currency = "INR";

    const redirectUrl = `http://localhost:8080/api/payment/ccavenueVendorstatus/${transactionId}/${vendorId}/${amount}}`;
    const cancelUrl = "http://localhost:3000/payment-cancel";
    const language = "EN";

    const paymentString = `merchant_id=${merchant_id}&order_id=${orderId}&currency=${currency}&amount=${amount}&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}&language=${language}`;

    // Encrypt the request
    const encRequest = encodeURIComponent(
      ccavUtil.encrypt(paymentString, workingKey)
    );

    const baseUrl =
      "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction";
    const paymentUrl = `${baseUrl}&encRequest=${encRequest}&access_code=${accessCode}`;

    res.status(200).json({ url: paymentUrl });
  }

  async CCAvenueVendorStatus(req, res) {
    const { vendorId, vendorAmt } = req.params;
    const convertedAmount = Number(vendorAmt / 100);

    const { encResp } = req.body;

    // Decrypt the response
    const decryptedResponse = ccavUtil.decrypt(encResp, workingKey);

    // Convert the decrypted response string to an object
    const responseObject = decryptedResponse
      .split("&")
      .reduce((acc, keyValueString) => {
        const [key, value] = keyValueString.split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {});

    // Redirect based on the order status
    if (responseObject.order_status === "Success") {
      const vendorData = await technicianmodel.findOneAndUpdate(
        { _id: vendorId },
        { $inc: { vendorAmt: convertedAmount } },
        { new: true }
      );

      const responseData = new sPaymentmodel({
        userId: vendorId,
        code: responseObject.order_status,

        payment_mode: responseObject.payment_mode,
        message: responseObject.status_message,
        amount: convertedAmount,
        success: true,
      });
      await responseData.save();
      return res.redirect("myapp://mydrawer");
    } else {
      return res.redirect("myapp://failed");
    }
  }

  async CCAvenueUserApppayment(req, res) {
    const { updateddata } = req.body;

    const orderId = "T" + Date.now();
    const currency = "INR";
    const transactionId = "T" + Date.now();

    const redirectUrl = `https://api.vijayhomeservicebengaluru.in/api/payment/CCAvenueUserAppstatus/${transactionId}/${updateddata.userId}/${updateddata.serviceID}`;
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

      await addServiceDetails1(updateddata);

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
    const transactionId = req.params.transactionId;
    const userId = req.params.userId;
    const serviceID = req.params.serviceID;
    console.log("transactionId", transactionId);

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
          { transactionId: transactionId },
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

        await responseData.save();
        console.log("Payment data saved successfully.");
        res.redirect("myapp://paymentSuccess");
      } else {
        return res.redirect("http://localhost:3000/Paymentfailure");
      }
    } catch (error) {
      console.error("Error handling payment status:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async yogiVendorpayment(req, res) {
    const { vendorId, amount, number, MUID, transactionId } = req.body;

    const saltkey = "a01d076b-dc15-4c1f-bac8-c53852439d04";
    const MerchantId = "M1PX7BZG1R4G";

    const data = {
      merchantId: MerchantId,
      merchantTransactionId: transactionId,
      merchantUserId: MUID,
      amount: amount,
      redirectUrl: `https://api.vijayhomeservicebengaluru.in/api/payment/yogiVendorstatus/${transactionId}/${vendorId}}`,
      redirectMode: "POST",
      mobileNumber: number,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + saltkey;

    const sha256hash = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256hash + "###" + keyIndex;

    const prodUrl = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
    const options = {
      method: "POST",
      url: prodUrl,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    try {
      const response = await axios.request(options);
      const redirectUrl =
        response.data.data.instrumentResponse.redirectInfo.url;
      console.log(redirectUrl);
      return res.json({ redirectUrl });
    } catch (error) {
      console.error("Error initiating payment:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async yogiVendorStatus(req, res) {
    const { transactionId, vendorId } = req.params;

    const keyIndex = 1;
    const saltkey = "a01d076b-dc15-4c1f-bac8-c53852439d04";
    const string = `/pg/v1/status/M1PX7BZG1R4G/${transactionId}` + saltkey;
    const sha256hash = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256hash + "###" + keyIndex;

    const options = {
      method: "GET",
      url: `https://api.phonepe.com/apis/hermes/pg/v1/status/M1PX7BZG1R4G/${transactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": `M1PX7BZG1R4G`,
      },
    };

    try {
      const response = await axios.request(options);
      if (response.data.success === true) {
        console.log("response----", response.data);
        const vendorData = await technicianmodel.findOneAndUpdate(
          { _id: vendorId },
          { $inc: { vendorAmt: convertedAmount } },
          { new: true }
        );

        const responseData = new sPaymentmodel({
          userId: vendorId,
          code: response.data.code,

          data: response.data.data,
          message: response.data.message,
          success: response.data.success,
        });
        await responseData.save();
        console.log("Payment data saved successfully.");
        return res.redirect("http://localhost:3000/Paymentsuccess");
      } else {
        console.log("payment failure: ", response.data.message);
        return res.redirect("http://localhost:3000/Paymentfailure");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async initiatePaymentforvendor(req, res) {
    const transactionId = uuidv4();

    try {
      const { amount, vendorId, number } = req.body;

      if (!vendorId) {
        return res.status(400).json({ error: "Please try again later" });
      }

      // Ensure amount is a valid number
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid amount. Please provide a valid positive number.",
        });
      }

      const base64 = Buffer.from(
        JSON.stringify({
          merchantId: "M1PX7BZG1R4G",
          merchantTransactionId: transactionId,
          merchantUserId: "asfnjk212",
          amount,
          redirectUrl: "",
          redirectMode: "POST",
          callbackUrl: `https://api.vijayhomeservicebengaluru.in/api/payment/vendorstatus/M1PX7BZG1R4G/${transactionId}/${vendorId}/${amount}`,
          mobileNumber: number,
          paymentInstrument: {
            type: "PAY_PAGE",
          },
        })
      ).toString("base64");

      const sha256encode =
        sha256(base64 + "/pg/v1/paya01d076b-dc15-4c1f-bac8-c53852439d04") +
        "###1";

      // Save payment details to the database
      const newPayment = new Paymentgetwaymodel({
        amount,
        serviceId,
      });

      await newPayment.save();

      return res.status(200).json({
        success: true,
        message: "Payment initiated successfully",
        base64,
        sha256encode,
        merchantId: "M1PX7BZG1R4G",
        merchantTransactionId: transactionId,
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      return res.status(500).json({
        success: false,
        message: "Payment initiation failed. Please try again.",
      });
    }
  }

  async checkTransactionStatusinvendor(req, res) {
    const { merchantId, merchantTransactionId, vendorId, vendorAmt } =
      req.params;
    const convertedAmount = Number(vendorAmt / 100);

    const saltKey = "a01d076b-dc15-4c1f-bac8-c53852439d04";
    const url = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
    const xVerify =
      crypto
        .createHash("sha256")
        .update(url + saltKey)
        .digest("hex") +
      "###" +
      1;

    try {
      const response = await axios.get(
        `https://api.phonepe.com/apis/hermes${url}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": xVerify,
            "X-MERCHANT-ID": "M1PX7BZG1R4G", // Remove the space before "X-MERCHANT-ID"
          },
        }
      );

      response.data.data.paymentInstrument = JSON.stringify(
        response.data.data.paymentInstrument
      );

      // Save the responseData to MongoDB
      if (response.data.code === "PAYMENT_SUCCESS") {
        const vendorData = await technicianmodel.findOneAndUpdate(
          { _id: vendorId },
          { $inc: { vendorAmt: convertedAmount } },
          { new: true }
        );

        const responseData = new sPaymentmodel({
          userId: vendorId,
          code: response.data.code,

          data: response.data.data,
          message: response.data.message,
          success: response.data.success,
        });
        await responseData.save();
        return res.status(200).json({
          success: true,
          responseData: response.data,
        });
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to check transaction status.",
      });
    }
  }

  async initiatePayment(req, res) {
    const transactionId = uuidv4();

    try {
      const { amount, serviceId } = req.body;

      // Ensure amount is a valid number
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid amount. Please provide a valid positive number.",
        });
      }

      const base64 = Buffer.from(
        JSON.stringify({
          merchantId: "M1PX7BZG1R4G",
          merchantTransactionId: transactionId,
          merchantUserId: "pankaj123",
          amount,
          redirectUrl: "",
          redirectMode: "POST",
          callbackUrl: `https://api.vijayhomeservicebengaluru.in/api/payment/status/M1PX7BZG1R4G/${transactionId}`,
          mobileNumber: "8951592630",
          paymentInstrument: {
            type: "PAY_PAGE",
          },
        })
      ).toString("base64");

      const sha256encode =
        sha256(base64 + "/pg/v1/paya01d076b-dc15-4c1f-bac8-c53852439d04") +
        "###1";

      // Save payment details to the database
      const newPayment = new Paymentgetwaymodel({
        amount,
        serviceId,
      });

      await newPayment.save();

      return res.status(200).json({
        success: true,
        message: "Payment initiated successfully",
        base64,
        sha256encode,
        merchantId: "M1PX7BZG1R4G",
        merchantTransactionId: transactionId,
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      return res.status(500).json({
        success: false,
        message: "Payment initiation failed. Please try again.",
      });
    }
  }

  async checkTransactionStatus(req, res) {
    const { merchantId, merchantTransactionId, userId, serviceId } = req.params;
    const saltKey = "a01d076b-dc15-4c1f-bac8-c53852439d04";
    const url = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
    const xVerify =
      crypto
        .createHash("sha256")
        .update(url + saltKey)
        .digest("hex") +
      "###" +
      1;

    try {
      const response = await axios.get(
        `https://api.phonepe.com/apis/hermes${url}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": xVerify,
            " X-MERCHANT-ID": "M1PX7BZG1R4G",
          },
        }
      );

      response.data.data.paymentInstrument = JSON.stringify(
        response.data.data.paymentInstrument
      );

      // Save the responseData to MongoDB
      if (response.data.code === "PAYMENT_SUCCESS") {
        const responseData = new sPaymentmodel({
          userId: userId,
          code: response.data.code,
          serviceId: serviceId,
          data: response.data.data,
          message: response.data.message,
          success: response.data.success,
        });
        await responseData.save();
      }

      return res.status(200).json({
        success: true,
        responseData: response.data,
      });
    } catch (error) {
      console.error("Error checking transaction status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to check transaction status.",
      });
    }
  }

  async initiatePaymentforvendor(req, res) {
    const transactionId = uuidv4();

    try {
      const { amount, serviceId, vendorId } = req.body;

      // Ensure amount is a valid number
      if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid amount. Please provide a valid positive number.",
        });
      }

      const base64 = Buffer.from(
        JSON.stringify({
          merchantId: "M1PX7BZG1R4G",
          merchantTransactionId: transactionId,
          merchantUserId: "asfnjk212",
          amount,
          redirectUrl: "",
          redirectMode: "POST",
          callbackUrl: `https://api.vijayhomeservicebengaluru.in/api/payment/status/M1PX7BZG1R4G/${transactionId}/${vendorId}/${amount}`,
          mobileNumber: "8951592630",
          paymentInstrument: {
            type: "PAY_PAGE",
          },
        })
      ).toString("base64");

      const sha256encode =
        sha256(base64 + "/pg/v1/paya01d076b-dc15-4c1f-bac8-c53852439d04") +
        "###1";

      // Save payment details to the database
      const newPayment = new Paymentgetwaymodel({
        amount,
        serviceId,
      });

      await newPayment.save();

      return res.status(200).json({
        success: true,
        message: "Payment initiated successfully",
        base64,
        sha256encode,
        merchantId: "M1PX7BZG1R4G",
        merchantTransactionId: transactionId,
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      return res.status(500).json({
        success: false,
        message: "Payment initiation failed. Please try again.",
      });
    }
  }

  async checkTransactionStatusinvendor(req, res) {
    const { merchantId, merchantTransactionId, vendorId, vendorAmt } =
      req.params;
    const convertedAmount = vendorAmt / 100;
    const saltKey = "a01d076b-dc15-4c1f-bac8-c53852439d04";
    const url = `/pg/v1/status/${merchantId}/${merchantTransactionId}`;
    const xVerify =
      crypto
        .createHash("sha256")
        .update(url + saltKey)
        .digest("hex") +
      "###" +
      1;

    try {
      const response = await axios.get(
        `https://api.phonepe.com/apis/hermes${url}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": xVerify,
            "X-MERCHANT-ID": "M1PX7BZG1R4G", // Remove the space before "X-MERCHANT-ID"
          },
        }
      );

      response.data.data.paymentInstrument = JSON.stringify(
        response.data.data.paymentInstrument
      );

      // Save the responseData to MongoDB
      if (response.data.code === "PAYMENT_SUCCESS") {
        const vendorData = await technicianmodel.findOneAndUpdate(
          { _id: vendorId },
          { $inc: { vendorAmt: convertedAmount } },
          { new: true }
        );

        const responseData = new sPaymentmodel({
          userId: vendorId,
          code: response.data.code,

          data: response.data.data,
          message: response.data.message,
          success: response.data.success,
        });
        await responseData.save();
        return res.status(200).json({
          success: true,
          responseData: response.data,
        });
      }
    } catch (error) {
      console.error("Error checking transaction status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to check transaction status.",
      });
    }
  }

  async getpaymentstatusByUserId(req, res) {
    let userId = req.params.userId;
    try {
      const status = await Paymentgetwaymodel.find({
        userId: userId,
      });

      if (status) {
        return res.json({ getPaymentStatus: status });
      } else {
        return res.json({ getPaymentStatus: [] });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to fetch user status" });
    }
  }
  async getAllPayment(req, res) {
    try {
      const payment = await Paymentgetwaymodel.find({});
      if (payment) {
        res.status(200).json({ success: payment });
      } else {
        res.status(404).json({ error: "something went wrong" });
      }
    } catch (error) {
      console.log("error:", error);
    }
  }
}

const paymentgetwaycontroller = new Paymentgetway();
module.exports = paymentgetwaycontroller;
