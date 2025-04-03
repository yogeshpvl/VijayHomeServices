const { Op } = require("sequelize");
const Vendor = require("../../models/master/vendors");

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

exports.login = async (req, res) => {
  try {
    const { number, password } = req.body;
    const vendor = await Vendor.findOne({ where: { number } });
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });

    const match = await bcrypt.compare(password, vendor.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    res.json(vendor);
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
      attributes: ["vhsname", "smsname", "type", "id"],
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
  await Vendor.update({ block: true }, { where: { id: req.params.id } });
  res.json({ message: "Blocked" });
};

exports.logout = async (req, res) => {
  await Vendor.update({ fcmtoken: null }, { where: { id: req.body.id } });
  res.json({ message: "Logged out" });
};

exports.changePassword = async (req, res) => {
  try {
    const { id, newPassword } = req.body;
    const hash = await bcrypt.hash(newPassword, 10);
    await Vendor.update({ password: hash }, { where: { id } });
    res.json({ message: "Password updated" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
