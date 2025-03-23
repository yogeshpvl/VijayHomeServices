const express = require("express");
const router = express.Router();
const controller = require("../controllers/trytobooking");

router.post("/", controller.createBooking);
router.put("/:id", controller.updateRemarks);
router.get("/", controller.getBookings);

module.exports = router;
