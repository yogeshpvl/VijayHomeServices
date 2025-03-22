const Response = require("../../models/response/response");

// ✅ Fetch all responses
exports.getAllResponses = async (req, res) => {
  try {
    const responses = await Response.findAll();
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch responses" });
  }
};

// // ✅ Fetch all response names only
// exports.getAllResponses = async (req, res) => {
//   try {
//     const responses = await Response.findAll({
//       attributes: ["response_name"], // Only fetch this column
//     });
//     res.json(responses);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch response names" });
//   }
// };

// ✅ Get a single response by ID
exports.getResponseById = async (req, res) => {
  try {
    const response = await Response.findByPk(req.params.id);
    if (!response) return res.status(404).json({ error: "Response not found" });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving response" });
  }
};

// ✅ Create a new response
exports.createResponse = async (req, res) => {
  try {
    const { response_name, template } = req.body;

    const newResponse = await Response.create({ response_name, template });
    res.status(201).json(newResponse);
  } catch (error) {
    console.error("Error creating response:", error); // ✅ Print full error details
    res.status(400).json({ error: error.message || "Error creating response" });
  }
};

// ✅ Update an existing response
exports.updateResponse = async (req, res) => {
  try {
    const { id } = req.params; // Get response ID from URL
    const { response_name, template } = req.body; // Get update fields

    const response = await Response.findByPk(id);
    if (!response) {
      return res.status(404).json({ error: "Response not found" });
    }

    // Update only provided fields
    if (response_name) response.response_name = response_name;
    if (template) response.template = template;

    await response.save(); // Save changes

    return res
      .status(200)
      .json({ message: "Response updated successfully", response });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(400).json({ error: "Error updating response" });
  }
};
// ✅ Delete a response
exports.deleteResponse = async (req, res) => {
  try {
    const response = await Response.findByPk(req.params.id);
    if (!response) return res.status(404).json({ error: "Response not found" });

    await response.destroy();
    res.json({ message: "Response deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting response" });
  }
};
