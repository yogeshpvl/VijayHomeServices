const RMaterial = require("../../models/serviceBooking/rMaterials");

exports.createRMaterial = async (req, res) => {
  try {
    const data = await RMaterial.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to create entry", details: error });
  }
};

exports.getAllRMaterials = async (req, res) => {
  try {
    const { service_id, customer_id } = req.query;
    const where = {};
    if (service_id) where.service_id = service_id;
    if (customer_id) where.customer_id = customer_id;

    const data = await RMaterial.findAll({ where });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch records" });
  }
};

exports.getRMaterialById = async (req, res) => {
  try {
    const data = await RMaterial.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "Entry not found" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch entry" });
  }
};

exports.updateRMaterial = async (req, res) => {
  try {
    await RMaterial.update(req.body, { where: { id: req.params.id } });
    res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update entry" });
  }
};

exports.deleteRMaterial = async (req, res) => {
  try {
    await RMaterial.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete entry" });
  }
};
