const enquiryfollowupModel = require("../model/enquiryfollowup");
const moment = require("moment");
const { ObjectId } = require("mongodb");

class addenquiry {
  async findWithUserIdInEnquiryFollowup(req, res) {
    try {
      let userId = req.params.id;
      let data = await enquiryfollowupModel.aggregate([
        {
          $match: {
            userId: userId,
          },
        },
        {
          $lookup: {
            from: "enquiryadds",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "enquirydata",
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
      ]);

      if (data !== null && data !== undefined && data.length > 0) {
        return res.status(200).json({ enquiryfollowup: data });
      } else {
        return res
          .status(404)
          .json({ error: "No data found for the given user ID" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async surveyFilterdata(req, res) {
    try {
      const { fromdate, todate } = req.body;

      const formattedFromDate = moment(fromdate, "YYYY-MM-DD").format(
        "YYYY-MM-DD"
      );
      const formattedToDate = todate
        ? moment(todate, "YYYY-MM-DD").format("YYYY-MM-DD")
        : moment().format("MM-DD-YYYY");

      const filter = {
        nxtfoll:
          fromdate && todate
            ? { $gte: formattedFromDate, $lte: formattedToDate }
            : undefined,
        response: "Survey",
      };

      // Remove undefined properties from the filter
      const cleanedFilter = Object.fromEntries(
        Object.entries(filter).filter(([_, v]) => v !== undefined)
      );

      const data = await enquiryfollowupModel.aggregate([
        {
          $lookup: {
            from: "enquiryadds",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "enquirydata",
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
            from: "quotes",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "quoteData",
          },
        },
        {
          $match: cleanedFilter,
        },

        { $sort: { _id: -1 } },
      ]);

      if (data) {
        return res.status(200).json({ enquiryadd: data });
      }
    } catch (error) {
      console.error("Error in getallenquiryadd:", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getallagreedataexe(req, res) {
    const id = req.params.id;
    try {
      let data = await enquiryfollowupModel.aggregate([
        {
          $match: {
            techId: id,
          },
        },
        {
          $lookup: {
            from: "enquiryadds",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "enquirydata",
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
      ]);

      const latestRecords = {};

      data.forEach((item) => {
        const { EnquiryId, createdAt } = item;
        if (
          !latestRecords[EnquiryId] ||
          createdAt > latestRecords[EnquiryId].createdAt
        ) {
          latestRecords[EnquiryId] = item;
        }
      });

      const latestSurveyData = Object.values(latestRecords).filter(
        (item) => item.response === "Survey"
      );

      if (latestSurveyData.length > 0) {
        return res.json({ enquiryfollowup: latestSurveyData });
      } else {
        return res.json({ error: "Something went wrong" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getsurveyaggredataexes1server(req, res) {
    try {
      const id = req.params.id;
      const today = moment().format("YYYY-MM-DD");
      const tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
      const yesterday = moment().subtract(1, "days").format("YYYY-MM-DD");

      let data = await enquiryfollowupModel.aggregate([
        {
          $match: {
            techId: id,
          },
        },
        {
          $lookup: {
            from: "enquiryadds",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "enquirydata",
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
      ]);

      const latestRecords = {};

      data.forEach((item) => {
        const { EnquiryId, createdAt } = item;
        if (
          !latestRecords[EnquiryId] ||
          createdAt > latestRecords[EnquiryId].createdAt
        ) {
          latestRecords[EnquiryId] = item;
        }
      });

      const latestSurveyData = Object.values(latestRecords).filter(
        (item) => item.response === "Survey"
      );

      const todayData = latestSurveyData.filter((i) => i.appoDate === today);
      const tomorrowData = latestSurveyData.filter(
        (i) => i.appoDate === tomorrow
      );
      const yesterdayData = latestSurveyData.filter(
        (i) => i.appoDate === yesterday
      );

      return res.json({
        todayData: todayData,
        tomorrowData: tomorrowData,
        yesterdayData: yesterdayData,
      });
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
  async getsurveyaggredataexe(req, res) {
    const id = req.params.id;
    try {
      let data = await enquiryfollowupModel.aggregate([
        {
          $match: {
            techId: id,
          },
        },
        {
          $lookup: {
            from: "enquiryadds",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "enquirydata",
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
      ]);

      const latestRecords = {};

      data.forEach((item) => {
        const { EnquiryId, createdAt } = item;
        if (
          !latestRecords[EnquiryId] ||
          createdAt > latestRecords[EnquiryId].createdAt
        ) {
          latestRecords[EnquiryId] = item;
        }
      });

      const latestSurveyData = Object.values(latestRecords).filter(
        (item) => item.response === "Survey"
      );

      if (latestSurveyData.length > 0) {
        return res.json({ enquiryfollowup: latestSurveyData });
      } else {
        return res.json({ error: "Something went wrong" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async Addenquiryfollowup(req, res) {
    try {
      let {
        EnquiryId,
        category,
        folldate,
        staffname,
        response,
        desc,
        value,
        colorcode,
        nxtfoll,
        appoTime,
        sendSms,
        appoDate,
        slotid,
        userId,
        type,
        techId,
        responseType,
      } = req.body;
      const newVendor = new enquiryfollowupModel({
        EnquiryId,
        category,
        folldate,
        staffname,
        response,
        desc,
        value,
        colorcode,
        nxtfoll,
        appoTime,
        sendSms,
        appoDate,
        slotid,
        userId,
        type,
        techId,
        responseType,
      });
      newVendor.save().then((data) => {
        return res
          .status(200)
          .json({ Success: "Account created. Please login" });
      });
    } catch (error) {
      console.error("Error enquiry add:", error);
    }
  }

  //Get all
  async getallenquiryfollowup(req, res) {
    let data = await enquiryfollowupModel.find({}).sort({ _id: -1 });
    if (data) {
      return res.status(200).json({ enquiryfollowup: data });
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  //find with enquiryId
  async getEnquiryFollowupByEnquiryId(req, res) {
    try {
      const { enquiryId } = req.params; // Assuming EnquiryId is in the URL parameters

      if (!enquiryId) {
        return res.status(400).json({ error: "EnquiryId is required" });
      }

      // Find enquiryfollowup data for the specific EnquiryId
      const data = await enquiryfollowupModel
        .find({ EnquiryId: enquiryId })
        .sort({ _id: -1 });

      if (data && data.length > 0) {
        return res.status(200).json({ enquiryfollowup: data });
      } else {
        return res.status(404).json({ enquiryfollowup: [] });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  //Get new data
  async getnewdata(req, res) {
    let data = (await enquiryfollowupModel.find({})).filter(
      (i) => i.response === "New"
    );
    if (data) {
      return res.status(200).json({ enquiryfollowup: data });
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
  //post category

  async getsurveydata(req, res) {
    try {
      const data = await enquiryfollowupModel
        .find({ response: "Survey" })
        .sort({ createdAt: -1 });

      const latestRecords = {};

      data.forEach((item) => {
        const { EnquiryId, createdAt } = item;
        if (
          !latestRecords[EnquiryId] ||
          createdAt > latestRecords[EnquiryId].createdAt
        ) {
          latestRecords[EnquiryId] = item;
        }
      });

      const finalLatestSurveyData = Object.values(latestRecords);

      if (finalLatestSurveyData.length > 0) {
        return res.status(200).json({ enquiryfollowup: finalLatestSurveyData });
      } else {
        return res.status(500).json({ error: "Something went wrong" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async postsurveycat(req, res) {
    try {
      const { category, city } = req.body;

      const cities = city.map((i) => i.name);

      let data = await enquiryfollowupModel.aggregate([
        {
          $match: {
            category,
          },
        },
        {
          $lookup: {
            from: "enquiryadds",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "enquirydata",
          },
        },
        {
          $unwind: "$enquirydata", // Unwind to filter on the nested document
        },
        {
          $match: {
            "enquirydata.city": { $in: cities }, // Filter based on city
          },
        },
        {
          $group: {
            _id: "$_id", // Grouping back to merge documents
            category: { $first: "$category" },
            createdAt: { $first: "$createdAt" },
            nxtfoll: { $first: "$nxtfoll" },
            EnquiryId: { $first: "$EnquiryId" },
            response: { $first: "$response" },
            enquirydata: { $push: "$enquirydata" }, // Push filtered enquirydata
          },
        },
      ]);

      const latestRecords = {};

      data.forEach((item) => {
        const { EnquiryId, createdAt } = item;
        if (
          !latestRecords[EnquiryId] ||
          createdAt > latestRecords[EnquiryId].createdAt
        ) {
          latestRecords[EnquiryId] = item;
        }
      });

      const result = Object.values(latestRecords).filter(
        (item) => item.response === "Survey"
      );

      if (result.length > 0) {
        return res.json({ enquiryfollowup: result });
      } else {
        console.log("No survey responses found");
        return res.json({ enquiryfollowup: [] });
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getallagreedata(req, res) {
    try {
      const { category, date } = req.body;

      let data = await enquiryfollowupModel.aggregate([
        {
          $match: {
            nxtfoll: date,
            category,
          },
        },
        {
          $lookup: {
            from: "enquiryadds",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "enquirydata",
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
            from: "quotes",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "quoteData",
          },
        },
      ]);

      const latestRecords = {};

      data.forEach((item) => {
        const { EnquiryId, createdAt } = item;
        if (
          !latestRecords[EnquiryId] ||
          createdAt > latestRecords[EnquiryId].createdAt
        ) {
          latestRecords[EnquiryId] = item;
        }
      });

      const latestSurveyData = Object.values(latestRecords).filter(
        (item) => item.response === "Survey"
      );

      if (latestSurveyData.length > 0) {
        return res.json({ enquiryfollowup: latestSurveyData });
      } else {
        return res.json({ error: "Something went wrong" });
      }
    } catch (error) {
      console.log("error---", error.message);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getallnewagreedata(req, res) {
    try {
      const { category, date, city } = req.body;
      const cities = city?.map((i) => i.name);
      console.log("cities", cities);

      let data = await enquiryfollowupModel.aggregate([
        {
          $match: {
            nxtfoll: date,
            category,
          },
        },
        {
          $lookup: {
            from: "enquiryadds",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "enquirydata",
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
            from: "quotes",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "quoteData",
          },
        },
        {
          $unwind: "$enquirydata", // Unwind to filter on the nested document
        },
        {
          $match: {
            "enquirydata.city": { $in: cities }, // Filter based on city
          },
        },
        {
          $group: {
            _id: "$_id",
            category: { $first: "$category" },
            createdAt: { $first: "$createdAt" },
            appoTime: { $first: "$appoTime" },
            desc: { $first: "$desc" },
            reasonForCancel: { $first: "$reasonForCancel" },
            adminname: { $first: "$adminname" },
            admindate: { $first: "$admindate" },
            cancelStatus: { $first: "$cancelStatus" },
            technicianname: { $first: "$technicianname" },
            techId: { $first: "$techId" },
            status: { $first: "$status" },
            nxtfoll: { $first: "$nxtfoll" },
            EnquiryId: { $first: "$EnquiryId" },
            enquirydata: { $push: "$enquirydata" },
            treatmentData: { $push: "$treatmentData" },
            quoteData: { $push: "$quoteData" },
            response: { $first: "$response" },
          },
        },
      ]);

      const latestRecords = {};

      data.forEach((item) => {
        const { EnquiryId, createdAt } = item;
        if (
          !latestRecords[EnquiryId] ||
          createdAt > latestRecords[EnquiryId].createdAt
        ) {
          latestRecords[EnquiryId] = item;
        }
      });

      const latestSurveyData = Object.values(latestRecords).filter(
        (item) => item.response === "Survey"
      );

      if (latestSurveyData.length > 0) {
        return res.json({ enquiryfollowup: latestSurveyData });
      } else {
        return res.json({ error: "No survey responses found" });
      }
    } catch (error) {
      console.log("error---", error.message);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async cancelsurvey(req, res) {
    try {
      let id = req.params.id;
      let { reasonForCancel, adminname, admindate } = req.body;
      let newData = await enquiryfollowupModel.findOneAndUpdate(
        { _id: id },
        {
          reasonForCancel,
          adminname,
          admindate,
          cancelStatus: true, // Set cancelStatus to true when canceling the survey
        },
        { new: true } // Return the updated document
      );
      if (newData) {
        return res.status(200).json({ Success: "Added", cancelStatus: true });
      } else {
        return res.status(500).json({ error: "Something went wrong" });
      }
    } catch (error) {
      console.log("Error in controller : ", error);
      return res.status(403).send({
        message:
          "Something went wrong while updating your details Please try again later.",
      });
    }
  }

  async updateDetails(req, res) {
    let id = req.params.id;
    let { technicianname, appoDate, appoTime, sendSms, techId } = req.body;
    let newData = await enquiryfollowupModel.findOneAndUpdate(
      { _id: id },
      {
        technicianname,
        appoDate,
        appoTime,
        sendSms,
        techId,
        nxtfoll: appoDate,
      }
    );
    if (newData) {
      return res.status(200).json({ Success: "Added" });
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getflwdata(req, res) {
    try {
      const { page = 1, pageSize = 25 } = req.query;
      const skip = (page - 1) * pageSize;

      const data = await enquiryfollowupModel.aggregate([
        {
          $lookup: {
            from: "enquiryadds",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "enquirydata",
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: parseInt(pageSize),
        },
      ]);

      const latestRecords = {};

      data.forEach((item) => {
        const { EnquiryId, createdAt } = item;
        if (
          !latestRecords[EnquiryId] ||
          createdAt > latestRecords[EnquiryId].createdAt
        ) {
          latestRecords[EnquiryId] = item;
        }
      });

      const latestSurveyData = Object.values(latestRecords).filter(
        (item) => item.response === "New"
      );

      console.log("latestSurveyData---new", latestSurveyData);
      return res.json({ enquiryfollowup: latestSurveyData });
    } catch (error) {
      console.error("Error in getflwdata:", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  // Example usage with Express
  // app.get('/api/enquiryfollowups', getflwdata);

  async getcalllaterdata(req, res) {
    try {
      let data = await enquiryfollowupModel.aggregate([
        {
          $lookup: {
            from: "enquiryadds",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "enquirydata",
          },
        },
      ]);

      const latestRecords = {};

      data.forEach((item) => {
        const { EnquiryId, createdAt } = item;
        if (
          !latestRecords[EnquiryId] ||
          createdAt > latestRecords[EnquiryId].createdAt
        ) {
          latestRecords[EnquiryId] = item;
        }
      });

      const latestCallLaterData = Object.values(latestRecords).filter(
        (item) => item.response === "Call Later"
      );

      return res.json({ enquiryfollowup: latestCallLaterData });
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getcalllaterandquotedata(req, res) {
    try {
      let data = await enquiryfollowupModel.aggregate([
        {
          $lookup: {
            from: "enquiryadds",
            localField: "EnquiryId",
            foreignField: "EnquiryId",
            as: "enquirydata",
          },
        },
      ]);

      const latestRecords = {};

      data.forEach((item) => {
        const { EnquiryId, createdAt } = item;
        if (
          !latestRecords[EnquiryId] ||
          createdAt > latestRecords[EnquiryId].createdAt
        ) {
          latestRecords[EnquiryId] = item;
        }
      });

      const latestEnquiries = Object.values(latestRecords).filter(
        (item) => item.response === "Call Later" || item.response === "Quote"
      );

      return res.json({ enquiryfollowup: latestEnquiries });
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  //Delete
  async deleteenquiryfollowup(req, res) {
    let id = req.params.id;
    const data = await enquiryfollowupModel.deleteOne({ _id: id });
    return res.json({ success: "Delete Successf" });
  }
}
const enquiryfollowupcontroller = new addenquiry();
module.exports = enquiryfollowupcontroller;
