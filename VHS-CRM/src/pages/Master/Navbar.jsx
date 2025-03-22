import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Menu Items
  const menuItems = [
    { name: "User", path: "/master/user" },
    { name: "Team", path: "/master/team" },
    { name: "Category", path: "/master/category" },
    { name: "City", path: "/master/city" },
    // { name: "Material", path: "/master/material" },
    { name: "Customer Type", path: "/master/customer-type" },
    { name: "Response", path: "/master/response" },
    { name: "Reference", path: "/master/reference" },
    { name: "Whatsapp Template", path: "/master/whatsapp-template" },
    { name: "B2B Type", path: "/master/b2b-type" },
    { name: "Quotation Format", path: "/master/quotation-format" },
  ];

  // Redirect to "/master/user" if only "/master" is visited
  useEffect(() => {
    if (location.pathname === "/master") {
      navigate("/master/user");
    }
  }, [location.pathname, navigate]);

  return (
    <div className="bg-white shadow-md rounded-sm p-4">
      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-between items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="text-red-800">
          <Menu size={24} />
        </button>
      </div>

      {/* Navbar Menu */}
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
                isActive ||
                (location.pathname === "/master" &&
                  item.path === "/master/user")
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

///
