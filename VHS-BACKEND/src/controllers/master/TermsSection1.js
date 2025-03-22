const TermsSection1 = require("../../models/master/TermsSection1");

exports.getAll = async (req, res) => {
  try {
    const data = await TermsSection1.findAll({ order: [["id", "ASC"]] });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const { category, header, type, content } = req.body;

  if (!category || !header || !content) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newItem = await TermsSection1.create({
      category,
      header,
      type,
      content,
    });
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { category, header, type, content } = req.body;

  try {
    const item = await TermsSection1.findByPk(id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.category = category;
    item.header = header;
    item.type = type;
    item.content = content;

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    await TermsSection1.destroy({ where: { id } });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const data = await TermsSection1.findAll({
      where: { category },
      order: [["id", "ASC"]],
    });

    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for this category" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
