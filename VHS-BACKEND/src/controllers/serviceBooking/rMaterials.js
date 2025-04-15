const RMaterial = require("../../models/serviceBooking/rMaterials");
const moment = require("moment");
exports.createRMaterial = async (req, res) => {
  try {
    const {
      work_date,
      work_mile_stone,
      work_material_use,
      work_details,
      work_remark,
      service_id,
    } = req.body;

    // ✅ Validate the date
    const formattedDate = moment(work_date, "YYYY-MM-DD", true).isValid()
      ? moment(work_date).format("YYYY-MM-DD")
      : null;

    if (!formattedDate) {
      return res.status(400).json({ message: "Invalid work_date format" });
    }

    const newMaterial = await RMaterial.create({
      work_date: formattedDate,
      work_mile_stone,
      work_material_use,
      work_details,
      work_remark,
      service_id,
    });

    res.status(201).json(newMaterial);
  } catch (error) {
    console.error("Error creating RMaterial:", error);
    res.status(500).json({ message: "Internal server error", error });
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
