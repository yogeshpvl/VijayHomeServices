const City = require("../../models/city/city");
const { deleteCache, setCache, getCache } = require("../../config/redis");

// ✅ Create a new city
exports.createCity = async (req, res) => {
  try {
    const { city_name } = req.body;

    // Check if city already exists
    const existingCity = await City.findOne({ where: { city_name } });
    if (existingCity) {
      return res.status(400).json({ error: "City already exists" });
    }

    const city = await City.create({ city_name });

    // ✅ Clear cache
    await deleteCache("all_cities");

    return res.status(201).json({ message: "City created successfully", city });
  } catch (error) {
    console.error("❌ Error creating city:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllCities = async (req, res) => {
  try {
    // ✅ Check cache first
    const cachedCities = await getCache("all_cities");
    if (cachedCities) {
      return res.status(200).json(cachedCities);
    }

    // ✅ Fetch from DB sorted alphabetically (A-Z)
    const cities = await City.findAll({ order: [["city_name", "ASC"]] });

    // ✅ Convert Sequelize instances to plain JSON
    const cityList = cities.map((city) => city.dataValues);

    await setCache("all_cities", cityList);

    return res.status(200).json(cityList);
  } catch (error) {
    console.error("❌ Error fetching cities:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Update a city
exports.updateCity = async (req, res) => {
  try {
    const { city_name } = req.body;
    const { id } = req.params;

    // ✅ Check if city exists
    const city = await City.findByPk(id);
    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }

    // ✅ Update city
    await city.update({ city_name });

    // ✅ Clear cache after updating
    await deleteCache("all_cities");

    return res.status(200).json({ message: "City updated successfully", city });
  } catch (error) {
    console.error("❌ Error updating city:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Delete a city
exports.deleteCity = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Check if city exists
    const city = await City.findByPk(id);
    if (!city) {
      return res.status(404).json({ error: "City not found" });
    }

    // ✅ Delete city
    await city.destroy();

    // ✅ Clear cache
    await deleteCache("all_cities");

    return res.status(200).json({ message: "City deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting city:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
