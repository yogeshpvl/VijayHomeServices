import React, { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to default tab on base path
  useEffect(() => {
    if (location.pathname === "/enquiryfollowup") {
      navigate("/EnquiryFollowup/FollowupCalendar"); // Default tab: Today
    }
  }, [location, navigate]);

  const tabs = [
    "today",
    "tomorrow",
    "yesterday",
    "this-week",
    "last-week",
    "next-week",
    "this-month",
    "call-later",
    "confirmed",
    "not-interested",
  ];

  return (
    <div className="bg-white shadow-md rounded-sm p-4">
      <div className="flex gap-3 flex-wrap">
        {tabs.map((tab) => (
          <NavLink
            key={tab}
            to={`/EnquiryFollowup/FollowupTable/${tab}`}
            className={({ isActive }) =>
              `px-2 py-1 text-sm font-medium border border-red-100 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-red-800 text-white shadow-md"
                  : "text-gray-700 hover:bg-red-800 hover:text-white hover:shadow-sm"
              }`
            }
          >
            {tab.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
