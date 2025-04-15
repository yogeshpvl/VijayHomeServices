const express = require("express");
const router = express.Router();
const QuotationController = require("../../controllers/quote/quote");

router.put(
  "/follwups/:followup_id/:enquiry_id",
  QuotationController.sendquoteinwhatsapp
);

// Create a new quotation
router.put(
  "/update-or-create/:id",
  QuotationController.updateOrCreateQuotation
);

// Edit a quotation
router.put("/quotations/:quotation_id", QuotationController.editQuotation);
router.put(
  "/advupdatequotations/:quotation_id",
  QuotationController.updateAdvQuotation
);

// Fetch all quotations
router.get("/quotations", QuotationController.fetchQuotations);
router.get("/executivequotations", QuotationController.ExecutiveQuotations);

router.get("/fetchQuotationsReport", QuotationController.fetchQuotationsReport);
router.get(
  "/fetchQuotationsReportDownload",
  QuotationController.fetchQuotationsReportDownload
);

router.get("/fetch-with-items", QuotationController.fetchQuotationswithItems);

// Fetch quotation by enquiry_id
router.get(
  "/enquiry/:enquiry_id",
  QuotationController.fetchQuotationByEnquiryId
);

// Fetch quotation by enquiry_id
router.get(
  "/pmsalename/:enquiry_id",
  QuotationController.fetchQuotationByEnquiryIdForPM
);
// Delete a quotation
router.delete("/quotations/:quotation_id", QuotationController.deleteQuotation);

module.exports = router;
