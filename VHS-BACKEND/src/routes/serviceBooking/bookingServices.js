const express = require("express");
const router = express.Router();
const bookingServiceController = require("../../controllers/serviceBooking/bookingServices");

router.get("/MonthlyCounts", bookingServiceController.getMonthlyServiceCounts);

router.get(
  "/PaymnetsMonthlyCounts",
  bookingServiceController.getMonthlyPaymentsServiceCounts
);

router.get("/dailydata", bookingServiceController.getDailyServiceData);
router.get(
  "/paymentsdailydata",
  bookingServiceController.getPaymentsReportDailyServiceData
);

router.get("/getDSRREportFilter", bookingServiceController.getDSRReportFilter);

router.get("/service/:id", bookingServiceController.getServiceById);

// ✅ Get all services for a specific booking
router.get(
  "/booking/:booking_id",
  bookingServiceController.getServicesByBookingId
);

// ✅ Create a booking service entry
router.post("/", bookingServiceController.createBookingService);

// ✅ Update service status
router.put("/:id", bookingServiceController.updateServiceDetails);
router.put("/START/:id", bookingServiceController.ServiceStartByTenhnicain);

router.put("/COMPLETE/:id", bookingServiceController.ServiceENDByTenhnicain);

// ✅ Delete a booking service
router.delete("/:id", bookingServiceController.deleteBookingService);

module.exports = router;
