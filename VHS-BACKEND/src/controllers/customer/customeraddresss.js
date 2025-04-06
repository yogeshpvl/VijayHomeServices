const UserAddress = require("../../models/customer/customeraddresss");

// Create
exports.createAddress = async (req, res) => {
  try {
    const data = await UserAddress.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create address", details: error.message });
  }
};

// Delete
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await UserAddress.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete address", details: error.message });
  }
};

// Get all by user_id
exports.getAddressesByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const addresses = await UserAddress.findAll({ where: { user_id } });
    res.json(addresses);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch addresses", details: error.message });
  }
};
