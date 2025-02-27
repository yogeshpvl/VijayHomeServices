import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const PRLayout = () => {
  return (
    <div className="p-6">
      <Navbar />

      <div
        className="mt-5 bg-white shadow-md p-4 rounded-md"
        style={{ background: "#f5eceab8" }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default PRLayout;
