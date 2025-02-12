import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="bg-white shadow-md rounded-sm p-4">
      <div className="flex  gap-3">
        {[
          { name: "Customer Add", path: "/customer/add" },
          { name: "Customer Search", path: "/customer/search" },
        ].map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-2 py-1 text-sm font-medium border border-red-100 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-red-800 text-white shadow-md"
                  : "text-black-600 hover:bg-red-800 hover:text-white hover:shadow-sm"
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
