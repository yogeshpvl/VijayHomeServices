const FollowUpModel = require("../../model/Enquiry/followUp");
const EnquiryAddModel = require("../../model/Enquiry/Enquiry");
const { default: mongoose } = require("mongoose");

class FollowUpController {
  /**
   * ✅ Add Follow-up to an Enquiry
   */
  async addFollowUp(req, res) {
    const { EnquiryId, response } = req.body;

    if (!EnquiryId || !response) {
      return res
        .status(400)
        .json({ error: "Enquiry ID and Response are required" });
    }

    try {
      // Create a new follow-up record
      const newFollowUp = new FollowUpModel({ EnquiryId, response });
      const savedFollowUp = await newFollowUp.save();

      // Update the Enquiry record by adding the follow-up reference
      await EnquiryAddModel.findByIdAndUpdate(EnquiryId, {
        $push: { followUps: savedFollowUp._id },
      });

      return res.json({
        success: "Follow-up added successfully",
        followUp: savedFollowUp,
      });
    } catch (error) {
      console.error("Error adding follow-up:", error);
      return res.status(500).json({ error: "Failed to add follow-up" });
    }
  }

  /**
   * ✅ Get Last Follow-up of a Customer
   */
  async getLastFollowUp(req, res) {
    try {
      let { EnquiryId } = req.params;

      // ✅ Check if EnquiryId is a valid ObjectId or a Number
      let query = {};
      if (mongoose.isValidObjectId(EnquiryId)) {
        // ✅ Use `createFromHexString()` to avoid deprecated function
        query.EnquiryId = new mongoose.Types.ObjectId.createFromHexString(
          EnquiryId
        );
      } else if (!isNaN(EnquiryId)) {
        // ✅ If it's a Number, use it as-is
        query.EnquiryId = parseInt(EnquiryId);
      } else {
        return res.status(400).json({ error: "Invalid Enquiry ID format" });
      }

      // ✅ Find the latest follow-up for the given EnquiryId
      const lastFollowUp = await FollowUpModel.findOne(query)
        .sort({ createdAt: -1 }) // ✅ Get the most recent follow-up
        .exec();

      if (!lastFollowUp) {
        return res.status(404).json({ error: "No follow-up found" });
      }

      return res.json({ lastFollowUp });
    } catch (error) {
      console.error("Error fetching last follow-up:", error);
      return res.status(500).json({ error: "Failed to fetch follow-up" });
    }
  }

  /**
   * ✅ Get All Follow-ups for a Customer
   */
  async getAllFollowUps(req, res) {
    const { EnquiryId } = req.params;

    try {
      const followUps = await FollowUpModel.find({ EnquiryId }).sort({
        date: -1,
      });

      if (!followUps.length) {
        return res.status(404).json({ error: "No follow-ups found" });
      }

      return res.json({ followUps });
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
      return res.status(500).json({ error: "Failed to fetch follow-ups" });
    }
  }
}

module.exports = new FollowUpController();
