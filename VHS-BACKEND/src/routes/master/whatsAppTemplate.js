const express = require("express");
const router = express.Router();
const controller = require("../../controllers/master/whatsAppTemplate");

// Fetch template by name from URL parameter
router.get("/get-template/:templateName", controller.findwithtemplatename);
// Fetch all templates
router.get("/", controller.getAll);

// Create a new template
router.post("/", controller.create);

// Update an existing template
router.put("/:id", controller.update);

// Delete a template by ID
router.delete("/:id", controller.remove);

module.exports = router;
