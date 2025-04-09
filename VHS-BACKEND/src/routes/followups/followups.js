const express = require("express");
const router = express.Router();
const followupController = require("../../controllers/followups/followups");

// ✅ 1️⃣ Get Next Follow-up Date and Response-wise Follow-ups
router.get("/next-followups", followupController.getNextFollowups);
router.get("/last", followupController.getLatestFollowupsByDateAndResponse);
router.get("/monthly", followupController.getMonthlyFollowupsByDateAndResponse);
router.get(
  "/monthlyCounts",
  followupController.getMonthlyFollowupCountsByDateAndResponse
);
router.get("/totalCounts", followupController.gettotalCounts);
router.get("/datewise", followupController.getCallLaterDateWiseFollowups);
router.get("/datewiseSurveys", followupController.getSurveyDateWiseFollowups);
router.get("/getSurveyReportpage", followupController.getSurveyReportpage);
router.get(
  "/getSurveyReportpageDownload",
  followupController.getSurveyReportpageDownload
);

router.get("/call-later", followupController.getFollowupsByResponse);
router.put(
  "/update-followup-appointment/:followupId",
  followupController.updateFollowupAppointment
);
router.put(
  "/update-cancel-survey/:followupId",
  followupController.updateFollowupSurveyCancel
);
// ✅ 2️⃣ Get Follow-ups Response-wise
router.get("/response/:response", followupController.getFollowupsByResponse);

// ✅ 3️⃣ Get Follow-ups within a Date Range (With Counts)
router.get("/date-range", followupController.getFollowupsByDateRange);

// ✅ 4️⃣ Get Follow-ups by Enquiry ID
router.get("/enquiry/:enquiryId", followupController.getFollowupsByenquiryId);

router.post("/", followupController.createFollowup);

module.exports = router;
