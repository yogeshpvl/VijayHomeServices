const Community = require("../../models/1community/community");

exports.createCommunity = async (req, res) => {
  try {
    const data = await Community.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create community", details: error });
  }
};

exports.getAllCommunities = async (req, res) => {
  try {
    const data = await Community.findAll();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch communities" });
  }
};

exports.getCommunityById = async (req, res) => {
  try {
    const data = await Community.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "Community not found" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch community" });
  }
};

exports.updateCommunity = async (req, res) => {
  try {
    await Community.update(req.body, { where: { id: req.params.id } });
    res.status(200).json({ message: "Community updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update community" });
  }
};

exports.deleteCommunity = async (req, res) => {
  try {
    await Community.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Community deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete community" });
  }
};
