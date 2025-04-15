const workingKey = "26BEB2F2DF6FEB5A6BF29F7259679061";
const accessCode = "AVHX01LG55AF47XHFA";
const merchant_id = "3663823";
const ccavUtil = require("../../config/ccavutil");
const db = require("../../models");
const Payment = require("../../models/payments/payments");
const { Booking, BookingService, User } = db;
const moment = require("moment");

const safeDate = (val) => {
  const d = new Date(val);
  return isNaN(d) ? null : d;
};
class CustomerPG {
  async CustomerBookingpayment(req, res) {
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
        customerName,
        email,
      } = req.body;

      const markerCoord = req.body.marker_coordinate
        ? [
            req.body.marker_coordinate.latitude,
            req.body.marker_coordinate.longitude,
          ]
        : [];

      const service_id = "121";

      const [rowsUpdated, updatedUsers] = await User.update(
        { customerName, email },
        {
          where: { id: user_id },
          returning: true,
        }
      );

      const updatedUser = updatedUsers?.[0] || null;
      // Step 1: Create the booking
      const newBooking = await Booking.create({
        ...req.body,
        marker_coordinate: markerCoord,
        amt_frequency: amt_frequency || 1,
        amtstart_date: safeDate(amtstart_date),
        amtexpiry_date: safeDate(amtexpiry_date),
        start_date: safeDate(start_date),
        expiry_date: safeDate(expiry_date),
        delivery_address,
        service_frequency: serviceFrequency,
        enquiry_id: enquiryId,
        payment_mode: "pending",
      });

      if (!service_id || !service) {
        return res.status(400).json({
          error:
            "service_id and service are required to create booking_services",
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
        const dividedAmount = +(totalCharge / amtFreq).toFixed(2);

        let serviceDates = [];
        let amtDates = [];

        if (frequency <= 1) {
          serviceDates = [start];
        } else {
          const interval = (end.getTime() - start.getTime()) / (frequency - 1);
          for (let i = 0; i < frequency; i++) {
            serviceDates.push(new Date(start.getTime() + i * interval));
          }
        }

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
          service_id,
          service_charge: dividedAmount,
          service_date:
            serviceDates[i] || serviceDates[serviceDates.length - 1],
          amt_date: amtDates[i] || amtDates[amtDates.length - 1],
          user_id,
        }));

