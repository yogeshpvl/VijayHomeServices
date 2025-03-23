const TryToBooking = require("../models/trytobooking");
const { Op } = require("sequelize");

exports.createBooking = async (req, res) => {
  try {
    const data = req.body;
    const result = await TryToBooking.create(data);
    res.status(201).json({ success: true, booking: result });
  } catch (err) {
    console.error("Create error", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.updateRemarks = async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks, executive } = req.body;

    const booking = await TryToBooking.findByPk(id);
    if (!booking) return res.status(404).json({ error: "Not found" });

    booking.remarks = remarks || booking.remarks;
    booking.executive = executive || booking.executive;

    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    console.error("Update error", err);
    res.status(500).json({ error: "Update failed" });
  }
};

exports.getBookings = async (req, res) => {
  try {
    let { page = 1, limit = 25, search = "{}" } = req.query;
    const offset = (page - 1) * limit;
    const filters = JSON.parse(search);

    let where = {};
    if (filters.name) {
      where.name = { [Op.iLike]: `%${filters.name}%` };
    }
    if (filters.phoneNumber) {
      where.phoneNumber = { [Op.like]: `%${filters.phoneNumber}%` };
    }
    if (filters.service) {
      where.service = { [Op.iLike]: `%${filters.service}%` };
    }
    if (filters.executive) {
      where.executive = { [Op.iLike]: `%${filters.executive}%` };
    }

    const { rows, count } = await TryToBooking.findAndCountAll({
      where,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      bookings: rows,
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.error("Get error", err);
    res.status(500).json({ error: "Fetch failed" });
  }
};
