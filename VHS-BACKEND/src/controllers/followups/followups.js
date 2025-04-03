const Enquiry = require("../../models/enquiry/enquiry");
const Followup = require("../../models/followups/followups");
const { Op, Sequelize, QueryTypes } = require("sequelize");
const sequelize = require("../../config/database");
const moment = require("moment");

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
    const { from_date, end_date, response, category } = req.query;

    if (!from_date || !end_date || !response) {
      return res.status(400).json({
        message: "from_date, end_date, and response are required",
      });
    }

    // Add category filter conditionally
    const categoryFilter = category
      ? `AND LOWER(e."category") = LOWER(:category)`
      : "";

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
      INNER JOIN "enquiries" e ON f."enquiryId" = e."enquiryId"
      WHERE f."response" = :response
      ${categoryFilter}
      GROUP BY f."next_followup_date"
      ORDER BY f."next_followup_date" ASC;
    `;

    const replacements = {
      from_date,
      end_date,
      response,
    };

    if (category) {
      replacements.category = category;
    }

    const followupCounts = await Followup.sequelize.query(query, {
      replacements,
      type: Sequelize.QueryTypes.SELECT,
    });

    if (!followupCounts.length) {
      return res.json({
        followups: [],
        message: "No follow-ups found for the given period and filters",
      });
    }

    return res.json({ followups: followupCounts });
  } catch (error) {
    console.error("❌ Error fetching follow-up counts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCallLaterDateWiseFollowups = async (req, res) => {
  try {
    const { page = 1, limit = 25, search, date, category } = req.query;

    console.log("req.query", req.query);

    const offset = (page - 1) * limit;
    const filters = JSON.parse(search);

    if (!date) {
      return res
        .status(400)
        .json({ message: "❌ 'date' parameter is required" });
    }

    let filterConditions = ``;
    if (category) {
      filterConditions += ` AND LOWER(e."category") = LOWER(:category)`;
    }

    // Search filters
    let searchQuery = "";
    if (filters.name) {
      searchQuery += ` AND LOWER(e."name") LIKE LOWER('%${filters.name}%')`;
    }
    if (filters.mobile) {
      searchQuery += ` AND e."mobile" LIKE '%${filters.mobile}%'`;
    }
    if (filters.city) {
      searchQuery += ` AND LOWER(e."city") LIKE LOWER('%${filters.city}%')`;
    }

    const result = await sequelize.query(
      `
      SELECT 
        e.*,
        f.response AS followup_response,
        f.description AS followup_description,
        f.date AS followup_date,
        f.next_followup_date,
        f.staff AS followup_staff,
        f."createdAt" AS followup_createdAt
      FROM enquiries e
      JOIN (
        SELECT f1.*
        FROM followups f1
        INNER JOIN (
          SELECT "enquiryId", MAX("createdAt") AS max_created
          FROM followups
          WHERE response = 'Call Later'
          GROUP BY "enquiryId"
        ) f2 ON f1."enquiryId" = f2."enquiryId" AND f1."createdAt" = f2.max_created
        WHERE f1."next_followup_date" = :date
      ) f ON f."enquiryId" = e."enquiryId"
      WHERE 1=1
      ${filterConditions}
      ${searchQuery}
      ORDER BY f."createdAt" DESC
      LIMIT :limit OFFSET :offset
      `,
      {
        replacements: {
          limit,
          offset,
          date,
          category,
        },
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json({ data: result });
  } catch (error) {
    console.error("❌ Error in getCallLaterDateWiseFollowups:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getSurveyDateWiseFollowups = async (req, res) => {
  try {
    const { page = 1, limit = 25, search, date, category } = req.query;

    console.log("req.query", req.query);

    const offset = (page - 1) * limit;
    const filters = JSON.parse(search);

    if (!date) {
      return res
        .status(400)
        .json({ message: "❌ 'date' parameter is required" });
    }

    let filterConditions = ``;
    if (category) {
      filterConditions += ` AND LOWER(e."category") = LOWER(:category)`;
    }

    // Search filters
    let searchQuery = "";
    if (filters.name) {
      searchQuery += ` AND LOWER(e."name") LIKE LOWER('%${filters.name}%')`;
    }
    if (filters.mobile) {
      searchQuery += ` AND e."mobile" LIKE '%${filters.mobile}%'`;
    }
    if (filters.city) {
      searchQuery += ` AND LOWER(e."city") LIKE LOWER('%${filters.city}%')`;
    }

    const result = await sequelize.query(
      `
      SELECT 
        e.*,
        f.response AS followup_response,
         f."followupId" AS followup_id,
        f.description AS followup_description,
        f.date AS followup_date,
        f.next_followup_date,
        f.staff AS followup_staff,
  f.appo_date AS followup_appo_date,
  f.next_followup_date AS followup_next_followup_date,

  f.appo_time AS followup_appo_time,
  f.executive_name AS followup_executive_name,
  f.executive_id AS followup_executive_id,
  f.status AS followup_status,
    f.creason AS followup_creason,
  f.appo_time AS followup_appo_time,
        f."createdAt" AS followup_createdAt
      FROM enquiries e
      JOIN (
        SELECT f1.*
        FROM followups f1
        INNER JOIN (
          SELECT "enquiryId", MAX("createdAt") AS max_created
          FROM followups
          WHERE response = 'Survey'
          GROUP BY "enquiryId"
        ) f2 ON f1."enquiryId" = f2."enquiryId" AND f1."createdAt" = f2.max_created
        WHERE f1."next_followup_date" = :date
      ) f ON f."enquiryId" = e."enquiryId"
      WHERE 1=1
      ${filterConditions}
      ${searchQuery}
      ORDER BY f."createdAt" DESC
      LIMIT :limit OFFSET :offset
      `,
      {
        replacements: {
          limit,
          offset,
          date,
          category,
        },
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json({ data: result });
  } catch (error) {
    console.error("❌ Error in getCallLaterDateWiseFollowups:", error);
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

// exports.getCallLaterFollowups = async (req, res) => {
//   try {
//     const { page = 1, limit = 20, search = "{}", dateRange = "" } = req.query;

//     const offset = (page - 1) * limit;
//     const filters = JSON.parse(search);

//     // Dynamic Date Logic
//     const today = moment().format("YYYY-MM-DD");
//     const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
//     const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

//     const thisWeek = [
//       moment().startOf("week").format("YYYY-MM-DD"),
//       moment().endOf("week").format("YYYY-MM-DD"),
//     ];

//     const lastWeek = [
//       moment().subtract(1, "weeks").startOf("week").format("YYYY-MM-DD"),
//       moment().subtract(1, "weeks").endOf("week").format("YYYY-MM-DD"),
//     ];

//     const thisMonth = [
//       moment().startOf("month").format("YYYY-MM-DD"),
//       moment().endOf("month").format("YYYY-MM-DD"),
//     ];

//     let dateFilter = "";

//     switch (dateRange) {
//       case "today":
//         dateFilter = `AND f."next_followup_date" = '${today}'`;
//         break;
//       case "tomorrow":
//         dateFilter = `AND f."next_followup_date" = '${tomorrow}'`;
//         break;
//       case "yesterday":
//         dateFilter = `AND f."next_followup_date" = '${yesterday}'`;
//         break;
//       case "this_week":
//         dateFilter = `AND f."next_followup_date" BETWEEN '${thisWeek[0]}' AND '${thisWeek[1]}'`;
//         break;
//       case "last_week":
//         dateFilter = `AND f."next_followup_date" BETWEEN '${lastWeek[0]}' AND '${lastWeek[1]}'`;
//         break;
//       case "this_month":
//         dateFilter = `AND f."next_followup_date" BETWEEN '${thisMonth[0]}' AND '${thisMonth[1]}'`;
//         break;
//     }

//     // Dynamic search filters
//     let searchQuery = "";
//     if (filters.name) {
//       searchQuery += ` AND LOWER(e.name) LIKE LOWER('%${filters.name}%')`;
//     }
//     if (filters.mobile) {
//       searchQuery += ` AND e.mobile LIKE '%${filters.mobile}%'`;
//     }
//     if (filters.city) {
//       searchQuery += ` AND LOWER(e.city) LIKE LOWER('%${filters.city}%')`;
//     }
//     if (filters.response) {
//       searchQuery += ` AND LOWER(f.response) = LOWER('${filters.response}')`;
//     }

//     const results = await sequelize.query(
//       `
//       SELECT
//         e.*,
//         f.response AS followup_response,
//         f.description AS followup_description,
//         f.date AS followup_date,
//         f.next_followup_date,
//         f.staff,
//         f."createdAt" AS followup_createdAt
//       FROM enquiries e
//       JOIN (
//         SELECT f1.*
//         FROM followups f1
//         INNER JOIN (
//           SELECT "enquiryId", MAX("createdAt") AS max_created
//           FROM followups
//           GROUP BY "enquiryId"
//         ) f2 ON f1."enquiryId" = f2."enquiryId" AND f1."createdAt" = f2.max_created
//         WHERE f1.response = 'Call Later'
//       ) f ON f."enquiryId" = e."enquiryId"
//       WHERE 1=1
//       ${searchQuery}
//       ${dateFilter}
//       ORDER BY f."createdAt" DESC
//       LIMIT :limit OFFSET :offset
//       `,
//       {
//         replacements: { limit, offset },
//         type: QueryTypes.SELECT,
//       }
//     );

