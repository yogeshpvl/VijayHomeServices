import React from "react";
import { Sidebar as ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faList,
  faUsers,
  faQuestionCircle,
  faFileAlt,
  faClipboardCheck,
  faUserPlus,
  faCalendarCheck,
  faClipboardList,
  faClipboard,
  faFileSignature,
  faProjectDiagram,
  faTasks,
  faHandshake,
  faBuilding,
  faUsersCog,
  faMoneyBillWave,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

import { setActiveTab, toggleSidebar } from "../../store/uiSlice";
import "./Sidebar.css";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { activeTab, isSidebarCollapsed } = useSelector((state) => state.ui);

  return (
    <ProSidebar collapsed={isSidebarCollapsed} className="sidebar">
      {/* Sidebar Header with Logo & Collapse Button */}
      <div className="sidebar-header">
        {!isSidebarCollapsed && <h3>VHS CRM</h3>}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="toggle-btn"
        >
          {isSidebarCollapsed ? "→" : "←"}
        </button>
      </div>

      <Menu className="pro-menu">
        <MenuItem
          className={`pro-menu-item ${activeTab === "/home" ? "active" : ""}`}
          component={<NavLink to="/home" />}
          onClick={() => dispatch(setActiveTab("/home"))}
        >
          <FontAwesomeIcon icon={faHome} className="menu-icon" />
          {!isSidebarCollapsed && <span className="menu-text">Home</span>}
        </MenuItem>

        <MenuItem
          className={`pro-menu-item ${activeTab === "/master" ? "active" : ""}`}
          component={<NavLink to="/master" />}
          onClick={() => dispatch(setActiveTab("/master"))}
        >
          <FontAwesomeIcon icon={faList} className="menu-icon" />
          {!isSidebarCollapsed && <span className="menu-text">Master</span>}
        </MenuItem>

        <MenuItem
          className={`pro-menu-item ${
            activeTab === "/customer" ? "active" : ""
          }`}
          component={<NavLink to="/customer" />}
          onClick={() => dispatch(setActiveTab("/customer"))}
        >
          <FontAwesomeIcon icon={faUsers} className="menu-icon" />
          {!isSidebarCollapsed && <span className="menu-text">Customer</span>}
        </MenuItem>

        <MenuItem
          className={`pro-menu-item ${
            activeTab === "/enquiry" ? "active" : ""
          }`}
          component={<NavLink to="/enquiry" />}
          onClick={() => dispatch(setActiveTab("/enquiry"))}
        >
          <FontAwesomeIcon icon={faQuestionCircle} className="menu-icon" />
          {!isSidebarCollapsed && <span className="menu-text">Enquiry</span>}
        </MenuItem>

        <MenuItem
          className={`pro-menu-item ${
            activeTab === "/enquiryfollowup" ? "active" : ""
          }`}
          component={<NavLink to="/enquiryfollowup" />}
          onClick={() => dispatch(setActiveTab("/enquiryfollowup"))}
        >
          <FontAwesomeIcon icon={faClipboardCheck} className="menu-icon" />
          {!isSidebarCollapsed && (
            <span className="menu-text">Enquiry Follow Up</span>
          )}
        </MenuItem>

        <MenuItem
          className={`pro-menu-item ${
            activeTab === "/EnquiryCreate" ? "active" : ""
          }`}
          component={<NavLink to="/EnquiryCreate" />}
          onClick={() => dispatch(setActiveTab("/EnquiryCreate"))}
        >
          <FontAwesomeIcon icon={faUserPlus} className="menu-icon" />
          {!isSidebarCollapsed && (
            <span className="menu-text">Enquiry Add</span>
          )}
        </MenuItem>

        <MenuItem
          className={`pro-menu-item ${
            activeTab === "/TryToBook" ? "active" : ""
          }`}
          component={<NavLink to="/TryToBook" />}
          onClick={() => dispatch(setActiveTab("/TryToBook"))}
        >
          <FontAwesomeIcon icon={faCalendarCheck} className="menu-icon" />
          {!isSidebarCollapsed && (
            <span className="menu-text">Try To Book</span>
          )}
        </MenuItem>

        <MenuItem
          className={`pro-menu-item ${activeTab === "/Survey" ? "active" : ""}`}
          component={<NavLink to="/Survey" />}
          onClick={() => dispatch(setActiveTab("/Survey"))}
        >
          <FontAwesomeIcon icon={faClipboardList} className="menu-icon" />
          {!isSidebarCollapsed && <span className="menu-text">Survey</span>}
        </MenuItem>

        <MenuItem
          className={`pro-menu-item ${activeTab === "/quote" ? "active" : ""}`}
          component={<NavLink to="/quote" />}
          onClick={() => dispatch(setActiveTab("/quote"))}
        >
          <FontAwesomeIcon icon={faFileSignature} className="menu-icon" />
          {!isSidebarCollapsed && <span className="menu-text">Quote</span>}
        </MenuItem>

        <MenuItem
          className={`pro-menu-item ${
            activeTab === "/quotefollowup" ? "active" : ""
          }`}
          component={<NavLink to="/quotefollowup" />}
          onClick={() => dispatch(setActiveTab("/quotefollowup"))}
        >
          <FontAwesomeIcon icon={faClipboardCheck} className="menu-icon" />
          {!isSidebarCollapsed && (
            <span className="menu-text">Quote Followup</span>
          )}
        </MenuItem>

        <MenuItem
          className={`pro-menu-item ${activeTab === "/DSR" ? "active" : ""}`}
          component={<NavLink to="/DSR" />}
          onClick={() => dispatch(setActiveTab("/DSR"))}
        >
          <FontAwesomeIcon icon={faClipboard} className="menu-icon" />
          {!isSidebarCollapsed && <span className="menu-text">DSR</span>}
        </MenuItem>

        <MenuItem
          className={`pro-menu-item ${
            activeTab === "/runningproject" ? "active" : ""
          }`}
          component={<NavLink to="/runningproject" />}
          onClick={() => dispatch(setActiveTab("/runningproject"))}
        >
          <FontAwesomeIcon icon={faProjectDiagram} className="menu-icon" />
          {!isSidebarCollapsed && (
            <span className="menu-text">Running Project</span>
          )}
        </MenuItem>

        <MenuItem
          className={`pro-menu-item ${activeTab === "/Closed" ? "active" : ""}`}
          component={<NavLink to="/Closed" />}
          onClick={() => dispatch(setActiveTab("/Closed"))}
        >
          <FontAwesomeIcon icon={faTasks} className="menu-icon" />
          {!isSidebarCollapsed && (
            <span className="menu-text">Closed Project</span>
          )}
        </MenuItem>

        <MenuItem
          className={`pro-menu-item ${activeTab === "/B2B" ? "active" : ""}`}
          component={<NavLink to="/B2B" />}
          onClick={() => dispatch(setActiveTab("/B2B"))}
        >
          <FontAwesomeIcon icon={faHandshake} className="menu-icon" />
          {!isSidebarCollapsed && <span className="menu-text">B2B</span>}
        </MenuItem>

        <MenuItem
          className={`pro-menu-item ${
            activeTab === "/Community" ? "active" : ""
          }`}
          component={<NavLink to="/Community" />}
          onClick={() => dispatch(setActiveTab("/Community"))}
        >
          <FontAwesomeIcon icon={faBuilding} className="menu-icon" />
          {!isSidebarCollapsed && <span className="menu-text">Community</span>}
        </MenuItem>

        <MenuItem
          className={`pro-menu-item ${
            activeTab === "/payment-reports" ? "active" : ""
          }`}
          component={<NavLink to="/payment-reports" />}
          onClick={() => dispatch(setActiveTab("/payment-reports"))}
        >
          <FontAwesomeIcon icon={faMoneyBillWave} className="menu-icon" />
          {!isSidebarCollapsed && (
            <span className="menu-text">Payment Reports</span>
          )}
        </MenuItem>

        <MenuItem
          className={`pro-menu-item ${
            activeTab === "/reports" ? "active" : ""
          }`}
          component={<NavLink to="/reports" />}
          onClick={() => dispatch(setActiveTab("/reports"))}
        >
          <FontAwesomeIcon icon={faChartLine} className="menu-icon" />
          {!isSidebarCollapsed && <span className="menu-text">Reports</span>}
        </MenuItem>
      </Menu>
    </ProSidebar>
  );
};

export default Sidebar;
