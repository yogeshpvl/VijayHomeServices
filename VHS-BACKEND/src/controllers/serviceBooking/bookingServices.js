const moment = require("moment");
const BookingService = require("../../models/serviceBooking/bookingServices");
const { Op, Sequelize } = require("sequelize");
const Booking = require("../../models/serviceBooking/bookings");
const User = require("../../models/customer/customer");
const Payment = require("../../models/payments/payments");

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
          model: Booking,
          required: true,
          attributes: [
            "id",
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
            "backoffice_executive",
            "type",
            "city",
            "selected_slot_text",
          ],
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

exports.updateServiceDetails = async (req, res) => {
  const { id } = req.params;
  const {
    customer_feedback,
    worker_names,
    day_to_complete,
    job_complete,
    tech_comment,
    worker_amount,

    vendor_id,
    vendor_name,
    cancel_reason,
    service_date,
  } = req.body;

  let finalStatus = req.body.status;

  if (job_complete === "CANCEL") {
    finalStatus = "SERVICE CANCELLED";
  } else if (job_complete === "YES") {
    finalStatus = "CLOSED BY OPERATION MANAGER";
  } else if (vendor_name) {
    finalStatus = "ASSIGNED FOR TECHNICIAN";
  }
  try {
    const service = await BookingService.findByPk(id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    try {
      // Update the service details inside the transaction
      service.customer_feedback =
        customer_feedback || service.customer_feedback;
      service.worker_names = worker_names || service.worker_names;
      service.day_to_complete = day_to_complete || service.day_to_complete;
      service.job_complete = job_complete || service.job_complete;
      service.tech_comment = tech_comment || service.tech_comment;
      service.worker_amount = worker_amount || service.worker_amount;
      service.status = finalStatus || service.status;
      service.vendor_id = vendor_id || service.vendor_id;
      service.vendor_name = vendor_name || service.vendor_name;
      service.cancel_reason = cancel_reason || service.cancel_reason;
      service.service_date = service_date || service.service_date;

      await service.save(); // Save within the transaction

      res.status(200).json({
        message: "Service details updated successfully",
        data: service,
      });
    } catch (error) {
      console.error("Error in transaction:", error);
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.ServiceStartByTenhnicain = async (req, res) => {
  const { id } = req.params;
  const {
    customer_feedback,
    worker_names,
    day_to_complete,
    job_complete,
    tech_comment,
    worker_amount,
    start_date_time,
    vendor_id,
    vendor_name,
    cancel_reason,
    service_date,
    before_service_img,
  } = req.body;

  let finalStatus = "SERVICE STARTED";

  try {
    const service = await BookingService.findByPk(id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    try {
      // Update the service details inside the transaction
      service.customer_feedback =
        customer_feedback || service.customer_feedback;
      service.worker_names = worker_names || service.worker_names;
      service.day_to_complete = day_to_complete || service.day_to_complete;
      service.job_complete = job_complete || service.job_complete;
      service.tech_comment = tech_comment || service.tech_comment;
      service.worker_amount = worker_amount || service.worker_amount;
      service.status = finalStatus || service.status;
      service.vendor_id = vendor_id || service.vendor_id;
      service.vendor_name = vendor_name || service.vendor_name;
      service.cancel_reason = cancel_reason || service.cancel_reason;
      service.service_date = service_date || service.service_date;
      service.start_date_time = start_date_time || service.start_date_time;
      service.before_service_img =
        before_service_img || service.before_service_img;

      await service.save(); // Save within the transaction

      res.status(200).json({
        message: "Service details updated successfully",
        data: service,
      });
    } catch (error) {
      console.error("Error in transaction:", error);
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.ServiceENDByTenhnicain = async (req, res) => {
  const { id } = req.params;
  const {
    customer_feedback,
    worker_names,
    day_to_complete,
    job_complete,
    tech_comment,
    worker_amount,
    end_date_time,
    vendor_id,
    vendor_name,
    cancel_reason,
    service_date,
    after_service_img,
  } = req.body;

  let finalStatus = "SERVICE COMPLETED";

  try {
    const service = await BookingService.findByPk(id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    try {
      // Update the service details inside the transaction
      service.customer_feedback =
        customer_feedback || service.customer_feedback;
      service.worker_names = worker_names || service.worker_names;
      service.day_to_complete = day_to_complete || service.day_to_complete;
      service.job_complete = job_complete || service.job_complete;
      service.tech_comment = tech_comment || service.tech_comment;
      service.worker_amount = worker_amount || service.worker_amount;
      service.status = finalStatus || service.status;
      service.vendor_id = vendor_id || service.vendor_id;
      service.vendor_name = vendor_name || service.vendor_name;
      service.cancel_reason = cancel_reason || service.cancel_reason;
      service.service_date = service_date || service.service_date;
      service.end_date_time = end_date_time || service.end_date_time;
      service.after_service_img =
        after_service_img || service.after_service_img;

      await service.save(); // Save within the transaction

      res.status(200).json({
        message: "Service details updated successfully",
        data: service,
      });
    } catch (error) {
      console.error("Error in transaction:", error);
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.error(error);
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

exports.getMonthlyPaymentsServiceCounts = async (req, res) => {
  try {
    const { from_date, end_date, city } = req.query;

    // Validate input parameters
    if (!from_date || !end_date || !city) {
      return res.status(400).json({
        error: "from_date, end_date, city,  are required",
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
        amt_date: {
          [Op.gte]: parsedFromDate, // greater than or equal to the start date
          [Op.lte]: parsedEndDate, // less than or equal to the end date
        },
      },
      include: {
        model: Booking, // Include the related Booking model
        where: {
          city: { [Op.in]: cityList }, // Filter by multiple cities using Op.in
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
    const {
      date,
      city,
      category,
      technician,
      jobType,
      paymentMode,
      name,
      address,
      contactNo,
      jobAmount,
      description,
      reference,
      page = 1,
      limit = 10,
    } = req.query;

    if (!date || !category) {
      return res
        .status(400)
        .json({ error: "date, city, and category are required" });
    }

    const cityList = city.split(",").map((c) => c.trim());
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageLimit;

    // Filters for Booking
    const bookingFilters = {
      [Op.and]: [
        { category },
        { city: { [Op.in]: cityList } },

        paymentMode ? { payment_mode: paymentMode } : {},
        description ? { description: { [Op.like]: `%${description}%` } } : {},
        reference ? { type: { [Op.like]: `%${reference}%` } } : {},
        jobAmount ? { service_charge: { [Op.like]: `%${jobAmount}%` } } : {},
        address
          ? Sequelize.where(Sequelize.json("delivery_address.address"), {
              [Op.like]: `%${address}%`,
            })
          : {},
      ],
    };

    // Filters for User (customer)
    const customerFilter = {
      ...(name && { customerName: { [Op.iLike]: `%${name}%` } }),
      ...(contactNo && { mainContact: contactNo }),
    };

    const serviceFilters = {
      [Op.and]: [
        Sequelize.where(
          Sequelize.fn("DATE", Sequelize.col("service_date")),
          date
        ),
        jobType
          ? { service_name: { [Op.iLike]: `%${jobType}%` } } // ✅ partial match
          : {},
        technician
          ? { vendor_name: { [Op.iLike]: `%${technician}%` } } // ✅ partial match
          : {},
      ],
    };

    // Main query with includes
    const services = await BookingService.findAll({
      where: serviceFilters,
      attributes: [
        "vendor_name",
        "service_charge",
        "service_name",
        "service_date",
        "status",
        "id",
      ],
      include: [
        {
          model: Booking,
          required: true,
          where: bookingFilters,
          include: [
            {
              model: User,
              as: "customer",
              where: customerFilter,
              attributes: [
                "id",
                "customerName",
                "email",
                "mainContact",
                "alternateContact",
                "gst",
              ],
            },
          ],
        },
      ],
      offset,
      limit: pageLimit,
      order: [["service_date", "ASC"]],
    });
    const vendorNames = await BookingService.findAll({
      where: Sequelize.where(
        Sequelize.fn("DATE", Sequelize.col("service_date")),
        date
      ),

      attributes: ["vendor_name"],
      group: ["vendor_name"],
      raw: true,
    });

    // Count query for pagination
    const totalServicesCount = await BookingService.count({
      where: serviceFilters,
    });

    const totalPages = Math.ceil(totalServicesCount / pageLimit);

    res.status(200).json({
      totalCount: totalServicesCount,
      totalPages,
      currentPage: pageNumber,
      data: services,
      vendorNames: vendorNames,
    });
  } catch (error) {
    console.error("Error fetching service data:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
};

exports.getPaymentsReportDailyServiceData = async (req, res) => {
  try {
    const {
      date,
      city,

      technician,
      jobType,
      paymentMode,
      name,
      address,
      contactNo,
      jobAmount,
      description,
      reference,
      page = 1,
      limit = 10,
    } = req.query;

    if (!date) {
      return res.status(400).json({ error: "date and city are required" });
    }

    const cityList = city.split(",").map((c) => c.trim());
    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageLimit;

    // Filters for Booking
    const bookingFilters = {
      [Op.and]: [
        { city: { [Op.in]: cityList } },

        paymentMode ? { payment_mode: paymentMode } : {},
        description ? { description: { [Op.like]: `%${description}%` } } : {},
        reference ? { type: { [Op.like]: `%${reference}%` } } : {},
        jobAmount ? { service_charge: { [Op.like]: `%${jobAmount}%` } } : {},
        address
          ? Sequelize.where(Sequelize.json("delivery_address.address"), {
              [Op.like]: `%${address}%`,
            })
          : {},
      ],
    };

    // Filters for User (customer)
    const customerFilter = {
      ...(name && { customerName: { [Op.iLike]: `%${name}%` } }),
      ...(contactNo && { mainContact: contactNo }),
    };

    const serviceFilters = {
      [Op.and]: [
        Sequelize.where(Sequelize.fn("DATE", Sequelize.col("amt_date")), date),
        jobType ? { service_name: { [Op.iLike]: `%${jobType}%` } } : {},
        technician ? { vendor_name: { [Op.iLike]: `%${technician}%` } } : {},
      ],
    };

    // Main query with includes
    const services = await BookingService.findAll({
      where: serviceFilters,
      attributes: [
        "vendor_name",
        "service_charge",
        "service_name",
        "service_date",
        "status",
        "id",
        "amt_date",
      ],
      include: [
        {
          model: Booking,
          required: true,
          where: bookingFilters,
          include: [
            {
              model: User,
              as: "customer",
              where: customerFilter,
              attributes: [
                "id",
                "customerName",
                "email",
                "mainContact",
                "alternateContact",
                "gst",
              ],
            },
            {
              model: Payment,
              as: "payments",
            },
          ],
        },
      ],
      offset,
      limit: pageLimit,
      order: [["service_date", "ASC"]],
    });
    const vendorNames = await BookingService.findAll({
      where: Sequelize.where(
        Sequelize.fn("DATE", Sequelize.col("service_date")),
        date
      ),

      attributes: ["vendor_name"],
      group: ["vendor_name"],
      raw: true,
    });

    // Count query for pagination
    const totalServicesCount = await BookingService.count({
      where: serviceFilters,
    });

    const totalPages = Math.ceil(totalServicesCount / pageLimit);

    res.status(200).json({
      totalCount: totalServicesCount,
      totalPages,
      currentPage: pageNumber,
      data: services,
      vendorNames: vendorNames,
    });
  } catch (error) {
    console.error("Error fetching service data:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
};

exports.getDSRReportFilter = async (req, res) => {
  try {
    const {
      fromdate,
      todate,
      city,
      category,
      technician,
      jobType,
      paymentMode,
      description,
      reference,
      page = 1,
      limit = 25,
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageLimit = parseInt(limit, 10);
    const offset = (pageNumber - 1) * pageLimit;

    const cityList = city?.split(",").map((c) => c.trim()) || [];

    // Filters for Booking
    const bookingFilters = {
      [Op.and]: [
        category ? { category } : {},
        cityList.length ? { city: { [Op.in]: cityList } } : {},
        paymentMode ? { payment_mode: paymentMode } : {},
        description ? { description: { [Op.like]: `%${description}%` } } : {},
        reference ? { type: { [Op.like]: `%${reference}%` } } : {},
      ],
    };

    // Filters for Customer (User)
    const customerFilter = {};
    // Add name/contact filters here if needed

    // Filters for BookingService
    const serviceFilters = {
      [Op.and]: [
        fromdate && todate
          ? {
              service_date: {
                [Op.between]: [
                  new Date(fromdate),
                  new Date(new Date(todate).setHours(23, 59, 59)),
                ],
              },
            }
          : {},
        jobType ? { service_name: { [Op.iLike]: `%${jobType}%` } } : {},
        technician ? { vendor_name: { [Op.iLike]: `%${technician}%` } } : {},
      ],
    };

    const services = await BookingService.findAll({
      where: serviceFilters,
      attributes: [
        "vendor_name",
        "service_charge",
        "service_name",
        "service_date",
        "status",
        "id",
      ],
      include: [
        {
          model: Booking,
          required: true,
          attributes: [
            "category",
            "city",
            "contract_type",
            "delivery_address",
            "description",
            "payment_mode",
            "reference",
            "selected_slot_text",
            "service",
            "service_charge",
            "type",
            "backoffice_executive",
          ],
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
              ],
            },
          ],
        },
      ],

      offset,
      limit: pageLimit,
      order: [["service_date", "ASC"]],
    });

    const vendorNames = await BookingService.findAll({
      where:
        fromdate && todate
          ? {
              service_date: {
                [Op.between]: [
                  new Date(fromdate),
                  new Date(new Date(todate).setHours(23, 59, 59)),
                ],
              },
            }
          : {},
      attributes: ["vendor_name"],
      group: ["vendor_name"],
      raw: true,
    });

    const totalServicesCount = await BookingService.count({
      where: serviceFilters,
    });

    res.status(200).json({
      totalCount: totalServicesCount,
      totalPages: Math.ceil(totalServicesCount / pageLimit),
      currentPage: pageNumber,
      data: services,
      vendorNames,
    });
  } catch (error) {
    console.error("Error fetching service data:", error);
    res.status(500).json({ error: "Server error, please try again later." });
  }
};
