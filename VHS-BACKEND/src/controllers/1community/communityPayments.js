const CommunityPayment = require("../../models/1community/communityPayments");

exports.createPayment = async (req, res) => {
  try {
    const payment = await CommunityPayment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create payment", details: error });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await CommunityPayment.findAll();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await CommunityPayment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payment" });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    await CommunityPayment.update(req.body, { where: { id: req.params.id } });
    res.status(200).json({ message: "Payment updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update payment" });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    await CommunityPayment.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete payment" });
  }
};
