const express = require("express");
const {
  EnquirySearch,
  getTodaysEnquiries,
  getExecutiveEnquiries,
  getEnquiryCounts,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getLastEnquiryId,
  getNewEnquiries,
  getOnlyResponseNewEnquiries,
  getEnquiriesFoReporPage,
  getEnquiriesFoReporPageDownload,
} = require("../../controllers/enquiry/enquiry");
const { protect, authorize } = require("../../middlewares/authMiddleware");

const router = express.Router();

// ✅ Place Static Routes Before Dynamic Routes
router.get("/search", EnquirySearch);
router.get("/today", protect, getTodaysEnquiries);
router.get("/last-enquiry", getLastEnquiryId);
router.get("/new-enquiry", getNewEnquiries);
router.get("/new-response-enquiry", getOnlyResponseNewEnquiries);
router.get("/getEnquiriesFoReporPage", getEnquiriesFoReporPage);
router.get("/getEnquiriesFoReporPageDownload", getEnquiriesFoReporPageDownload);

router.get("/:enquiryId", getEnquiryById);

router.post("/create", createEnquiry);

router.put("/:id", updateEnquiry);
router.delete("/:id", protect, deleteEnquiry);

module.exports = router;
