const express = require("express");
const router = express.Router();
const vendorPaymentController = require("../../controllers/payments/vendorPayments");

// Route: /api/vendor-payments/:vendorId
router.get(
  "/vendor-payments/:vendorId",
  vendorPaymentController.getPaymentsByVendor
);

router.post("/vendor-payments", vendorPaymentController.AddPaymentsByVendor);
module.exports = router;
