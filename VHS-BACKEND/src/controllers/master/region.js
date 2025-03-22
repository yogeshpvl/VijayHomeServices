const Region = require("../../models/master/region");
const { deleteCache, setCache, getCache } = require("../../config/redis");

exports.getAll = async (req, res) => {
  const cacheKey = "regions_all";

  const cached = await getCache(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const regions = await Region.findAll({ order: [["id", "ASC"]] });
  await setCache(cacheKey, JSON.stringify(regions));
  res.json(regions);
};

exports.create = async (req, res) => {
  const { category, region } = req.body;
  if (!category || !region)
    return res
      .status(400)
      .json({ error: "Both category and region are required" });

  try {
    const newRegion = await Region.create({ category, region });

    // Invalidate relevant caches
    await deleteCache("regions_all");
    await deleteCache(`regions_category_${category}`);

    res.status(201).json(newRegion);
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { category, region } = req.body;

  try {
    const item = await Region.findByPk(id);
    if (!item) return res.status(404).json({ error: "Region not found" });

    const oldCategory = item.category;

    item.category = category;
    item.region = region;
    await item.save();

    // Invalidate old and new category cache
    await deleteCache("regions_all");
    await deleteCache(`regions_category_${oldCategory}`);
    if (oldCategory !== category) {
      await deleteCache(`regions_category_${category}`);
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Region.findByPk(id);
    if (!item) return res.status(404).json({ error: "Region not found" });

    const category = item.category;

    await Region.destroy({ where: { id } });

    // Invalidate relevant caches
    await deleteCache("regions_all");
    await deleteCache(`regions_category_${category}`);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getByCategory = async (req, res) => {
  const { category } = req.params;
  const cacheKey = `regions_category_${category}`;

  const cached = await getCache(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  try {
    const data = await Region.findAll({
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
