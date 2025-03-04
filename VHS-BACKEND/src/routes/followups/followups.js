const express = require("express");
const router = express.Router();
const followupController = require("../../controllers/followups/followups");

// ✅ 1️⃣ Get Next Follow-up Date and Response-wise Follow-ups
router.get("/next-followups", followupController.getNextFollowups);

// ✅ 2️⃣ Get Follow-ups Response-wise
router.get("/response/:response", followupController.getFollowupsByResponse);

// ✅ 3️⃣ Get Follow-ups within a Date Range (With Counts)
router.get("/date-range", followupController.getFollowupsByDateRange);

// ✅ 4️⃣ Get Follow-ups by Enquiry ID
router.get("/enquiry/:enquiryId", followupController.getFollowupsByenquiryId);

router.post("/", followupController.createFollowup);

module.exports = router;
