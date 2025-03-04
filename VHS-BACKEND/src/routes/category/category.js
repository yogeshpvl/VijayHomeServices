const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../../controllers/category/category");

const router = express.Router();

router.post("/", createCategory); // Create category
router.get("/", getAllCategories); // Get all categories
router.get("/:id", getCategoryById); // Get category by ID
router.put("/:id", updateCategory); // Update category
router.delete("/:id", deleteCategory); // Delete category

module.exports = router;
