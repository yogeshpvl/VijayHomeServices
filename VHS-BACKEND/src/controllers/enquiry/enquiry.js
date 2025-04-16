const Enquiry = require("../../models/enquiry/enquiry");
const Followup = require("../../models/followups/followups");
const redisClient = require("../../config/redis"); // Redis setup
const { Op, QueryTypes } = require("sequelize");
const moment = require("moment");
const sequelize = require("../../config/database");
const ExcelJS = require("exceljs");

// ✅ Get all enquiries with pagination & search

const EnquirySearch = async (req, res) => {
  try {
    let {
      page,
      limit,
      search,
      fromDate,
      toDate,
      executive,
      city,
      mobile,
      name,
    } = req.query;

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

    if (name && !search) {
      whereClause.name = { [Op.iLike]: `%${name}%` };
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

    // Ensure page and limit have default values if they are not passed in the query
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

    // Start building filter conditions
    let filterClause = `WHERE e.date = :today`;
    const replacements = { limit, offset, today };

    if (searchFilters.name) {
      filterClause += ` AND LOWER(e.name) LIKE LOWER(:name)`;
      replacements.name = `%${searchFilters.name}%`;
    }
    if (searchFilters.executive) {
      filterClause += ` AND LOWER(e.executive) LIKE LOWER(:executive)`;
      replacements.executive = `%${searchFilters.executive}%`;
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
    if (searchFilters.category) {
      filterClause += ` AND LOWER(e.category) LIKE LOWER(:category)`;
      replacements.category = `%${searchFilters.category}%`;
    }
    if (searchFilters.city) {
      filterClause += ` AND LOWER(e.city) LIKE LOWER(:city)`;
      replacements.city = `%${searchFilters.city}%`;
    }

    // Query to get the filtered paginated data
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

    // Count the total records to determine total pages
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

// const getTodaysEnquiries = async (req, res) => {
//   try {
//     const today = moment().format("YYYY-MM-DD");

//     let { page, limit, search, sortBy, sortOrder } = req.query;

//     console.log("today---", today);
//     page = parseInt(page) || 1;
//     limit = parseInt(limit) || 10;
//     sortBy = sortBy || "createdAt";
//     sortOrder = sortOrder === "asc" ? "ASC" : "DESC";

//     const offset = (page - 1) * limit;

//     let searchFilters = {};
//     if (search && typeof search === "string") {
//       try {
//         searchFilters = JSON.parse(search);
//       } catch (err) {
//         console.error("Invalid search query:", search);
//       }
//     }

//     // 🔍 Start building filter conditions
//     let filterClause = `WHERE e.date = :today`;
//     const replacements = { limit, offset, today };

//     if (searchFilters.name) {
//       filterClause += ` AND LOWER(e.name) LIKE LOWER(:name)`;
//       replacements.name = `%${searchFilters.name}%`;
//     }
//     if (searchFilters.executive) {
//       filterClause += ` AND LOWER(e.executive) LIKE LOWER(:executive)`;
//       replacements.executive = `%${searchFilters.executive}%`;
//     }
//     if (searchFilters.mobile) {
//       filterClause += ` AND e.mobile LIKE :mobile`;
//       replacements.mobile = `%${searchFilters.mobile}%`;
//     }
//     if (searchFilters.response) {
//       filterClause += ` AND LOWER(f.response) = LOWER(:response)`;
//       replacements.response = searchFilters.response;
//     }
//     if (searchFilters.description) {
//       filterClause += ` AND LOWER(f."description") LIKE LOWER(:description)`;
//       replacements.description = `%${searchFilters.description}%`;
//     }
//     if (searchFilters.next_followup_date) {
//       filterClause += ` AND f."next_followup_date" = :next_followup_date`;
//       replacements.next_followup_date = searchFilters.next_followup_date;
//     }

//     // 🧠 Step 1: Fetch paginated data
//     const enquiries = await sequelize.query(
//       `
//       SELECT
//         e.*,
//         f.response AS followup_response,
//         f."description" AS followup_description,
//         f."next_followup_date" AS followup_next_date,
//         f."createdAt" AS followup_createdAt
//       FROM enquiries e
//       LEFT JOIN LATERAL (
//         SELECT *
//         FROM followups f
//         WHERE f."enquiryId" = e."enquiryId"
//         ORDER BY f."createdAt" DESC
//         LIMIT 1
//       ) f ON true
//       ${filterClause}
//       ORDER BY e."${sortBy}" ${sortOrder}
//       LIMIT :limit OFFSET :offset
//       `,
//       {
//         replacements,
//         type: QueryTypes.SELECT,
//       }
//     );

//     // 🧠 Step 2: Count total
//     const countResult = await sequelize.query(
//       `
//       SELECT COUNT(*) as count
//       FROM enquiries e
//       LEFT JOIN LATERAL (
//         SELECT *
//         FROM followups f
//         WHERE f."enquiryId" = e."enquiryId"
//         ORDER BY f."createdAt" DESC
//         LIMIT 1
//       ) f ON true
//       ${filterClause}
//       `,
//       {
//         replacements,
//         type: QueryTypes.SELECT,
//       }
//     );

//     const totalCount = parseInt(countResult[0].count);
//     const totalPages = Math.ceil(totalCount / limit);

//     res.status(200).json({
//       enquiries,
//       pagination: {
//         totalCount,
//         totalPages,
//         page,
//         limit,
//       },
//     });
//   } catch (error) {
//     console.error("Error in getTodaysEnquiries:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

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

const getEnquiryByuserId = async (req, res) => {
  try {
    const { user_id } = req.params; // Extract enquiryenquiryId from request parameters

    // ✅ Fetch enquiry details with additional data if needed
    const enquiry = await Enquiry.findOne({
      where: { user_id: user_id },
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
    // const newEnquiry = await Enquiry.create(req.body);
    const newEnquiry = await Enquiry.create({
      date: moment(req.body.date).format("YYYY-MM-DD"),
      executive: req.body.executive || "userapp",
      name: req.body.name,
      email: req.body.email || "N/A",
      mobile: req.body.mobile,
      contact2: req.body.contact2 || "N/A", // ✅ Fix here
      address: req.body.address || "N/A",
      city: req.body.city,
      category: req.body.category,
      reference1: req.body.reference1,
      reference2: req.body.reference2 || "N/A",

      reference3: req.body.reference3 || "N/A",

      reference4: req.body.reference4 || "N/A",

      reference5: req.body.reference5 || "N/A",
      tag: req.body.tag || "N/A",
      amount: req.body.amount || "N/A",

      interested_for: req.body.interested_for,
      createdAt: new Date(),
      updatedAt: new Date(),
      user_id: req.body.user_id || "N/A",
    });

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

const getEnquiriesFoReporPage = async (req, res) => {
  try {
    const today = moment().format("YYYY-MM-DD");

    let {
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      fromdate,
      todate,
      category,
      city,
      reference,
      executive,
      followupresponse,
      jobType,
      UTMSource,
      UTMContent,
      tag,
    } = req.query;

    console.log("followupresponse", followupresponse);
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
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
    let filterClause = `WHERE e.date BETWEEN :fromdate AND :todate`;
    const replacements = { limit, offset, today, fromdate, todate };

    // Apply additional filters based on search
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

    // Apply other filters if they exist
    if (category) {
      filterClause += ` AND e.category = :category`;
      replacements.category = category;
    }
    if (city) {
      filterClause += ` AND e.city = :city`;
      replacements.city = city;
    }
    if (reference) {
      filterClause += ` AND e.reference1 = :reference`;
      replacements.reference = reference;
    }
    if (executive) {
      filterClause += ` AND e.executive = :executive`;
      replacements.executive = executive;
    }
    if (followupresponse) {
      filterClause += ` AND f.response = :followupresponse`;
      replacements.followupresponse = followupresponse;
    }
    if (jobType) {
      filterClause += ` AND e.jobType = :jobType`;
      replacements.jobType = jobType;
    }
    if (UTMSource) {
      filterClause += ` AND e.utm_source = :UTMSource`;
      replacements.UTMSource = UTMSource;
    }
    if (UTMContent) {
      filterClause += ` AND e.utm_content = :UTMContent`;
      replacements.UTMContent = UTMContent;
    }
    if (tag) {
      filterClause += ` AND e.tag = :tag`;
      replacements.tag = tag;
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
    console.error("Error in getEnquiriesFoReporPage:", error);
    res.status(500).json({ error: error.message });
  }
};

const getEnquiriesFoReporPageDownload = async (req, res) => {
  try {
    let {
      fromdate,
      todate,
      category,
      city,
      reference,
      executive,
      followupresponse,
      jobType,
      UTMSource,
      UTMContent,
      tag,
    } = req.query;

    let searchFilters = {};

    // 🔍 Start building filter conditions
    let filterClause = `WHERE e.date BETWEEN :fromdate AND :todate`;
    const replacements = { fromdate, todate };

    // Apply additional filters based on search
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

    // Apply other filters if they exist
    if (category) {
      filterClause += ` AND e.category = :category`;
      replacements.category = category;
    }
    if (city) {
      filterClause += ` AND e.city = :city`;
      replacements.city = city;
    }
    if (reference) {
      filterClause += ` AND e.reference1 = :reference`;
      replacements.reference = reference;
    }
    if (executive) {
      filterClause += ` AND e.executive = :executive`;
      replacements.executive = executive;
    }
    if (followupresponse) {
      filterClause += ` AND f.response = :followupresponse`;
      replacements.followupresponse = followupresponse;
    }
    if (jobType) {
      filterClause += ` AND e.jobType = :jobType`;
      replacements.jobType = jobType;
    }
    if (UTMSource) {
      filterClause += ` AND e.utm_source = :UTMSource`;
      replacements.UTMSource = UTMSource;
    }
    if (UTMContent) {
      filterClause += ` AND e.utm_content = :UTMContent`;
      replacements.UTMContent = UTMContent;
    }
    if (tag) {
      filterClause += ` AND e.tag = :tag`;
      replacements.tag = tag;
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
   
      `,
      {
        replacements,
        type: QueryTypes.SELECT,
      }
    );

    // Create Excel file
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Enquiries Report");

    sheet.columns = [
      { header: "Enquiry ID", key: "enquiryId", width: 20 },
      { header: "Name", key: "name", width: 25 },
      { header: "Mobile", key: "mobile", width: 20 },
      { header: "Follow-up Response", key: "followup_response", width: 25 },
      {
        header: "Follow-up Description",
        key: "followup_description",
        width: 30,
      },
      { header: "Next Follow-up Date", key: "followup_next_date", width: 20 },
      { header: "Category", key: "category", width: 15 },
      { header: "City", key: "city", width: 15 },
      { header: "Executive", key: "executive", width: 20 },
      { header: "Utm Source", key: "utmsource", width: 20 },

      { header: "Utm content", key: "utmcontent", width: 20 },

      { header: "Tag", key: "tag", width: 20 },
    ];

    // Add rows to the sheet
    enquiries.forEach((item) => {
      sheet.addRow({
        enquiryId: item.enquiryId,
        name: item.name,
        mobile: item.mobile,
        followup_response: item.followup_response || "",
        followup_description: item.followup_description || "",
        followup_next_date: item.followup_next_date || "",
        category: item.category || "",
        city: item.city || "",
        executive: item.executive || "",
        utmsource: item.utm_source || "",
        utmcontent: item.utm_content || "",
        tag: item.tag || "",
      });
    });

    // Set headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Enquiries_Report_${fromdate}_to_${todate}.xlsx`
    );

    // Write the Excel file and end the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error in getEnquiriesFoReporPage:", error);
    res.status(500).json({ error: error.message });
  }
};

const gettotalCounts = async (req, res) => {
  try {
    // Current Date for Today
    const todayStart = moment().startOf("day").toDate(); // Start of the day
    const todayEnd = moment().endOf("day").toDate(); // End of the day

    // Start and End of This Week (Assuming week starts on Sunday)
    const startOfWeek = moment().startOf("week").toDate(); // Start of the week
    const endOfWeek = moment().endOf("week").toDate(); // End of the week

    console.log("todayStart", todayStart);
    // Get count for today
    const todayCount = await Enquiry.count({
      where: {
        date: {
          [Op.gte]: todayStart, // Greater than or equal to today's start
          [Op.lte]: todayEnd, // Less than or equal to today's end
        },
      },
    });

    // Get count for this week
    const weekCount = await Enquiry.count({
      where: {
        date: {
          [Op.gte]: startOfWeek, // Greater than or equal to the start of the week
          [Op.lte]: endOfWeek, // Less than or equal to the end of the week
        },
      },
    });

    // Send response
    res.json({
      todayCount,
      weekCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  getEnquiriesFoReporPage,
  getEnquiriesFoReporPageDownload,
  gettotalCounts,
  getEnquiryByuserId,
};
