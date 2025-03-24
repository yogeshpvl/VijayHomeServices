const express = require("express");
const router = express.Router();
const QuotationController = require("../../controllers/quote/quote");

// Create a new quotation
router.post("/quotations", QuotationController.createQuotation);

// Edit a quotation
router.put("/quotations/:quotation_id", QuotationController.editQuotation);

// Fetch all quotations
router.get("/quotations", QuotationController.fetchQuotations);

// Fetch quotation by enquiry_id
router.get(
  "/quotations/enquiry/:enquiry_id",
  QuotationController.fetchQuotationByEnquiryId
);

// Delete a quotation
router.delete("/quotations/:quotation_id", QuotationController.deleteQuotation);

module.exports = router;
