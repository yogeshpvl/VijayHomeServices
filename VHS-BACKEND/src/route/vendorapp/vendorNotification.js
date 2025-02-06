const express = require("express");
const router = express.Router();
const vendorNotificationController = require("../../controller/vendorapp/vendorNotification");

router.post(
  "/createVendorNotification",
  vendorNotificationController.addvendorNotification
);
router.get(
  "/getVendorNotification/:vendorId",
  vendorNotificationController.getvendorNotification
);

module.exports = router;
