const { Op } = require("sequelize");
const Quotation = require("../../models/quote/quote");

// Create a new quotation
const createQuotation = async (req, res) => {
  try {
    const {
      enquiry_id,
      followup_id,
      project_type,
      total_amount,
      gst,
      discount,
      adjustment,
      grand_total,
      quotation_date,
      quotation_time,
      booked_by,
      sales_executive,
      type,
      executive_id,
      number,
      exe_number,
    } = req.body;

    const newQuotation = await Quotation.create({
      enquiry_id,
      followup_id,
      project_type,
      total_amount,
      gst,
      discount,
      adjustment,
      grand_total,
      quotation_date,
      quotation_time,
      booked_by,
      sales_executive,
      type,
      executive_id,
      number,
      exe_number,
    });

    res.status(201).json({
      message: "Quotation created successfully",
      data: newQuotation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating quotation", error });
  }
};

// Edit a quotation
const editQuotation = async (req, res) => {
  try {
    const { quotation_id } = req.params;
    const {
      enquiry_id,
      followup_id,
      project_type,
      total_amount,
      gst,
      discount,
      adjustment,
      grand_total,
      quotation_date,
      quotation_time,
      booked_by,
      sales_executive,
      type,
      executive_id,
      number,
      exe_number,
    } = req.body;

    const quotation = await Quotation.findByPk(quotation_id);

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    await quotation.update({
      enquiry_id,
      followup_id,
      project_type,
      total_amount,
      gst,
      discount,
      adjustment,
      grand_total,
      quotation_date,
      quotation_time,
      booked_by,
      sales_executive,
      type,
      executive_id,
      number,
      exe_number,
    });

    res.status(200).json({
      message: "Quotation updated successfully",
      data: quotation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating quotation", error });
  }
};

// Fetch all quotations
const fetchQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.findAll();
    res.status(200).json({ data: quotations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching quotations", error });
  }
};

// Fetch a particular quotation by enquiry_id
const fetchQuotationByEnquiryId = async (req, res) => {
  try {
    const { enquiry_id } = req.params;

    const quotation = await Quotation.findAll({
      where: { enquiry_id },
    });

    if (!quotation || quotation.length === 0) {
      return res
        .status(404)
        .json({ message: "No quotations found for this enquiry" });
    }

    res.status(200).json({ data: quotation });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching quotation by enquiryId", error });
  }
};

// Delete a quotation
const deleteQuotation = async (req, res) => {
  try {
    const { quotation_id } = req.params;

    const quotation = await Quotation.findByPk(quotation_id);

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    await quotation.destroy();

    res.status(200).json({ message: "Quotation deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting quotation", error });
  }
};

module.exports = {
  createQuotation,
  editQuotation,
  fetchQuotations,
  fetchQuotationByEnquiryId,
  deleteQuotation,
};
