import React from "react";
import { Link } from "react-router-dom";

function Reports() {
  const cardClass =
    "bg-white border border-gray-300 rounded-md h-40 flex items-center justify-center text-sm font-semibold text-center cursor-pointer transition-all duration-300 hover:bg-red-800 hover:text-white";

  return (
    <div className="w-full px-4 py-6 bg-white min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Link to="/category">
          <div className={cardClass}>Category</div>
        </Link>

        <Link to="/reportdsr">
          <div className={cardClass}>DSR</div>
        </Link>

        <div className={cardClass}>Enquiry Report</div>
        <div className={cardClass}>Survey</div>
        <div className={cardClass}>Quotation</div>
        <div className={cardClass}>Running Projects</div>
        <div className={cardClass}>Closed Projects</div>
        <div className={cardClass}>B2B</div>
        <div className={cardClass}>Payment Reports</div>
      </div>
    </div>
  );
}

export default Reports;
