import React from "react";
import ContentNav from "./ContentNav";
import { Outlet } from "react-router-dom";

const QuotationFormatContentLayout = () => {
  const selectedCategory = localStorage.getItem("selectedCategory");

  return (
    <div className="">
      <h3>Category: {selectedCategory}</h3>
      <ContentNav />
      <div className="mt-2">
        <Outlet />
      </div>
    </div>
  );
};

export default QuotationFormatContentLayout;
