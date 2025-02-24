const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(morgan(""));
const connectDB = require("./config/db");

app.use(express.json());

app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
const cityRoutes = require("./routes/Master/city");
const enquiryRoutes = require("./routes/Enquiry/enquiry");
const followUpRoutes = require("./routes/Enquiry/followUp");

// Use Routes
app.use("/api/adminAuth", authRoutes);
app.use("/api/master", cityRoutes);
app.use("/api", enquiryRoutes);
app.use("/api/followup", followUpRoutes);

module.exports = app;
