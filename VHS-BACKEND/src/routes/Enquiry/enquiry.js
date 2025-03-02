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
} = require("../../controllers/enquiry/enquiry");
const { protect, authorize } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.get("/search", EnquirySearch);
router.get("/today", protect, getTodaysEnquiries);
router.get("/:enquiryId", getEnquiryById);

router.post("/create", createEnquiry);
router.put("/:id", updateEnquiry);
router.delete("/:id", protect, deleteEnquiry);

module.exports = router;
