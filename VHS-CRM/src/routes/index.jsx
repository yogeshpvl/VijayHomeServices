import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../store/uiSlice";
import MainLayout from "../components/layout/MainLayout";
import Login from "../pages/Login";
import Home from "../pages/Home/Home";
import ProtectedRoute from "./ProtectedRoute";

import Loader from "../components/common/Loader";
import NotFound from "../pages/404 page/NotFound";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import EnquiryAdd from "../pages/Enquiry/EnquiryAdd";
import EnquiryNew from "../pages/Enquiry/EnquiryNew";
import New from "../pages/Enquiry/New";
import Today from "../pages/Enquiry/Today";
import EnquirySearch from "../pages/Enquiry/EnquirySearch";
import EnquiryLayout from "../pages/Enquiry/EnquiryLayout";
import MasterLayout from "../pages/Master/MaterLayout";
import User from "../pages/Master/User";
import Category from "../pages/Master/Category";
import Team from "../pages/Master/Team";
import City from "../pages/Master/City";
import Material from "../pages/Master/Material";
import CustomerType from "../pages/Master/CustomerType";
import Response from "../pages/Master/Response";
import Reference from "../pages/Master/Reference";
import WhatsAppTemplate from "../pages/Master/WhatsAppTemplate";
import B2BType from "../pages/Master/B2BType";
import QuotationFormat from "../pages/Master/QuotationFormat";
import CustomerLayout from "../pages/Customer/CustomerLayout";
import Add from "../pages/Customer/Add";
import Search from "../pages/Customer/Search";
import EnquiryDetails from "../pages/Enquiry/EnquiryDetails";
import DSRLayout from "../pages/DSR/DSRLayout";
import DSRCalendar from "../pages/DSR/DSRCalendar";
import DSRDetails from "../pages/DSR/DSRDetails";
import DSRList from "../pages/DSR/DSRList";
import EFollwupLayout from "../pages/Enquiry_Followup/EFollwupLayout";
import FollowupCalendar from "../pages/Enquiry_Followup/FollowupCalendar";
import FollowupTable from "../pages/Enquiry_Followup/FollowupTable";
import SurveyLayout from "../pages/Survey/SurveyLayout";
import SurveyCalendar from "../pages/Survey/SurveyCalendar";
import SurveyList from "../pages/Survey/SurveyList";
import SurveyCancelled from "../pages/Survey/SurveyCancelled";
import QuoteLayout from "../pages/Quote/QuoteLayout";
import QuoteList from "../pages/Quote/QuoteList";
import QuoteConfirmed from "../pages/Quote/QuoteConfirmed";
import QuoteDetails from "../pages/Quote/QuoteDetails";
import QuoteFLayout from "../pages/Quote_Followup/QuoteFLayout";
import QuoteCalendar from "../pages/Quote_Followup/QuoteCalendar";
import QuoteTable from "../pages/Quote_Followup/QuoteTable";
import PRLayout from "../pages/Payment_Report/PRLayout";
import PRCalendar from "../pages/Payment_Report/PRCalendar";
import PRList from "../pages/Payment_Report/PRList";
import PaymentCollect from "../pages/Payment_Report/PaymentCollect";
import PRInvoice from "../pages/Payment_Report/PRInvoice";
import B2BLayout from "../pages/B2B/B2BLayout";
import B2BAdd from "../pages/B2B/B2BAdd";
import B2BImport from "../pages/B2B/B2BImport";
import B2BSearch from "../pages/B2B/B2BSearch";
import B2BSendTemp from "../pages/B2B/B2BSendTemp";
import B2BTodaySch from "../pages/B2B/B2BTodaySch";
import EnquiryCreate from "../pages/Enquiry/EnquiryCreate";
import TryToBook from "../pages/TryToBook/TryToBook";
import ClosedProject from "../pages/Projects/CloseProject";
import RunningProjects from "../pages/Projects/RunningProjects";
import ContentNav from "../pages/Master/ContentNav";
import Region from "../pages/Master/Region";
import Job from "../pages/Master/Job";
import BankDetails from "../pages/Master/BankDetails";
import QFooterImg from "../pages/Master/QFooterImg";
import QHeaderImg from "../pages/Master/QHeaderImg";
import TermsAndConditions from "../pages/Master/TermsAndConditions";
import QuotationFormatContentLayout from "../pages/Master/QuotationFormatContentLayout";
import TermsSection2 from "../pages/Master/TermsSection2";
import UserDetails from "../pages/Master/UserDetails";
import CustomerDetails from "../pages/Customer/CustomerDetails";
import CustomerEdit from "../pages/Customer/CustomerEdit";
import CustomerList from "../pages/Customer/CustomerList";
import EnquiryEdit from "../pages/Enquiry/EnquiryEdit";
import EFollwupDateTable from "../pages/Enquiry_Followup/EFollwupDateTable";
import SurveyDetails from "../pages/Survey/SurveyDetails";
import QuoteView from "../pages/Quote/QuoteView";
import Payments from "../pages/Projects/Payments";
import Painting from "../pages/Projects/Painting";
import Communitylayout from "../pages/Community/Communitylayout";
import Communityadd from "../pages/Community/Communityadd";
import Communitylist from "../pages/Community/Communitylist";
import Reports from "../pages/Reports/Reports";
import ReportCategory from "../pages/Reports/RepostCategory";

