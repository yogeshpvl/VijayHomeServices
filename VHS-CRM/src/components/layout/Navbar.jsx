import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const users = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-64 right-0 bg-[#9b0f2d] text-white py-3 px-6 flex items-center justify-between shadow-md z-50">
      {/* Left Section - Date & Time */}
      <div className="text-sm font-light">
        {new Date().toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

      {/* Center Section - Title */}
      <h2 className="text-lg font-bold tracking-wide uppercase">
        VIJAY HOME SERVICES
      </h2>

      {/* Right Section - User Info & Logout */}
      <div className="flex items-center gap-6 text-sm font-medium">
        <span>{users.displayname}</span>
        <a href="/change-password" className="hover:underline">
          Change Password
        </a>
        <button
          onClick={handleLogout}
          className="bg-white text-red-700 px-4 py-1 rounded-md hover:bg-red-600 hover:text-white transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
