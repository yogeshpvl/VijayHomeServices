const Job = require("../../models/master/job");
const { deleteCache, setCache, getCache } = require("../../config/redis");

exports.getAll = async (req, res) => {
  const cacheKey = "jobs_all";

  const cached = await getCache(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const data = await Job.findAll({ order: [["id", "ASC"]] });

  await setCache(cacheKey, JSON.stringify(data));
  res.json(data);
};

exports.create = async (req, res) => {
  const { category, material, qty_desc, rate } = req.body;
  if (!category || !material || !qty_desc || !rate) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newJob = await Job.create({ category, material, qty_desc, rate });
    await deleteCache("jobs_all");
    await deleteCache(`jobs_category_${category}`); // if available
    await deleteCache(`jobs_material_${material}`); // if available

    res.status(201).json(newJob);
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { category, material, qty_desc, rate } = req.body;

  try {
    const item = await Job.findByPk(id);
    if (!item) return res.status(404).json({ error: "Job not found" });

    item.category = category;
    item.material = material;
    item.qty_desc = qty_desc;
    item.rate = rate;
    await item.save();
    await deleteCache("jobs_all");
    await deleteCache(`jobs_category_${category}`); // if available
    await deleteCache(`jobs_material_${material}`); // if available

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    await Job.destroy({ where: { id } });

    // Invalidate cache
    await deleteCache("jobs_all");
    await deleteCache(`jobs_category_${job.category}`);
    await deleteCache(`jobs_material_${job.material}`);

    console.log(`✅ Deleted Cache: jobs_category_${job.category}`);
    console.log(`✅ Deleted Cache: jobs_material_${job.material}`);

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.log("❌ Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getByCategory = async (req, res) => {
  const { category } = req.params;
  const cacheKey = `jobs_category_${category}`;

  const cached = await getCache(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  try {
    const data = await Job.findAll({
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

exports.getByMaterial = async (req, res) => {
  const { material } = req.params;
  const cacheKey = `jobs_material_${material}`;

  const cached = await getCache(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  try {
    const data = await Job.findAll({
      where: { material },
      order: [["id", "ASC"]],
    });

    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for this material" });
    }

    await setCache(cacheKey, JSON.stringify(data));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
