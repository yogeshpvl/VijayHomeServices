const QuotationItem = require("../../models/quote/quotationItem");

// Create a new quotation item
const createQuotationItem = async (req, res) => {
  try {
    const {
      enquiry_id,

      region,
      material,
      job,
      category,
      qty,
      rate,
      subtotal,
    } = req.body;

    const newQuotationItem = await QuotationItem.create({
      enquiry_id,

      region,
      material,
      job,
      category,
      qty,
      rate,
      subtotal,
    });

    res.status(201).json({
      message: "Quotation item created successfully",
      data: newQuotationItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating quotation item", error });
  }
};

// Edit a quotation item
const editQuotationItem = async (req, res) => {
  try {
    const { item_id } = req.params;
    const {
      enquiry_id,

      region,
      material,
      job,
      category,
      qty,
      rate,
      subtotal,
    } = req.body;

    const quotationItem = await QuotationItem.findByPk(item_id);

    if (!quotationItem) {
      return res.status(404).json({ message: "Quotation item not found" });
    }

    await quotationItem.update({
      enquiry_id,

      region,
      material,
      job,
      category,
      qty,
      rate,
      subtotal,
    });

    res.status(200).json({
      message: "Quotation item updated successfully",
      data: quotationItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating quotation item", error });
  }
};

// Fetch all items for a particular enquiry_id
const fetchQuotationItems = async (req, res) => {
  try {
    const { enquiry_id } = req.params;

    const items = await QuotationItem.findAll({
      where: { enquiry_id },
    });

    if (!items || items.length === 0) {
      return res
        .status(404)
        .json({ message: "No items found for this quotation" });
    }

    res.status(200).json({ data: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching quotation items", error });
  }
};

// Delete a quotation item
const deleteQuotationItem = async (req, res) => {
  try {
    const { item_id } = req.params;

    const quotationItem = await QuotationItem.findByPk(item_id);

    if (!quotationItem) {
      return res.status(404).json({ message: "Quotation item not found" });
    }

    await quotationItem.destroy();

    res.status(200).json({ message: "Quotation item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting quotation item", error });
  }
};

module.exports = {
  createQuotationItem,
  editQuotationItem,
  fetchQuotationItems,
  deleteQuotationItem,
};
