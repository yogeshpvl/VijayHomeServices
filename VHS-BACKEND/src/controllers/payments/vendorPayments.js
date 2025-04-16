const Vendor = require("../../models/master/vendors");
const VendorPayment = require("../../models/payments/vendorPayments");
const moment = require("moment");

exports.AddPaymentsByVendor = async (req, res) => {
  try {
    const payments = await VendorPayment.create({
      payment_date: moment().format("YYYY-MM-DD"),
      payment_type: "credit",
      payment_mode: "N/A",
      vendor_id: req.body.vendor_id,
      comment: req.body.comment,
      amount: req.body.amount,
    });

    // Increment vendor_amt by the payment amount
    await Vendor.increment(
      { vendor_amt: req.body.amount }, // Correct reference to amount
      { where: { id: req.body.vendor_id } }
    );

    return res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error("Error processing vendor payments:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET: All payments by vendor ID
exports.getPaymentsByVendor = async (req, res) => {
  const { vendorId } = req.params;

  try {
    const payments = await VendorPayment.findAll({
      where: { vendor_id: vendorId },

      order: [["payment_date", "DESC"]],
    });

    return res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error("Error fetching vendor payments:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
