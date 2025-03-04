const Category = require("../../models/category/category");
const { setCache, getCache, deleteCache } = require("../../config/redis");

exports.createCategory = async (req, res) => {
  try {
    const { category_name, category_order } = req.body;

    // ✅ Check if category name already exists
    const existingCategory = await Category.findOne({
      where: { category_name },
    });
    if (existingCategory) {
      return res.status(400).json({ error: "Category name already exists" });
    }

    // ✅ Check if category order already exists
    const existingOrder = await Category.findOne({
      where: { category_order },
    });
    if (existingOrder) {
      return res.status(400).json({ error: "Category order already exists" });
    }

    // ✅ Create the category if no duplicates are found
    const category = await Category.create({ category_name, category_order });

    // ✅ Clear cache so new category is fetched in the next request
    await deleteCache("all_categories");

    return res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("❌ Error creating category:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    // ✅ Try to get data from cache
    const cachedCategories = await getCache("all_categories");

    if (cachedCategories) {
      console.log("🔹 Serving from cache");
      return res.status(200).json(JSON.parse(cachedCategories)); // ✅ Fix: Properly parse JSON
    }

    // ✅ Fetch from database if cache is empty
    const categories = await Category.findAll();

    // ✅ Store fetched data in cache
    await setCache("all_categories", JSON.stringify(categories)); // ✅ Fix: Store JSON string

    return res.status(200).json(categories);
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { category_name, category_order } = req.body;
    const { id } = req.params;

    // ✅ Check if category exists
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // ✅ Ensure category_order is not null before updating
    if (category_order === undefined || category_order === null) {
      return res.status(400).json({ error: "category_order is required" });
    }

    // ✅ Update category
    await category.update({ category_name, category_order });

    // ✅ Clear cache after updating
    await deleteCache("all_categories");

    return res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("❌ Error updating category:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    await category.destroy();

    // 1️⃣ Clear cache to ensure fresh data on next request
    await deleteCache("all_categories");

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting category:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
