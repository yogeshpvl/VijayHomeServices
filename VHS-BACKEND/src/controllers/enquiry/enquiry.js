const Enquiry = require("../../models/enquiry/enquiry");
const Followup = require("../../models/followups/followups");
const redisClient = require("../../config/redis"); // Redis setup
const { Op, QueryTypes } = require("sequelize");
const moment = require("moment");
const sequelize = require("../../config/database");

// ✅ Get all enquiries with pagination & search

const EnquirySearch = async (req, res) => {
  try {
    let { page, limit, search, fromDate, toDate, executive, city, mobile } =
      req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {};

    // 🔍 Search filter (name, category, mobile)
    if (search) {
      whereClause[Op.or] = [
        { category: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        { mobile: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // ✅ Direct mobile filter if search is not used
    if (mobile && !search) {
      whereClause.mobile = { [Op.iLike]: `%${mobile}%` };
    }

    // 📅 Date filter
    if (fromDate && toDate) {
      whereClause.date = {
        [Op.between]: [fromDate, toDate],
      };
    }

    // 👤 Executive filter
    if (executive) {
      whereClause.executive = { [Op.iLike]: `%${executive}%` };
    }

    // 🌆 City filter
    if (city) {
      whereClause.city = { [Op.iLike]: `%${city}%` };
    }

    const { rows, count } = await Enquiry.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      enquiries: rows,
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getTodaysEnquiries = async (req, res) => {
  try {
    const today = moment().format("YYYY-MM-DD");

    let { page, limit, search, sortBy, sortOrder } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    sortBy = sortBy || "createdAt";
    sortOrder = sortOrder === "asc" ? "ASC" : "DESC";

    const offset = (page - 1) * limit;

    let searchFilters = {};
    if (search && typeof search === "string") {
      try {
        searchFilters = JSON.parse(search);
      } catch (err) {
        console.error("Invalid search query:", search);
      }
    }

    // 🔍 Start building filter conditions
    let filterClause = `WHERE e.date = :today`;
    const replacements = { limit, offset, today };

    if (searchFilters.name) {
      filterClause += ` AND LOWER(e.name) LIKE LOWER(:name)`;
      replacements.name = `%${searchFilters.name}%`;
    }
    if (searchFilters.mobile) {
      filterClause += ` AND e.mobile LIKE :mobile`;
      replacements.mobile = `%${searchFilters.mobile}%`;
    }
    if (searchFilters.response) {
      filterClause += ` AND LOWER(f.response) = LOWER(:response)`;
      replacements.response = searchFilters.response;
    }
    if (searchFilters.description) {
      filterClause += ` AND LOWER(f."description") LIKE LOWER(:description)`;
      replacements.description = `%${searchFilters.description}%`;
    }
    if (searchFilters.next_followup_date) {
      filterClause += ` AND f."next_followup_date" = :next_followup_date`;
      replacements.next_followup_date = searchFilters.next_followup_date;
    }

    // 🧠 Step 1: Fetch paginated data
    const enquiries = await sequelize.query(
      `
      SELECT 
        e.*,
        f.response AS followup_response,
        f."description" AS followup_description,
        f."next_followup_date" AS followup_next_date,
        f."createdAt" AS followup_createdAt
      FROM enquiries e
      LEFT JOIN LATERAL (
        SELECT *
        FROM followups f
        WHERE f."enquiryId" = e."enquiryId"
        ORDER BY f."createdAt" DESC
        LIMIT 1
      ) f ON true
      ${filterClause}
      ORDER BY e."${sortBy}" ${sortOrder}
      LIMIT :limit OFFSET :offset
      `,
      {
        replacements,
        type: QueryTypes.SELECT,
      }
    );

    // 🧠 Step 2: Count total
    const countResult = await sequelize.query(
      `
      SELECT COUNT(*) as count
      FROM enquiries e
      LEFT JOIN LATERAL (
        SELECT *
        FROM followups f
        WHERE f."enquiryId" = e."enquiryId"
        ORDER BY f."createdAt" DESC
        LIMIT 1
      ) f ON true
      ${filterClause}
      `,
      {
        replacements,
        type: QueryTypes.SELECT,
      }
    );

    const totalCount = parseInt(countResult[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      enquiries,
      pagination: {
        totalCount,
        totalPages,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error in getTodaysEnquiries:", error);
    res.status(500).json({ error: error.message });
  }
};

//New
const getNewEnquiries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC",
      search = "{}",
    } = req.query;

    const offset = (page - 1) * limit;
    const filters = JSON.parse(search);

    let filterQuery = `WHERE NOT EXISTS (
      SELECT 1 FROM followups f WHERE f."enquiryId" = e."enquiryId"
    )`;

    // Dynamic filters
    if (filters.name) {
      filterQuery += ` AND LOWER(e.name) LIKE LOWER('%${filters.name}%')`;
    }
    if (filters.mobile) {
      filterQuery += ` AND e.mobile LIKE '%${filters.mobile}%'`;
    }
    if (filters.email) {
      filterQuery += ` AND LOWER(e.email) LIKE LOWER('%${filters.email}%')`;
    }
    if (filters.city) {
      filterQuery += ` AND LOWER(e.city) LIKE LOWER('%${filters.city}%')`;
    }
    if (filters.category) {
      filterQuery += ` AND LOWER(e.category) LIKE LOWER('%${filters.category}%')`;
    }
    if (filters.address) {
      filterQuery += ` AND LOWER(e.address) LIKE LOWER('%${filters.address}%')`;
    }
    if (filters.executive) {
      filterQuery += ` AND LOWER(e.executive) LIKE LOWER('%${filters.executive}%')`;
    }
    if (filters.interested_for) {
      filterQuery += ` AND LOWER(e.interested_for) LIKE LOWER('%${filters.interested_for}%')`;
    }

    // Step 1: Get paginated full enquiry data directly
    const enquiries = await sequelize.query(
      `
      SELECT * FROM enquiries e
      ${filterQuery}
      ORDER BY e."${sortBy}" ${sortOrder}
      LIMIT :limit OFFSET :offset
      `,
      {
        replacements: { limit, offset },
        type: QueryTypes.SELECT,
      }
    );

    // Step 2: Count total matching entries
    const countResult = await sequelize.query(
      `SELECT COUNT(*) FROM enquiries e ${filterQuery}`,
      { type: QueryTypes.SELECT }
    );
    const totalCount = parseInt(countResult[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      enquiries,
      pagination: {
        totalCount,
        totalPages,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error fetching new enquiries with filters:", error);
    res.status(500).json({ error: error.message });
  }
};

const getOnlyResponseNewEnquiries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC",
      search = "{}",
    } = req.query;

    const offset = (page - 1) * limit;
    const filters = JSON.parse(search);

    // Start with filtering response = 'New' from latest followup
    let filterConditions = `
      WHERE lf.response = 'New'
    `;

    // Dynamic filters on enquiry fields
    if (filters.name) {
      filterConditions += ` AND LOWER(e.name) LIKE LOWER('%${filters.name}%')`;
    }
    if (filters.mobile) {
      filterConditions += ` AND e.mobile LIKE '%${filters.mobile}%'`;
    }
    if (filters.email) {
      filterConditions += ` AND LOWER(e.email) LIKE LOWER('%${filters.email}%')`;
    }
    if (filters.city) {
      filterConditions += ` AND LOWER(e.city) LIKE LOWER('%${filters.city}%')`;
    }
    if (filters.category) {
      filterConditions += ` AND LOWER(e.category) LIKE LOWER('%${filters.category}%')`;
    }
    if (filters.address) {
      filterConditions += ` AND LOWER(e.address) LIKE LOWER('%${filters.address}%')`;
    }
    if (filters.executive) {
      filterConditions += ` AND LOWER(e.executive) LIKE LOWER('%${filters.executive}%')`;
    }
    if (filters.interested_for) {
      filterConditions += ` AND LOWER(e.interested_for) LIKE LOWER('%${filters.interested_for}%')`;
    }

    // Get paginated enquiry + followup data
    const enquiries = await sequelize.query(
      `
      SELECT 
        e.*,
        lf.response AS followup_response,
        lf."description" AS followup_description,
        lf."date" AS followup_date,
        lf."staff" AS followup_staff,
        lf."createdAt" AS followup_createdAt
      FROM enquiries e
      JOIN (
        SELECT f.*
        FROM followups f
        INNER JOIN (
          SELECT "enquiryId", MAX("createdAt") AS max_created
          FROM followups
          GROUP BY "enquiryId"
        ) latest ON latest."enquiryId" = f."enquiryId" AND latest.max_created = f."createdAt"
      ) lf ON lf."enquiryId" = e."enquiryId"
      ${filterConditions}
      ORDER BY e."${sortBy}" ${sortOrder}
      LIMIT :limit OFFSET :offset
      `,
      {
        replacements: { limit, offset },
        type: QueryTypes.SELECT,
      }
    );

    // Get total count
    const countResult = await sequelize.query(
      `
      SELECT COUNT(*) AS count
      FROM enquiries e
      JOIN (
        SELECT f.*
        FROM followups f
        INNER JOIN (
          SELECT "enquiryId", MAX("createdAt") AS max_created
          FROM followups
          GROUP BY "enquiryId"
        ) latest ON latest."enquiryId" = f."enquiryId" AND latest.max_created = f."createdAt"
      ) lf ON lf."enquiryId" = e."enquiryId"
      ${filterConditions}
      `,
      { type: QueryTypes.SELECT }
    );

    const totalCount = parseInt(countResult[0].count);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      enquiries,
      pagination: {
        totalCount,
        totalPages,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error(
      "Error fetching enquiries with latest followup as 'New':",
      error
    );
    res.status(500).json({ error: error.message });
  }
};

const getLastEnquiryId = async (req, res) => {
  try {
    // Fetch the latest enquiry ID
    const latestEnquiry = await Enquiry.findOne({
      order: [["enquiryId", "DESC"]],
      attributes: ["enquiryId"],
    });

    // Ensure a valid response
    const lastEnquiryId = latestEnquiry ? latestEnquiry.enquiryId : 1;

    res.status(200).json({
      success: true,
      lastEnquiryId,
    });
  } catch (error) {
    console.error("Error fetching last enquiry ID:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getEnquiryById = async (req, res) => {
  try {
    const { enquiryId } = req.params; // Extract enquiryenquiryId from request parameters

    // ✅ Fetch enquiry details with additional data if needed
    const enquiry = await Enquiry.findOne({
      where: { enquiryId: enquiryId },
      // attributes: [
      //   "enquiryId",
      //   "date",
      //   "time",
      //   "executive",
      //   "name",
      //   "email",
      //   "mobile",
      //   "contact2",
      //   "address",
      //   "city",
      //   "category",
      //   "reference1",
      //   "reference2",
      //   "reference3",
      //   "interested_for",
      //   "comment",
      // ],
    });

    // ✅ If no enquiry found, return 404
    if (!enquiry) {
      return res
        .status(404)
        .json({ success: false, message: "Enquiry not found" });
    }

    // ✅ Return enquiry data
    res.status(200).json({ success: true, data: enquiry });
  } catch (error) {
    console.error("Error fetching enquiry:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Fetch Executive-wise Enquiries
const getExecutiveEnquiries = async (req, res) => {
  try {
    const { executive } = req.params;

    if (!executive) {
      return res.status(400).json({ error: "Executive ID is required" });
    }

    const enquiries = await Enquiry.findAll({
      where: { executive },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(enquiries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Count of Today's and This Month's Enquiries
const getEnquiryCounts = async (req, res) => {
  try {
    const todayStart = moment().startOf("day").toDate();
    const todayEnd = moment().endOf("day").toDate();
    const monthStart = moment().startOf("month").toDate();
    const monthEnd = moment().endOf("month").toDate();

    const todayCount = await Enquiry.count({
      where: { createdAt: { [Op.between]: [todayStart, todayEnd] } },
    });

    const monthCount = await Enquiry.count({
      where: { createdAt: { [Op.between]: [monthStart, monthEnd] } },
    });

    res.status(200).json({ todayCount, monthCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Create a new enquiry
const createEnquiry = async (req, res) => {
  try {
    const newEnquiry = await Enquiry.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Enquiry created successfully",
      data: newEnquiry,
    });
  } catch (error) {
    console.error("Error creating enquiry:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to create enquiry",
        error: error.message,
      });
    }
  }
};

// ✅ Update an enquiry
const updateEnquiry = async (req, res) => {
  try {
    const updatedEnquiry = await Enquiry.update(req.body, {
      where: { enquiryId: req.params.id },
      returning: true,
    });

    if (updatedEnquiry[0] === 0)
      return res.status(404).json({ message: "Enquiry not found" });

    res.status(200).json(updatedEnquiry[1][0]);
  } catch (error) {
    console.log("error.message ", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete an enquiry
const deleteEnquiry = async (req, res) => {
  try {
    const deleted = await Enquiry.destroy({ where: { id: req.params.id } });

    if (!deleted) return res.status(404).json({ message: "Enquiry not found" });

    res.status(200).json({ message: "Enquiry deleted successfully" });
    await redisClient.del("enquiries:*"); // Clear cache after delete
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  EnquirySearch,
  getTodaysEnquiries,
  getExecutiveEnquiries,
  getEnquiryCounts,
  getEnquiryById,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
  getLastEnquiryId,
  getNewEnquiries,
  getOnlyResponseNewEnquiries,
};
