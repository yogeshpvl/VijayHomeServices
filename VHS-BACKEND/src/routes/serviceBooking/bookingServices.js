const express = require("express");
const router = express.Router();
const bookingServiceController = require("../../controllers/serviceBooking/bookingServices");

router.get("/MonthlyCounts", bookingServiceController.getMonthlyServiceCounts);
router.get("/dailydata", bookingServiceController.getDailyServiceData);

// ✅ Create a booking service entry
router.post("/", bookingServiceController.createBookingService);
router.get("/service/:id", bookingServiceController.getServiceById);

// ✅ Get all services for a specific booking
router.get(
  "/booking/:booking_id",
  bookingServiceController.getServicesByBookingId
);

// ✅ Get monthly services with vendor filter

// ✅ Update service status
router.put("/:id/status", bookingServiceController.updateServiceStatus);

// ✅ Delete a booking service
router.delete("/:id", bookingServiceController.deleteBookingService);

module.exports = router;
