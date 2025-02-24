const express = require("express");
const router = express.Router();
const enquiryController = require("../../controller/Enquiry/enquiry");

// Define Enquiry Routes
router.post("/add", enquiryController.addEnquiry);
router.get("/getAll", enquiryController.getEnquiries);
router.get("/get/:id", enquiryController.getEnquiryById);
router.put("/edit/:id", enquiryController.editEnquiry);
router.delete("/delete/:id", enquiryController.deleteEnquiry);

module.exports = router;
