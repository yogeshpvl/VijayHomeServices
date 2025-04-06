const WorkMaterial = require("../../models/serviceBooking/work");

exports.createMaterial = async (req, res) => {
  try {
    const data = await WorkMaterial.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to create material", details: err });
  }
};

exports.getAllMaterials = async (req, res) => {
  try {
    const { service_id } = req.query;

    const filter = service_id ? { where: { service_id } } : {};
    const data = await WorkMaterial.findAll(filter);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch materials" });
  }
};

exports.getMaterialById = async (req, res) => {
  try {
    const data = await WorkMaterial.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "Material not found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch material" });
  }
};

exports.updateMaterial = async (req, res) => {
  try {
    await WorkMaterial.update(req.body, { where: { id: req.params.id } });
    res.status(200).json({ message: "Material updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update material" });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    await WorkMaterial.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Material deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete material" });
  }
};
