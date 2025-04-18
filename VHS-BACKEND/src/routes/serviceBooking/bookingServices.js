const express = require("express");
const router = express.Router();
const bookingServiceController = require("../../controllers/serviceBooking/bookingServices");

const multer = require("multer");

// Use memory storage (no uploads folder required)
const upload = multer({ storage: multer.memoryStorage() });

router.get("/MonthlyCounts", bookingServiceController.getMonthlyServiceCounts);

router.get(
  "/PaymnetsMonthlyCounts",
  bookingServiceController.getMonthlyPaymentsServiceCounts
);

router.get("/yearlyCounts", bookingServiceController.getyearlyCounts);
router.get("/dailydata", bookingServiceController.getDailyServiceData);

router.get(
  "/paymentsdailydata",
  bookingServiceController.getPaymentsReportDailyServiceData
);

router.get(
  "/PaymentsReportDailySummary",
  bookingServiceController.getPaymentsReportDailySummary
);

//reporst page apis
router.get(
  "/getPaymentReportFilter",
  bookingServiceController.getPaymentsReportPAge
);

// router.get("/exportDSRReport", bookingServiceController.exportDSRReport);
router.get("/getDSRREportFilter", bookingServiceController.getDSRReportFilter);
router.get("/exportDSRReport", bookingServiceController.exportDSRReport);
router.get(
  "/exportPAYMMENTReport",
  bookingServiceController.exportPaymentReport
);

router.get("/service/:id", bookingServiceController.getServiceById);

// ✅ Get all services for a specific booking
router.get(
  "/booking/:booking_id",
  bookingServiceController.getServicesByBookingId
);

router.get("/bookingForuser", bookingServiceController.getbookingIDForUserById);

router.get(
  "/booking-sevice/:id",
  bookingServiceController.getServicesByBookingServiceId
);

router.get(
  "/vendor-counts/:vendor_id",
  bookingServiceController.getServiceCountsByVendor
);
router.get(
  "/vendor-data/:vendor_id",
  bookingServiceController.getServicesByVendorAndDate
);

//project manager
router.get("/pm-project-counts", bookingServiceController.PMprojectsCounts);
router.get("/pm-project-data", bookingServiceController.PMNewProjectdata);

router.put(
  "/pm-start-project/:id",
  bookingServiceController.PMStartProjectsData
);

router.put("/pm-deep-clean/:id", bookingServiceController.PMDeepCleanUpdate);
router.get(
  "/past/:user_id",
  bookingServiceController.getPastServicesByUserIdNext
);

router.get(
  "/future/:user_id",
  bookingServiceController.getFutureServicesByUserIdNext
);
router.get(
  "/today/:user_id",
  bookingServiceController.gettodayServicesByUserIdNext
);

// ✅ Create a booking service entry
router.post("/", bookingServiceController.createBookingService);

// ✅ Update service status
router.put("/:id", bookingServiceController.updateServiceDetails);
router.get(
  "/vendor-app-inhouse-data/:vendor_id",
  bookingServiceController.getServicesByVendorInhouseData
);
router.put(
  "/vendor-job-accept/:vendor_id",
  bookingServiceController.getServicesByVendorInhouseAcceptOrREjectJOb
);

router.put(
  "/outvendor-job-accept/:vendor_id",
  bookingServiceController.getServicesByVendorOuthouseAcceptnearServiceJOb
);

router.get(
  "/vendor-app-ongoning-jobs/:vendor_id",
  bookingServiceController.getServicesByVendorOngoningData
);

router.put(
  "/START/:id",
  upload.single("before_service_img"),
  bookingServiceController.ServiceStartByVendor
);

router.get(
  "/vendor-app-completed-jobs/:vendor_id",
  bookingServiceController.getServicesByVendorCompletedData
);

router.put(
  "/COMPLETE/:id",
  upload.single("after_service_img"),
  bookingServiceController.ServiceENDByVendor
);

router.put(
  "/TECHSTART/:id",

  bookingServiceController.ServiceStartByTenhnicain
);

router.get("/close-projects", bookingServiceController.closedPojects);
router.put(
  "/TECHCOMPLETE/:id",

  bookingServiceController.ServiceENDByTenhnicain
);

// ✅ Delete a booking service
router.delete("/:id", bookingServiceController.deleteBookingService);

module.exports = router;
