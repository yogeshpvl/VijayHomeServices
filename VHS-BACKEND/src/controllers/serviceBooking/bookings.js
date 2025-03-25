const Booking = require("../../models/serviceBooking/bookings");
const BookingService = require("../../models/serviceBooking/bookingServices");
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

// ✅ Update a booking by ID
exports.updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedBooking[0] === 0)
      return res.status(404).json({ message: "Booking not found" });
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
    const { year, month, category, city } = req.query;
    const cacheKey = `bookings:${year}-${month}:${category}:${city}`;

    // Check Redis cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("🚀 Returning cached data");
      return res.json(JSON.parse(cachedData));
    }

    // Fetch from DB if not cached
    const bookings = await Booking.findAll({
      where: {
        category,
        city,
        start_date: {
          [Op.between]: [`${year}-${month}-01`, `${year}-${month}-31`],
        },
      },
    });

    // Count bookings per day
    let dailyCounts = {};
    bookings.forEach((booking) => {
      const date = booking.start_date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    // Store in Redis for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(dailyCounts));

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
