const db = require("../../models");
const { Booking, BookingService, User } = db;
const { Op } = require("sequelize");

exports.getRunningProjectWithFilter = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 25,
      name,
      city,
      contactNo,
      jobAmount,
      description,
      reference,
      technician,
      sales_executive,
    } = req.query;

    // Ensure city is split and defined correctly
    const cityList = city ? city.split(",") : [];
    const category = "Painting";
    const contract_type = "AMC";

    console.log(
      `Filters received - Name: ${name}, City: ${city}, Contact No: ${contactNo}, Job Amount: ${jobAmount}, Description: ${description}, Reference: ${reference}, Technician: ${technician}`
    );

    // Convert page & limit to numbers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;

    // Customer filters
    const customerFilters = {};
    if (name) customerFilters.customerName = { [Op.iLike]: `%${name}%` };

    if (contactNo) customerFilters.mainContact = { [Op.eq]: contactNo }; // Use exact match if it's numeric

    if (reference) customerFilters.reference = { [Op.iLike]: `%${reference}%` };

    // Quotation filters
    const quotationFilters = {};
    if (sales_executive)
      quotationFilters.sales_executive = { [Op.eq]: sales_executive };

    // Booking service filters
    const bookingServiceFilters = {};
    if (jobAmount)
      bookingServiceFilters.worker_amount = { [Op.iLike]: `%${jobAmount}%` };
    if (description)
      bookingServiceFilters.tech_comment = { [Op.iLike]: `%${description}%` };

    if (technician)
      bookingServiceFilters.vendor_name = { [Op.iLike]: `%${technician}%` };
    // Building the query dynamically based on filters
    const bookings = await Booking.findAndCountAll({
      where: {
        category,
        city: { [Op.in]: cityList }, // Apply city filter
        contract_type,
      },
      attributes: [
        "id",
        "enquiryId",
        "category",
        "city",
        "delivery_address",
        "createdAt",
      ],
      limit: limitNumber,
      offset: offset,
      order: [["id", "DESC"]],
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
          where: bookingServiceFilters, // Apply jobAmount and description filter
        },
        {
          model: User,
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
          where: customerFilters, // Apply customer-related filters
        },
        {
          model: db.Quotation,
          as: "quotation",
          attributes: [
            "quotation_id",
            "enquiryId",
            "project_type",
            "grand_total",
            "quotation_date",
            "booked_by",
            "sales_executive",
          ],
          where: quotationFilters, // Apply technician filter
        },
        {
          model: db.Payment,
          as: "payments",
        },
      ],
    });

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

const safeDate = (val) => {
  const d = new Date(val);
  return isNaN(d) ? null : d;
};
exports.createBooking = async (req, res) => {
  try {
    const {
      contract_type,
      service,
      delivery_address,
      service_charge,
      serviceFrequency,
      start_date,
      expiry_date,
      amt_frequency,
      amtstart_date,
      amtexpiry_date,
      enquiryId,
      user_id,
    } = req.body;

    const service_id = "121";

    // Step 1: Create the booking
    const newBooking = await Booking.create({
      ...req.body,
      amt_frequency: amt_frequency || null,
      amtstart_date: safeDate(amtstart_date),
      amtexpiry_date: safeDate(amtexpiry_date),
      start_date: safeDate(start_date),
      expiry_date: safeDate(expiry_date),
      delivery_address,
      service_frequency: serviceFrequency,
      enquiryId,
    });

    console.log("service_id", service_id, service);
    if (!service_id || !service) {
      return res.status(400).json({
        error: "service_id and service are required to create booking_services",
      });
    }

    if (contract_type === "AMC") {
      const frequency = Number(serviceFrequency);
      const start = new Date(start_date);
      const end = new Date(expiry_date);

      const amtFreq = Number(amt_frequency);
      const amtStart = new Date(amtstart_date);
      const amtEnd = new Date(amtexpiry_date);

      const totalCharge = parseFloat(service_charge);
      const dividedAmount = +(totalCharge / amtFreq).toFixed(2); // Rounded to 2 decimals

      let serviceDates = [];
      let amtDates = [];

      // Generate service dates
      if (frequency <= 1) {
        serviceDates = [start];
      } else {
        const interval = (end.getTime() - start.getTime()) / (frequency - 1);
        for (let i = 0; i < frequency; i++) {
          serviceDates.push(new Date(start.getTime() + i * interval));
        }
      }

      // Generate amount dates
      if (amtFreq <= 1) {
        amtDates = [amtStart];
      } else {
        const amtInterval =
          (amtEnd.getTime() - amtStart.getTime()) / (amtFreq - 1);
        for (let i = 0; i < amtFreq; i++) {
          amtDates.push(new Date(amtStart.getTime() + i * amtInterval));
        }
      }

      const entryCount = Math.max(serviceDates.length, amtDates.length);

      const serviceEntries = Array.from({ length: entryCount }, (_, i) => ({
        booking_id: newBooking.id,
        service_name: service,
        service_id: service_id || "",
        service_charge: dividedAmount,
        service_date: serviceDates[i] || serviceDates[serviceDates.length - 1],
        amt_date: amtDates[i] || amtDates[amtDates.length - 1],
        user_id,
      }));

      await BookingService.bulkCreate(serviceEntries);
    }

    // Step 3: Handle One Time contract
    if (contract_type === "One Time") {
      await BookingService.create({
        booking_id: newBooking.id,
        service_name: service,
        service_id,
        user_id,
        service_charge,
        service_date: safeDate(start_date),
        amt_date: safeDate(start_date),
      });
    }

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
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
    // Find booking by primary key (ID) and include associated customer data
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: User,
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

    // Check if booking was found
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Return the booking along with associated customer data
    res.status(200).json(booking);
  } catch (error) {
    // Handle any errors that occur during the process
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
    console.log("req.body ", req.body);
    console.log("req.params.id ", req.params.id);

    // Check if body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No data to update" });
    }

    // Find the booking first
    const booking = await Booking.findOne({ where: { id: req.body.id } });

    console.log("booking", booking);
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

exports.gettotalCounts = async (req, res) => {
  try {
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);

    const currentMonthEnd = new Date(currentMonthStart);
    currentMonthEnd.setMonth(currentMonthEnd.getMonth() + 1);
    currentMonthEnd.setMilliseconds(-1);

    // Query the total count for the current month
    const { count } = await Booking.findAndCountAll({
      where: {
        createdAt: {
          [Op.gte]: currentMonthStart, // Greater than or equal to the first day of the current month
          [Op.lte]: currentMonthEnd, // Less than or equal to the last day of the current month
        },
      },
    });

    // Return the count of items created in the current month
    res.json({
      totalItems: count,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
