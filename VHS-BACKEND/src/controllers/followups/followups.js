const Enquiry = require("../../models/enquiry/enquiry");
const Followup = require("../../models/followups/followups");
const { Op, Sequelize } = require("sequelize");
const db = require("../../config/database"); // Import your Sequelize instance

exports.getLatestFollowupsByDateAndResponse = async (req, res) => {
  try {
    const { next_followup_date, response } = req.query;
    if (!next_followup_date || !response) {
      return res
        .status(400)
        .json({ message: "next_followup_date and response are required" });
    }

    const query = `
      SELECT DISTINCT ON (f."enquiryId") f.*
      FROM "followups" f
      WHERE f."next_followup_date" = :next_followup_date
      ORDER BY f."enquiryId", f."createdAt" DESC;
    `;

    const latestFollowups = await Followup.sequelize.query(query, {
      replacements: { next_followup_date },
      type: Sequelize.QueryTypes.SELECT,
    });

    // Filter only those follow-ups where the latest one matches the response
    const filteredFollowups = latestFollowups.filter(
      (followup) => followup.response === response
    );

    if (!filteredFollowups.length) {
      return res.status(404).json({ message: "No latest follow-ups found" });
    }

    return res.json({ followups: filteredFollowups });
  } catch (error) {
    console.error("❌ Error fetching latest follow-ups:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getMonthlyFollowupsByDateAndResponse = async (req, res) => {
  try {
    const { from_date, end_date, response } = req.query;

    if (!from_date || !end_date || !response) {
      return res
        .status(400)
        .json({ message: "from_date, end_date, and response are required" });
    }

    const query = `
      SELECT f.*
      FROM "followups" f
      INNER JOIN (
       
        SELECT "enquiryId", MAX("createdAt") as max_createdAt
        FROM "followups"
        WHERE "next_followup_date" BETWEEN :from_date AND :end_date
        GROUP BY "enquiryId"
      ) latest ON f."enquiryId" = latest."enquiryId" AND f."createdAt" = latest.max_createdAt
      WHERE f."response" = :response 
      ORDER BY f."enquiryId";
    `;

    const latestFollowups = await Followup.sequelize.query(query, {
      replacements: { from_date, end_date, response },
      type: Sequelize.QueryTypes.SELECT,
    });

    if (!latestFollowups.length) {
      return res
        .status(404)
        .json({ message: "No follow-ups found for the given period" });
    }

    return res.json({ followups: latestFollowups });
  } catch (error) {
    console.error("❌ Error fetching follow-ups:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getMonthlyFollowupCountsByDateAndResponse = async (req, res) => {
  try {
    const { from_date, end_date, response } = req.query;

    if (!from_date || !end_date || !response) {
      return res
        .status(400)
        .json({ message: "from_date, end_date, and response are required" });
    }

    const query = `
      SELECT f."next_followup_date", COUNT(*) as count
      FROM "followups" f
      INNER JOIN (
        SELECT "enquiryId", MAX("createdAt") as max_createdAt
        FROM "followups"
        WHERE "next_followup_date" BETWEEN :from_date AND :end_date
        GROUP BY "enquiryId"
      ) latest 
      ON f."enquiryId" = latest."enquiryId" 
      AND f."createdAt" = latest.max_createdAt
      WHERE f."response" = :response 
      GROUP BY f."next_followup_date"
      ORDER BY f."next_followup_date" ASC;
    `;

    const followupCounts = await Followup.sequelize.query(query, {
      replacements: { from_date, end_date, response },
      type: Sequelize.QueryTypes.SELECT,
    });

    if (!followupCounts.length) {
      return res
        .status(404)
        .json({ message: "No follow-ups found for the given period" });
    }

    return res.json({ followups: followupCounts });
  } catch (error) {
    console.error("❌ Error fetching follow-up counts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createFollowup = async (req, res) => {
  try {
    const {
      enquiryId,
      staff,
      response,
      description,
      value,
      color,
      category,
      city,
      next_followup_date,
    } = req.body;

    console.log("  categorycity", category, city);
    // If next_followup_date is not provided, set it to the current date
    const followUpDate = next_followup_date || new Date().toISOString();

    // ✅ Validate input
    if (!enquiryId || !staff || !response) {
      return res.status(400).json({
        error: "Missing required fields (enquiryId, staff, response)",
      });
    }

    // ✅ Create a new follow-up entry
    const newFollowup = await Followup.create({
      enquiryId,
      staff,
      response,
      description,
      value,
      color,
      category,
      city,
      next_followup_date: followUpDate,
    });

    return res.status(201).json({
      message: "Follow-up created successfully",
      followup: newFollowup,
    });
  } catch (error) {
    console.error("❌ Error creating follow-up:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ 1️⃣ Get Next Follow-up Date and Response-wise Follow-ups
exports.getNextFollowups = async (req, res) => {
  try {
    const { next_followup_date, response } = req.query;

    const followups = await Followup.findAll({
      where: {
        next_followup_date: next_followup_date
          ? { [Op.eq]: next_followup_date }
          : { [Op.ne]: null },
        response: response ? { [Op.eq]: response } : { [Op.ne]: null },
      },
      order: [["next_followup_date", "ASC"]],
    });

    return res.json({ followups });
  } catch (error) {
    console.error("❌ Error fetching next follow-ups:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ 2️⃣ Get Follow-ups Response-wise
exports.getFollowupsByResponse = async (req, res) => {
  try {
    const { response } = req.params;

    const followups = await Followup.findAll({
      where: {
        response,
      },
      order: [["date", "DESC"]],
    });

    return res.json({ followups });
  } catch (error) {
    console.error("❌ Error fetching follow-ups by response:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ 3️⃣ Get Follow-ups within a Date Range (Based on Next Follow-up Date)
exports.getFollowupsByDateRange = async (req, res) => {
  try {
    const { start_date, end_date, response } = req.query; // Pass date range and response filter

    const followups = await Followup.findAll({
      where: {
        next_followup_date: {
          [Op.between]: [start_date, end_date],
        },
        ...(response && { response }),
      },
      attributes: [
        "next_followup_date",
        "response",
        [Sequelize.fn("COUNT", Sequelize.col("followupId")), "count"],
      ],
      group: ["next_followup_date", "response"],
      order: [["next_followup_date", "ASC"]],
    });

    return res.json({ followups });
  } catch (error) {
    console.error("❌ Error fetching follow-ups by date range:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ 4️⃣ Get Follow-ups by Enquiry ID
exports.getFollowupsByenquiryId = async (req, res) => {
  try {
    const { enquiryId } = req.params; // Example: /api/followups/enquiry/18927

    const followups = await Followup.findAll({
      where: {
        enquiryId,
      },
      order: [["date", "DESC"]],
    });

    return res.json({ followups });
  } catch (error) {
    console.error("❌ Error fetching follow-ups by enquiry ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
