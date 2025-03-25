const express = require("express");
const router = express.Router();
const bookingServiceController = require("../../controllers/serviceBooking/bookingServices");

// ✅ Create a booking service entry
router.post("/", bookingServiceController.createBookingService);

// ✅ Get all services for a specific booking
router.get("/booking/:booking_id", bookingServiceController.getServicesByBookingId);

// ✅ Get monthly services with vendor filter
router.get("/monthly/:year/:month", bookingServiceController.getMonthlyBookingServices);

// ✅ Update service status
router.put("/:id/status", bookingServiceController.updateServiceStatus);

// ✅ Delete a booking service
router.delete("/:id", bookingServiceController.deleteBookingService);

module.exports = router;
