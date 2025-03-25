const express = require("express");
const router = express.Router();
const vendorAssignmentController = require("../../controllers/serviceBooking/vendorAssignments");

router.post("/assign", vendorAssignmentController.assignVendor);
router.get(
  "/booking/:booking_id",
  vendorAssignmentController.getAssignedVendors
);
router.get("/vendor/:vendor_id", vendorAssignmentController.getVendorBookings);

module.exports = router;
