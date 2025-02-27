import React, { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to first tab if no subpath is present
  useEffect(() => {
    if (location.pathname === "/enquiryfollowup") {
      navigate("/EnquiryFollowup/FollowupCalendar"); // Default first tab
    }
  }, [location, navigate]);

  return (
    <div className="bg-white shadow-md rounded-sm p-4">
      <div className="flex gap-3">
        {[
          { name: "Today", path: "/EnquiryFollowup/FollowupTable/:today" },
          { name: "Tomorrow", path: "/EnquiryFollowup/FollowupTable" },
          { name: "Yesterday", path: "/EnquiryFollowup/FollowupTable" },
          { name: "This Week", path: "/EnquiryFollowup/FollowupTable" },
          { name: "Last Week", path: "/EnquiryFollowup/FollowupTable" },
          { name: "Next Week", path: "/EnquiryFollowup/FollowupTable" },
          { name: "This Month", path: "/EnquiryFollowup/FollowupTable" },
          { name: "Call Later", path: "/EnquiryFollowup/FollowupTable" },
          { name: "Call Later", path: "/EnquiryFollowup/FollowupTable" },
          { name: "Confirmed", path: "/EnquiryFollowup/FollowupTable" },
          { name: "Not Interested", path: "/EnquiryFollowup/FollowupTable" },
        ].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-2 py-1 text-sm font-medium border border-red-100 rounded-lg transition-all duration-300 ${
                isActive ||
                (location.pathname === "/enquiry" &&
                  item.path === "/enquiry/add")
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
