const VendorPayment = require("../../models/payments/vendorPayments");

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
