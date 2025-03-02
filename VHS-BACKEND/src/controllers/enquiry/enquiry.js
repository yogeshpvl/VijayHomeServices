const Enquiry = require("../../models/enquiry/enquiry");
const redisClient = require("../../config/redis"); // Redis setup
const { Op, Sequelize } = require("sequelize");
const moment = require("moment");

// ✅ Get all enquiries with pagination & search

const EnquirySearch = async (req, res) => {
  try {
    let { page, limit, search, fromDate, toDate, executive, city } = req.query;

    // ✅ Convert pagination params to numbers
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {};

    // ✅ Apply search filter (case-insensitive search)
    if (search) {
      whereClause[Op.or] = [
        { category: { [Op.iLike]: `%${search}%` } },
        { name: { [Op.iLike]: `%${search}%` } },
        { mobile: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // ✅ Convert date format to match database
    if (fromDate && toDate) {
      const formattedFromDate = moment(fromDate, "YYYY-MM-DD").format(
        "YYYY-MM-DD"
      );
      const formattedToDate = moment(toDate, "YYYY-MM-DD").format("YYYY-MM-DD");

      whereClause.date = {
        [Op.between]: [formattedFromDate, formattedToDate],
      };
    }

    // ✅ Filter by Executive
    if (executive) {
      whereClause.executive = { [Op.iLike]: `%${executive}%` };
    }

    // ✅ Filter by City
    if (city) {
      whereClause.city = { [Op.iLike]: `%${city}%` };
    }

    // ✅ Fetch data with pagination
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
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
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

    // ✅ Ensure `search` is parsed correctly
    let searchFilters = {};
    if (search && typeof search === "string") {
      try {
        searchFilters = JSON.parse(search); // Convert JSON string to an object
      } catch (err) {
        console.error("Invalid search query:", search);
      }
    }

    // ✅ Adjusted Where Clause to match date stored as string
    const whereClause = {
      date: today, // Now matching against a string
    };

    // ✅ Apply Search Filters if Available
    if (Object.keys(searchFilters).length > 0) {
      whereClause[Op.and] = [];

      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value && typeof value === "string") {
          whereClause[Op.and].push({
            [key]: { [Op.iLike]: `%${value}%` },
          });
        }
      });
    }

    console.log("Final Where Clause:", JSON.stringify(whereClause, null, 2));

    // ✅ Fetch Enquiries with Pagination
    const { rows, count } = await Enquiry.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    // ✅ Return Response
    res.status(200).json({
      enquiries: rows,
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      where: { id: req.params.id },
      returning: true,
    });

    if (updatedEnquiry[0] === 0)
      return res.status(404).json({ message: "Enquiry not found" });

    res.status(200).json(updatedEnquiry[1][0]);
    await redisClient.del("enquiries:*"); // Clear cache after update
  } catch (error) {
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
};
