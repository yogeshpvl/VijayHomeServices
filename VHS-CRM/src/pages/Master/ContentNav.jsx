import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

const ContentNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const contentMenuItems = [
    { name: "Region", path: "/master/quotation-format-content/region" },
    { name: "Material", path: "/master/quotation-format-content/material" },
    { name: "Job", path: "/master/quotation-format-content/job" },
  ];

  const formatMenuItems = [
    {
      name: "Terms and Condition",
      path: "/master/quotation-format-content/termsAndConditions",
    },
    {
      name: "Quote Header Img",
      path: "/master/quotation-format-content/qHeaderImg",
    },
    {
      name: "Quote Footer Img",
      path: "/master/quotation-format-content/qFooterImg",
    },
    { name: "Bank", path: "/master/quotation-format-content/bank" },
  ];

  useEffect(() => {
    const selectionType = localStorage.getItem("selectionType");
    if (selectionType === "format") {
      setMenuItems(formatMenuItems);
    } else if (selectionType === "content") {
      setMenuItems(contentMenuItems);
    }
  }, []);

  useEffect(() => {
    // Perform redirect to first tab after menuItems are set
    if (
      menuItems.length > 0 &&
      (location.pathname === "/master/quotation-format-content" ||
        location.pathname === "/master")
    ) {
      navigate(menuItems[0].path); // Redirect to first item's path
    }
  }, [menuItems]);

  return (
    <div className="bg-white shadow-md rounded-sm p-2">
      {/* Mobile toggle */}
      <div className="md:hidden flex justify-between items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="text-red-800">
          <Menu size={24} />
        </button>
      </div>

      {/* Nav Buttons */}
      <div
        className={`md:flex ${
          isOpen ? "block" : "hidden"
        } flex-wrap gap-2 md:gap-3 mt-2 md:mt-0`}
      >
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-2 py-1 text-sm font-medium border border-red-200 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-red-800 text-white shadow-md"
                  : "text-gray-700 hover:bg-red-800 hover:text-white hover:shadow-sm"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default ContentNav;
