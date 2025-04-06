// const Enquiry = require("../../models/enquiry/enquiry");
// const QuoteFollowup = require("../../models/quote/quoteFollowup");
const db = require("../../models");
const { Op, Sequelize } = require("sequelize");
const { Quotation, Enquiry, QuoteFollowup } = db;

exports.fetchConfirmedFollowups = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 25,
      category,
      city,
      name,
      mobile,
      service,
      executive,
    } = req.query;

    const offset = (page - 1) * limit;

    // Filter conditions for the Enquiry table
    const enquiryFilter = {};
    if (category) enquiryFilter.category = category;
    if (city) enquiryFilter.city = city;
    if (name) enquiryFilter.name = { [Op.iLike]: `%${name}%` };
    if (mobile) enquiryFilter.mobile = { [Op.iLike]: `%${mobile}%` };
    if (service) enquiryFilter.interested_for = { [Op.iLike]: `%${service}%` };
    if (executive) enquiryFilter.executive = { [Op.iLike]: `%${executive}%` };

    const { rows, count } = await QuoteFollowup.findAndCountAll({
      where: { response: "Confirmed" },
      include: [
        {
          model: Enquiry,
          as: "enquiry",
          where: enquiryFilter,
          include: [
            {
              model: Quotation,
              as: "quotations",
            },
          ],
        },
      ],
      limit: Number(limit),
      offset: Number(offset),
      order: [["foll_date", "DESC"]],
    });

    res.status(200).json({
      data: rows,
      totalCount: count,
    });
  } catch (error) {
    console.error("Error fetching confirmed followups:", error);
    res.status(500).json({
      message: "Failed to fetch confirmed followups",
      error,
    });
  }
};

// FETCH followups where latest response is 'Call Later' or 'Not interested'
exports.fetchLatestCallFollowups = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 25,
      category,
      city,
      name,
      mobile,
      service,
      executive,
      dateFilter, // today, tomorrow, thisweek, etc.
    } = req.query;

    const offset = (page - 1) * limit;

    const enquiryFilter = {};
    if (category) enquiryFilter.category = category;
    if (city) enquiryFilter.city = city;
    if (name) enquiryFilter.name = { [Op.iLike]: `%${name}%` };
    if (mobile) enquiryFilter.mobile = { [Op.iLike]: `%${mobile}%` };
    if (service) enquiryFilter.interested_for = { [Op.iLike]: `%${service}%` };
    if (executive) enquiryFilter.executive = { [Op.iLike]: `%${executive}%` };

    // Subquery: get latest followup ID per enquiry
    const latestFollowupSubquery = Sequelize.literal(`(
      SELECT MAX(id)
      FROM quote_followups AS qf2
      WHERE qf2.enquiryId = quote_followup.enquiryId
    )`);

    // Date condition for 'call later' schedule
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));

    let dateWhere = {};
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const addDays = (d, days) =>
      new Date(new Date(d).setDate(d.getDate() + days));

    switch (dateFilter) {
      case "today":
        dateWhere.foll_date = Sequelize.where(
          Sequelize.fn("DATE", Sequelize.col("foll_date")),
          new Date().toISOString().split("T")[0]
        );
        break;
      case "tomorrow":
        dateWhere.foll_date = Sequelize.where(
          Sequelize.fn("DATE", Sequelize.col("foll_date")),
          tomorrow.toISOString().split("T")[0]
        );
        break;
      case "thisweek":
        dateWhere.foll_date = {
          [Op.between]: [
            startOfWeek.toISOString().split("T")[0],
            endOfWeek.toISOString().split("T")[0],
          ],
        };
        break;
      case "lastweek":
        const lastWeekStart = addDays(startOfWeek, -7);
        const lastWeekEnd = addDays(startOfWeek, -1);
        dateWhere.foll_date = {
          [Op.between]: [
            lastWeekStart.toISOString().split("T")[0],
            lastWeekEnd.toISOString().split("T")[0],
          ],
        };
        break;
      case "nextweek":
        const nextWeekStart = addDays(endOfWeek, 1);
        const nextWeekEnd = addDays(endOfWeek, 7);
        dateWhere.foll_date = {
          [Op.between]: [
            nextWeekStart.toISOString().split("T")[0],
            nextWeekEnd.toISOString().split("T")[0],
          ],
        };
        break;
      case "thismonth":
        const startOfMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        );
        const endOfMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        );
        dateWhere.foll_date = {
          [Op.between]: [
            startOfMonth.toISOString().split("T")[0],
            endOfMonth.toISOString().split("T")[0],
          ],
        };
        break;
      default:
        break;
    }

    const { rows, count } = await QuoteFollowup.findAndCountAll({
      where: {
        response: { [Op.in]: ["Call Later", "Not interested"] },
        [Op.and]: [
          Sequelize.literal(`
            "QuoteFollowup"."id" = (
              SELECT MAX(qf2.id)
              FROM quote_followups AS qf2
              WHERE qf2.enquiry_id = "QuoteFollowup".enquiry_id
            )
          `),
          dateFilterClause && Sequelize.literal(dateFilterClause),
        ].filter(Boolean),
      },
      include: [
        {
          model: Enquiry,
          as: "enquiry",
          where: enquiryFilter,
          include: [
            {
              model: Quotation,
              as: "quotations",
            },
          ],
        },
      ],
      limit: Number(limit),
      offset: Number(offset),
      order: [["foll_date", "DESC"]],
    });

    res.status(200).json({
      data: rows,
      totalCount: count,
    });
  } catch (error) {
    console.error("Error fetching call later/not interested followups:", error);
    res.status(500).json({
      message: "Failed to fetch data",
      error,
    });
  }
};

exports.createFollowup = async (req, res) => {
  try {
    const { enquiryId, response } = req.body;

    // First create the followup
    const followup = await QuoteFollowup.create(req.body);

    // If response is "Confirmed", update the quotation type
    if (response === "Confirmed") {
      await Quotation.update(
        { type: "CONFIRMED" },
        { where: { enquiry_id: enquiryId } } // use `enquiry_id` if DB column is snake_case
      );
    }

    res.status(201).json(followup);
  } catch (err) {
    console.log("err", err);
    res
      .status(500)
      .json({ error: "Failed to create quote followup", details: err });
  }
};

exports.getAllFollowups = async (req, res) => {
  try {
    const { enquiry_id } = req.params;

    const followups = await QuoteFollowup.findAll({
      where: { enquiry_id: enquiry_id },
      order: [["foll_date", "DESC"]], // optional: sorts recent first
    });

    res.status(200).json(followups);
  } catch (err) {
    console.error("Error fetching followups:", err);
    res.status(500).json({ error: "Failed to fetch followups" });
  }
};

exports.getFollowupById = async (req, res) => {
  try {
    const followup = await QuoteFollowup.findByPk(req.params.id);
    if (!followup)
      return res.status(404).json({ message: "Followup not found" });
    res.status(200).json(followup);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch followup" });
  }
};

exports.updateFollowup = async (req, res) => {
  try {
    await QuoteFollowup.update(req.body, { where: { id: req.params.id } });
    res.status(200).json({ message: "Followup updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update followup" });
  }
};

exports.deleteFollowup = async (req, res) => {
  try {
    await QuoteFollowup.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Followup deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete followup" });
  }
};
