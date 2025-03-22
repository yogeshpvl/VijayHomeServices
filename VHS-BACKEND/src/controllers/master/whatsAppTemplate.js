const WhatsappTemplate = require("../../models/master/whatsAppTemplate");

// Get all templates
exports.getAll = async (req, res) => {
  try {
    const templates = await WhatsappTemplate.findAll({
      order: [["id", "ASC"]],
    });
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
};

// Create template
exports.create = async (req, res) => {
  const { template_name, content } = req.body;

  if (!template_name || !content) {
    return res
      .status(400)
      .json({ error: "template_name and content are required" });
  }

  try {
    const created = await WhatsappTemplate.create({ template_name, content });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update template
exports.update = async (req, res) => {
  const { id } = req.params;
  const { template_name, content } = req.body;

  try {
    const template = await WhatsappTemplate.findByPk(id);
    if (!template) return res.status(404).json({ error: "Template not found" });

    template.template_name = template_name;
    template.content = content;
    await template.save();

    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete template
exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    const template = await WhatsappTemplate.findByPk(id);
    if (!template) return res.status(404).json({ error: "Template not found" });

    await template.destroy();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
