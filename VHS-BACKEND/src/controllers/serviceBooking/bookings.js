const Booking = require("../../models/serviceBooking/bookings");
const BookingService = require("../../models/serviceBooking/bookingServices");
const User = require("../../models/customer/customer");
const { Op } = require("sequelize");

exports.createBooking = async (req, res) => {
  try {
    const {
      contract_type,
      service,
      service_id,
      service_charge,
      serviceFrequency,
      start_date,
      expiry_date,
    } = req.body;

    console.log("start_date,expiry_date", start_date, expiry_date, service);

    // Step 1: Create booking entry
    const newBooking = await Booking.create(req.body);

    // Step 2: If AMC, calculate multiple service dates
    if (contract_type === "AMC") {
      let serviceDates = [];
      let currentDate = new Date(start_date);

      while (currentDate <= new Date(expiry_date)) {
        serviceDates.push(new Date(currentDate));

        if (serviceFrequency === "Monthly") {
          currentDate.setMonth(currentDate.getMonth() + 1);
        } else if (serviceFrequency === "Quarterly") {
          currentDate.setMonth(currentDate.getMonth() + 3);
        } else if (serviceFrequency === "Yearly") {
          currentDate.setFullYear(currentDate.getFullYear() + 1);
        }
      }

      // Insert all service dates into `booking_services`
      const serviceEntries = serviceDates.map((date) => ({
        booking_id: newBooking.id,
        service_name: service,
        service_id,
        service_charge,
        service_date: date,
        status: "Pending",
      }));

      await BookingService.bulkCreate(serviceEntries);
    } else {
      // For one-time services, insert a single row
      await BookingService.create({
        booking_id: newBooking.id,
        service_name: service,
        service_id: "",
        service_charge,
        service_date: new Date(start_date),
        status: "Pending",
      });
    }

    res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.log("error.message", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookingsByUserId = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.params.user_id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    // Check if body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No data to update" });
    }

    console.log("req.params.id ", req.params.id, req.body);

    // Find the booking first
    const booking = await Booking.findOne({ where: { id: req.params.id } });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Dynamically update only the fields that are present in req.body
    const updatedBooking = await booking.update(req.body);

    // Log the update result
    console.log("updatedBooking", updatedBooking);

    res.status(200).json({ message: "Booking updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a booking by ID
exports.deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.destroy({
      where: { id: req.params.id },
    });
    if (!deletedBooking)
      return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMonthlyCounts = async (req, res) => {
  try {
    const { fromdate, enddate, category, city } = req.query;

    console.log("city", city);
    // Fetch from DB if not cached
    const bookings = await Booking.findAll({
      where: {
        category,
        city,
        start_date: {
          [Op.between]: [`${fromdate}`, `${enddate}`],
        },
      },
    });

    // Count bookings per day
    let dailyCounts = {};
    bookings.forEach((booking) => {
      const date = booking.start_date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    return res.json(dailyCounts);
  } catch (error) {
    console.error("Error fetching monthly counts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getBookingsWithFilter = async (req, res) => {
  try {
    const { date, category, city, page = 1, limit = 10 } = req.query;

    // Convert page & limit to numbers
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const bookings = await Booking.findAndCountAll({
      where: {
        category,
        city,
        start_date: date,
      },
      limit: limitNumber,
      offset: offset,
      order: [["start_date", "DESC"]],
    });

    return res.json({
      totalRecords: bookings.count,
      totalPages: Math.ceil(bookings.count / limitNumber),
      currentPage: pageNumber,
      bookings: bookings.rows,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getRunningProjectWithFilter = async (req, res) => {
  try {
    const { page = 1, limit = 25 } = req.query;
    const city = "Bangalore";
    const category = "Painting";
    const contract_type = "AMC";

    // Convert page & limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Log filters for debugging
    console.log("Filters:", { category, city, contract_type });

    const bookings = await Booking.findAndCountAll({
      where: {
        category,
        city,
        contract_type,
      },
      limit: limitNumber,
      offset: offset,
      order: [["start_date", "DESC"]],
      include: [
        {
          model: BookingService,
          required: true,
          attributes: [
            "id",
            "worker_names",
            "day_to_complete",
            "job_complete",
            "tech_comment",
            "worker_amount",
            "vendor_name",
          ],
        },
        {
          model: User, // Include the customer model
          as: "customer",
          attributes: [
            "id",
            "customerName",
            "email",
            "mainContact",
            "alternateContact",
            "lnf",
            "city",
            "approach",
            "reference",
          ],
        },
      ],
    });

    console.log("Bookings found:", bookings.count); // Log count of found bookings

    // Return the paginated result
    return res.json({
      totalRecords: bookings.count,
      totalPages: Math.ceil(bookings.count / limitNumber),
      currentPage: pageNumber,
      bookings: bookings.rows,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
