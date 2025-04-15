const Vendors = require("../../models/master/vendors"); // Sequelize models
const workingKey = "26BEB2F2DF6FEB5A6BF29F7259679061";
const accessCode = "AVHX01LG55AF47XHFA";
const merchant_id = "3663823";
const ccavUtil = require("../../config/ccavutil");
const vendorPayment = require("../../models/payments/vendorPayments");
const moment = require("moment");

class vendorPG {
  async CCAvenueVendorpayment(req, res) {
    const { vendorId, amount, transactionId } = req.body;

    const orderId = transactionId;
    const currency = "INR";

    const redirectUrl = `https://newapi.vijayhomeservicebengaluru.in/api/vendorPG/vendorRechargeStatus/${transactionId}/${vendorId}/${amount}`;

    const cancelUrl = "http://localhost:3000/payment-cancel";
    const language = "EN";

    const paymentString = `merchant_id=${merchant_id}&order_id=${orderId}&currency=${currency}&amount=${amount}&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}&language=${language}`;
    const encRequest = encodeURIComponent(
      ccavUtil.encrypt(paymentString, workingKey)
    );

    const baseUrl =
      "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";
    const paymentUrl = `${baseUrl}&encRequest=${encRequest}&access_code=${accessCode}`;

    res.status(200).json({ url: paymentUrl });
  }

  async CCAvenueVendorStatus(req, res) {
    const { vendorId, amount } = req.params;

    const parsedAmt = parseFloat(amount);
    if (isNaN(parsedAmt)) {
      return res.status(400).json({ error: "Invalid vendor amount" });
    }

    const convertedAmount = parsedAmt;
    const { encResp } = req.body;

    const decryptedResponse = ccavUtil.decrypt(encResp, workingKey);
    const responseObject = decryptedResponse
      .split("&")
      .reduce((acc, keyValueString) => {
        const [key, value] = keyValueString.split("=");
        acc[key] = decodeURIComponent(value || "");
        return acc;
      }, {});

    if (responseObject.order_status === "Success") {
      await Vendors.increment(
        { vendor_amt: 1000 },
        { where: { id: vendorId } }
      );

      await vendorPayment.create({
        payment_date: moment().format("YYYY-MM-DD"),
        payment_type: "credit",
        payment_mode: responseObject?.card_name,
        amount: responseObject.amount,
        vendor_id: vendorId,
      });
      return res.redirect("myapp://mydrawer");
    } else {
      return res.redirect("myapp://failed");
    }
  }
}

module.exports = new vendorPG();
