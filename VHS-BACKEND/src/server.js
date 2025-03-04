const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

// Load environment variables first
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const enquiryRoutes = require("./routes/enquiry/enquiry");
const userRoutes = require("./routes/user/user");
const responseRoutes = require("./routes/response/response");
const categoryRoutes = require("./routes/category/category");
const cityRoutes = require("./routes/city/city");
const followupRoutes = require("./routes/followups/followups");

app.use("/api/enquiries", enquiryRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/followups", followupRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
