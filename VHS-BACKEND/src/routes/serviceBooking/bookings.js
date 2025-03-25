const express = require("express");
const router = express.Router();
const BookingController = require("../../controllers/serviceBooking/bookings");

// Create a new booking
router.post("/create", BookingController.createBooking);

// Get all bookings
router.get("/all", BookingController.getAllBookings);
router.get("/by-customer/:user_id", BookingController.getBookingsByUserId);

// Get a single booking by ID
router.get("/:id", BookingController.getBookingById);

// Update a booking by ID
router.put("/update/:id", BookingController.updateBooking);

// Delete a booking by ID
router.delete("/:id", BookingController.deleteBooking);

// Get bookings for a particular month with vendor filter
router.get("/bookings/monthly", BookingController.getMonthlyCounts);

module.exports = router;
