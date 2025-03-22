const QuotationHeaderFooterIm = require("../../models/master/quotationImgs");
const axios = require("axios");
require("dotenv").config();

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE;
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_CDN_URL = process.env.BUNNY_CDN_URL;
const BUNNY_STORAGE_URL = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}`;

// Create new entry
exports.create = async (req, res) => {
  try {
    const file = req.file;
    const { category, type } = req.body;

    if (!file || !category || !type) {
      return res
        .status(400)
        .json({ error: "image, category, and type are required" });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const fileBuffer = file.buffer;

    await axios.put(`${BUNNY_STORAGE_URL}/${fileName}`, fileBuffer, {
      headers: {
        AccessKey: BUNNY_API_KEY,
        "Content-Type": "application/octet-stream",
      },
    });

    const cdnUrl = `${BUNNY_CDN_URL}/${fileName}`;

    const created = await QuotationHeaderFooterIm.create({
      category,
      type,
      image_url: cdnUrl,
    });

    res.status(201).json(created);
  } catch (err) {
    console.error("Create error:", err.message);
    res.status(500).json({ error: "Image upload failed" });
  }
};

// Get all
exports.getAll = async (req, res) => {
  try {
    const items = await QuotationHeaderFooterIm.findAll({
      order: [["id", "ASC"]],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update (with optional new image)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, type } = req.body;
    const file = req.file;

    const item = await QuotationHeaderFooterIm.findByPk(id);
    if (!item) return res.status(404).json({ error: "Not found" });

    let imageUrl = item.image_url;

    if (file) {
      const fileName = `${Date.now()}-${file.originalname}`;
      const fileBuffer = file.buffer;

      await axios.put(`${BUNNY_STORAGE_URL}/${fileName}`, fileBuffer, {
        headers: {
          AccessKey: BUNNY_API_KEY,
          "Content-Type": "application/octet-stream",
        },
      });

      imageUrl = `${BUNNY_CDN_URL}/${fileName}`;
    }

    item.category = category;
    item.type = type;
    item.image_url = imageUrl;
    await item.save();

    res.json(item);
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ error: "Failed to update" });
  }
};

// Delete
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await QuotationHeaderFooterIm.destroy({ where: { id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getImageswithquery = async (req, res) => {
  const { category, type } = req.query;

  try {
    const where = {};
    if (category) where.category = category;
    if (type) where.type = type;

    const images = await QuotationHeaderFooterIm.findAll({
      where,
      order: [["id", "DESC"]],
    });

    res.json(images);
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};
