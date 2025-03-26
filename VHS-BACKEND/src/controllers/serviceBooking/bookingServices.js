const moment = require("moment");
const BookingService = require("../../models/serviceBooking/bookingServices");
const { Op, Sequelize } = require("sequelize");
const Booking = require("../../models/serviceBooking/bookings");
const User = require("../../models/customer/customer");

// ✅ Create a new booking service entry
exports.createBookingService = async (req, res) => {
  try {
    const newService = await BookingService.create(req.body);
    res.status(201).json({
      message: "Service added to booking successfully",
      data: newService,
    });
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

exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params; // Get the `id` from URL params

    // Fetch the service with related Booking and User (customer) data
    const service = await BookingService.findOne({
      where: { id: id }, // Find the service by ID
      include: [
        {
          model: Booking, // Include the related Booking model
          required: true, // Ensures that the `Booking` model is joined (inner join)
          attributes: [
            "city",
            "category",
            "contract_type",
            "service_frequency",
            "start_date",
            "expiry_date",
            "selected_slot_text",
            "service_charge",
            "delivery_address",
            "description",
            "payment_mode",
            "type",
          ], // Include relevant fields from Booking
          include: [
            {
              model: User, // Include the related User model (customer details)
              as: "customer", // Alias for the association
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
        },
      ],
    });

    // If no service found, return an error message
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Return the service details with associated data
    return res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching service by ID:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ Get monthly booking services with optional vendor filtering
exports.getMonthlyBookingServices = async (req, res) => {
  try {
    const { start_date, end_date, category } = req.params;
    const { vendor_name } = req.query;

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const whereCondition = {
      service_date: { [Op.gte]: startDate, [Op.lt]: endDate },
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

    res
      .status(200)
      .json({ message: "Service status updated successfully", data: service });
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

exports.getMonthlyServiceCounts = async (req, res) => {
  try {
    const { from_date, end_date, city, category } = req.query;

    // Validate input parameters
    if (!from_date || !end_date || !city || !category) {
      return res.status(400).json({
        error: "from_date, end_date, city, and category are required",
      });
    }

    // Parse the dates
    const parsedFromDate = moment(from_date).startOf("day").toDate();
    const parsedEndDate = moment(end_date).endOf("day").toDate();

    // Split cities into an array
    const cityList = city.split(",");

    // Step 1: Get the services for the given date range, cities, and category
    const services = await BookingService.findAll({
      where: {
        service_date: {
          [Op.gte]: parsedFromDate, // greater than or equal to the start date
          [Op.lte]: parsedEndDate, // less than or equal to the end date
        },
      },
      include: {
        model: Booking, // Include the related Booking model
        where: {
          city: { [Op.in]: cityList }, // Filter by multiple cities using Op.in
          category: category, // Filter by category
        },
        required: true, // Ensures that the `Booking` model is joined (inner join)
        attributes: [], // Optionally, exclude fields from the `Booking` model
      },
    });

    if (services.length === 0) {
      return res
        .status(200)
        .json({ message: "No services found for the given parameters." });
    }

    // Step 2: Group services by day
    const serviceCountsByDay = {};
    let totalServiceCount = 0; // Initialize total count

    services.forEach((service) => {
      const day = moment(service.service_date).format("YYYY-MM-DD"); // Get the day in "YYYY-MM-DD" format

      if (!serviceCountsByDay[day]) {
        serviceCountsByDay[day] = 0;
      }

      serviceCountsByDay[day] += 1;
      totalServiceCount += 1; // Increment total service count
    });

    // Prepare response data in a sorted format (by day)
    const responseData = Object.keys(serviceCountsByDay)
      .sort() // Sort the days in ascending order
      .map((day) => ({
        day,
        serviceCount: serviceCountsByDay[day],
      }));

    console.log("responseData", responseData);
    // Include the total count in the response
    res.status(200).json({
      totalCount: totalServiceCount,
      data: responseData,
    });
  } catch (error) {
    console.log("Error fetching service counts:", error.message);
    res.status(500).json({ error: "Server error, please try again later." });
  }
};
exports.getDailyServiceData = async (req, res) => {
  try {
    const { date, city, category, page = 1, limit = 10 } = req.query;

    // Validate input parameters
    if (!date || !city || !category) {
      return res.status(400).json({
        error: "date, city, and category are required",
      });
    }

    const parsedDate = date; // Date is already in YYYY-MM-DD format

    // Split cities into an array, making sure to trim spaces
    const cityList = city.split(",").map((c) => c.trim());

    // Convert page and limit to numbers
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);

    // Calculate the offset for pagination
    const offset = (pageNumber - 1) * pageLimit;

    const services = await BookingService.findAll({
      where: Sequelize.where(
        Sequelize.fn("date", Sequelize.col("service_date")), // Extract only the date part
        parsedDate
      ),
      include: [
        {
          model: Booking, // Include the related Booking model
          where: {
            city: { [Op.in]: cityList }, // Filter by multiple cities using Op.in
            category: category, // Filter by category
          },
          required: true, // Ensures that the `Booking` model is joined (inner join)
          attributes: [
            "city",
            "category",
            "selected_slot_text",
            "service_charge",
            "delivery_address",
            "description",
            "payment_mode",
            "type",
          ], // Include city and category in the response
          include: [
            {
              model: User, // Include the related User model (customer details)
              as: "customer", // Alias used in the association
              attributes: [
                "id",
                "customerName", // Include customer details
                "email",
                "mainContact",
                "alternateContact",
                "gst",
                // Add other customer attributes here
              ],
            },
          ],
        },
      ],
      offset: offset, // Apply pagination offset
      limit: pageLimit, // Apply pagination limit
    });

    // If no services found, return a message
    if (services.length === 0) {
      return res
        .status(200)
        .json({ message: "No services found for the given parameters." });
    }

    // Step 2: Get the total number of services for pagination (without limits)
    const totalServicesCount = await BookingService.count({
      where: {
        service_date: parsedDate, // Exact match for the service date
      },
      include: [
        {
          model: Booking, // Include the related Booking model
          where: {
            city: { [Op.in]: cityList }, // Filter by multiple cities using Op.in
            category: category, // Filter by category
          },
          required: true, // Ensures that the `Booking` model is joined (inner join)
        },
      ],
    });

    // Include the total count in the response with pagination metadata
    const totalPages = Math.ceil(totalServicesCount / pageLimit);
    res.status(200).json({
      totalCount: totalServicesCount,
      totalPages: totalPages,
      currentPage: pageNumber,
      data: services,
    });
  } catch (error) {
    console.log("Error fetching service data:", error.message);
    res.status(500).json({ error: "Server error, please try again later." });
  }
};
