const B2BType = require("../../models/master/b2bType");

exports.getAll = async (req, res) => {
  const types = await B2BType.findAll({ order: [["id", "ASC"]] });
  res.json(types);
};

exports.create = async (req, res) => {
  const { b2btype } = req.body;

  if (!b2btype) return res.status(400).json({ error: "b2btype is required" });

  try {
    const newType = await B2BType.create({ b2btype });
    res.status(201).json(newType);
  } catch (error) {
    console.error("❌ Error creating b2btype:", error); // Add this
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { b2btype } = req.body;

  try {
    const type = await B2BType.findByPk(id);
    if (!type) return res.status(404).json({ error: "Not found" });

    type.b2btype = b2btype;
    await type.save();

    res.json(type);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    await B2BType.destroy({ where: { id } });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
