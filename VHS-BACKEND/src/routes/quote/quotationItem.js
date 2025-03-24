const express = require("express");
const router = express.Router();
const QuotationItemController = require("../../controllers/quote/quotationItem");

// Create a new quotation item
router.post("/quotation_items", QuotationItemController.createQuotationItem);

// Edit an existing quotation item
router.put(
  "/quotation_items/:item_id",
  QuotationItemController.editQuotationItem
);

// Fetch all items for a particular enquiry
router.get(
  "/quotation_items/enquiry/:enquiry_id",
  QuotationItemController.fetchQuotationItems
);

// Delete a quotation item
router.delete(
  "/quotation_items/:item_id",
  QuotationItemController.deleteQuotationItem
);

module.exports = router;
