const express = require("express");
const { firebase } = require("../firebase"); // Ensure firebase is correctly imported
const { firebase1 } = require("../firebase"); // Ensure firebase is correctly imported
const router = express.Router();
const technicianmodel = require("../model/master/technician");
const customerModel = require("../model/customer");

//Outside vendor
router.route("/fcmpushnotificationoutvendor").post(async (req, res) => {
  const { title, body, imageUrl } = req.body; // Add imageUrl to the request body

  try {
    // Fetch FCM tokens from the database
    const vendors = await technicianmodel.find({}).select("fcmtoken");

    // Filter out vendors with a valid FCM token
    const filterdata = vendors.filter((i) => i.fcmtoken);

    // Check if there are no vendors with a valid FCM token
    if (!filterdata || filterdata.length === 0) {
      console.log("No vendors found with valid FCM tokens");
      return res.status(404).send("No vendors found with valid FCM tokens");
    }

    // Loop through each vendor and send the notification
    const notificationPromises = filterdata.map(async (vendor) => {
      try {
        await firebase.messaging().send({
          token: vendor.fcmtoken,
          notification: {
            title: title,
            body: body,
            image: imageUrl, // Add imageUrl to the notification payload
          },
          data: {
            navigationId: "notification",
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
    await Promise.all(notificationPromises);

    res.status(200).send("Notifications sent successfully");
  } catch (error) {
    console.error("Error sending FCM notifications:", error);
    res.status(500).send("Error sending FCM notifications");
  }
});

//userapp customers
router.route("/fcmpushnotificationUserApp").post(async (req, res) => {
  const { title, body, imageUrl } = req.body; // Add imageUrl to the request body

  try {
    // Fetch FCM tokens from the database
    const customers = await customerModel.find({}).select("fcmtoken");

    // Filter out customers with a valid FCM token
    const filterdata = customers.filter((i) => i.fcmtoken);

    console.log("filterdata", filterdata);

    // Check if there are no customers with a valid FCM token
    if (!filterdata || filterdata.length === 0) {
      return res.status(404).send("No customers found with valid FCM tokens");
    }

    // Loop through each vendor and send the notification
    const notificationPromises = filterdata.map(async (customer) => {
      try {
        await firebase1.messaging().send({
          token: customer.fcmtoken,
          notification: {
            title: title,
            body: body,
            image: imageUrl, // Add imageUrl to the notification payload
          },
          data: {
            navigationId: "notification",
            chatId: "12345",
          },
        });
      } catch (error) {}
    });

    // Wait for all notifications to be sent
    await Promise.all(notificationPromises);

    res.status(200).send("Notifications sent successfully");
  } catch (error) {
    console.error("Error sending FCM notifications:", error);
    res.status(500).send("Error sending FCM notifications");
  }
});

module.exports = router; // Export the router
