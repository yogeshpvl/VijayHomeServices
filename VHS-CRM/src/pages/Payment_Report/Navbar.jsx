import React, { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to first tab if no subpath is present
  useEffect(() => {
    if (location.pathname === "/payment-reports") {
      navigate("/payment-reports/PRCalendar"); // Default first tab
    }
  }, [location, navigate]);

  return (
    <div className="bg-white shadow-md rounded-sm p-4">
      <div className="flex gap-3">
        {[
          { name: "Payment Calender", path: "/payment-reports/PRCalendar" },
        ].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-2 py-1 text-sm font-medium border border-red-100 rounded-lg transition-all duration-300 ${
                isActive ||
                (location.pathname === "/payment-reports" &&
                  item.path === "/payment-reports/PRCalendar")
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
