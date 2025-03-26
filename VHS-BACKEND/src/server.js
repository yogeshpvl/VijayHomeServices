const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
// Load environment variables first
dotenv.config();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const enquiryRoutes = require("./routes/enquiry/enquiry");
const userRoutes = require("./routes/user/user");
const responseRoutes = require("./routes/response/response");
const categoryRoutes = require("./routes/category/category");
const cityRoutes = require("./routes/city/city");
const followupRoutes = require("./routes/followups/followups");
const b2btypeRoutes = require("./routes/master/b2bType");
const customerTypeRoutes = require("./routes/master/customerType");

const referenceRoutes = require("./routes/master/reference");
const regionRoutes = require("./routes/master/region");
const materialRoutes = require("./routes/master/material");
const jobRoutes = require("./routes/master/job");
const quotationHeaderFooterImRoutes = require("./routes/master/quotationImgs");
const bankDetailsRoutes = require("./routes/master/bankDetails");
const TermsSection1Routes = require("./routes/master/TermsSection1");
const TermsSection2Routes = require("./routes/master/TermsSection2");
const whatsappTemplateRoutes = require("./routes/master/whatsAppTemplate");
const vendorsRoutes = require("./routes/master/vendors");

// whats message
const whatappMsgRoutes = require("./routes/whatappMsg");

//customer
const customerRoutes = require("./routes/customer/customer");

//try to booking
const trytobookingRoutes = require("./routes/trytobooking");

const quotationRoutes = require("./routes/quote/quote");
const quotationItemRoutes = require("./routes/quote/quotationItem");

//servcice bookings data
const bookingsRoutes = require("./routes/serviceBooking/bookings");
const bookingServicesRoutes = require("./routes/serviceBooking/bookingServices");
const vendorAssignmentsRoutes = require("./routes/serviceBooking/vendorAssignments");

app.use("/api/enquiries", enquiryRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/followups", followupRoutes);
app.use("/api/b2btype", b2btypeRoutes);
app.use("/api/customertype", customerTypeRoutes);

app.use("/api/reference", referenceRoutes);

app.use("/api/region", regionRoutes);
app.use("/api/material", materialRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/quotation-header-footer", quotationHeaderFooterImRoutes);
app.use("/api/bank-details", bankDetailsRoutes);
app.use("/api/termsandcondtionssection1", TermsSection1Routes);
app.use("/api/termsandcondtionssection2", TermsSection2Routes);

app.use("/api/whatsapp-templates", whatsappTemplateRoutes);
app.use("/api/vendors", vendorsRoutes);

//whats app msgss
app.use("/api/whats-msg", whatappMsgRoutes);
//trytobooking
app.use("/api/trytobooking", trytobookingRoutes);

//customer
app.use("/api/customers", customerRoutes);
app.use("/api/quotation", quotationRoutes);
app.use("/api", quotationItemRoutes);

//service booking
app.use("/api/bookings", bookingsRoutes);
app.use("/api/bookingService", bookingServicesRoutes);
app.use("/api", vendorAssignmentsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
