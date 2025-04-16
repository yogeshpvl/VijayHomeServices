const Enquiry = require("../../models/enquiry/enquiry");
const Followup = require("../../models/followups/followups");
const { Op, Sequelize, QueryTypes, fn, col, where } = require("sequelize");
const sequelize = require("../../config/database");
const moment = require("moment");
const ExcelJS = require("exceljs");

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

exports.getcancelledSurveys = async (req, res) => {
  try {
    const { page = 1, limit = 25, search } = req.query;
    const offset = (page - 1) * limit;
    const filters = JSON.parse(search);
    let filterConditions = ``;

    // Adding status filter for "CANCEL"
    const status = "CANCEL";
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
       
      ) f ON f."enquiryId" = e."enquiryId"
      WHERE 1=1
        AND f.status = :status  -- Ensure only "CANCEL" status is considered
        ${filterConditions}
        ${searchQuery}
      ORDER BY f."createdAt" DESC
      LIMIT :limit OFFSET :offset
      `,
      {
        replacements: {
          limit,
          offset,

          status, // Passing the CANCEL status filter
        },
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).json({ data: result });
  } catch (error) {
    console.error("❌ Error in getCancelledSurveys:", error);
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

    const followUpDate = next_followup_date || new Date().toISOString();

    // ✅ Default values for missing fields
    const safeStaff = staff || "N/A";
    const safeDescription = description || "N/A";
    const safeResponse = response || "N/A";
    const safeCategory = category || "N/A";
    const safeCity = city || "N/A";

    // ✅ Required field validation
    if (!enquiryId) {
      return res.status(400).json({ error: "enquiryId is required" });
    }

    const newFollowup = await Followup.create({
      enquiryId,
      staff: safeStaff,
      response: safeResponse,
      description: safeDescription,
      value,
      color,
      category: safeCategory,
      city: safeCity,
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

exports.getSurveyReportpage = async (req, res) => {
  try {
    const {
      fromdate,
      todate,
      category,
      city,
      reference,
      executive,
      executive_name,
      jobType,
      page,
      limit, // Increase limit for testing
    } = req.query;

    // Convert page and limit to integers
    const currentPage = parseInt(page);
    const itemsPerPage = parseInt(limit);
    const fromDate = new Date(fromdate).toISOString();
    const toDate = new Date(todate).toISOString();
    const response = "Survey";

    // Calculate the offset based on the page
    const offset = (currentPage - 1) * itemsPerPage;

    // Define where conditions for date range and response
    const whereConditions = {
      next_followup_date: {
        [Op.gte]: fromDate, // Greater than or equal to fromdate
        [Op.lte]: toDate, // Less than or equal to todate
      },
      response: response ? { [Op.eq]: response } : { [Op.ne]: null },
    };

    // Add executive_name filter condition
    if (executive_name) {
      whereConditions.executive_name = { [Op.eq]: executive_name };
    } else {
      whereConditions.executive_name = {
        [Op.or]: [{ [Op.is]: null }, { [Op.ne]: null }],
      };
    }

    // Prepare EnquiryFilter with additional filters
    const EnquiryFilter = {};
    if (category) {
      EnquiryFilter.category = { [Op.eq]: category }; // Filter by category
    }
    if (city) {
      EnquiryFilter.city = { [Op.eq]: city }; // Filter by city
    }
    if (reference) {
      EnquiryFilter.reference1 = { [Op.eq]: reference }; // Filter by reference
    }
    if (executive) {
      EnquiryFilter.executive = { [Op.eq]: executive }; // Filter by executive
    }
    if (jobType) {
      EnquiryFilter.interested_for = { [Op.eq]: jobType }; // Filter by jobType
    }

    // Log EnquiryFilter for debugging
    console.log("EnquiryFilter:", EnquiryFilter);

    // Count the total number of records to calculate total pages
    const totalRecords = await Followup.count({
      where: whereConditions,
      include: [
        {
          model: Enquiry,
          as: "Enquiry", // Join with Enquiry table
          where: EnquiryFilter, // Apply EnquiryFilter conditions
          attributes: [
            "enquiryId",
            "name",
            "mobile",
            "category",
            "city",
            "date",
            "time",
            "executive",
            "address",
            "reference1",
            "interested_for",
            "comment",
          ],
        },
      ],
    });

    // Fetch followups with enquiry details joined
    const followups = await Followup.findAll({
      where: whereConditions,
      include: [
        {
          model: Enquiry,
          as: "Enquiry", // Join with Enquiry table
          where: EnquiryFilter, // Apply EnquiryFilter conditions
          attributes: [
            "enquiryId",
            "name",
            "mobile",
            "category",
            "city",
            "date",
            "time",
            "executive",
            "address",
            "reference1",
            "interested_for",
            "comment",
          ],
        },
      ],
      order: [["next_followup_date", "ASC"]], // Order by next_followup_date
      limit: itemsPerPage, // Paginate results
      offset: offset, // Apply offset for pagination
    });

    // Calculate total number of pages
    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    // Return followups with pagination info
    return res.json({
      followups,
      pagination: {
        currentPage,
        totalPages,
        totalRecords,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching next follow-ups:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSurveyReportpageDownload = async (req, res) => {
  try {
    const {
      fromdate,
      todate,
      category,
      city,
      reference,
      executive,
      executive_name,
      jobType,
    } = req.query;

    // Convert fromdate and todate to ISO format
    const fromDate = new Date(fromdate).toISOString();
    const toDate = new Date(todate).toISOString();
    const response = "Survey"; // Assume this filter is always "Survey" for follow-ups

    // Define where conditions for date range and response
    const whereConditions = {
      next_followup_date: {
        [Op.gte]: fromDate, // Greater than or equal to fromdate
        [Op.lte]: toDate, // Less than or equal to todate
      },
      response: { [Op.eq]: response },
    };

    // Apply filters for executive_name, category, city, etc.
    if (executive_name) {
      whereConditions.executive_name = { [Op.eq]: executive_name };
    } else {
      whereConditions.executive_name = {
        [Op.or]: [{ [Op.is]: null }, { [Op.ne]: null }],
      };
    }

    const EnquiryFilter = {};
    if (category) {
      EnquiryFilter.category = { [Op.eq]: category }; // Filter by category
    }
    if (city) {
      EnquiryFilter.city = { [Op.eq]: city }; // Filter by city
    }
    if (reference) {
      EnquiryFilter.reference1 = { [Op.eq]: reference }; // Filter by reference
    }
    if (executive) {
      EnquiryFilter.executive = { [Op.eq]: executive }; // Filter by executive
    }
    if (jobType) {
      EnquiryFilter.interested_for = { [Op.eq]: jobType }; // Filter by jobType
    }

    // Fetch followups with enquiry details
    const followups = await Followup.findAll({
      where: whereConditions,
      include: [
        {
          model: Enquiry,
          as: "Enquiry", // Join with Enquiry table
          where: EnquiryFilter, // Apply EnquiryFilter conditions
          attributes: [
            "enquiryId",
            "name",
            "mobile",
            "category",
            "city",
            "date",
            "time",
            "executive",
            "address",
            "reference1",
            "interested_for",
            "comment",
          ],
        },
      ],
    });

    // Create Excel file using ExcelJS
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Survey Report");

    // Define the columns for the Excel sheet
    sheet.columns = [
      { header: "Enquiry ID", key: "enquiryId", width: 20 },
      { header: "Name", key: "name", width: 25 },
      { header: "Mobile", key: "mobile", width: 20 },
      { header: "Category", key: "category", width: 15 },
      { header: "City", key: "city", width: 15 },
      { header: "Executive", key: "executive", width: 20 },
      { header: "Address", key: "address", width: 25 },
      { header: "Reference", key: "reference1", width: 20 },
      { header: "Interested For", key: "interested_for", width: 20 },
      { header: "Comment", key: "comment", width: 30 },
      { header: "Follow-up Response", key: "followup_response", width: 25 },
      {
        header: "Follow-up Description",
        key: "followup_description",
        width: 30,
      },
      { header: "Next Follow-up Date", key: "followup_next_date", width: 20 },
      { header: "Created At", key: "followup_createdAt", width: 20 },
    ];

    // Add rows to the Excel sheet
    followups.forEach((item) => {
      sheet.addRow({
        enquiryId: item.Enquiry.enquiryId,
        name: item.Enquiry.name,
        mobile: item.Enquiry.mobile,
        category: item.Enquiry.category,
        city: item.Enquiry.city,
        executive: item.Enquiry.executive,
        address: item.Enquiry.address,
        reference1: item.Enquiry.reference1,
        interested_for: item.Enquiry.interested_for,
        comment: item.Enquiry.comment,
        followup_response: item.followup_response || "",
        followup_description: item.followup_description || "",
        followup_next_date: item.followup_next_date || "",
        followup_createdAt: item.followup_createdAt || "",
      });
    });

    // Set headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Survey_Report_${fromdate}_to_${todate}.xlsx`
    );

    // Write the Excel file and end the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error in getSurveyReportpageDownload:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.gettotalCounts = async (req, res) => {
  try {
    // Get the current date and format it properly (including time)
    const todayStart = moment().startOf("day").format("YYYY-MM-DD HH:mm:ss");
    const todayEnd = moment().endOf("day").format("YYYY-MM-DD HH:mm:ss");

    // Get the start and end of the current week
    const startOfWeek = moment().startOf("week").format("YYYY-MM-DD HH:mm:ss");
    const endOfWeek = moment().endOf("week").format("YYYY-MM-DD HH:mm:ss");

    // Get the follow-ups for today
    const todayCounts = await Followup.findAll({
      attributes: [
        "response",
        [sequelize.fn("COUNT", sequelize.col("response")), "count"],
      ],
      where: {
        date: {
          [Op.gte]: todayStart, // Ensure this matches the format in the database
          [Op.lte]: todayEnd,
        },
      },
      group: ["response"], // Group by response
    });

    // Get the follow-ups for this week
    const weekCounts = await Followup.findAll({
      attributes: [
        "response",
        [sequelize.fn("COUNT", sequelize.col("response")), "count"],
      ],
      where: {
        date: {
          [Op.gte]: startOfWeek,
          [Op.lte]: endOfWeek,
        },
      },
      group: ["response"], // Group by response
    });

    // Format the response data into a usable object
    const todayData = todayCounts.reduce((acc, item) => {
      const count = parseInt(item.dataValues.count, 10) || 0; // Ensure valid number
      acc[item.response] = count;
      return acc;
    }, {});

    const weekData = weekCounts.reduce((acc, item) => {
      const count = parseInt(item.dataValues.count, 10) || 0; // Ensure valid number
      acc[item.response] = count;
      return acc;
    }, {});

    // Send the response back with formatted data
    res.json({
      todayData,
      weekData,
    });
  } catch (err) {
    console.error("❌ Error fetching follow-up counts:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getExecutivesAppCounts = async (req, res) => {
  try {
    const { executive_id } = req.params;

    const today = moment().format("YYYY-MM-DD");
    const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

    const [todayCount, tomorrowCount, yesterdayCount] = await Promise.all([
      Followup.count({
        where: {
          executive_id,
          [Op.and]: [where(fn("DATE", col("next_followup_date")), today)],
        },
      }),
      Followup.count({
        where: {
          executive_id,
          [Op.and]: [where(fn("DATE", col("next_followup_date")), tomorrow)],
        },
      }),
      Followup.count({
        where: {
          executive_id,
          [Op.and]: [where(fn("DATE", col("next_followup_date")), yesterday)],
        },
      }),
    ]);

    return res.json({
      today: todayCount,
      tomorrow: tomorrowCount,
      yesterday: yesterdayCount,
    });
  } catch (error) {
    console.error("❌ Error fetching follow-up counts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getExecutivesAppFollowupsByData = async (req, res) => {
  try {
    const { executive_id } = req.params;
    const { range } = req.query;

    const today = moment().format("YYYY-MM-DD");
    const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
    const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

    let targetDate;

    switch (range) {
      case "today":
        targetDate = today;
        break;
      case "tomorrow":
        targetDate = tomorrow;
        break;
      case "yesterday":
        targetDate = yesterday;
        break;
      default:
        return res.status(400).json({ error: "Invalid range parameter" });
    }

    const followups = await Followup.findAll({
      where: {
        executive_id,
        [Op.and]: [where(fn("DATE", col("next_followup_date")), targetDate)],
      },
      attributes: [
        "next_followup_date",
        "description",
        "appo_time",
        "enquiryId",
        "followupId",
      ],

      order: [["next_followup_date", "ASC"]],
      include: [
        {
          model: Enquiry,
          as: "Enquiry",

          attributes: [
            "enquiryId",
            "name",
            "mobile",
            "category",
            "city",
            "date",
            "time",
            "executive",
            "address",
            "reference1",
            "interested_for",
            "comment",
          ],
        },
      ],
    });

    return res.json({ followups });
  } catch (error) {
    console.error("❌ Error fetching follow-ups by date:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
