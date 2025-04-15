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
const userAddressRoutes = require("./routes/customer/customeraddresss");
const customerWalletRoutes = require("./routes/customer/customerWallet");

//try to booking
const trytobookingRoutes = require("./routes/trytobooking");

const quotationRoutes = require("./routes/quote/quote");
const quotationItemRoutes = require("./routes/quote/quotationItem");
const quoteFollowupRoutes = require("./routes/quote/quoteFollowup");

//servcice bookings data
const bookingsRoutes = require("./routes/serviceBooking/bookings");
const bookingServicesRoutes = require("./routes/serviceBooking/bookingServices");
const vendorAssignmentsRoutes = require("./routes/serviceBooking/vendorAssignments");
const rescheduleRoutes = require("./routes/serviceBooking/resheduledata");
const rmaterialRoutes = require("./routes/serviceBooking/rMaterials");
const workMaterialRoutes = require("./routes/serviceBooking/work");
const techCancelRoutes = require("./routes/serviceBooking/techCancel");
const techRescheduleRoutes = require("./routes/serviceBooking/techReschedule");
const manpowerRoutes = require("./routes/serviceBooking/manpower");

//b2b
const b2bRoutes = require("./routes/b2b/b2b");
const b2bFollowupRoutes = require("./routes/b2b/b2bfollowups");

//comunity
const communityRoutes = require("./routes/1community/community");
const communityPaymentRoutes = require("./routes/1community/communityPayments");

//paymets
const paymentRoutes = require("./routes/payments/payments");
const vendorPaymentRoutes = require("./routes/payments/vendorPayments");

const vendorPgRoutes = require("./routes/PG/vendorPG");
const customerPGRoutes = require("./routes/PG/customerPG");

app.use("/api/vendorPG", vendorPgRoutes);
app.use("/api/customerPG", customerPGRoutes);

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
app.use("/api/customer-address", userAddressRoutes);
app.use("/api/customer-wallet", customerWalletRoutes);

app.use("/api/quotation", quotationRoutes);
app.use("/api", quotationItemRoutes);
app.use("/api/quote-followups", quoteFollowupRoutes);

//service booking
app.use("/api/bookings", bookingsRoutes);
app.use("/api/bookingService", bookingServicesRoutes);
app.use("/api/reschedules", rescheduleRoutes);
app.use("/api", vendorAssignmentsRoutes);
app.use("/api/manpower", manpowerRoutes);
app.use("/api/rmaterial", rmaterialRoutes);
app.use("/api/work-materials", workMaterialRoutes);
app.use("/api", techCancelRoutes);
app.use("/api", techRescheduleRoutes);

//b2b
app.use("/api/b2b", b2bRoutes);
app.use("/api/b2b-followups", b2bFollowupRoutes);

//comunity
app.use("/api/communities", communityRoutes);
app.use("/api/community-payments", communityPaymentRoutes);

//payments

app.use("/api/payments", paymentRoutes);
app.use("/api", vendorPaymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
