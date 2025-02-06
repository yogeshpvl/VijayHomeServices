const express = require("express");
const router = express.Router();
const CCavenuepaymentgetwaycontroller = require("../../controller/paymentgatway/CCAvenue");

router.post(
  "/CCAvenueUserApppayment",
  CCavenuepaymentgetwaycontroller.CCAvenueUserApppayment
);

router.post(
  "/CCAvenueUserAppstatus/:transactionId/:userId/:serviceID",
  CCavenuepaymentgetwaycontroller.CCAvenueUserAppStatus
);

router.post(
  "/CCAvenueUserApppaymentAfterBook",
  CCavenuepaymentgetwaycontroller.CCAvenueUserApppaymentAfterService
);

router.post(
  "/CCAvenueUserAppstatusAfterBook/:transactionId/:userId/:serviceID/:amount",
  CCavenuepaymentgetwaycontroller.CCAvenueUserAppStatusAfterService
);

module.exports = router;
