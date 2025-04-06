const express = require("express");
const router = express.Router();
const controller = require("../../controllers/payments/payments");

router.post("/", controller.createPayment);
router.get("/", controller.getAllPayments);
router.get("/:service_id", controller.getPaymentByServiceId);
router.put("/:id", controller.updatePayment);
router.delete("/:id", controller.deletePayment);

module.exports = router;
