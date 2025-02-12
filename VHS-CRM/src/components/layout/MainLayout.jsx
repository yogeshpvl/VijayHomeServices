import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Wrapper */}
      <div
        className={`flex-1 flex flex-col bg-gray-100 transition-all duration-300 ${
          isSidebarCollapsed ? "ml-16" : ""
        }`}
      >
        {/* Navbar - Fixed Position */}
        <Navbar
          isSidebarCollapsed={isSidebarCollapsed}
          className="fixed top-0 w-full z-50  overflow-auto"
        />

        {/* Main Content Section */}
        <div className="p-2 pt-12 overflow-auto flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
