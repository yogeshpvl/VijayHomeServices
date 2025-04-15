const express = require("express");
const router = express.Router();
const techRescheduleController = require("../../controllers/serviceBooking/techReschedule");

// POST create reschedule
router.post("/techreschedule", techRescheduleController.createReschedule);

// GET all reschedules
router.get("/techreschedule", techRescheduleController.getAllReschedules);

// GET by booking_service_id
router.get(
  "/techreschedule/:booking_service_id",
  techRescheduleController.getRescheduleByServiceId
);

module.exports = router;
