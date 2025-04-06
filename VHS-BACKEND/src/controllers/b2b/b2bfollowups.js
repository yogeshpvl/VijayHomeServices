const B2BFollowup = require("../../models/b2b/b2b");

exports.createFollowup = async (req, res) => {
  try {
    const followup = await B2BFollowup.create(req.body);
    res.status(201).json(followup);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create B2B follow-up", details: error });
  }
};

exports.getAllFollowups = async (req, res) => {
  try {
    const followups = await B2BFollowup.findAll();
    res.status(200).json(followups);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch follow-ups" });
  }
};

exports.getFollowupById = async (req, res) => {
  try {
    const followup = await B2BFollowup.findByPk(req.params.id);
    if (!followup)
      return res.status(404).json({ message: "Follow-up not found" });
    res.status(200).json(followup);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch follow-up" });
  }
};

exports.updateFollowup = async (req, res) => {
  try {
    await B2BFollowup.update(req.body, {
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Follow-up updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update follow-up" });
  }
};

exports.deleteFollowup = async (req, res) => {
  try {
    await B2BFollowup.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Follow-up deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete follow-up" });
  }
};
