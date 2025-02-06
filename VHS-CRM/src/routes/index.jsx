import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Customer from "../pages/Customer";
import Enquiry from "../pages/Enquiry";

const AppRoutes = () => {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer"
              element={
                <PrivateRoute>
                  <Customer />
                </PrivateRoute>
              }
            />
            <Route
              path="/enquiry"
              element={
                <PrivateRoute>
                  <Enquiry />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppRoutes;
