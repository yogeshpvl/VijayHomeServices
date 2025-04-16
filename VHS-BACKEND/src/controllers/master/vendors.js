const { Op } = require("sequelize");
const Vendor = require("../../models/master/vendors");
const axios = require("axios");
require("dotenv").config();

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_CDN_URL = process.env.BUNNY_CDN_URL;
const BUNNY_STORAGE_URL = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}`;

exports.getAll = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 25,
      type,
      city,
      vhsname,
      smsname,
      number,
      password,
      experiance,
      languagesknow,
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Build dynamic filters
    const where = {};
    if (type) where.type = { [Op.like]: `%${type}%` };
    if (city) where.city = { [Op.like]: `%${city}%` };
    if (vhsname) where.vhsname = { [Op.like]: `%${vhsname}%` };
    if (smsname) where.smsname = { [Op.like]: `%${smsname}%` };
    if (number) where.number = { [Op.like]: `%${number}%` };
    if (password) where.password = { [Op.like]: `%${password}%` };
    if (experiance) where.experiance = { [Op.like]: `%${experiance}%` };
    if (languagesknow)
      where.languagesknow = { [Op.like]: `%${languagesknow}%` };

    const { rows, count } = await Vendor.findAndCountAll({
      where,
      order: [["id", "ASC"]],
      limit: parseInt(limit),
      offset,
    });

    return res.json({
      results: rows,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      totalCount: count,
    });
  } catch (err) {
    console.error("Error fetching vendors:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getoutAll = async (req, res) => {
  try {
    const { count, rows } = await Vendor.findAndCountAll({
      where: {
        type: "outVendor", // Filter by the correct type
      },
    });

    return res.json({
      results: rows,
    });
  } catch (err) {
    console.error("Error fetching vendors:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.bulkRegister = async (req, res) => {
  try {
    const vendors = req.body;

    if (!Array.isArray(vendors) || vendors.length === 0) {
      return res.status(400).json({ error: "Invalid or empty vendor array" });
    }

    // Normalize & prepare data
    const normalizedVendors = vendors.map((vendor) => {
      let type = vendor.type?.toLowerCase() || "";

      if (type.includes("technician")) type = "Technician";
      else if (type.includes("executive")) type = "Executive";
      else if (type === "pm" || type.includes("project")) type = "PM";
      else type = vendor.type; // fallback

      return {
        ...vendor,
        type,
        number: vendor.number?.trim(), // sanitize if needed
        password: vendor.password || "123456", // default password if missing
      };
    });

    // Extract unique numbers for matching
    const numbers = normalizedVendors.map((v) => v.number);

    // Find existing vendors by number
    const existingVendors = await Vendor.findAll({
      where: {
        number: {
          [Op.in]: numbers,
        },
      },
    });

    const existingMap = {};
    existingVendors.forEach((v) => {
      existingMap[v.number] = v;
    });

    const toInsert = [];
    const toUpdate = [];

    for (const vendor of normalizedVendors) {
      if (existingMap[vendor.number]) {
        toUpdate.push(vendor);
      } else {
        toInsert.push(vendor);
      }
    }

    // Insert new vendors
    if (toInsert.length) {
      await Vendor.bulkCreate(toInsert);
    }

    // Update existing vendors
    for (const vendor of toUpdate) {
      await Vendor.update(vendor, {
        where: { number: vendor.number },
      });
    }

    res.json({
      inserted: toInsert.length,
      updated: toUpdate.length,
      total: vendors.length,
      message: "Bulk upload complete ✅",
    });
  } catch (error) {
    console.error("Bulk Register Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.register = async (req, res) => {
  try {
    const { number, password } = req.body;

    const vendor = await Vendor.create({
      ...req.body,
      password,
    });
    res.json(vendor);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { number, oldPassword, newPassword } = req.body;

    console.log("number", number);
    const vendor = await Vendor.findOne({ where: { number } });

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    // Compare old password (plaintext, you can switch to bcrypt later)
    if (vendor.password !== oldPassword) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    // Update with new password
    vendor.password = newPassword;
    await vendor.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.techlogin = async (req, res) => {
  try {
    const { number, password, type } = req.body;

    // Check if type is strictly 'Technician'
    if (type !== "Technician") {
      return res
        .status(403)
        .json({ error: "Unauthorized access. Invalid type." });
    }

    const vendor = await Vendor.findOne({
      where: { number, type: "Technician" },
    });

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    // Check plain password (Note: Use bcrypt in production)
    if (password !== vendor.password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // All checks passed
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.exelogin = async (req, res) => {
  try {
    const { number, password, type } = req.body;

    // Check if type is strictly 'Executive'
    if (type !== "Executive") {
      return res
        .status(403)
        .json({ error: "Unauthorized access. Invalid type." });
    }

    const vendor = await Vendor.findOne({
      where: { number, type: "Executive" },
    });

    if (!vendor) {
      return res.status(404).json({ error: "Executive not found" });
    }

    // Check plain password (Note: Use bcrypt in production)
    if (password !== vendor.password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // All checks passed
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.pmlogin = async (req, res) => {
  try {
    const { number, password, type } = req.body;

    // Check if type is strictly 'Executive'
    if (type !== "PM") {
      return res
        .status(403)
        .json({ error: "Unauthorized access. Invalid type." });
    }

    const vendor = await Vendor.findOne({ where: { number, type: "PM" } });

    if (!vendor) {
      return res.status(404).json({ error: "PM not found" });
    }

    // Check plain password (Note: Use bcrypt in production)
    if (password !== vendor.password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // All checks passed
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.vendorlogin = async (req, res) => {
  try {
    const { number, password, type, fcmtoken } = req.body;

    // Allow only type "VENDOR"
    if (type !== "VENDOR") {
      return res
        .status(403)
        .json({ error: "Unauthorized access. Invalid type." });
    }

    // Find vendor by number
    const vendor = await Vendor.findOne({
      where: {
        number,
        type: "outVendor",
      },
    });

    if (!vendor) {
      return res.status(404).json({ error: "VENDOR not found" });
    }

    // Compare password (in production use bcrypt)
    if (password !== vendor.password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Update fcmtoken if provided
    if (fcmtoken) {
      await vendor.update({ fcmtoken });
    }

    res.status(200).json({ success: true, vendor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  const vendor = await Vendor.findByPk(req.params.id);
  vendor ? res.json(vendor) : res.status(404).json({ error: "Not found" });
};

exports.getByType = async (req, res) => {
  const list = await Vendor.findAll({ where: { type: req.params.type } });
  res.json(list);
};

exports.getByCity = async (req, res) => {
  const list = await Vendor.findAll({ where: { city: req.params.city } });
  res.json(list);
};
exports.getByCityAndCategory = async (req, res) => {
  const { city, category, type } = req.query;

  try {
    const list = await Vendor.findAll({
      where: {
        city,
        type,
        category: {
          [Op.contains]: [{ name: category }],
        },
      },
      attributes: [
        "vhsname",
        "smsname",
        "type",
        "id",
        "languagesknow",
        "experiance",
      ],
    });

    res.json(list);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getByCityAndCategoryForDSRReport = async (req, res) => {
  const { city, category } = req.query;

  try {
    const list = await Vendor.findAll({
      where: {
        city,
        category: {
          [Op.contains]: [{ name: category }],
        },
        type: {
          [Op.ne]: "Executive", // Exclude 'Executive'
        },
      },
      attributes: ["vhsname", "smsname", "type", "id"],
      order: [["vhsname", "ASC"]], // Alphabetical order by name
    });

    res.json(list);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.edit = async (req, res) => {
  try {
    const vendor = await Vendor.update(req.body, {
      where: { id: req.params.id },
    });
    res.json({ message: "Updated", vendor });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.delete = async (req, res) => {
  await Vendor.destroy({ where: { id: req.params.id } });
  res.json({ message: "Deleted" });
};
exports.block = async (req, res) => {
  try {
    const result = await Vendor.update(
      { block: true, reason: req.body.reason },
      { where: { id: req.params.id } }
    );

    if (result[0] === 0) {
      return res
        .status(404)
        .json({ message: "Vendor not found or no changes made." });
    }

    res.json({ message: "Vendor blocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while blocking the vendor",
      error: error.message,
    });
  }
};

exports.unblock = async (req, res) => {
  try {
    const result = await Vendor.update(
      { block: false },
      { where: { id: req.params.id } }
    );

    if (result[0] === 0) {
      return res
        .status(404)
        .json({ message: "Vendor not found or no changes made." });
    }

    res.json({ message: "Vendor unblocked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while blocking the vendor",
      error: error.message,
    });
  }
};
exports.logout = async (req, res) => {
  await Vendor.update({ fcmtoken: null }, { where: { id: req.body.id } });
  res.json({ message: "Logged out" });
};

exports.updatevendordocuments = async (req, res) => {
  try {
    const { vendorId, adharno } = req.body;
    const file = req.file;

    if (!vendorId || !adharno || !file) {
      return res.status(400).json({ error: "Missing required fields or file" });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const fileBuffer = file.buffer;

    // Upload file to Bunny CDN
    await axios.put(`${BUNNY_STORAGE_URL}/${fileName}`, fileBuffer, {
      headers: {
        AccessKey: BUNNY_API_KEY,
        "Content-Type": "application/octet-stream",
      },
    });

    const cdnUrl = `${BUNNY_CDN_URL}/${fileName}`;

    // Update vendor record
    await Vendor.update(
      {
        adharno,
        id_proof: true,
        adhar_img_url: cdnUrl,
      },
      { where: { id: vendorId } }
    );

    // Fetch updated vendor record
    const updatedVendor = await Vendor.findOne({ where: { id: vendorId } });

    res.status(200).json({
      success: true,
      message: "Vendor document updated successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error("Error updating vendor documents:", error.message);
    res.status(500).json({ error: "Server error while uploading document" });
  }
};
