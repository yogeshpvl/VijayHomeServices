import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const MasterLayout = () => {
  return (
    <div className="p-6">
      <Navbar />

      <div
        className="mt-5 bg-white shadow-md p-4 rounded-md"
        style={{ height: "100vh" }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MasterLayout;
