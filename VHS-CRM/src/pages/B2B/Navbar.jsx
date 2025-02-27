import React, { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to first tab if no subpath is present
  useEffect(() => {
    if (location.pathname === "/B2B") {
      navigate("/B2B/B2BAdd"); // Default first tab
    }
  }, [location, navigate]);

  return (
    <div className="bg-white shadow-md rounded-sm p-4">
      <div className="flex gap-3">
        {[
          { name: "B2B Add", path: "/B2B/B2BAdd" },
          { name: "Import/ Export Bulk", path: "/B2B/B2BImport" },
          { name: "B2B Search", path: "/B2B/B2BSearch" },
          { name: "Send Template", path: "/B2B/B2BSendTemp" },
          { name: "Todays Scheduled Templates", path: "/B2B/B2BTodaySch" },
        ].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-2 py-1 text-sm font-medium border border-red-100 rounded-lg transition-all duration-300 ${
                isActive ||
                (location.pathname === "/B2B" && item.path === "/B2B/B2BAdd")
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
