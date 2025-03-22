const Terms = require("../../models/master/TermsSection2");

exports.getAll = async (req, res) => {
  const data = await Terms.findAll({ order: [["id", "ASC"]] });
  res.json(data);
};

exports.create = async (req, res) => {
  const { category, header, type, content } = req.body;
  if (!category || !header || !content) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const created = await Terms.create({ category, header, type, content });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { category, header, type, content } = req.body;

  try {
    const item = await Terms.findByPk(id);
    if (!item) return res.status(404).json({ error: "Not found" });

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
    await Terms.destroy({ where: { id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const data = await Terms.findAll({
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
