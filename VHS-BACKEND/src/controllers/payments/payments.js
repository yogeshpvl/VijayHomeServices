const Payment = require("../../models/payments/payments");

exports.createPayment = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const data = await Payment.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create payment", details: error });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const { service_id, service_date } = req.query;

    const where = {};
    if (service_id) where.service_id = service_id;
    if (service_date) where.service_date = service_date;

    const payments = await Payment.findAll({ where });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payments", details: error });
  }
};

exports.getPaymentByServiceId = async (req, res) => {
  try {
    const { service_id } = req.params;

    const data = await Payment.findAll({
      where: { service_id: service_id }, // Ensure `serviceId` is the correct column name
    });

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ message: "No payments found for this service" });
    }

    res.status(200).json({ payments: data });
  } catch (error) {
    console.error("Error fetching payment by service ID:", error);
    res.status(500).json({ error: "Failed to fetch payment" });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    await Payment.update(req.body, { where: { id: req.params.id } });
    res.status(200).json({ message: "Payment updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update payment" });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    await Payment.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete payment" });
  }
};
