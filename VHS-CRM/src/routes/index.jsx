import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../store/uiSlice";
import MainLayout from "../components/layout/MainLayout";
import Login from "../pages/Login";
import Home from "../pages/Home/Home";

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

    setTimeout(() => dispatch(setLoading(false)), 1000); // Simulate loading
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

            <Route path="*" element={<NotFound />} />

            {/* Enquiry Section with Nested Routes */}
            <Route path="enquiry" element={<EnquiryLayout />}>
              <Route index element={<EnquiryAdd />} /> {/* Default route */}
              <Route path="add" element={<EnquiryAdd />} />
              <Route path="new" element={<EnquiryNew />} />
              <Route path="new-records" element={<New />} />
              <Route path="today" element={<Today />} />
              <Route path="search" element={<EnquirySearch />} />
              <Route path="enquiry-details/:id" element={<EnquiryDetails />} />
            </Route>

            {/* Master Section with Nested Routes */}
            <Route path="master" element={<MasterLayout />}>
              <Route index element={<User />} /> {/* Default to User */}
              <Route path="user" element={<User />} />
              <Route path="team" element={<Team />} />
              <Route path="category" element={<Category />} />
              <Route path="city" element={<City />} />
              <Route path="material" element={<Material />} />
              <Route path="customer-type" element={<CustomerType />} />
              <Route path="response" element={<Response />} />
              <Route path="reference" element={<Reference />} />
              <Route path="whatsapp-template" element={<WhatsAppTemplate />} />
              <Route path="b2b-type" element={<B2BType />} />
              <Route path="quotation-format" element={<QuotationFormat />} />
            </Route>

            {/* Customer Section with Nested Routes */}
            <Route path="customer" element={<CustomerLayout />}>
              <Route index element={<Search />} /> {/* Default to User */}
              <Route path="add" element={<Add />} />
              <Route path="search" element={<Search />} />
            </Route>

            {/* DSR Section with Nested Routes */}
            <Route path="DSR" element={<DSRLayout />}>
              <Route index element={<DSRCalendar />} />
              <Route path="DSRCalendar" element={<DSRCalendar />} />
              <Route path="DSRDetails/:id" element={<DSRDetails />} />
              <Route path="DSRList/:date/:category" element={<DSRList />} />
            </Route>
          </Route>
        )}
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
