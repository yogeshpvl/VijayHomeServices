const Manpower = require("../../models/serviceBooking/manpower");

exports.createManpower = async (req, res) => {
  try {
    const data = await Manpower.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to create manpower", details: err });
  }
};

exports.getAllManpower = async (req, res) => {
  try {
    const { service_id } = req.query;
    const filter = service_id ? { where: { service_id } } : {};
    const data = await Manpower.findAll(filter);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch manpower" });
  }
};

exports.getManpowerById = async (req, res) => {
  try {
    const data = await Manpower.findByPk(req.params.id);
    if (!data)
      return res.status(404).json({ message: "Manpower entry not found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch manpower" });
  }
};

exports.updateManpower = async (req, res) => {
  try {
    await Manpower.update(req.body, { where: { id: req.params.id } });
    res.status(200).json({ message: "Manpower updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update manpower" });
  }
};

exports.deleteManpower = async (req, res) => {
  try {
    await Manpower.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Manpower deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete manpower" });
  }
};
