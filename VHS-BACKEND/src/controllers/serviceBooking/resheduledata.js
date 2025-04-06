const Reschedule = require("../../models/serviceBooking/resheduledata");

exports.createReschedule = async (req, res) => {
  try {
    const data = await Reschedule.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create reschedule", details: error });
  }
};

exports.getAllReschedules = async (req, res) => {
  try {
    const { service_id, service_date } = req.query;
    const where = {};
    if (service_id) where.service_id = service_id;
    if (service_date) where.service_date = service_date;

    const data = await Reschedule.findAll({ where });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reschedules" });
  }
};

exports.getRescheduleById = async (req, res) => {
  try {
    const data = await Reschedule.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "Reschedule not found" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reschedule" });
  }
};

exports.updateReschedule = async (req, res) => {
  try {
    await Reschedule.update(req.body, { where: { id: req.params.id } });
    res.status(200).json({ message: "Reschedule updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update reschedule" });
  }
};

exports.deleteReschedule = async (req, res) => {
  try {
    await Reschedule.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Reschedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete reschedule" });
  }
};
