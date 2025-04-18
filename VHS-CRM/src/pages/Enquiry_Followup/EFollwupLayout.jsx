import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const EFollwupLayout = () => {
  return (
    <div className="p-6">
      <Navbar />

      {/* This is where the selected enquiry page will be displayed */}
      <div
        className="mt-5 bg-white shadow-md p-4 rounded-md"
        style={{ background: "#f5eceab8" }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default EFollwupLayout;
