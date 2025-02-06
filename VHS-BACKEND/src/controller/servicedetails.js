const servicedetailsmodel = require("../model/servicedetails");
const customerModel = require("../model/customer");
const addcallModel = require("../model/addcall");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = require("mongodb");
const moment = require("moment");
const mongoose = require("mongoose");
const recheduledatasmodel = require("../model/rescheduledata");
const automatedServiceModel = require("../model/Automated");
const { firebase } = require("../firebase");
const technicianmodel = require("../model/master/technician");
const { pipeline } = require("nodemailer/lib/xoauth2");

const sendNotificationToMultipleDevices = async () => {
  try {
    // Fetch FCM tokens from the database
    const vendors = await technicianmodel.find({}).select("fcmtoken");
    console.log("vendors--", vendors);

    // Check if vendors array is not empty
    if (!vendors || vendors.length === 0) {
      console.log("No vendors found");
      return;
    }

    // Loop through each vendor and send the notification
    const notificationPromises = vendors.map(async (vendor) => {
      try {
        await firebase.messaging().send({
          token: vendor.fcmtoken,
          notification: {
            title: "Hey you earned money",
            body: "New job assigned from crm please check",
          },
          data: {
            navigationId: "login",
            chatId: "12345",
          },
        });
        console.log(
          `Notification sent successfully to vendor with FCM token: ${vendor.fcmtoken}`
        );
      } catch (error) {
        console.error(
          `Error sending notification to vendor with FCM token ${vendor.fcmtoken}:`,
          error
        );
      }
    });

    // Wait for all notifications to be sent
    const results = await Promise.all(notificationPromises);

    // Log results
    results.forEach((res, index) => {
      console.log(`Notification ${index + 1} sent successfully:`, res);
    });
  } catch (error) {
    console.log("Error sending FCM notification:", error);
  }
};

