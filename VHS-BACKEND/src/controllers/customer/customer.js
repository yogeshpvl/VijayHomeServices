const { Op, literal } = require("sequelize");
const Customer = require("../../models/customer/customer");
const sanitizeNumber = (value) => {
  return value === "" ? null : value;
};

exports.create = async (req, res) => {
  try {
    const {
      customerName,
      contactPerson,
      mainContact,
      alternateContact,
      email,
      gst,
      rbhf,
      cnap,
      lnf,
      mainArea,
      city,
      pinCode,
      customerType,
      approach,
      enquiryId,
    } = req.body;

    // Check if mainContact already exists
    const exists = await Customer.findOne({ where: { mainContact } });
    if (exists) {
      return res
        .status(400)
        .json({ error: "Customer with this phone number already exists." });
    }

    const newCustomer = await Customer.create({
      customerName,
      contactPerson,
      mainContact: sanitizeNumber(mainContact),
      alternateContact: sanitizeNumber(alternateContact),
      email,
      gst,
      rbhf,
      cnap,
      lnf,
      mainArea,
      city,
      pinCode: sanitizeNumber(pinCode),
      customerType,
      approach,
      enquiryId,
    });

    res.status(201).json({ user: newCustomer });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// Register (name + phone)
exports.register = async (req, res) => {
  try {
    const { customerName, mainContact } = req.body;

    if (!customerName || !mainContact)
      return res.status(400).json({ message: "Name & phone required" });

    const existing = await Customer.findOne({ where: { mainContact } });
    if (existing)
      return res.status(400).json({ message: "Customer already exists" });

    const customer = await Customer.create({ customerName, mainContact });
    res.status(201).json({ message: "Registered successfully", customer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login (by phone)
exports.login = async (req, res) => {
  try {
    const { mainContact } = req.body;
    const customer = await Customer.findOne({ where: { mainContact } });
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all customers (with pagination and optional search filter)
exports.getAll = async (req, res) => {
  try {
    // Extract query parameters for search, page, and limit
    const { search, page = 1, limit = 25 } = req.query;

    // Build the `where` filter condition based on the search query
    const where = search
      ? {
          customerName: {
            [require("sequelize").Op.iLike]: `%${search}%`, // Case-insensitive search
          },
        }
      : {};

    // Calculate the offset for pagination
    const offset = (page - 1) * limit;

    // Fetch customers with pagination
    const { count, rows } = await Customer.findAndCountAll({
      where,
      limit: parseInt(limit, 10), // Ensure the limit is an integer
      offset: offset, // Pagination offset
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(count / limit);

    // Respond with the paginated results
    res.json({
      totalItems: count, // Total number of items
      totalPages: totalPages, // Total number of pages
      currentPage: page, // Current page
      customers: rows, // List of customers for the current page
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchCustomers = async (req, res) => {
  try {
    const {
      customerName,
      mainContact,
      city,
      customerType,
      page = 1,
      limit = 10,
    } = req.query;

    const where = {};

    if (customerName) {
      where.customerName = { [Op.iLike]: `%${customerName}%` };
    }

    if (mainContact) {
      // Use literal to cast BIGINT to text and apply ilike
      where[Op.and] = literal(`"mainContact"::text ILIKE '%${mainContact}%'`);
    }

    if (city) {
      where.city = city;
    }

    if (customerType) {
      where.customerType = customerType;
    }

    if (!customerName && !mainContact && !city && !customerType) {
      return res
        .status(400)
        .json({ message: "At least one filter is required" });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: customers } = await Customer.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.json({ customers, totalPages, currentPage: parseInt(page) });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Get single customer
exports.getOne = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: "Not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOneByContact = async (req, res) => {
  try {
    const { contact } = req.params;

    const customer = await Customer.findOne({
      where: { mainContact: contact },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (err) {
    console.error("Error fetching customer by contact:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    // Perform the update operation
    const [updatedCount, updatedRows] = await Customer.update(req.body, {
      where: { id },
      returning: true, // This ensures that the updated rows are returned
    });

    if (updatedCount === 0) {
      return res
        .status(404)
        .json({ message: "Customer not found or no changes made" });
    }

    // Get the updated customer from the returned rows
    const updatedCustomer = updatedRows[0];

    // Respond with the updated customer data
    res.json({
      message: "Updated successfully",
      customer: updatedCustomer,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Customer.destroy({ where: { id } });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get the latest cardNo
exports.getLastCardNo = async (req, res) => {
  try {
    const lastCustomer = await Customer.findOne({
      order: [["cardNo", "DESC"]],
      attributes: ["cardNo"],
    });

    const lastCardNo = lastCustomer?.cardNo || 0;

    res.json({ cardNo: lastCardNo });
  } catch (err) {
    console.error("Get Last CardNo Error:", err);
    res.status(500).json({ message: err.message });
  }
};
