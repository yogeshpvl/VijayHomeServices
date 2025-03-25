const VendorAssignment = require("../../models/serviceBooking/vendorAssignments");
const Booking = require("../../models/serviceBooking/bookings");
const Vendor = require("../../models/master/vendors");

exports.assignVendor = async (req, res) => {
  try {
    const { booking_id, vendor_id } = req.body;

    // Check if booking exists
    const booking = await Booking.findByPk(booking_id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Check if vendor exists
    const vendor = await Vendor.findByPk(vendor_id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    // Assign vendor
    const assignment = await VendorAssignment.create({ booking_id, vendor_id });

    return res
      .status(201)
      .json({ message: "Vendor assigned successfully", assignment });
  } catch (error) {
    console.error("Error assigning vendor:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAssignedVendors = async (req, res) => {
  try {
    const { booking_id } = req.params;

    const assignments = await VendorAssignment.findAll({
      where: { booking_id },
      include: [
        {
          model: Vendor,
          as: "vendor",
          attributes: ["id", "name", "phone", "email"],
        },
      ],
    });

    if (!assignments.length)
      return res.status(404).json({ message: "No vendors assigned" });

    return res.json(assignments);
  } catch (error) {
    console.error("Error fetching assigned vendors:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getVendorBookings = async (req, res) => {
  try {
    const { vendor_id } = req.params;

    const assignments = await VendorAssignment.findAll({
      where: { vendor_id },
      include: [
        {
          model: Booking,
          as: "booking",
          attributes: ["id", "category", "start_date", "city"],
        },
      ],
    });

    if (!assignments.length)
      return res
        .status(404)
        .json({ message: "No bookings assigned to this vendor" });

    return res.json(assignments);
  } catch (error) {
    console.error("Error fetching vendor bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
