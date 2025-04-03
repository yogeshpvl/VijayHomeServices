import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const SurveyLayout = () => {
  return (
    <div className="p-6">
      <Navbar />

      <div className="mt-5 bg-white shadow-md p-4 rounded-md">
        <Outlet />
      </div>
    </div>
  );
};

export default SurveyLayout;
