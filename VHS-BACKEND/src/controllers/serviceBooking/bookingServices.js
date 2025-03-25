const BookingService = require("../../models/serviceBooking/bookingServices");
const { Op } = require("sequelize");

// ✅ Create a new booking service entry
exports.createBookingService = async (req, res) => {
    try {
        const newService = await BookingService.create(req.body);
        res.status(201).json({ message: "Service added to booking successfully", data: newService });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get all services for a specific booking
exports.getServicesByBookingId = async (req, res) => {
    try {
        const { booking_id } = req.params;
        const services = await BookingService.findAll({ where: { booking_id } });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get monthly booking services with optional vendor filtering
exports.getMonthlyBookingServices = async (req, res) => {
    try {
        const { year, month } = req.params;
        const { vendor_name } = req.query;

        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const whereCondition = {
            service_date: { [Op.gte]: startDate, [Op.lt]: endDate }
        };

        if (vendor_name) {
            whereCondition.vendor_name = vendor_name;
        }

        const services = await BookingService.findAll({ where: whereCondition });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Update service status (e.g., "Completed", "Canceled")
exports.updateServiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const service = await BookingService.findByPk(id);
        if (!service) return res.status(404).json({ message: "Service not found" });

        service.status = status;
        await service.save();

        res.status(200).json({ message: "Service status updated successfully", data: service });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Delete a booking service entry
exports.deleteBookingService = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await BookingService.destroy({ where: { id } });

        if (!deleted) return res.status(404).json({ message: "Service not found" });

        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
