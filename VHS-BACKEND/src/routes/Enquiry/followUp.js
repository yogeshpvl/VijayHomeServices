const express = require("express");
const router = express.Router();
const followUpController = require("../../controller/Enquiry/followUp");

// ✅ Add a follow-up for a customer
router.post("/add", followUpController.addFollowUp);

// ✅ Get the last follow-up response for a customer
router.get("/last/:enquiryId", followUpController.getLastFollowUp);

// ✅ Get all follow-ups for a customer
router.get("/all/:enquiryId", followUpController.getAllFollowUps);

module.exports = router;
