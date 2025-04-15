const Techcancel = require("../../models/serviceBooking/techCancel");

exports.createTechCancel = async (req, res) => {
  try {
    const {
      reason,
      vendor_name,
      service_id,
      vendor_id,
      cancel,
      booking_service_id,
    } = req.body;

    const newCancel = await Techcancel.create({
      reason,
      vendor_name,
      service_id,
      vendor_id,
      cancel,
      booking_service_id,
    });

    res.status(201).json(newCancel);
  } catch (error) {
    console.error("Error in createTechCancel:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllTechCancels = async (req, res) => {
  try {
    const cancels = await Techcancel.findAll({
      include: {
        model: BookingService,
        attributes: ["id", "service_name", "service_date"],
      },
      order: [["created_at", "DESC"]],
    });

    res.json(cancels);
  } catch (error) {
    console.error("Error in getAllTechCancels:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getTechCancelByServiceId = async (req, res) => {
  try {
    const { booking_service_id } = req.params;
    const cancel = await Techcancel.findOne({
      where: { booking_service_id },
    });

    if (!cancel) {
      return res.status(404).json({ error: "Tech cancel not found" });
    }

    res.json(cancel);
  } catch (error) {
    console.error("Error in getTechCancelByServiceId:", error);
    res.status(500).json({ error: "Server error" });
  }
};
