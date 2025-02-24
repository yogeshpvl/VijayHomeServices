const cityymodel = require("../../model/Master/city");
const cacheService = require("../../utils/cacheService");

class CityController {
  async addcity(req, res) {
    let { city } = req.body;
    if (!city) {
      return res.status(400).json({ error: "City field must not be empty" });
    }
    try {
      let newCity = new cityymodel({ city });
      let save = await newCity.save();
      if (save) {
        await cacheService.del("allCities"); // Invalidate cache
        return res.json({ success: "City added successfully" });
      }
    } catch (error) {
      console.error("Error adding city:", error);
      return res.status(500).json({ error: "Failed to add city" });
    }
  }

  /**
   * ✅ Edit City
   * - Updates an existing city.
   * - Invalidates Redis cache after update.
   */
  async editcity(req, res) {
    let id = req.params.id;
    let { city } = req.body;
    if (!city) {
      return res.status(400).json({ error: "City field must not be empty" });
    }
    try {
      let updatedCity = await cityymodel.findOneAndUpdate(
        { _id: id },
        { city },
        { new: true }
      );
      if (updatedCity) {
        await cacheService.del("allCities"); // Invalidate cache
        return res.json({ success: "City updated successfully" });
      } else {
        return res.status(404).json({ error: "City not found" });
      }
    } catch (error) {
      console.error("Error updating city:", error);
      return res.status(500).json({ error: "Failed to update city" });
    }
  }

  /**
   * ✅ Get Cities (With Redis Cache)
   * - Checks Redis cache first.
   * - If not cached, fetches from MongoDB and sets cache.
   */
  async getcity(req, res) {
    const cacheKey = "allCities";

    try {
      // Check Redis cache
      const cachedCities = await cacheService.get(cacheKey);
      if (cachedCities) {
        return res.json({ cities: cachedCities, cache: true });
      }

      // Fetch from MongoDB
      const cities = await cityymodel.find().sort({ _id: -1 });
      if (cities.length > 0) {
        await cacheService.set(cacheKey, cities, 600); // Cache for 10 mins
      }
      return res.json({ cities, cache: false });
    } catch (error) {
      console.error("Error fetching cities:", error);
      return res.status(500).json({ error: "Failed to fetch cities" });
    }
  }

  /**
   * ✅ Delete City
   * - Deletes a city by ID.
   * - Invalidates Redis cache after deletion.
   */
  async postdeletecity(req, res) {
    let id = req.params.id;
    try {
      const deleteResult = await cityymodel.deleteOne({ _id: id });
      if (deleteResult.deletedCount > 0) {
        await cacheService.del("allCities"); // Invalidate cache
        return res.json({ success: "City deleted successfully" });
      } else {
        return res.status(404).json({ error: "City not found" });
      }
    } catch (error) {
      console.error("Error deleting city:", error);
      return res.status(500).json({ error: "Failed to delete city" });
    }
  }
}

module.exports = new CityController();
