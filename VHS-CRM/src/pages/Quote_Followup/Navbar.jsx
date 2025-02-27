import React, { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to first tab if no subpath is present
  useEffect(() => {
    if (location.pathname === "/quotefollowup") {
      navigate("/QuoteFollowup/QuoteCalendar"); // Default first tab
    }
  }, [location, navigate]);

  return (
    <div className="bg-white shadow-md rounded-sm p-4">
      <div className="flex gap-3">
        {[
          { name: "Today", path: "/QuoteFollowup/FollowupTable/:today" },
          { name: "Tomorrow", path: "/QuoteFollowup/FollowupTable" },
          { name: "Yesterday", path: "/QuoteFollowup/FollowupTable" },
          { name: "This Week", path: "/QuoteFollowup/FollowupTable" },
          { name: "Last Week", path: "/QuoteFollowup/FollowupTable" },
          { name: "Next Week", path: "/QuoteFollowup/FollowupTable" },
          { name: "This Month", path: "/QuoteFollowup/FollowupTable" },
          { name: "Call Later", path: "/QuoteFollowup/FollowupTable" },
          { name: "Call Later", path: "/QuoteFollowup/FollowupTable" },
          { name: "Confirmed", path: "/QuoteFollowup/FollowupTable" },
          { name: "Not Interested", path: "/QuoteFollowup/FollowupTable" },
        ].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-2 py-1 text-sm font-medium border border-red-100 rounded-lg transition-all duration-300 ${
                isActive ||
                (location.pathname === "/quotefollowup" &&
                  item.path === "/QuoteFollowup/add")
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

export default Navbar;
