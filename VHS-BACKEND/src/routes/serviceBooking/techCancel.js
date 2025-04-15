const express = require("express");
const router = express.Router();
const techcancelController = require("../../controllers/serviceBooking/techCancel");

// Create a tech cancel entry
router.post("/techcancel", techcancelController.createTechCancel);

// Get all tech cancel entries
router.get("/techcancel", techcancelController.getAllTechCancels);

// Get cancel entry by booking_service_id
router.get(
  "/techcancel/:booking_service_id",
  techcancelController.getTechCancelByServiceId
);

module.exports = router;