import RepostDSR from "../pages/Reports/RepostDSR";
import PaymentReport from "../pages/Reports/PaymentReports";
import EnquiryReport from "../pages/Reports/EnquiryReport";
import SurveyReport from "../pages/Reports/SurveyReport";
import QuoteReport from "../pages/Reports/QuoteReport";
import RunningReport from "../pages/Reports/RunningReport";

const AppContent = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setLoading(true));

    // Check if token is expired
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          console.warn("Token expired, redirecting to login...");
          localStorage.removeItem("authToken"); // Clear expired token
          navigate("/"); // Redirect to login
        }
      } catch (error) {
        console.error("Invalid token format:", error);
        localStorage.removeItem("authToken"); // Handle malformed token
        navigate("/");
      }
    }

    setTimeout(() => dispatch(setLoading(false)), 500); // Simulate loading
  }, [location.pathname, dispatch, navigate]);

  return (
    <>
      <Loader />
      <Routes>
        {!isAuthenticated ? (
          <Route path="/*" element={<Login />} />
        ) : (
          <Route path="/" element={<MainLayout />}>
            <Route path="home" element={<Home />} />
            <Route path="EnquiryCreate" element={<EnquiryCreate />} />
            <Route path="TryToBook" element={<TryToBook />} />
            <Route path="CloseProject" element={<ClosedProject />} />
            <Route path="runningproject" element={<RunningProjects />} />

            <Route path="*" element={<NotFound />} />

            {/* Enquiry Section with Nested Routes */}
            <Route path="enquiry" element={<EnquiryLayout />}>
              <Route index element={<EnquiryAdd />} /> {/* Default route */}
              <Route path="add" element={<EnquiryAdd />} />
              <Route path="edit/:id" element={<EnquiryEdit />} />
              <Route path="new" element={<EnquiryNew />} />
              <Route path="new-records" element={<New />} />
              <Route path="today" element={<Today />} />
              <Route path="search" element={<EnquirySearch />} />
              <Route path="enquiry-details/:id" element={<EnquiryDetails />} />
            </Route>

            {/* Suvey Section with Nested Routes */}
            <Route path="Survey" element={<SurveyLayout />}>
              <Route index element={<SurveyCalendar />} /> {/* Default route */}
              <Route path="SurveyCalendar" element={<SurveyCalendar />} />
              <Route
                path="surveyDetails/:enquiryId"
                element={<SurveyDetails />}
              />
              <Route
                path="SurveyList/:date/:category"
                element={<SurveyList />}
              />
              <Route path="SurveyCancelled" element={<SurveyCancelled />} />
            </Route>
            {/* Community */}
            <Route path="Community" element={<Communitylayout />}>
              <Route index element={<Communityadd />} /> {/* Default route */}
              <Route path="Communityadd" element={<Communityadd />} />
              <Route path="Communitylist" element={<Communitylist />} />
            </Route>

            {/* Reports */}

            <Route path="Reports" element={<Reports />}></Route>
            <Route path="category" element={<ReportCategory />}></Route>
            <Route path="reportdsr" element={<RepostDSR />}></Route>
            <Route path="reportEnquiry" element={<EnquiryReport />}></Route>
            <Route path="reportSurvey" element={<SurveyReport />}></Route>
            <Route path="reportQuote" element={<QuoteReport />}></Route>
            <Route path="RunningReport" element={<RunningReport />}></Route>

            <Route
              path="reportPaymentReport"
              element={<PaymentReport />}
            ></Route>

            {/* Master Section with Nested Routes */}
            <Route path="master" element={<MasterLayout />}>
              <Route index element={<User />} /> {/* Default to User */}
              <Route
                path="user"
                element={
                  <ProtectedRoute allowedRoles={["Master"]}>
                    <User />
                  </ProtectedRoute>
                }
              />
              <Route
                path="userdetails/:id"
                element={
                  <ProtectedRoute allowedRoles={["Master"]}>
                    <UserDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="team"
                element={
                  <ProtectedRoute allowedRoles={["Master"]}>
                    <Team />
                  </ProtectedRoute>
                }
              />
              <Route
                path="category"
                element={
                  <ProtectedRoute allowedRoles={["Master"]}>
                    <Category />
                  </ProtectedRoute>
                }
              />
              <Route
                path="city"
                element={
                  <ProtectedRoute allowedRoles={["Master"]}>
                    <City />
                  </ProtectedRoute>
                }
              />
              <Route
                path="customer-type"
                element={
                  <ProtectedRoute allowedRoles={["Master"]}>
                    <CustomerType />
                  </ProtectedRoute>
                }
              />
              <Route
                path="response"
                element={
                  <ProtectedRoute allowedRoles={["Master"]}>
                    <Response />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reference"
                element={
                  <ProtectedRoute allowedRoles={["Master"]}>
                    <Reference />
                  </ProtectedRoute>
                }
              />
              <Route path="whatsapp-template" element={<WhatsAppTemplate />} />
              <Route path="b2b-type" element={<B2BType />} />
              <Route path="quotation-format" element={<QuotationFormat />} />
              <Route
                path="quotation-format-content"
                element={<QuotationFormatContentLayout />}
              >
                <Route index element={<Navigate to="region" />} />
                <Route path="region" element={<Region />} />
                <Route path="material" element={<Material />} />
                <Route path="job" element={<Job />} />
                <Route path="bank" element={<BankDetails />} />
                <Route path="qFooterImg" element={<QFooterImg />} />
                <Route path="qHeaderImg" element={<QHeaderImg />} />
                <Route
                  path="termsAndConditions"
                  element={<TermsAndConditions />}
                />
                <Route path="termsAndConditions2" element={<TermsSection2 />} />
              </Route>
            </Route>

            {/* Customer Section with Nested Routes */}
            <Route path="customer" element={<CustomerLayout />}>
              <Route index element={<Search />} /> {/* Default to User */}
              <Route path="add" element={<Add />} />
              <Route path="edit/:id" element={<CustomerEdit />} />
              <Route path="search" element={<Search />} />
              <Route path="customerList" element={<CustomerList />} />
              <Route path="customerDetails/:id" element={<CustomerDetails />} />
            </Route>

            {/* DSR Section with Nested Routes */}
            <Route path="DSR" element={<DSRLayout />}>
              <Route index element={<DSRCalendar />} />
              <Route path="DSRCalendar" element={<DSRCalendar />} />
              <Route path="DSRDetails/:id" element={<DSRDetails />} />
              <Route path="DSRList/:date/:category" element={<DSRList />} />
            </Route>

            {/* Payment reports Section with Nested Routes */}
            <Route path="payment-reports" element={<PRLayout />}>
              <Route index element={<PRCalendar />} />
              <Route path="PRCalendar" element={<PRCalendar />} />
              <Route path="PaymentCollect/:id" element={<PaymentCollect />} />
              <Route path="PRInvoice/:id" element={<PRInvoice />} />

              <Route path="PRList/:date" element={<PRList />} />
            </Route>

            {/* EnquiryFollowup Section with Nested Routes */}
            <Route path="EnquiryFollowup" element={<EFollwupLayout />}>
              <Route index element={<FollowupCalendar />} />
              <Route path="FollowupCalendar" element={<FollowupCalendar />} />
              <Route
                path="FollowupDateTable/:date/:category"
                element={<EFollwupDateTable />}
              />

              <Route
                path="FollowupTable/:dateType"
                element={<FollowupTable />}
              />
              <Route path="Today" element={<Today />} />
            </Route>

            {/* Quote Section with Nested Routes */}
            <Route path="Quote" element={<QuoteLayout />}>
              <Route index element={<QuoteList />} />
              <Route path="QuoteList" element={<QuoteList />} />
              <Route path="QuoteConfirmed" element={<QuoteConfirmed />} />
              <Route path="quoteDetails/:id" element={<QuoteDetails />} />
            </Route>

            {/* Quote Section with Nested Routes */}
            <Route path="QuoteFollowup" element={<QuoteFLayout />}>
              <Route index element={<QuoteCalendar />} />
              <Route path="QuoteCalendar" element={<QuoteCalendar />} />
              <Route path="QuoteTable" element={<QuoteTable />} />
            </Route>

            {/* B2B Section with Nested Routes */}
            <Route path="B2B" element={<B2BLayout />}>
              <Route index element={<B2BAdd />} />
              <Route path="B2BAdd" element={<B2BAdd />} />
              <Route path="B2BImport" element={<B2BImport />} />
              <Route path="B2BSearch" element={<B2BSearch />} />
              <Route path="B2BSendTemp" element={<B2BSendTemp />} />
              <Route path="B2BTodaySch" element={<B2BTodaySch />} />
            </Route>
            <Route path="Payments" element={<Payments />} />
            <Route path="Painting" element={<Painting />} />
          </Route>
        )}

        <Route path="/quoteview" element={<QuoteView />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
