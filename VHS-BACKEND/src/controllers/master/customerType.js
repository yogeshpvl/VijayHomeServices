const CustomerType = require("../../models/master/customerType");

exports.getAll = async (req, res) => {
  const types = await CustomerType.findAll({ order: [["id", "ASC"]] });
  res.json(types);
};

exports.create = async (req, res) => {
  const { customertype } = req.body;
  if (!customertype)
    return res.status(400).json({ error: "customertype is required" });

  try {
    const newType = await CustomerType.create({ customertype });
    res.status(201).json(newType);
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Customer type already exists" });
    }
    console.error("Create error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { customertype } = req.body;

  try {
    const type = await CustomerType.findByPk(id);
    if (!type) return res.status(404).json({ error: "Not found" });

    type.customertype = customertype;
    await type.save();

    res.json(type);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    await CustomerType.destroy({ where: { id } });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
