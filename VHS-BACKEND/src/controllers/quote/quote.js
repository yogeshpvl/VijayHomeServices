// const Quotation = require("../../models/quote/quote");
const followups = require("../../models/followups/followups");
const moment = require("moment");
const db = require("../../models");
const { Quotation, Enquiry, QuoteFollowup, QuotationItem } = db;
const { Op, Sequelize } = require("sequelize");
const ExcelJS = require("exceljs");

// Create a new quotation
const updateOrCreateQuotation = async (req, res) => {
  try {
    const enquiryId = req.params.id;
    const {
      project_type,
      total,
      gst,
      adjustments,
      sum,
      netTotal,
      followupId,
      booked_by,
      executive_id,
      exe_number,
      number,
      sales_executive,
    } = req.body;

    const existing = await Quotation.findOne({ where: { enquiryId } });
    await followups.update(
      { status: "QUOTE GENERATED" },
      { where: { followupId } }
    );

    const now = moment();
    const payload = {
      enquiryId,
      project_type: project_type || "NA",
      total_amount: sum || 0,
      gst: gst === "YES" ? 5 : 0,
      discount: 0,
      adjustment: adjustments || 0,
      grand_total: netTotal || 0,
      quotation_date: now.format("YYYY-MM-DD"),
      quotation_time: now.format("HH:mm:ss"),
      booked_by,
      sales_executive,
      type: "NOT SHARED",
      executive_id: executive_id || 0,
      number: number || "N/A",
      exe_number: exe_number || "N/A",
    };

    let quotation;
    if (existing) {
      await Quotation.update(payload, { where: { enquiryId } });
      quotation = await Quotation.findOne({ where: { enquiryId } });
    } else {
      quotation = await Quotation.create(payload);
    }

    res.status(200).json({
      message: existing
        ? "Quotation updated successfully"
        : "Quotation created successfully",
      data: quotation,
    });
  } catch (error) {
    console.error("Error in updateOrCreateQuotation:", error);
    res.status(500).json({ message: "Internal server error", error });
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

const updateAdvQuotation = async (req, res) => {
  try {
    const { quotation_id } = req.params;
    const { adv_payment_date, adv_payment_mode, adv_amount, adv_comment } =
      req.body;

    const quotation = await Quotation.findByPk(quotation_id);

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    await quotation.update({
      adv_payment_date,
      adv_amount,
      adv_comment,
      adv_payment_mode,
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

const fetchQuotations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 25,
      category,
      city,
      type,
      name,
      mobile,
      service,
      executive,
      booked_by,
    } = req.query;

    const offset = (page - 1) * limit;

    const enquiryFilter = {};
    if (category) enquiryFilter.category = category;
    if (city) enquiryFilter.city = city;
    if (name) enquiryFilter.name = { [Op.iLike]: `%${name}%` };
    if (mobile) enquiryFilter.mobile = { [Op.iLike]: `%${mobile}%` };
    if (service) enquiryFilter.interested_for = { [Op.iLike]: `%${service}%` };
    if (executive) enquiryFilter.executive = { [Op.iLike]: `%${executive}%` };

    const quotationFilter = {};
    if (type) quotationFilter.type = type;
    if (booked_by) quotationFilter.booked_by = { [Op.iLike]: `%${booked_by}%` };

    const { rows, count } = await Quotation.findAndCountAll({
      include: [
        {
          model: Enquiry,
          as: "enquiry",
          where: enquiryFilter,
        },
        {
          model: QuoteFollowup,
          as: "QuoteFollowups",
          separate: true,
          limit: 1,
          order: [["id", "DESC"]],
        },
      ],
      where: quotationFilter,
      limit: Number(limit),
      offset: Number(offset),
      order: [["quotation_date", "DESC"]],
    });

    // Filter out any rows where the latest QuoteFollowup has response === "Confirmed"
    const filteredRows = rows.filter(
      (q) =>
        !q.QuoteFollowups?.[0] ||
        q.QuoteFollowups?.[0]?.response !== "Confirmed"
    );

    res.status(200).json({
      data: filteredRows,
      totalCount: filteredRows.length, // Update this if pagination is critical
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Error fetching quotations", error });
  }
};

const ExecutiveQuotations = async (req, res) => {
  try {
    const { executive_id } = req.query;

    const rows = await Quotation.findAll({
      where: {
        executive_id,
      },
      include: [
        {
          model: Enquiry,
          as: "enquiry",
        },
        {
          model: QuoteFollowup,
          as: "QuoteFollowups",
          separate: true,
          order: [["id", "DESC"]],
        },
      ],
      order: [["quotation_date", "DESC"]],
    });

    res.status(200).json({
      data: rows,
    });
  } catch (error) {
    console.error("ERROR:", error);
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

// Fetch a particular quotation by enquiry_id
const fetchQuotationByEnquiryIdForPM = async (req, res) => {
  try {
    const { enquiry_id } = req.params;

    const quotation = await Quotation.findAll({
      where: { enquiry_id },
      attributes: [
        "quotation_id",
        "sales_executive",
        "executive_id",
        "exe_number",
        "booked_by",
        "grand_total",
      ],
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

const sendquoteinwhatsapp = async (req, res) => {
  try {
    const { followup_id, enquiry_id } = req.params;

    console.log("followup_id, enquiry_id", followup_id, enquiry_id);
    // Update followup status
    // const [followupUpdated] = await followups.update(
    //   { status: "QUOTE SHARED" },
    //   { where: { followupId: followup_id } }
    // );

    // Update quotation status
    const [quotationUpdated] = await Quotation.update(
      { type: "QUOTE SHARED" },
      { where: { enquiryId: enquiry_id } }
    );

    if (quotationUpdated === 0) {
      return res.status(404).json({
        message: "Follow-up and Quotation not found or already updated",
      });
    }

    res.status(200).json({ message: "Quote status updated successfully" });
  } catch (error) {
    console.error("Error updating quote status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchQuotationswithItems = async (req, res) => {
  try {
    const { enquiryId } = req.query;

    if (!enquiryId) {
      return res.status(400).json({ message: "Missing enquiryId" });
    }

    const quotations = await Quotation.findAll({
      where: {
        enquiryId: Number(enquiryId), // 👈 this filters correctly
      },
      include: [
        {
          model: Enquiry,
          as: "enquiry",
          attributes: ["name", "mobile", "email", "address"],
        },
        {
          model: QuotationItem,
          as: "quotationItems",
        },
      ],
    });

    if (!quotations.length) {
      return res.status(404).json({ message: "No data found" });
    }

    res.status(200).json({ data: quotations });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Error fetching quotations", error });
  }
};

const fetchQuotationsReport = async (req, res) => {
  try {
    const {
      fromdate,
      todate,
      page = 1,
      limit = 25,
      category,
      city,
      type,
      name,
      mobile,
      service,
      executive,
      booked_by,
    } = req.query;
    console.log("executive", executive);

    const offset = (page - 1) * limit;

    const enquiryFilter = {};
    if (category) enquiryFilter.category = category;
    if (city) enquiryFilter.city = city;
    if (name) enquiryFilter.name = { [Op.iLike]: `%${name}%` };
    if (mobile) enquiryFilter.mobile = { [Op.iLike]: `%${mobile}%` };
    if (service) enquiryFilter.interested_for = { [Op.iLike]: `%${service}%` };
    if (executive) enquiryFilter.executive = { [Op.iLike]: `%${executive}%` };

    const quotationFilter = {};
    if (type) quotationFilter.type = type;
    if (booked_by) quotationFilter.booked_by = { [Op.iLike]: `%${booked_by}%` };

    // Add date range filters if fromdate and todate are provided
    if (fromdate && todate) {
      quotationFilter.quotation_date = {
        [Op.between]: [new Date(fromdate), new Date(todate)],
      };
    }

    // Fetch quotations with the applied filters
    const { rows, count } = await Quotation.findAndCountAll({
      include: [
        {
          model: Enquiry,
          as: "enquiry",
          where: enquiryFilter,
        },
        {
          model: QuoteFollowup,
          as: "QuoteFollowups",
          separate: true,
          limit: 1,
          order: [["id", "DESC"]],
        },
      ],
      where: quotationFilter,
      limit: Number(limit),
      offset: Number(offset),
      order: [["quotation_date", "DESC"]],
    });

    res.status(200).json({
      data: rows,
      totalCount: count, // Use the total count of filtered records for pagination
      totalPages: Math.ceil(count / limit), // Calculate total pages
      currentPage: page,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Error fetching quotations", error });
  }
};

const fetchQuotationsReportDownload = async (req, res) => {
  try {
    const {
      fromdate,
      todate,
      category,
      city,
      type,
      name,
      mobile,
      service,
      executive,
      booked_by,
    } = req.query;

    const enquiryFilter = {};
    if (category) enquiryFilter.category = category;
    if (city) enquiryFilter.city = city;
    if (name) enquiryFilter.name = { [Op.iLike]: `%${name}%` };
    if (mobile) enquiryFilter.mobile = { [Op.iLike]: `%${mobile}%` };
    if (service) enquiryFilter.interested_for = { [Op.iLike]: `%${service}%` };
    if (executive) enquiryFilter.executive = { [Op.iLike]: `%${executive}%` };

    const quotationFilter = {};
    if (type) quotationFilter.type = type;
    if (booked_by) quotationFilter.booked_by = { [Op.iLike]: `%${booked_by}%` };

    // Add date range filters if fromdate and todate are provided
    if (fromdate && todate) {
      quotationFilter.quotation_date = {
        [Op.between]: [new Date(fromdate), new Date(todate)],
      };
    }

    // Fetch quotations with the applied filters
    const { rows } = await Quotation.findAndCountAll({
      include: [
        {
          model: Enquiry,
          as: "enquiry",
          where: enquiryFilter,
        },
        {
          model: QuoteFollowup,
          as: "QuoteFollowups",
          separate: true,
          limit: 1,
          order: [["id", "DESC"]],
        },
      ],
      where: quotationFilter,
      order: [["quotation_date", "DESC"]],
    });

    // Create Excel file using ExcelJS
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Quotations Report");

    // Define the columns for the Excel sheet
    sheet.columns = [
      { header: "Quotation ID", key: "quotation_id", width: 20 },
      { header: "Name", key: "name", width: 25 },
      { header: "Mobile", key: "mobile", width: 20 },
      { header: "Category", key: "category", width: 15 },
      { header: "City", key: "city", width: 15 },
      { header: "Executive", key: "executive", width: 20 },
      { header: "Service", key: "interested_for", width: 20 },
      { header: "Booked By", key: "booked_by", width: 20 },
      { header: "Quotation Date", key: "quotation_date", width: 20 },
      { header: "Quote Amount", key: "quote_amount", width: 20 },
      { header: "Follow-up Response", key: "followup_response", width: 25 },
      { header: "Next Follow-up Date", key: "next_followup_date", width: 20 },
      { header: "Type", key: "type", width: 20 },
    ];

    // Add rows to the Excel sheet
    rows.forEach((item) => {
      sheet.addRow({
        quotation_id: item.quotation_id,
        name: item.enquiry?.name,
        mobile: item.enquiry?.mobile,
        category: item.enquiry?.category,
        city: item.enquiry?.city,
        executive: item.enquiry?.executive,
        interested_for: item.enquiry?.interested_for,
        booked_by: item.booked_by,
        quotation_date: item.quotation_date,
        quote_amount: item.grand_total,
        followup_response: item.QuoteFollowups[0]?.response || "",
        next_followup_date: item.QuoteFollowups[0]?.nxtfoll || "",
        type: item.type || "",
      });
    });

    // Set headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Quotations_Report_${fromdate}_to_${todate}.xlsx`
    );

    // Write the Excel file and end the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error in fetchQuotationsReportDownload:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateOrCreateQuotation,
  editQuotation,
  fetchQuotations,
  fetchQuotationByEnquiryId,
  deleteQuotation,
  sendquoteinwhatsapp,
  fetchQuotationswithItems,
  fetchQuotationsReport,
  fetchQuotationsReportDownload,
  ExecutiveQuotations,
  updateAdvQuotation,
  fetchQuotationByEnquiryIdForPM,
};
