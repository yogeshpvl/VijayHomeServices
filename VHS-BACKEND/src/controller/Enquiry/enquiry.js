const EnquiryAddModel = require("../../model/Enquiry/Enquiry");
const cacheService = require("../../utils/cacheService");

class EnquiryController {
  /**
   * ✅ Add Enquiry
   * - Saves a new enquiry in MongoDB.
   * - Invalidates Redis cache after adding.
   */
  async addEnquiry(req, res) {
    let {
      EnquiryId,
      name,
      mobile,
      address,
      city,
      category,
      comment,
      interestedFor,
    } = req.body;

    if (!name || !mobile || !city || !category) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    try {
      let newEnquiry = new EnquiryAddModel(req.body);
      let save = await newEnquiry.save();

      if (save) {
        await cacheService.del("allEnquiries"); // Invalidate cache
        return res.json({ success: "Enquiry added successfully" });
      }
    } catch (error) {
      console.error("Error adding enquiry:", error);
      return res.status(500).json({ error: "Failed to add enquiry" });
    }
  }

  /**
   * ✅ Get All Enquiries (With Redis Cache)
   * - Fetches all enquiries from Redis or MongoDB.
   */
  async getEnquiries(req, res) {
    const cacheKey = "allEnquiries";

    try {
      // Check Redis cache first
      const cachedData = await cacheService.get(cacheKey);
      if (cachedData) {
        return res.json({ enquiries: cachedData, cache: true });
      }

      // Fetch from MongoDB
      const enquiries = await EnquiryAddModel.find().sort({ _id: -1 });
      if (enquiries.length > 0) {
        await cacheService.set(cacheKey, enquiries, 600); // Cache for 10 mins
      }
      return res.json({ enquiries, cache: false });
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      return res.status(500).json({ error: "Failed to fetch enquiries" });
    }
  }

  /**
   * ✅ Get Enquiry by ID
   * - Fetches an enquiry by its MongoDB `_id`.
   */
  async getEnquiryById(req, res) {
    let { id } = req.params;
    try {
      let enquiry = await EnquiryAddModel.findById(id);
      if (!enquiry) return res.status(404).json({ error: "Enquiry not found" });
      return res.json(enquiry);
    } catch (error) {
      console.error("Error fetching enquiry:", error);
      return res.status(500).json({ error: "Failed to fetch enquiry" });
    }
  }

  /**
   * ✅ Edit Enquiry
   * - Updates an existing enquiry.
   * - Invalidates Redis cache after update.
   */
  async editEnquiry(req, res) {
    let id = req.params.id;
    try {
      let updatedEnquiry = await EnquiryAddModel.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true }
      );
      if (updatedEnquiry) {
        await cacheService.del("allEnquiries"); // Invalidate cache
        return res.json({ success: "Enquiry updated successfully" });
      } else {
        return res.status(404).json({ error: "Enquiry not found" });
      }
    } catch (error) {
      console.error("Error updating enquiry:", error);
      return res.status(500).json({ error: "Failed to update enquiry" });
    }
  }

  /**
   * ✅ Delete Enquiry
   * - Deletes an enquiry by ID.
   * - Invalidates Redis cache after deletion.
   */
  async deleteEnquiry(req, res) {
    let id = req.params.id;
    try {
      const deleteResult = await EnquiryAddModel.deleteOne({ _id: id });
      if (deleteResult.deletedCount > 0) {
        await cacheService.del("allEnquiries"); // Invalidate cache
        return res.json({ success: "Enquiry deleted successfully" });
      } else {
        return res.status(404).json({ error: "Enquiry not found" });
      }
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      return res.status(500).json({ error: "Failed to delete enquiry" });
    }
  }
}

module.exports = new EnquiryController();
