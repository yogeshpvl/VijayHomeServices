const express = require("express");
const router = express.Router();
const customerPGcontroller = require("../../controllers/PG/customerPG");

// Route to start payment
router.post(
  "/customer-booking-payment",
  customerPGcontroller.CustomerBookingpayment
);

// Route to receive payment status
router.post(
  "/customer-booking-payment-status/:serviceId/:service_date/:customer_id",
  customerPGcontroller.CustomerBookingpaymentStatus
);

// Route to start payment
router.post(
  "/customer-payment-after-booking",
  customerPGcontroller.afterservicebookpayment
);

// Route to receive payment status
router.post(
  "/customer-payment-after-booking-status/:serviceId/:service_date/:customer_id",
  customerPGcontroller.afterservicebookpaymentstatus
);

//website

// Route to start payment
router.post(
  "/customer-booking-payment-web",
  customerPGcontroller.CustomerBookingpaymentWebsite
);

// Route to receive payment status
router.post(
  "/customer-booking-payment-status-web/:serviceId/:service_date/:customer_id",
  customerPGcontroller.CustomerBookingpaymentStatuswebsite
);

// ✅ THIS LINE is critical — do NOT export an object
module.exports = router;