//     res.status(200).json({ data: results });
//   } catch (error) {
//     console.error("Error fetching Call Later followups:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getFollowupsByResponse = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "{}",
      dateRange = "",
      responseType = "Call Later", // ✅ Default
    } = req.query;

    const offset = (page - 1) * limit;
    const filters = JSON.parse(search);

    // Date Ranges
    const today = moment().format("YYYY-MM-DD");
    const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

    const thisWeek = [
      moment().startOf("week").format("YYYY-MM-DD"),
      moment().endOf("week").format("YYYY-MM-DD"),
    ];

    const lastWeek = [
      moment().subtract(1, "weeks").startOf("week").format("YYYY-MM-DD"),
      moment().subtract(1, "weeks").endOf("week").format("YYYY-MM-DD"),
    ];

    const thisMonth = [
      moment().startOf("month").format("YYYY-MM-DD"),
      moment().endOf("month").format("YYYY-MM-DD"),
    ];

    let dateFilter = "";
    switch (dateRange) {
      case "today":
        dateFilter = `AND f."next_followup_date" = '${today}'`;
        break;
      case "tomorrow":
        dateFilter = `AND f."next_followup_date" = '${tomorrow}'`;
        break;
      case "yesterday":
        dateFilter = `AND f."next_followup_date" = '${yesterday}'`;
        break;
      case "this_week":
        dateFilter = `AND f."next_followup_date" BETWEEN '${thisWeek[0]}' AND '${thisWeek[1]}'`;
        break;
      case "last_week":
        dateFilter = `AND f."next_followup_date" BETWEEN '${lastWeek[0]}' AND '${lastWeek[1]}'`;
        break;
      case "this_month":
        dateFilter = `AND f."next_followup_date" BETWEEN '${thisMonth[0]}' AND '${thisMonth[1]}'`;
        break;
    }

    // Search filters
    let searchQuery = "";
    if (filters.name) {
      searchQuery += ` AND LOWER(e.name) LIKE LOWER('%${filters.name}%')`;
    }
    if (filters.mobile) {
      searchQuery += ` AND e.mobile LIKE '%${filters.mobile}%'`;
    }
    if (filters.city) {
      searchQuery += ` AND LOWER(e.city) LIKE LOWER('%${filters.city}%')`;
    }
    if (filters.response) {
      searchQuery += ` AND LOWER(f.response) = LOWER('${filters.response}')`;
    }

    const results = await sequelize.query(
      `
      SELECT 
        e.*,
        f.response AS followup_response,
        f.description AS followup_description,
        f.date AS followup_date,
        f.next_followup_date,
        f.staff,
        f."createdAt" AS followup_createdAt
      FROM enquiries e
      JOIN (
        SELECT f1.*
        FROM followups f1
        INNER JOIN (
          SELECT "enquiryId", MAX("createdAt") AS max_created
          FROM followups
          GROUP BY "enquiryId"
        ) f2 ON f1."enquiryId" = f2."enquiryId" AND f1."createdAt" = f2.max_created
        WHERE f1.response = :responseType
      ) f ON f."enquiryId" = e."enquiryId"
      WHERE 1=1
      ${searchQuery}
      ${dateFilter}
      ORDER BY f."createdAt" DESC
      LIMIT :limit OFFSET :offset
      `,
      {
        replacements: { limit, offset, responseType },
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json({ data: results });
  } catch (error) {
    console.error("Error fetching followups:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateFollowupAppointment = async (req, res) => {
  try {
    const { followupId } = req.params;
    const {
      next_followup_date,
      appo_time,
      executive_name,
      executive_id,
      status = "ASSIGNED FOR SURVEY",
    } = req.body;

    const followup = await Followup.findByPk(followupId);

    if (!followup) {
      return res.status(404).json({ message: "❌ Followup not found" });
    }

    await followup.update({
      next_followup_date,
      appo_time,
      executive_name,
      executive_id,
      status,
    });

    res
      .status(200)
      .json({ message: "✅ Followup updated successfully", followup });
  } catch (error) {
    console.error("❌ Error updating followup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateFollowupSurveyCancel = async (req, res) => {
  try {
    const { followupId } = req.params;
    const { creason, status = "CANCEL" } = req.body;

    const followup = await Followup.findByPk(followupId);

    if (!followup) {
      return res.status(404).json({ message: "❌ Followup not found" });
    }

    await followup.update({
      creason,
      status,
    });

    res.status(200).json({ message: "✅ Followup cancelled successfully" });
  } catch (error) {
    console.error("❌ Error updating followup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
