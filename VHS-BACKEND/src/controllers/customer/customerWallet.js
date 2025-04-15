const Customer = require("../../models/customer/customer");
const CustomerWalletHistory = require("../../models/customer/customerWallet");

exports.addWalletEntry = async (req, res) => {
  const { user_id, description, wamt } = req.body;

  if (!user_id || !wamt) {
    return res.status(400).json({ message: "user_id and wamt are required" });
  }

  await Customer({ wAmount: wamt }, { user_id: user_id });
  try {
    const entry = await CustomerWalletHistory.create({
      user_id,
      description,
      wamt,
    });

    res.status(201).json({
      message: "Wallet entry added successfully",
      data: entry,
    });
  } catch (error) {
    console.error("Error creating wallet history:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getWalletHistoryByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const history = await CustomerWalletHistory.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      message: "Wallet history fetched successfully",
      data: history,
    });
  } catch (error) {
    console.error("Error fetching wallet history:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
