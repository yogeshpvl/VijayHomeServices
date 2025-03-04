const Followup = require("../../models/followups/followups");
const { Op, Sequelize } = require("sequelize");

exports.createFollowup = async (req, res) => {
  try {
    const {
      enquiryId,
      staff,
      response,
      description,
      value,
      next_followup_date,
    } = req.body;

    // ✅ Validate input
    if (!enquiryId || !staff || !response) {
      return res.status(400).json({
        error: "Missing required fields (enquiryId, staff, response)",
      });
    }

    // ✅ Create a new follow-up entry
    const newFollowup = await Followup.create({
      enquiryId,
      staff,
      response,
      description,
      value,
      next_followup_date,
    });

    return res.status(201).json({
      message: "Follow-up created successfully",
      followup: newFollowup,
    });
  } catch (error) {
    console.error("❌ Error creating follow-up:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ 1️⃣ Get Next Follow-up Date and Response-wise Follow-ups
exports.getNextFollowups = async (req, res) => {
  try {
    const { next_followup_date, response } = req.query; // Accept date and response filters

    const followups = await Followup.findAll({
      where: {
        next_followup_date: next_followup_date
          ? { [Op.eq]: next_followup_date }
          : { [Op.ne]: null },
        response: response ? { [Op.eq]: response } : { [Op.ne]: null },
      },
      order: [["next_followup_date", "ASC"]],
    });

    return res.json({ followups });
  } catch (error) {
    console.error("❌ Error fetching next follow-ups:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ 2️⃣ Get Follow-ups Response-wise
exports.getFollowupsByResponse = async (req, res) => {
  try {
    const { response } = req.params; // Example: /api/followups/response/Confirmed

    const followups = await Followup.findAll({
      where: {
        response,
      },
      order: [["date", "DESC"]],
    });

    return res.json({ followups });
  } catch (error) {
    console.error("❌ Error fetching follow-ups by response:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ 3️⃣ Get Follow-ups within a Date Range (Based on Next Follow-up Date)
exports.getFollowupsByDateRange = async (req, res) => {
  try {
    const { start_date, end_date, response } = req.query; // Pass date range and response filter

    const followups = await Followup.findAll({
      where: {
        next_followup_date: {
          [Op.between]: [start_date, end_date],
        },
        ...(response && { response }),
      },
      attributes: [
        "next_followup_date",
        "response",
        [Sequelize.fn("COUNT", Sequelize.col("followupId")), "count"],
      ],
      group: ["next_followup_date", "response"],
      order: [["next_followup_date", "ASC"]],
    });

    return res.json({ followups });
  } catch (error) {
    console.error("❌ Error fetching follow-ups by date range:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ 4️⃣ Get Follow-ups by Enquiry ID
exports.getFollowupsByenquiryId = async (req, res) => {
  try {
    const { enquiryId } = req.params; // Example: /api/followups/enquiry/18927

    const followups = await Followup.findAll({
      where: {
        enquiryId,
      },
      order: [["date", "DESC"]],
    });

    return res.json({ followups });
  } catch (error) {
    console.error("❌ Error fetching follow-ups by enquiry ID:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
