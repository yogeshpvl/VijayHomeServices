import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const EnquiryLayout = () => {
  return (
    <div className="p-6">
      <Navbar />

      {/* This is where the selected enquiry page will be displayed */}
      <div className="mt-5 ">
        <Outlet />
      </div>
    </div>
  );
};

export default EnquiryLayout;
