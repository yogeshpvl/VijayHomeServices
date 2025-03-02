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

app.use("/api/enquiries", enquiryRoutes);
app.use("/api/auth", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
