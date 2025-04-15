const TechReschedule = require("../../models/serviceBooking/techReschedule");

exports.createReschedule = async (req, res) => {
  try {
    const {
      reschedule_date,
      reason,
      vendor_name,
      service_id,
      vendor_id,
      booking_service_id,
    } = req.body;

    const reschedule = await TechReschedule.create({
      reschedule_date,
      reason,
      vendor_name,
      service_id,
      vendor_id,
      booking_service_id,
    });

    res.status(201).json(reschedule);
  } catch (error) {
    console.error("Error in createReschedule:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllReschedules = async (req, res) => {
  try {
    const reschedules = await TechReschedule.findAll({
      include: {
        model: BookingService,
        attributes: ["id", "service_name", "service_date"],
      },
      order: [["created_at", "DESC"]],
    });

    res.json(reschedules);
  } catch (error) {
    console.error("Error in getAllReschedules:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getRescheduleByServiceId = async (req, res) => {
  try {
    const { booking_service_id } = req.params;

    const reschedule = await TechReschedule.findOne({
      where: { booking_service_id },
    });

    if (!reschedule) {
      return res.status(404).json({ error: "Reschedule not found" });
    }

    res.json(reschedule);
  } catch (error) {
    console.error("Error in getRescheduleByServiceId:", error);
    res.status(500).json({ error: "Server error" });
  }
};