        await BookingService.bulkCreate(serviceEntries);
      }

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

      // Step 2: Initiate payment
      const orderId = `TXN${Date.now()}`;
      const currency = "INR";

      const redirectUrl = `http://192.168.0.102:5000/api/customerPG/customer-booking-payment-status/${newBooking.id}/${start_date}/${user_id}`;
      const cancelUrl = "http://localhost:3000/payment-cancel";
      const language = "EN";

      const paymentString = `merchant_id=${merchant_id}&order_id=${orderId}&currency=${currency}&amount=${service_charge}&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}&language=${language}`;
      const encRequest = encodeURIComponent(
        ccavUtil.encrypt(paymentString, workingKey)
      );

      const baseUrl =
        "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";
      const paymentUrl = `${baseUrl}&encRequest=${encRequest}&access_code=${accessCode}`;

      return res.status(200).json({
        message: "Booking created and payment initiated",
        bookingId: newBooking,
        url: paymentUrl,
        user: updatedUser,
      });
    } catch (error) {
      console.error("Booking creation error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async CustomerBookingpaymentStatus(req, res) {
    try {
      const { serviceId, customer_id, service_date } = req.params;
      const { encResp } = req.body;

      if (!encResp) {
        return res.status(400).send("encResp is required");
      }

      const decryptedResponse = ccavUtil.decrypt(encResp, workingKey);
      const responseObject = decryptedResponse
        .split("&")
        .reduce((acc, keyValueString) => {
          const [key, value] = keyValueString.split("=");
          acc[key] = decodeURIComponent(value || "");
          return acc;
        }, {});

      if (responseObject.order_status === "Success") {
        await Booking.update(
          { payment_mode: "online" },
          { where: { id: serviceId } }
        );
        await Payment.create({
          payment_date: moment().format("YYYY-MM-DD"),
          paymen_type: "Customer",
          payment_mode: responseObject?.card_name,
          amount: responseObject.amount,
          service_date: service_date,
          customer_id: customer_id,
          service_id: serviceId,
        });

        return res.redirect("myapp://paymentSuccess");
      } else {
        return res.redirect("myapp://failure");
      }
    } catch (error) {
      console.error("Payment status update failed:", error);
      return res.status(500).send("Internal Server Error");
    }
  }

  async afterservicebookpayment(req, res) {
    const { serviceId, service_date, customer_id, amount } = req.body;

    const orderId = new Date();
    const currency = "INR";

    const redirectUrl = `http://localhost:5000/api/customerPG/customer-payment-after-booking-status/${serviceId}/${service_date}/${customer_id}`;

    const cancelUrl = "http://localhost:3000/payment-cancel";
    const language = "EN";

    const paymentString = `merchant_id=${merchant_id}&order_id=${orderId}&currency=${currency}&amount=${amount}&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}&language=${language}`;
    const encRequest = encodeURIComponent(
      ccavUtil.encrypt(paymentString, workingKey)
    );

    const baseUrl =
      "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";
    const paymentUrl = `${baseUrl}&encRequest=${encRequest}&access_code=${accessCode}`;

    res.status(200).json({ url: paymentUrl });
  }

  async afterservicebookpaymentstatus(req, res) {
    try {
      const { serviceId, customer_id, service_date } = req.params;
      const { encResp } = req.body;

      if (!encResp) {
        return res.status(400).send("encResp is required");
      }

      const decryptedResponse = ccavUtil.decrypt(encResp, workingKey);
      const responseObject = decryptedResponse
        .split("&")
        .reduce((acc, keyValueString) => {
          const [key, value] = keyValueString.split("=");
          acc[key] = decodeURIComponent(value || "");
          return acc;
        }, {});

      if (responseObject.order_status === "Success") {
        await Booking.update(
          { payment_mode: "online" },
          { where: { id: serviceId } }
        );
        await Payment.create({
          payment_date: moment().format("YYYY-MM-DD"),
          paymen_type: "Customer",
          payment_mode: responseObject?.card_name,
          amount: responseObject.amount,
          service_date: service_date,
          customer_id: customer_id,
          service_id: serviceId,
        });

        return res.redirect("myapp://paymentSuccess");
      } else {
        return res.redirect("myapp://failure");
      }
    } catch (error) {
      console.error("Payment status update failed:", error);
      return res.status(500).send("Internal Server Error");
    }
  }

  async CustomerBookingpaymentWebsite(req, res) {
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
        customerName,
        email,
      } = req.body;

      const markerCoord = req.body.marker_coordinate
        ? [
            req.body.marker_coordinate.latitude,
            req.body.marker_coordinate.longitude,
          ]
        : [];

      const service_id = "121";

      const [rowsUpdated, updatedUsers] = await User.update(
        { customerName, email },
        {
          where: { id: user_id },
          returning: true,
        }
      );

      const updatedUser = updatedUsers?.[0] || null;
      // Step 1: Create the booking
      const newBooking = await Booking.create({
        ...req.body,
        marker_coordinate: markerCoord,
        amt_frequency: amt_frequency || 1,
        amtstart_date: safeDate(amtstart_date),
        amtexpiry_date: safeDate(amtexpiry_date),
        start_date: safeDate(start_date),
        expiry_date: safeDate(expiry_date),
        delivery_address,
        service_frequency: serviceFrequency,
        enquiry_id: enquiryId,
        payment_mode: "pending",
      });

      if (!service_id || !service) {
        return res.status(400).json({
          error:
            "service_id and service are required to create booking_services",
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
        const dividedAmount = +(totalCharge / amtFreq).toFixed(2);

        let serviceDates = [];
        let amtDates = [];

        if (frequency <= 1) {
          serviceDates = [start];
        } else {
          const interval = (end.getTime() - start.getTime()) / (frequency - 1);
          for (let i = 0; i < frequency; i++) {
            serviceDates.push(new Date(start.getTime() + i * interval));
          }
        }

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
          service_id,
          service_charge: dividedAmount,
          service_date:
            serviceDates[i] || serviceDates[serviceDates.length - 1],
          amt_date: amtDates[i] || amtDates[amtDates.length - 1],
          user_id,
        }));

        await BookingService.bulkCreate(serviceEntries);
      }

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

      // Step 2: Initiate payment
      const orderId = `TXN${Date.now()}`;
      const currency = "INR";

      const redirectUrl = `http://192.168.0.102:5000/api/customerPG/customer-booking-payment-status-web/${newBooking.id}/${start_date}/${user_id}`;
      const cancelUrl = "http://localhost:3000/payment-cancel";
      const language = "EN";

      const paymentString = `merchant_id=${merchant_id}&order_id=${orderId}&currency=${currency}&amount=${service_charge}&redirect_url=${redirectUrl}&cancel_url=${cancelUrl}&language=${language}`;
      const encRequest = encodeURIComponent(
        ccavUtil.encrypt(paymentString, workingKey)
      );

      const baseUrl =
        "https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction";
      const paymentUrl = `${baseUrl}&encRequest=${encRequest}&access_code=${accessCode}`;

      return res.status(200).json({
        message: "Booking created and payment initiated",
        bookingId: newBooking,
        url: paymentUrl,
        user: updatedUser,
      });
    } catch (error) {
      console.error("Booking creation error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async CustomerBookingpaymentStatuswebsite(req, res) {
    try {
      const { serviceId, customer_id, service_date } = req.params;
      const { encResp } = req.body;

      if (!encResp) {
        return res.status(400).send("encResp is required");
      }

      const decryptedResponse = ccavUtil.decrypt(encResp, workingKey);
      const responseObject = decryptedResponse
        .split("&")
        .reduce((acc, keyValueString) => {
          const [key, value] = keyValueString.split("=");
          acc[key] = decodeURIComponent(value || "");
          return acc;
        }, {});

      if (responseObject.order_status === "Success") {
        await Booking.update(
          { payment_mode: "online" },
          { where: { id: serviceId } }
        );
        await Payment.create({
          payment_date: moment().format("YYYY-MM-DD"),
          paymen_type: "Customer",
          payment_mode: responseObject?.card_name,
          amount: responseObject.amount,
          service_date: service_date,
          customer_id: customer_id,
          service_id: serviceId,
        });

        return res.redirect("https://vijayhomeservice.com/Paymentsuccess");
      } else {
        return res.redirect("https://vijayhomeservice.com/Paymentfailure");
      }
    } catch (error) {
      console.error("Payment status update failed:", error);
      return res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = new CustomerPG();
