const Material = require("../../models/master/material");
const { deleteCache, setCache, getCache } = require("../../config/redis");

exports.getAll = async (req, res) => {
  const cacheKey = "materials_all";

  const cached = await getCache(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const data = await Material.findAll({ order: [["id", "ASC"]] });

  await setCache(cacheKey, JSON.stringify(data));
  res.json(data);
};

exports.create = async (req, res) => {
  const { category, material, benefits } = req.body;
  if (!category || !material) {
    return res
      .status(400)
      .json({ error: "category and material are required" });
  }

  try {
    const newMaterial = await Material.create({ category, material, benefits });

    // Invalidate cache
    await deleteCache("materials_all");
    await deleteCache(`materials_category_${category}`);

    res.status(201).json(newMaterial);
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { category, material, benefits } = req.body;

  try {
    const item = await Material.findByPk(id);
    if (!item) return res.status(404).json({ error: "Material not found" });

    item.category = category;
    item.material = material;
    item.benefits = benefits;
    await item.save();

    // Invalidate cache
    await deleteCache("materials_all");
    await deleteCache(`materials_category_${category}`);

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Material.findByPk(id);
    if (!item) return res.status(404).json({ error: "Material not found" });

    const category = item.category;
    await Material.destroy({ where: { id } });

    // Invalidate cache
    await deleteCache("materials_all");
    await deleteCache(`materials_category_${category}`);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByCategory = async (req, res) => {
  const { category } = req.params;
  const cacheKey = `materials_category_${category}`;

  const cached = await getCache(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  try {
    const data = await Material.findAll({
      where: { category },
      order: [["id", "ASC"]],
    });

    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for this category" });
    }

    await setCache(cacheKey, JSON.stringify(data));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByRegion = async (req, res) => {
  const { region } = req.params;
  const cacheKey = `materials_region_${region}`;

  const cached = await getCache(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  try {
    const data = await Material.findAll({
      where: { region },
      order: [["id", "ASC"]],
    });

    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for this region" });
    }

    await setCache(cacheKey, JSON.stringify(data));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