class servicedetails {
  async MissedDsrData(req, res) {
    try {
      let servicedetails = await servicedetailsmodel
        .find({
          $or: [{ city: "" }, { city: { $exists: false } }],
        })
        .sort({ createdAt: -1 });

      if (servicedetails.length > 0) {
        return res.json({ servicedetails: servicedetails });
      } else {
        return res
          .status(404)
          .json({ message: "No service details found for November 2023" });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async getvendodata(req, res) {
    try {
      const { category, city, latitude, longitude } = req.query;

      const today = moment().format("YYYY-MM-DD");
      const check = await automatedServiceModel.find({ city, category });

      const filteredData = await servicedetailsmodel.find({
        markerCoordinate: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], 2 / 6378.1], // Radius of 2 kilometers
          },
        },
      });
      const filterlogLat = await servicedetailsmodel.find({});

      if (check?.action == true) {
        // const a = category.filter((cat) => check.category.includes(cat.name));
        // if (a && check.city === city) {
        let result = await servicedetailsmodel
          .aggregate([
            {
              $lookup: {
                from: "addcalls",
                localField: "_id",
                foreignField: "serviceId",
                as: "addcalldata",
              },
            },
            {
              $match: {
                city: city,
                type: "userapp",
                // category: category,
                contractType: "One Time",
                $or: [
                  {
                    dividedamtDates: {
                      $elemMatch: {
                        date: today,
                      },
                    },
                  },
                ],
                addcalldata: { $eq: [] },
              },
            },
          ])
          .exec();
      } else {
        return res
          .status(404)
          .json({ error: "service not available for this city" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async filterLogLat(req, res) {
    const { category, city, latitude, longitude, km } = req.query;

    const categoryNames = category.map((cat) => cat.name);

    const check = await automatedServiceModel.findOne({
      city,
      category: { $in: categoryNames },
    });

    const today = moment().format("YYYY-MM-DD");
    const tomorrow = moment().add(1, "day").format("YYYY-MM-DD");

    // Extracting the datawise property
    const datawise = check?.datewise;
    console.log("dataiw", km, datawise, today, tomorrow);
    if (!check || !check.action) {
      return res
        .status(401)
        .json({ error: "This location has no service available" });
    }

    try {
      let query = {
        markerCoordinate: {
          $geoWithin: {
            $centerSphere: [
              [parseFloat(longitude), parseFloat(latitude)],
              km / 3963.2,
            ],
          },
        },
        techName: "",
        city: city,
        category: { $in: categoryNames },

        contractType: "One Time",
      };

      // Adding condition for today's date
      if (datawise.includes("Today")) {
        query.$or = [
          {
            dividedDates: {
              $elemMatch: { date: today },
            },
          },
        ];
      }
      // Adding condition for both today and tomorrow
      if (datawise.includes("Both") || datawise.includes("All")) {
        query.$or = [
          {
            dividedDates: {
              $elemMatch: { date: today },
            },
          },
          {
            dividedDates: {
              $elemMatch: { date: tomorrow },
            },
          },
        ];
      }
      // Adding condition for tomorrow's date
      if (datawise.includes("Tomorrow")) {
        if (!query.$or) {
          query.$or = [];
        }
        query.$or.push({
          dividedDates: {
            $elemMatch: { date: tomorrow },
          },
        });
      }

      const nearbyDocuments = await servicedetailsmodel.find(query);

      res.status(200).json({ serviceData: nearbyDocuments });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }

  async getallservicecount(req, res) {
    try {
      const currentMonthStart = moment().startOf("month").toDate();
      const currentMonthEnd = moment().endOf("month").toDate();

      // Count the documents in the current month
      const totalServicesInCurrentMonth =
        await servicedetailsmodel.countDocuments({
          createdAt: {
            $gte: currentMonthStart,
            $lt: currentMonthEnd,
          },
        });

      return res
        .status(200)
        .json({ servicecount: totalServicesInCurrentMonth });
    } catch (error) {
      console.error("Error fetching all customers:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async paymentrepots(req, res) {
    try {
      const { fromdate, todate, city, category } = req.query;

      const formattedFromDate = moment(fromdate, "YYYY-MM-DD").format(
        "YYYY-MM-DD"
      );
      const formattedToDate = todate
        ? moment(todate, "YYYY-MM-DD").format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");

      // Initialize the match object
      const match = {
        dividedDates: {
          $elemMatch: {
            date: {
              $gte: formattedFromDate,
              $lte: formattedToDate,
            },
          },
        },
      };

      // Add city to the match object if it is provided
      if (city) {
        match.city = city;
      }

      // Add category to the match object if it is provided
      if (category) {
        match.category = category;
      }

      const pipeline = [
        {
          $match: match,
        },
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },

        {
          $lookup: {
            from: "payments",
            localField: "userId",
            foreignField: "customer",
            as: "paymentData",
          },
        },

        {
          $project: {
            _id: 1,
            customerData: 1,
            category: 1,
            city: 1,
            type: 1,
            deliveryAddress: 1,
            service: 1,
            desc: 1,
            paymentMode: 1,
            dividedamtCharges: 1,
            dividedamtDates: 1,
            GrandTotal: 1,
            contractType: 1,
            "dsrdata.jobComplete": 1,
            "dsrdata.TechorPMorVendorName": 1,
            "paymentData.paymentType": 1,
            "paymentData.paymentDate": 1,
            "paymentData.serviceId": 1,
            "paymentData.serviceDate": 1,
            "paymentData.amount": 1,
            "paymentData.paymentMode": 1,
          },
        },
      ];

      const data = await servicedetailsmodel.aggregate(pipeline);

      if (data && data.length > 0) {
        return res.json({
          runningdata: data,
        });
      } else {
        return res.status(404).json({ message: "No data found" });
      }
    } catch (error) {
      console.error(error.message);
      return res
        .status(500)
        .json({ error: error.message || "Something went wrong" });
    }
  }

  async getcloseprojectreport(req, res) {
    try {
      const { fromdate, todate, city } = req.query;

      const formattedFromDate = moment(fromdate, "YYYY-MM-DD").format(
        "YYYY-MM-DD"
      );
      const formattedToDate = todate
        ? moment(todate, "YYYY-MM-DD").format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");

      const filter = {
        date:
          fromdate && todate
            ? { $gte: formattedFromDate, $lte: formattedToDate }
            : undefined,
        contractType: "AMC",
        closeProject: "closed",
      };
      const cleanedFilter = Object.fromEntries(
        Object.entries(filter).filter(([_, v]) => v !== undefined)
      );

      const pipeline = [
        {
          $match: cleanedFilter,
        },
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        {
          $lookup: {
            from: "quotes",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "quotedata",
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "userId",
            foreignField: "_id",
            as: "customerdata",
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ];

      const data = await servicedetailsmodel.aggregate(pipeline);

      if (data) {
        return res.json({
          dsrdata: data,
        });
      } else {
        return res.status(404).json({ message: "No data found" });
      }
    } catch (error) {
      console.log("error.message", error.message);
      return res
        .status(500)
        .json({ error: error.message || "Something went wrong" });
    }
  }

  async runningpagefilter(req, res) {
    try {
      const { fromdate, todate, city } = req.query;

      const formattedFromDate = moment(fromdate, "YYYY-MM-DD").format(
        "YYYY-MM-DD"
      );
      const formattedToDate = todate
        ? moment(todate, "YYYY-MM-DD").format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");
      const pipeline = [
        {
          $match: {
            category: "Painting",
            contractType: "AMC",
            dividedDates: {
              $elemMatch: {
                date: {
                  $gte: formattedFromDate, // Greater than or equal to fromDate
                  $lte: formattedToDate, // Less than or equal to toDate
                },
              },
            },
            city: { $in: city.map((c) => c.name) },
          },
        },
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        {
          $lookup: {
            from: "payments",
            localField: "_id",
            foreignField: "serviceId",
            as: "paymentData",
          },
        },

        {
          $lookup: {
            from: "quotes",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "quotedata",
          },
        },
        {
          $lookup: {
            from: "manpowers",
            localField: "_id",
            foreignField: "serviceId",
            as: "manpowerdata",
          },
        },
        {
          $lookup: {
            from: "materials",
            localField: "_id",
            foreignField: "serviceId",
            as: "materialdata",
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ];

      const data = await servicedetailsmodel.aggregate(pipeline);

      if (data) {
        return res.json({
          dsrdata: data,
        });
      } else {
        return res.status(404).json({ message: "No data found" });
      }
    } catch (error) {
      console.log("error.message", error.message);
      return res
        .status(500)
        .json({ error: error.message || "Something went wrong" });
    }
  }

  async getnewreporttezt(req, res) {
    try {
      const { fromdate, todate, city, category } = req.query;

      const formattedFromDate = moment(fromdate, "YYYY-MM-DD").format(
        "YYYY-MM-DD"
      );
      const formattedToDate = todate
        ? moment(todate, "YYYY-MM-DD").format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD");

      // Initialize the match object
      const match = {
        dividedDates: {
          $elemMatch: {
            date: {
              $gte: formattedFromDate,
              $lte: formattedToDate,
            },
          },
        },
      };

      // Add city to the match object if it is provided
      if (city) {
        match.city = city;
      }

      // Add category to the match object if it is provided
      if (category) {
        match.category = category;
      }

      const pipeline = [
        {
          $match: match,
        },
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "userId",
            foreignField: "_id",
            as: "customerdata",
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ];

      const data = await servicedetailsmodel.aggregate(pipeline);

      if (data && data.length > 0) {
        return res.json({
          dsrdata: data,
        });
      } else {
        return res.status(404).json({ message: "No data found" });
      }
    } catch (error) {
      console.log("error.message", error.message);
      return res
        .status(500)
        .json({ error: error.message || "Something went wrong" });
    }
  }

  async getbookingservicepagewise(req, res) {
    try {
      const page = req.query.page || 1;
      const pageSize = 15;
      const skip = (page - 1) * pageSize;
      const searchQuery = req.query.search || ""; // Extract search query from request

      // Set initial filter for type === "userapp"
      const filter = { type: { $in: ["userapp", "website"] } };

      if (searchQuery) {
        // Add additional conditions for customerName and email
        const searchCondition = {
          $or: [
            {
              $or: [
                {
                  "customerData.customerName": {
                    $regex: searchQuery,
                    $options: "i",
                  },
                },
                { category: { $regex: searchQuery, $options: "i" } },
                { service: { $regex: searchQuery, $options: "i" } },
                { city: { $regex: searchQuery, $options: "i" } },
              ],
            },
          ],
        };
        // Combine the type condition and search condition using $and
        filter.$and = [filter, searchCondition];
      }

      const totalRecords = await servicedetailsmodel.countDocuments(filter);
      const service = await servicedetailsmodel
        .find(filter)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(pageSize);

      if (service.length > 0) {
        return res
          .status(200)
          .json({ service, totalRecords, currentPage: page });
      } else {
        return res.status(404).json({ message: "No services found." });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error.", error: error.message });
    }
  }

  async getpaymentfilterdatewise(req, res) {
    try {
      const {
        date,
        page = 1,
        filtercity,
        searchJobCatagory,
        searchContact,
        searchJobType,
        searchDesc,
        searchReference,
        approach,
        customerName,
        searchTechName,
      } = req.query;

      const technameInput = searchTechName.trim();

      const pageSize = 25;
      const currentPage = Math.max(1, parseInt(page));
      const skip = (currentPage - 1) * pageSize;

      // Build the base match object for filtering
      const baseMatch = {
        dividedamtDates: {
          $elemMatch: { date: date },
        },
      };

      // Add city filter if provided
      if (filtercity) {
        baseMatch.city = { $regex: filtercity, $options: "i" };
      }

      if (customerName) {
        baseMatch["customerData.customerName"] = {
          $regex: customerName,
          $options: "i",
        };
      }

      if (searchContact && !isNaN(searchContact)) {
        baseMatch["customerData.mainContact"] = Number(searchContact);
      }

      if (searchJobType) {
        baseMatch.service = { $regex: searchJobType, $options: "i" };
      }
      if (searchDesc) {
        baseMatch.desc = { $regex: searchDesc, $options: "i" };
      }
      if (searchReference) {
        baseMatch.reference = { $regex: searchReference, $options: "i" };
      }
      if (approach) {
        baseMatch.type = { $regex: approach, $options: "i" };
      }
      if (searchJobCatagory) {
        baseMatch.category = { $regex: searchJobCatagory, $options: "i" };
      }

      if (technameInput) {
        baseMatch.techName = { $regex: technameInput, $options: "i" };
      }
      const pipeline = [
        { $match: baseMatch },
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        {
          $lookup: {
            from: "payments",
            localField: "userId",
            foreignField: "customer",
            as: "paymentData",
          },
        },
        {
          $project: {
            _id: 1,
            customerData: 1,
            category: 1,
            city: 1,
            type: 1,
            deliveryAddress: 1,
            service: 1,
            desc: 1,
            paymentMode: 1,
            dividedamtCharges: 1,
            GrandTotal: 1,
            contractType: 1,
            "dsrdata.jobComplete": 1,
            "dsrdata.TechorPMorVendorName": 1,
            "paymentData.paymentType": 1,
            "paymentData.paymentDate": 1,
            "paymentData.serviceId": 1,
            "paymentData.serviceDate": 1,
            "paymentData.amount": 1,
            "paymentData.paymentMode": 1,
          },
        },
        { $skip: skip },
        { $limit: pageSize },
      ];

      // Count documents with filter for total pages calculation
      const countPipeline = [
        { $match: baseMatch },
        { $count: "totalDocuments" },
      ];

      const data = await servicedetailsmodel.aggregate(pipeline);
      const countResult = await servicedetailsmodel.aggregate(countPipeline);
      const totalDocuments = countResult[0]?.totalDocuments || 0;
      const totalPages = Math.ceil(totalDocuments / pageSize);

      // Respond with paginated data and metadata
      return res.json({
        runningdata: data,
        pagination: {
          currentPage,
          pageSize,
          totalDocuments,
          totalPages,
        },
      });
    } catch (error) {
      console.error(
        "Error fetching payment filter date-wise data:",
        error.message
      );
      return res.status(500).json({ error: "Failed to retrieve data." });
    }
  }

  async getPaymentcalenderlist(req, res) {
    let { startDate, endDate } = req.body; // Modify to accept start and end dates

    try {
      let data = await servicedetailsmodel
        .find({
          "dividedamtDates.date": {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .lean()
        .sort({ _id: -1 })
        .select("dividedamtDates");

      if (data && data.length > 0) {
        return res.json({ dividedamtDates: data });
      } else {
        return res.json({ dividedamtDates: [] }); // Return an empty array if no valid data found
      }
    } catch (error) {
      console.log("eroor", error.message);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getcustomeraggregateaddcals(req, res) {
    try {
      const userId = req.params.id;

      let pipeline = [
        {
          $match: {
            userId: new ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ];

      let data = await servicedetailsmodel.aggregate(pipeline);

      return res.json({
        runningdata: data,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getFilteredTechNames(req, res) {
    try {
      const { category, date, city } = req.query;

      const techNameData = await servicedetailsmodel.find(
        {
          category: category,
          dividedDates: {
            $elemMatch: { date: date },
          },
          city: { $in: city?.map((c) => c.name) },
        },
        { techName: 1, _id: 0 } // Project only the techName field, excluding _id if not needed
      );

      return res.json({
        techNameData,
      });
    } catch (error) {
      console.log("error.message", error.message);
      return res
        .status(500)
        .json({ error: error.message || "Something went wrong" });
    }
  }
  async getaggregateaddcalsnew(req, res) {
    try {
      const {
        category,
        date,
        city,
        customerName,
        number,
        techname,
        filtercity,
        searchJobType,
        searchDesc,
        searchReference,
        searchpaymentMode,
        searchAddress,
        page = 1,
        limit = 25,
      } = req.query;

      const technameInput = techname.trim();

      const skip = (page - 1) * limit;

      const baseMatch = {
        category: category,
        dividedDates: {
          $elemMatch: {
            date: date,
          },
        },
        city: { $in: city.map((c) => c.name) },
      };

      console.log("techname", techname);
      // Apply search filters
      if (customerName) {
        baseMatch["customerData.customerName"] = {
          $regex: customerName,
          $options: "i",
        };
      }

      if (number && !isNaN(number)) {
        baseMatch["$expr"] = {
          $regexMatch: {
            input: {
              $cond: {
                if: { $isArray: "$customerData.mainContact" }, // Check if mainContact is an array
                then: {
                  $reduce: {
                    input: "$customerData.mainContact",
                    initialValue: "",
                    in: { $concat: ["$$value", { $toString: "$$this" }] }, // Convert each element to string
                  },
                },
                else: { $toString: "$customerData.mainContact" }, // Convert to string if it's a single value
              },
            },
            regex: `${number}`, // Match any part of the number
            options: "i", // Optional case-insensitive
          },
        };
      }

      if (searchJobType) {
        baseMatch.service = { $regex: searchJobType, $options: "i" };
      }

      console.log("searchAddress", searchAddress);
      if (searchAddress) {
        baseMatch["$or"] = [
          {
            "deliveryAddress.address": { $regex: searchAddress, $options: "i" },
          },
          {
            "deliveryAddress.landmark": {
              $regex: searchAddress,
              $options: "i",
            },
          },
          {
            "deliveryAddress.platNo": { $regex: searchAddress, $options: "i" },
          },
        ];
      }

      if (searchDesc) {
        baseMatch.desc = { $regex: searchDesc, $options: "i" };
      }
      if (searchReference) {
        baseMatch.reference = { $regex: searchReference, $options: "i" };
      }

      if (filtercity) {
        baseMatch.city = { $regex: filtercity, $options: "i" };
      }
      if (searchpaymentMode) {
        baseMatch.paymentMode = { $regex: searchpaymentMode, $options: "i" };
      }

      if (technameInput) {
        baseMatch.techName = { $regex: technameInput, $options: "i" };
      }
      // Build pipeline for filtered count
      const countPipeline = [
        {
          $match: baseMatch,
        },
        {
          $lookup: {
            from: "customers",
            localField: "userId",
            foreignField: "_id",
            as: "customerdata",
            pipeline: [
              {
                $project: {
                  _id: 0, // Exclude _id field
                  customerName: 1,
                  mainContact: 1,
                },
              },
            ],
          },
        },

        {
          $count: "filteredCount", // Get the count of filtered results
        },
      ];

      // Run the count pipeline to get the filtered data count
      const filteredCountResult = await servicedetailsmodel.aggregate(
        countPipeline
      );
      const filteredCount = filteredCountResult[0]?.filteredCount || 0;

      const dataPipeline = [
        {
          $match: baseMatch,
        },
        {
          $lookup: {
            from: "customers",
            localField: "userId",
            foreignField: "_id",
            as: "customerdata",
          },
        },

        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
            pipeline: [
              {
                $project: {
                  _id: 0, // Exclude _id field
                  jobComplete: 1,
                  TechorPMorVendorID: 1,
                  TechorPMorVendorName: 1,
                  startJobTime: 1,
                  endJobTime: 1,
                  endJobReason: 1,
                  Tcancelreason: 1,
                  Tcanceldate: 1,
                  serviceDate: 1,
                  serviceId: 1,
                  rescheduledate: 1,
                  reschedulereason: 1,
                  rescheduletime: 1,
                },
              },
            ],
          },
        },
        {
          $sort: { _id: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: parseInt(limit),
        },
      ];

      // Fetch the paginated data
      const data = await servicedetailsmodel.aggregate(dataPipeline);

      // Count the total number of documents (unfiltered)
      const totalCount = await servicedetailsmodel.countDocuments({
        category: category,
        dividedDates: {
          $elemMatch: { date: date },
        },
        city: { $in: city.map((c) => c.name) },
      });

      return res.json({
        runningdata: data,
        totalCount, // Send total count for pagination
        filteredCount, // Send filtered data count
      });
    } catch (error) {
      console.log("error.message", error.message);
      return res
        .status(500)
        .json({ error: error.message || "Something went wrong" });
    }
  }

  async ColorCountData(req, res) {
    try {
      const { category, date, city } = req.query;

      const baseMatch = {
        category: category,
        dividedDates: {
          $elemMatch: {
            date: date,
          },
        },
        city: { $in: city.map((c) => c.name) },
      };

      // Define pipelines for each count
      const completedJobsPipeline = [
        { $match: baseMatch },
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        { $unwind: "$dsrdata" },
        { $match: { "dsrdata.jobComplete": "YES" } },
        { $count: "completedJobs" },
      ];

      const jobsWithEndTimePipeline = [
        { $match: baseMatch },
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        { $unwind: "$dsrdata" },
        { $match: { "dsrdata.endJobTime": { $ne: null } } },
        { $count: "jobsWithEndTime" },
      ];

      const canceledJobsPipeline = [
        { $match: baseMatch },
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        { $unwind: "$dsrdata" },
        { $match: { "dsrdata.jobComplete": "CANCEL" } },
        { $count: "canceledJobs" },
      ];

      // const delayedJobsPipeline = [
      //   { $match: baseMatch },
      //   {
      //     $lookup: {
      //       from: "addcalls",
      //       localField: "_id",
      //       foreignField: "serviceId",
      //       as: "dsrdata",
      //     },
      //   },
      //   { $unwind: "$dsrdata" },
      //   {
      //     $match: {
      //       $expr: {
      //         $function: {
      //           body: `return ${SERVICEdelay.toString()}(this)`,
      //           args: ["$dsrdata"],
      //           lang: "js",
      //         },
      //       },
      //     },
      //   },
      //   { $count: "delayedJobs" },
      // ];

      const startedJobsPipeline = [
        { $match: baseMatch },
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        { $unwind: "$dsrdata" },
        { $match: { "dsrdata.startJobTime": { $ne: null } } },
        { $count: "startedJobs" },
      ];

      const assignedTechnicianJobsPipeline = [
        { $match: baseMatch },
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        { $unwind: "$dsrdata" },
        { $match: { "dsrdata.TechorPMorVendorName": { $ne: null } } },
        { $count: "assignedTechnicianJobs" },
      ];

      // Execute each pipeline
      const [
        completedJobsCount,
        jobsWithEndTimeCount,
        canceledJobsCount,
        delayedJobsCount,
        startedJobsCount,
        assignedTechnicianJobsCount,
      ] = await Promise.all([
        servicedetailsmodel.aggregate(completedJobsPipeline),
        servicedetailsmodel.aggregate(jobsWithEndTimePipeline),
        servicedetailsmodel.aggregate(canceledJobsPipeline),
        // servicedetailsmodel.aggregate(delayedJobsPipeline),
        servicedetailsmodel.aggregate(startedJobsPipeline),
        servicedetailsmodel.aggregate(assignedTechnicianJobsPipeline),
      ]);

      // Extract counts and set default to 0 if not found
      const completedJobs = completedJobsCount[0]?.completedJobs || 0;
      const jobsWithEndTime = jobsWithEndTimeCount[0]?.jobsWithEndTime || 0;
      const canceledJobs = canceledJobsCount[0]?.canceledJobs || 0;
      // const delayedJobs = delayedJobsCount[0]?.delayedJobs || 0;
      const startedJobs = startedJobsCount[0]?.startedJobs || 0;
      const assignedTechnicianJobs =
        assignedTechnicianJobsCount[0]?.assignedTechnicianJobs || 0;

      // Return all counts in response
      return res.json({
        status: "success",
        data: {
          completedJobs,
          jobsWithEndTime,
          canceledJobs,
          // delayedJobs,
          startedJobs,
          assignedTechnicianJobs,
        },
      });
    } catch (error) {
      console.log("error.message", error.message);
      return res
        .status(500)
        .json({ error: error.message || "Something went wrong" });
    }
  }

  async getDevidedatenew(req, res) {
    let { category, startDate, endDate, city } = req.body;

    try {
      let data = await servicedetailsmodel
        .find({
          category,
          "dividedDates.date": {
            $gte: startDate,
            $lte: endDate,
          },
          city: { $in: city.map((c) => c.name) },
        })
        .lean()
        .select("dividedDates");
      if (data && data.length > 0) {
        return res.json({ dividedDates: data });
      } else {
        return res.json({ dividedDates: [] });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async filterdsrdata(req, res) {
    try {
      let { category, startDate, endDate, city } = req.body;

      console.log(category, startDate, endDate, city);

      // Create index for efficient querying
      await servicedetailsmodel.collection.createIndex({
        category: 1,
        "dividedDates.date": 1,
        city: 1,
      });

      let query = {
        category,
        "dividedDates.date": {
          $gte: startDate,
          $lte: endDate,
        },
        city: city,
      };

      let data = await servicedetailsmodel.find(query).lean();

      if (data && data.length > 0) {
        // If data is found, return the filtered dividedDates
        return res.json({ data: data.map((item) => item.dividedDates) });
      } else {
        // If no data is found, return an empty array
        return res.json({ data: [] });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getservicedetails1(req, res) {
    try {
      const startDate = new Date("2023-12-01T00:00:00.000Z");
      const endDate = new Date("2023-12-30T23:59:59.999Z");

      let servicedetails = await servicedetailsmodel
        .find({
          createdAt: { $gte: startDate, $lte: endDate },
        })
        .sort({ createdAt: -1 });

      if (servicedetails.length > 0) {
        return res.json({ servicedetails: servicedetails });
      } else {
        return res
          .status(404)
          .json({ message: "No service details found for November 2023" });
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getAggregateAddCals(req, res) {
    try {
      const { category, date } = req.query;

      let pipeline = [
        {
          $match: {
            category: category, // Match based on the provided category
          },
        },
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ];

      if (date) {
        pipeline.unshift({
          $addFields: {
            formattedDates: {
              $map: {
                input: "$dividedDates",
                as: "dateObj",
                in: {
                  $cond: {
                    if: { $ne: [{ $substr: ["$$dateObj.date", 11, 2] }, "00"] },
                    then: {
                      $dateToString: {
                        format: "%Y-%m-%d",
                        date: {
                          $add: [
                            { $toDate: "$$dateObj.date" }, // Convert string to Date type
                            24 * 60 * 60 * 1000, // Add 1 day if not at midnight
                          ],
                        },
                      },
                    },
                    else: {
                      $dateToString: {
                        format: "%Y-%m-%d",
                        date: { $toDate: "$$dateObj.date" },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        pipeline.push({
          $match: {
            formattedDates: date,
          },
        });
      }

      let data = await servicedetailsmodel.aggregate(pipeline);

      if (data.length > 0) {
        return res.json({ runningdata: data });
      } else {
        return res.status(404).json({ message: "No data found" });
      }
    } catch (error) {
      console.error("Error:", error); // Log the actual error for debugging
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getfilteredrunningdata(req, res) {
    try {
      let data = await servicedetailsmodel.aggregate([
        {
          $match: {
            contractType: "AMC",
            serviceFrequency: "1",
            category: "Painting",
            closeProject: { $exists: false },
          },
        },

        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "userId",
            foreignField: "_id",
            as: "customer",
          },
        },
        {
          $lookup: {
            from: "enquiryadds",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "enquiryData",
          },
        },
        {
          $lookup: {
            from: "enquiryfollowups",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "enquiryFollowupData",
          },
        },
        {
          $lookup: {
            from: "payments",
            localField: "_id",
            foreignField: "serviceId",
            as: "paymentData",
          },
        },
        {
          $lookup: {
            from: "quotes",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "quotedata",
          },
        },
        {
          $lookup: {
            from: "treatments",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "treatmentData",
          },
        },

        {
          $lookup: {
            from: "manpowers",
            localField: "_id",
            foreignField: "serviceId",
            as: "manpowerdata",
          },
        },
        {
          $lookup: {
            from: "materials",
            localField: "_id",
            foreignField: "serviceId",
            as: "materialdata",
          },
        },
        // {
        //   $limit: 10,
        // },
        {
          $sort: {
            _id: -1, // Sort by _id in descending order
          },
        },
      ]);

      const filterdata = data.filter(
        (i) => !i.closeProject && i.dsrdata[0]?.startproject
      );
      console.log("data", filterdata.length);
      if (data) {
        return res.json({ runningdata: filterdata });
      }
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getuserappbookings(req, res) {
    try {
      const userId = req.params.id;

      let data = await servicedetailsmodel.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ]);

      // if (servicedetails) {
      return res.status(200).json({ runningdata: data });
      // }
    } catch (error) {
      console.log("checkinbg error:", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async addservicedetails(req, res) {
    try {
      let {
        customerData,
        dCategory,
        cardNo,
        contractType,
        service,
        planName,
        slots, // this 03-10
        serviceId,
        serviceCharge,
        dateofService,
        desc,
        firstserviceDate,
        serviceFrequency,
        startDate,
        category,
        expiryDate,
        date,
        time,
        dividedDates,
        dividedCharges,
        dividedamtDates,
        dividedamtCharges,
        oneCommunity,
        communityId,
        BackofficeExecutive,
        deliveryAddress,
        type,
        userId,
        selectedSlotText,
        AddOns,
        TotalAmt,
        GrandTotal,
        totalSaved,
        discAmt,
        couponCode,
        city,
        paymentMode,
        status,
        customerName,
        email,
        EnquiryId,
        complaint,
        ctechName,
        reference,
        latitude,
        longitude,
      } = req.body;
      let file = req.file?.filename;

      let dividedDateObjects = [];
      let dividedamtDateObjects = [];
      let dividedamtChargeObjects = [];

      // Check if latitude and longitude are provided
      let markerCoordinates;
      if (latitude !== undefined && longitude !== undefined) {
        // Parse and validate latitude and longitude
        const parsedLatitude = parseFloat(latitude);
        const parsedLongitude = parseFloat(longitude);

        // Validate the parsed values
        if (
          !isNaN(parsedLatitude) &&
          parsedLatitude >= -90 &&
          parsedLatitude <= 90 &&
          !isNaN(parsedLongitude) &&
          parsedLongitude >= -180 &&
          parsedLongitude <= 180
        ) {
          // If valid, set the marker coordinates
          markerCoordinates = {
            latitude: parsedLatitude,
            longitude: parsedLongitude,
          };
        } else {
          // Handle invalid coordinates
          console.warn("Invalid latitude or longitude values provided.");
          markerCoordinates = null; // Or set a default valid coordinate
        }
      } else {
        console.warn("Latitude and longitude not provided.");
        markerCoordinates = null; // Or set a default valid coordinate
      }

      if (contractType === "AMC") {
        if (dividedDates) {
          dividedDateObjects = dividedDates.map((date) => {
            const uniqueId = uuidv4(); // Generate a UUID for the date
            return { id: uniqueId, date: date };
          });
        }

        if (dividedamtDates) {
          dividedamtDateObjects = dividedamtDates.map((date) => {
            const uniqueId = uuidv4(); // Generate a UUID for the date
            return { id: uniqueId, date: date };
          });
        }

        if (dividedamtCharges) {
          dividedamtChargeObjects = dividedamtCharges.map((charge) => {
            const uniqueId = uuidv4(); // Generate a UUID for the charge
            return { id: uniqueId, charge };
          });
        }
      } else {
        if (dividedDates) {
          dividedDateObjects = dividedDates.map((date) => {
            const uniqueId = uuidv4(); // Generate a UUID for the date
            return { id: uniqueId, date: date };
          });
        }
        if (dividedamtDates) {
          dividedamtDateObjects = dividedamtDates.map((date) => {
            const uniqueId = uuidv4(); // Generate a UUID for the date
            return { id: uniqueId, date: date };
          });
        }
        if (dividedamtCharges) {
          dividedamtChargeObjects = dividedamtCharges.map((charge) => {
            const uniqueId = uuidv4(); // Generate a UUID for the charge
            return { id: uniqueId, charge };
          });
        }
      }
      const userUpdate = {};

      if (customerName) {
        userUpdate.customerName = customerName;
      }

      if (city) {
        userUpdate.city = city;
      }

      if (category) {
        userUpdate.category = category;
      }

      if (email) {
        userUpdate.email = email;
      }

      let discAmtNumber = 0;

      let percentage = 0;

      if (GrandTotal >= 1500) {
        percentage = GrandTotal * 0.02;
      }
      if (discAmt) {
        discAmtNumber = parseFloat(discAmt) - percentage;
      }

      const user = await customerModel.findOneAndUpdate(
        { _id: customerData?._id },
        {
          $set: userUpdate,
          $inc: { wAmount: discAmt ? -discAmtNumber : percentage },
        },
        { new: true }
      );

      let add = new servicedetailsmodel({
        customerData,
        cardNo: cardNo,
        dCategory,
        planName: planName,
        category: category,
        contractType: contractType,
        service: service,
        serviceId: serviceId,
        slots: slots,
        serviceCharge: serviceCharge,
        dateofService: dateofService,
        desc: desc,
        serviceFrequency: serviceFrequency,
        startDate: startDate,
        expiryDate: expiryDate,
        firstserviceDate: firstserviceDate,
        date: date,
        time: time,
        dividedDates: dividedDateObjects, // Store the array of objects with IDs and dates
        dividedCharges,
        dividedamtDates: dividedamtDateObjects,
        dividedamtCharges: dividedamtChargeObjects,
        oneCommunity,
        communityId,
        BackofficeExecutive,
        deliveryAddress,
        type,
        userId,
        selectedSlotText,
        serviceImg: file,
        AddOns,
        GrandTotal,
        totalSaved,
        discAmt,
        couponCode,
        city,
        paymentMode,
        TotalAmt,
        status,
        EnquiryId,
        complaint,
        ctechName,
        reference,
        markerCoordinate: markerCoordinates ? markerCoordinates : undefined,
      });

      let save = await add.save();
      const check = await automatedServiceModel.findOne({
        city,
        category,
      });

      if (save) {
        return res.json({
          success: "Added successfully",
          data: save,
          user: user,
        });
      }
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ error: "An error occurred" });
    }
  }

  async updatepayment(req, res) {
    let id = req.params.id;

    let data = await servicedetailsmodel.findByIdAndUpdate(
      { _id: id },
      { paymentMode: "online" }
    );
    if (data) {
      return res.status(200).json({ success: "Updated" });
    }
  }

  async editServiceDetails(req, res) {
    const subcategoryId = req.params.id;
    const {
      customerData,
      contractType,
      service,
      planName,
      slots,
      serviceId,
      serviceCharge,
      dateofService,
      firstserviceDate,
      serviceFrequency,
      category,
      expiryDate,
      date,
      time,
      dividedDates,
      dividedCharges,
      dividedamtDates,
      dividedamtCharges,
      oneCommunity,
      communityId,
      BackofficeExecutive,
      deliveryAddress,
      desc,
      GrandTotal,
      selectedSlotText,

      markerCoordinate,
    } = req.body;

    const findCategory = await servicedetailsmodel.findOne({
      _id: subcategoryId,
    });
    if (!findCategory) {
      return res.send("no data found");
    }
    findCategory.customerData = customerData || findCategory.customerData;
    findCategory.category = category || findCategory.category;
    findCategory.contractType = contractType || findCategory.contractType;
    findCategory.service = service || findCategory.service;
    findCategory.desc = desc || findCategory.desc;
    findCategory.planName = planName || findCategory.planName;
    findCategory.GrandTotal = GrandTotal || findCategory.GrandTotal;
    findCategory.slots = slots || findCategory.slots;
    findCategory.serviceId = serviceId || findCategory.serviceId;
    findCategory.serviceCharge = serviceCharge || findCategory.serviceCharge;
    findCategory.dateofService = dateofService || findCategory.dateofService;
    findCategory.firstserviceDate =
      firstserviceDate || findCategory.firstserviceDate;
    findCategory.serviceFrequency =
      serviceFrequency || findCategory.serviceFrequency;
    findCategory.expiryDate = expiryDate || findCategory.expiryDate;
    findCategory.date = date || findCategory.date;
    findCategory.time = time || findCategory.time;
    findCategory.dividedDates = dividedDates || findCategory.dividedDates;
    findCategory.dividedCharges = dividedCharges || findCategory.dividedCharges;
    findCategory.dividedamtDates =
      dividedamtDates || findCategory.dividedamtDates;
    findCategory.dividedamtCharges =
      dividedamtCharges || findCategory.dividedamtCharges;
    findCategory.oneCommunity = oneCommunity || findCategory.oneCommunity;
    findCategory.communityId = communityId || findCategory.communityId;
    findCategory.BackofficeExecutive =
      BackofficeExecutive || findCategory.BackofficeExecutive;
    findCategory.deliveryAddress =
      deliveryAddress || findCategory.deliveryAddress;
    findCategory.selectedSlotText =
      selectedSlotText || findCategory.selectedSlotText;
    findCategory.markerCoordinate =
      markerCoordinate || findCategory.markerCoordinate;

    let updatedData = await servicedetailsmodel.findOneAndUpdate(
      { _id: subcategoryId },
      findCategory,
      { new: true }
    );
    if (updatedData) {
      return res.json({ success: "Updated", data: updatedData });
    } else {
      return res.send("failed");
    }
  }

  async manpower(req, res) {
    try {
      const id = req.params.id;
      const { mandate, mandesc } = req.body;

      const updatedData = await servicedetailsmodel.findByIdAndUpdate(
        { _id: id },
        {
          mandate: mandate,
          mandesc: mandesc,
        },
        { new: true }
      );

      if (updatedData) {
        return res.status(200).json({ success: "Updated", data: updatedData });
      } else {
        return res.status(404).json({ error: "Service not found" });
      }
    } catch (error) {
      console.error("Error updating payment mode and other fields:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async findbyservicechaneapp(req, res) {
    try {
      const id = req.params.serviceid;
      const bookid = req.params.bookid;
      const { city, selectedSlotText } = req.body;

      const updatedData = await servicedetailsmodel.findByIdAndUpdate(
        id,
        {
          city,
          selectedSlotText,
        },
        { new: true }
      );

      if (bookid !== 0) {
        const updatedData1 = await addcallModel.findByIdAndUpdate(
          bookid,
          {
            city,
            $set: {
              "serviceInfo.0.selectedSlotText": selectedSlotText,
            },
          },
          { new: true }
        );
      }

      if (updatedData) {
        return res.json({ success: "Updated", data: updatedData });
      } else {
        return res.status(404).json({ error: "Document not found" });
      }
    } catch (error) {
      console.log(" error.message", error.message);
      return res

        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
    }
  }

  async changeappotimewithoutdsr(req, res) {
    try {
      const id = req.params.serviceid;

      const { city, selectedSlotText } = req.body;

      const updatedData = await servicedetailsmodel.findByIdAndUpdate(
        id,
        {
          city,
          selectedSlotText,
        },
        { new: true }
      );

      if (updatedData) {
        return res.json({ success: "Updated", data: updatedData });
      } else {
        return res.status(404).json({ error: "Document not found" });
      }
    } catch (error) {
      console.log(" error.message", error.message);
      return res

        .status(500)
        .json({ error: "Internal Server Error", message: error.message });
    }
  }

  async findbyserviceID(req, res) {
    try {
      let userId = req.params.id;

      // Assuming you have a "ServiceID" field in your schema
      let rating = await servicedetailsmodel
        .find({ userId: userId })
        .sort({ _id: -1 });

      if (rating) {
        return res.json({ bookings: rating });
      } else {
        return res.json({ bookings: [] });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: "An error occurred while fetching data" });
    }
  }

  async findbyserviceIDandreschedule(req, res) {
    try {
      const serviceId = req.params.id;
      const {
        appoDate,
        appotime,
        newappoDate,
        ResheduleUser,
        ResheduleUsernumber,
        reason,
        resDate,
      } = req.body;

      const serviceDetails = await servicedetailsmodel.findOne({
        _id: serviceId,
      });
      if (!serviceDetails) {
        return res
          .status(404)
          .json({ error: "No document found for the specified ServiceID" });
      }

      const indexToUpdate = serviceDetails.dividedDates.findIndex((dateObj) => {
        const date = dateObj.date;

        return date === newappoDate;
      });

      let addcalldata = await addcallModel.findOneAndUpdate(
        { serviceId: serviceId },
        {
          serviceDate: appoDate,

          appoDate: appoDate,
          appoTime: appotime,
        },
        { new: true }
      );

      try {
        if (indexToUpdate !== -1) {
          serviceDetails.dividedDates[indexToUpdate].date = appoDate;
          // Update other fields as needed
          serviceDetails.selectedSlotText = appotime;
          serviceDetails.resDate = resDate;
          serviceDetails.dateofService = appoDate;
          if (serviceDetails.contractType === "One Time") {
            serviceDetails.dividedamtDates[indexToUpdate].date = appoDate;
          }
          const updatedDocument = await servicedetailsmodel.findOneAndUpdate(
            { _id: serviceId },
            serviceDetails,
            { new: true }
          );

          if (!updatedDocument) {
            return res.status(404).json({ error: "Document not found" });
          }

          let add = new recheduledatasmodel({
            serviceId: serviceId,
            name: ResheduleUser,
            number: ResheduleUsernumber,
            reason: reason,
          });

          const savedData = await add.save();
          console.log("Data successfully saved:", savedData);
          return res.json({ updatedDocument });
        } else {
          return res
            .status(404)
            .json({ error: "Date not found in dividedDates" });
        }
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: "Error updating document" });
      }
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while updating data" });
    }
  }

  async findbyserviceIDcancel(req, res) {
    try {
      const id = req.params.id;
      const { cancelOfficerName, cancelOfferNumber, reason, cancelDate } =
        req.body;

      // Check if any of the required fields are missing in the request body
      if (!cancelOfficerName || !cancelOfferNumber || !reason || !cancelDate) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const updatedData = await servicedetailsmodel.findByIdAndUpdate(
        id,
        {
          cancelOfficerName,
          cancelOfferNumber,
          reason,
          cancelDate,
        },
        { new: true }
      );

      if (updatedData) {
        return res.json({ success: "Updated", data: updatedData });
      } else {
        return res.status(404).json({ error: "Document not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async editstatus(req, res) {
    let id = req.params.id;

    let { status } = req.body;
    let data = await servicedetailsmodel.findOneAndUpdate(
      { _id: id },
      {
        status: status,
      },
      { new: true }
    );
    if (data) {
      return res.json({ success: "Updated" });
    }
  }

  async getallrunningdata(req, res) {
    try {
      // const customerId = req.query.customerId;
      // const userId = req.query.userId;
      let data = await servicedetailsmodel.aggregate([
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "cardNo",
            foreignField: "cardNo",
            as: "customer",
          },
        },
        {
          $lookup: {
            from: "enquiryadds",
            localField: "customer.EnquiryId",
            foreignField: "EnquiryId",
            as: "enquiryData",
          },
        },
        {
          $lookup: {
            from: "enquiryfollowups",
            localField: "customer.EnquiryId",
            foreignField: "EnquiryId",
            as: "enquiryFollowupData",
          },
        },
        {
          $lookup: {
            from: "payments",
            localField: "userId",
            foreignField: "customer",
            as: "paymentData",
          },
        },
        {
          $lookup: {
            from: "treatments",
            localField: "customer.EnquiryId",
            foreignField: "EnquiryId",
            as: "treatmentData",
          },
        },
        {
          $lookup: {
            from: "quotes",
            localField: "customer.EnquiryId",
            foreignField: "EnquiryId",
            as: "quotedata",
          },
        },
        {
          $lookup: {
            from: "manpowers",
            localField: "_id",
            foreignField: "serviceId",
            as: "manpowerdata",
          },
        },
        {
          $lookup: {
            from: "materials",
            localField: "_id",
            foreignField: "serviceId",
            as: "materialdata",
          },
        },
        {
          $sort: {
            _id: -1, // Sort by _id in descending order
          },
        },
      ]);
      if (data) {
        return res.json({ runningdata: data });
      }
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getalldsrcalldata(req, res) {
    try {
      const pipeline = [
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        {
          $lookup: {
            from: "payments",
            localField: "userId",
            foreignField: "customer",
            as: "paymentData",
          },
        },
        {
          $sort: {
            _id: -1, // Sort by _id in descending order
          },
        },
      ];

      const data = await servicedetailsmodel.aggregate(pipeline);

      if (data) {
        return res.json({ runningdata: data });
      }
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getmybookingdata(req, res) {
    try {
      const serviceId = req.params.id;
      console.log("servis", serviceId);
      let data = await servicedetailsmodel.aggregate([
        {
          $match: { _id: serviceId },
        },
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "cardNo",
            foreignField: "cardNo",
            as: "customer",
          },
        },
      ]);

      if (data && data.length > 0) {
        return res.json({ runningdata: data[0] }); // Assuming you only expect one record
      } else {
        return res
          .status(404)
          .json({ error: "Data not found for the specified serviceId" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getmybookingdata1(req, res) {
    try {
      const serviceId = req.params.id;

      let data = await servicedetailsmodel.find({ _id: serviceId });

      if (data && data.length > 0) {
        return res.json({ runningdata: data[0] }); // Assuming you only expect one record
      } else {
        return res
          .status(404)
          .json({ error: "Data not found for the specified serviceId" });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getaggregateaddcals(req, res) {
    try {
      const { category, date } = req.query;

      let data = await servicedetailsmodel.aggregate([
        {
          $match: {
            category: category, // Match based on the provided category
          },
        },
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ]);

      if (data && date) {
        const filteredData = data.filter((item) => {
          const formattedDates = item.dividedDates.map((dateObj) => {
            const currentDate = moment(dateObj.date);

            // Check if the time component is present or if it's not midnight (00:00:00)
            if (currentDate.format("HH:mm:ss") !== "00:00:00") {
              return currentDate.add(1, "days").format("YYYY-MM-DD");
            }

            return currentDate.format("YYYY-MM-DD");
          });

          return formattedDates.includes(date);
        });
        return res.json({ runningdata: filteredData });
      } else if (data) {
        return res.json({ runningdata: data });
      } else {
        return res.status(404).json({ message: "No data found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async serchfilter(req, res) {
    try {
      const {
        category,
        date,
        city,
        searchCustomerName,
        searchContact,
        searchTechName,
        searchJobType,
        searchDesc,
        searchpaymentMode,
        searchAddress,
      } = req.query;

      let pipeline = [
        {
          $match: {
            category: category,
            dividedDates: {
              $elemMatch: {
                date: date,
              },
            },
          },
        },

        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
      ];

      // Additional filtering based on search parameters
      if (
        searchCustomerName ||
        searchContact ||
        city ||
        searchTechName ||
        searchJobType ||
        searchDesc ||
        searchpaymentMode ||
        searchAddress
      ) {
        const matchStage = {};

        if (searchCustomerName) {
          matchStage.customerData = {
            $elemMatch: {
              customerName: { $regex: new RegExp(searchCustomerName, "i") },
            },
          };
        }

        if (searchTechName) {
          matchStage.dsrdata = {
            $elemMatch: {
              TechorPMorVendorName: { $regex: new RegExp(searchTechName, "i") },
            },
          };
        }

        if (searchContact) {
          matchStage.customerData = {
            $elemMatch: {
              mainContact: { $regex: new RegExp(searchContact, "i") },
            },
          };
        }

        if (city) {
          matchStage.city = { $regex: new RegExp(city, "i") };
        }

        if (searchJobType) {
          matchStage.service = { $regex: new RegExp(searchJobType, "i") };
        }

        if (searchDesc) {
          matchStage.desc = { $regex: new RegExp(searchDesc, "i") };
        }
        if (searchAddress) {
          matchStage["deliveryAddress.address"] = {
            $regex: new RegExp(searchAddress, "i"),
          };
        }

        if (searchpaymentMode) {
          matchStage.paymentMode = {
            $regex: new RegExp(searchpaymentMode, "i"),
          };
        }

        pipeline.unshift({ $match: matchStage });
      }

      let data = await servicedetailsmodel.aggregate(pipeline);

      if (data) {
        return res.json({ runningdata: data });
      } else {
        return res.status(404).json({ message: "No data found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async serchfilterinpaymentrepots(req, res) {
    try {
      const {
        date,
        city,
        searchCustomerName,
        searchContact,
        searchTechName,
        searchJobType,
        searchDesc,
        searchpaymentMode,
        searchAddress,
      } = req.query;

      let pipeline = [
        {
          $match: {
            dividedDates: {
              $elemMatch: {
                date: date,
              },
            },
          },
        },
        {
          $lookup: {
            from: "addcalls",
            localField: "_id",
            foreignField: "serviceId",
            as: "dsrdata",
          },
        },
        {
          $lookup: {
            from: "payments",
            localField: "userId",
            foreignField: "customer",
            as: "paymentData",
          },
        },
      ];

      // Additional filtering based on search parameters
      if (
        searchCustomerName ||
        searchContact ||
        city ||
        searchTechName ||
        searchJobType ||
        searchDesc ||
        searchpaymentMode ||
        searchAddress
      ) {
        const matchStage = {};

        if (searchCustomerName) {
          matchStage.customerData = {
            $elemMatch: {
              customerName: { $regex: new RegExp(searchCustomerName, "i") },
            },
          };
        }

        if (searchTechName) {
          matchStage.dsrdata = {
            $elemMatch: {
              TechorPMorVendorName: { $regex: new RegExp(searchTechName, "i") },
            },
          };
        }

        if (searchJobType) {
          matchStage.customerData = {
            $elemMatch: {
              mainContact: { $regex: new RegExp(searchJobType, "i") },
            },
          };
        }

        if (city) {
          matchStage.city = { $regex: new RegExp(city, "i") };
        }

        if (searchJobType) {
          matchStage.service = { $regex: new RegExp(searchJobType, "i") };
        }

        if (searchDesc) {
          matchStage.desc = { $regex: new RegExp(searchDesc, "i") };
        }
        if (searchAddress) {
          matchStage["deliveryAddress.address"] = {
            $regex: new RegExp(searchAddress, "i"),
          };
        }

        if (searchpaymentMode) {
          matchStage.paymentMode = {
            $regex: new RegExp(searchpaymentMode, "i"),
          };
        }

        pipeline.unshift({ $match: matchStage });
      }

      let data = await servicedetailsmodel.aggregate(pipeline);

      if (data) {
        return res.json({ runningdata: data });
      } else {
        return res.status(404).json({ message: "No data found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async postservicecategory(req, res) {
    let { category } = req.body;
    let data = await servicedetailsmodel.find({ category }).sort({ _id: -1 });

    if (data) {
      return res.json({ servicedetails: data });
    }
  }
  async updateclose(req, res) {
    let id = req.params.id;
    let { closeProject, closeDate } = req.body;
    let newData = await servicedetailsmodel.findOneAndUpdate(
      { _id: id },
      {
        closeProject,
        closeDate,
      },
      { new: true } // Option to return the updated document
    );
    if (newData) {
      return res.status(200).json({ Success: "updated succesfully" });
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async postcategory(req, res) {
    let { category } = req.body;
    let servicedetails = await servicedetailsmodel.find({ category });

    if (servicedetails) {
      return res.json({ servicedetails: servicedetails });
    } else {
      return res.json({ error: "something went wrong" });
    }
  }

  async getservicedetails(req, res) {
    try {
      let servicedetails = await servicedetailsmodel.find({}).sort({ _id: -1 });

      if (servicedetails) {
        return res.json({ servicedetails: servicedetails });
      } else {
        return res.status(404).json({ message: "No service details found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async deleteservicedetails(req, res) {
    let id = req.params.id;
    let data = await servicedetailsmodel.deleteOne({ _id: id });
    return res.json({ sucess: "Successfully deleted" });
  }
}

const servicedetailscontroller = new servicedetails();
module.exports = servicedetailscontroller;
