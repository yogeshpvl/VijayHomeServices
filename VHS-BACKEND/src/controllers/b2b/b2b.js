const B2B = require("../../models/b2b/b2b");

exports.createB2B = async (req, res) => {
  try {
    const b2b = await B2B.create(req.body);
    res.status(201).json(b2b);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create B2B entry", details: error });
  }
};

exports.getAllB2Bs = async (req, res) => {
  try {
    const b2bs = await B2B.findAll();
    res.status(200).json(b2bs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch B2B list" });
  }
};

exports.getB2BById = async (req, res) => {
  try {
    const b2b = await B2B.findByPk(req.params.id);
    if (!b2b) return res.status(404).json({ message: "B2B not found" });
    res.status(200).json(b2b);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch B2B" });
  }
};

exports.updateB2B = async (req, res) => {
  try {
    const updated = await B2B.update(req.body, {
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "B2B updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update B2B" });
  }
};

exports.deleteB2B = async (req, res) => {
  try {
    await B2B.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "B2B deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete B2B" });
  }
};
