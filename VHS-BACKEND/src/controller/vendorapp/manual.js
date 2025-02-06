const manualModel = require("../../model/vendorapp/manual");
const { firebase } = require("../../firebase");
const technicianmodel = require("../../model/master/technician");
const vendorNotificationmodel = require("../../model/vendorapp/vendorNotification");

const sendNotification = async (TechorPMorVendorID) => {
  try {
    // Fetch FCM tokens from the database
    const vendor = await technicianmodel.findOne({ _id: TechorPMorVendorID });

    if (!vendor || !vendor.fcmtoken) {
      console.log("No FCM token found for this vendor.");
      return;
    }

    // Send notification to the vendor's FCM token
    try {
      await firebase.messaging().send({
        token: vendor.fcmtoken,
        notification: {
          title: "New Job from VHS",
          body: "Please accept the job",
        },
        android: {
          notification: {
            sound: "sound_bell",
            channelId: "sound_channel",
          },
        },
        data: {
          navigationId: "inhouseJob",
          chatId: "12345",
        },
      });
      console.log("Notification sent successfully.");
    } catch (error) {
      console.log("Error sending notification:", error);
    }
  } catch (error) {
    console.log("Error fetching vendor data:", error);
  }
};

class ManualJobs {
  async addjobs(req, res) {
    try {
      let { serviceID, vendorID, type, vendorName } = req.body;
      let add = new manualModel({
        serviceID,
        vendorID,
        vendorName,
        type,
      });
      let save = add.save();
      if (save) {
        return res.json({ sucess: "added successfully" });
      }
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({ error: "Unable to update " });
    }
  }

