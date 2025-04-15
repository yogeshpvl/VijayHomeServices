const express = require("express");
const router = express.Router();
const vendorPGcontroller = require("../../controllers/PG/vendorPG");

// Route to start payment
router.post("/vendorRecharge", vendorPGcontroller.CCAvenueVendorpayment);

// Route to receive payment status
router.post(
  "/vendorRechargeStatus/:transactionId/:vendorId/:amount",
  vendorPGcontroller.CCAvenueVendorStatus
);

// ✅ THIS LINE is critical — do NOT export an object
module.exports = router;
