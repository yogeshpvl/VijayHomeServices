const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const app = express();

app.use(morgan(""));
const connectDB = require("./config/db");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", // Change this to your frontend URL
    credentials: true,
  })
);

app.use(express.json()); // Allow JSON requests
connectDB();

// Middleware
app.use(express.json());
// Import Routes
const authRoutes = require("./routes/admin/auth");

// Use Routes
app.use("/api/adminAuth", authRoutes);

module.exports = app;