  async save(req, res) {
    try {
      const {
        serviceInfo,
        serviceId,
        serviceDate,
        bookingDate,
        jobCategory,
        TechorPMorVendorID,
        appoDate,
        appoTime,
        workerName,
        workerAmount,
        daytoComplete,
        techComment,
        backofficerExe,
        backofficerno,
        techName,
        salesExecutive,
        jobComplete,
        category,
        amount,
        type,
        jobType,
        BackofficeExecutive,
        TechorPMorVendorName,
        cancelOfficerName,
        cancelOfferNumber,
        reason,
        vCancel,
      } = req.body;

      // Check if the service already exists
      const existingService = await manualModel.findOne({
        serviceId: serviceId,
      });

      if (existingService) {
        // Update the existing service
        existingService.serviceInfo = serviceInfo;
        existingService.serviceDate = serviceDate;
        existingService.bookingDate = bookingDate;
        existingService.jobCategory = jobCategory;
        existingService.appoDate = appoDate;
        existingService.appoTime = appoTime;
        existingService.workerName = workerName;
        existingService.workerAmount = workerAmount;
        existingService.daytoComplete = daytoComplete;
        existingService.techComment = techComment;
        existingService.backofficerExe = backofficerExe;
        existingService.backofficerno = backofficerno;
        existingService.techName = techName;
        existingService.salesExecutive = salesExecutive;
        existingService.jobComplete = jobComplete;
        existingService.category = category;
        existingService.amount = amount;
        existingService.type = type;
        existingService.jobType = jobType;
        existingService.BackofficeExecutive = BackofficeExecutive;
        existingService.TechorPMorVendorName = TechorPMorVendorName;
        existingService.TechorPMorVendorID = TechorPMorVendorID;
        existingService.cancelOfficerName = cancelOfficerName;
        existingService.cancelOfferNumber = cancelOfferNumber;
        existingService.reason = reason;
        existingService.vCancel = vCancel;

        // Save the updated service
        const updatedService = await existingService.save();
        sendNotification(TechorPMorVendorID);
        return res.json({
          success: "Service data updated successfully",
          data: updatedService,
        });
      } else {
        // Create a new service
        const newService = new manualModel({
          serviceInfo,
          serviceId,
          serviceDate,
          bookingDate,
          jobCategory,
          TechorPMorVendorID,
          appoDate,
          appoTime,
          workerName,
          workerAmount,
          daytoComplete,
          techComment,
          backofficerExe,
          backofficerno,
          techName,
          salesExecutive,
          jobComplete,
          category,
          amount,
          type,
          jobType,
          BackofficeExecutive,
          TechorPMorVendorName,
          cancelOfficerName,
          cancelOfferNumber,
          reason,
          vCancel,
        });
        let add = new vendorNotificationmodel({
          title: serviceInfo[0]?.service || "New Job", // Fallback to default value if service is undefined
          desc: serviceInfo[0]?.desc || "Please accept", // Fallback to default value if desc is undefined
          date: appoDate,
          vendorId: TechorPMorVendorID,
          amount: amount || 0, // Default amount to 0 if undefined
        });

        const savedNotification = await add.save();
        const savedService = await newService.save();
        sendNotification(TechorPMorVendorID);
        return res.json({
          success: "Service data added successfully",
          data: savedService,
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  // async save(req, res) {
  //   let {
  //     serviceInfo,
  //     serviceId,
  //     serviceDate,
  //     bookingDate,
  //     jobCategory,
  //     TechorPMorVendorID, //this
  //     appoDate,
  //     appoTime,
  //     workerName,
  //     workerAmount,
  //     daytoComplete,
  //     techComment,
  //     backofficerExe,
  //     backofficerno,
  //     techName,
  //     salesExecutive,
  //     jobComplete,
  //     category,
  //     amount,
  //     type,
  //     jobType,
  //     BackofficeExecutive,
  //     TechorPMorVendorName,
  //     cancelOfficerName,
  //     cancelOfferNumber,
  //     reason,
  //     vCancel,
  //   } = req.body;

  //   const checkService = await manualModel.findOne({
  //     serviceId: serviceId,
  //     TechorPMorVendorID: TechorPMorVendorID,
  //   });

  //   if (checkService) {
  //     return res
  //       .status(401)
  //       .json({ error: "Service ID already exists in the database" });
  //   }
  //   try {
  //     const customer = new manualModel({
  //       serviceInfo,
  //       serviceId,
  //       serviceDate,
  //       category,
  //       bookingDate,
  //       jobCategory,

  //       appoDate,
  //       TechorPMorVendorID,
  //       appoTime,

  //       workerName,
  //       workerAmount,
  //       daytoComplete,
  //       techComment,
  //       salesExecutive,
  //       backofficerExe,
  //       backofficerno,
  //       techName,

  //       type,
  //       jobComplete,
  //       amount,
  //       jobType,
  //       BackofficeExecutive,
  //       TechorPMorVendorName,
  //       cancelOfficerName,
  //       cancelOfferNumber,
  //       reason,
  //       vCancel,
  //     });
  //     // Save the customer data to the database
  //     const savedCustomer = await customer.save();

  //     if (savedCustomer) {
  //       return res.json({ success: "dsr data added successfully" });
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //     return res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }

  async editdsr(req, res) {
    try {
      let id = req.params.id;

      let { vCancel, cancelDate } = req.body;
      let data = await manualModel.findOneAndUpdate(
        { _id: id },
        {
          vCancel,
          cancelDate,
        },
        { new: true }
      );
      if (data) {
        return res.json({ success: "Updated" });
      }
    } catch (error) {
      console.log("console vcancel error", error.message);
    }
  }

  async findwithmanulserviceids(req, res) {
    try {
      let serviceID = req.params.id;

      console.log("serviceID", serviceID);

      const data = await manualModel.findOne({ serviceID });
      if (data) {
        return res.status(200).json({ data: data });
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async getvendoraggreData(req, res) {
    try {
      const vendorId = req.params?.id;
      const data = await manualModel.find({
        TechorPMorVendorID: vendorId,
        $or: [{ vCancel: "" }, { vCancel: { $exists: false } }],
      });
      if (data.length === 0) {
        return res.status(404).json({ error: "no data found!" });
      } else {
        return res.status(200).json({ data: data });
      }
    } catch (error) {
      console.log("error.message", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // async getvendoraggreData(req, res) {
  //   try {
  //     const vendorId = req.params?.id;
  //     const data = await manualModel.find({
  //       TechorPMorVendorID: vendorId,
  //       vCancel: "",
  //     });
  //     if (data.length === 0) {
  //       return res.status(404).json({ error: "no data found!" });
  //     } else {
  //       return res.status(200).json({ data: data });
  //     }
  //   } catch (error) {
  //     console.log("error.message", error.message);
  //   }
  // }

  async getmanualdatafromcrm(req, res) {
    let data = await manualModel.find({}).sort({ _id: -1 });
    if (data) {
      return res.status(200).json({ data: data });
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
}
const Manualcontroller = new ManualJobs();
module.exports = Manualcontroller;
