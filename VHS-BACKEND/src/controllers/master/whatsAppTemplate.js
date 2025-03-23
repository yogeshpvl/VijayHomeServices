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

// Get template by template name
exports.findwithtemplatename = async (req, res) => {
  try {
    // Extract templateName from URL parameters
    const { templateName } = req.params;
    console.log("templateName", templateName);

    // Fetch the template based on templateName
    const template = await WhatsappTemplate.findOne({
      where: { template_name: templateName },
    });

    // Handle case where template is not found
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    // Return the template content
    res.json({
      success: true,
      message: "Template fetched successfully",
      content: template.content,
    });
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
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
