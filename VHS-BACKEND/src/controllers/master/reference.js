const referenceModel = require("../../models/master/reference");

exports.getAll = async (req, res) => {
  const types = await referenceModel.findAll({ order: [["id", "ASC"]] });
  res.json(types);
};

exports.create = async (req, res) => {
  const { reference } = req.body;
  if (!reference)
    return res.status(400).json({ error: "reference is required" });

  try {
    const newType = await referenceModel.create({ reference });
    res.status(201).json(newType);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Reference type already exists" });
    }
    console.error("Create error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { reference } = req.body;

  try {
    const type = await referenceModel.findByPk(id);
    if (!type) return res.status(404).json({ error: "Not found" });

    type.reference = reference;
    await type.save();

    res.json(type);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    await referenceModel.destroy({ where: { id } });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
