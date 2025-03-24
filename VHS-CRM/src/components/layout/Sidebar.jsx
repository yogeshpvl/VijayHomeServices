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

// 🧠 Menu configuration based on roles
const menuConfig = [
  { key: "Home", path: "/home", label: "Home", icon: faHome },
  { key: "Master", path: "/master", label: "Master", icon: faList },
  { key: "Customer", path: "/customer", label: "Customer", icon: faUsers },
  {
    key: "Enquiry",
    path: "/enquiry",
    label: "Enquiry",
    icon: faQuestionCircle,
  },
  {
    key: "Enquiry Followup",
    path: "/enquiryfollowup",
    label: "Enquiry Follow Up",
    icon: faClipboardCheck,
  },
  {
    key: "EnquiryAdd",
    path: "/EnquiryCreate",
    label: "Enquiry Add",
    icon: faUserPlus,
  },
  {
    key: "TrytoBook Customers",
    path: "/TryToBook",
    label: "Try To Book",
    icon: faCalendarCheck,
  },
  { key: "Survey", path: "/Survey", label: "Survey", icon: faClipboardList },
  { key: "Quote", path: "/quote", label: "Quote", icon: faFileSignature },
  {
    key: "Quote Followup",
    path: "/quotefollowup",
    label: "Quote Followup",
    icon: faClipboardCheck,
  },
  { key: "DSR", path: "/DSR", label: "DSR", icon: faClipboard },
  {
    key: "Running Project",
    path: "/runningproject",
    label: "Running Project",
    icon: faProjectDiagram,
  },
  {
    key: "Close Project",
    path: "/Closed",
    label: "Closed Project",
    icon: faTasks,
  },
  { key: "B2B", path: "/B2B", label: "B2B", icon: faHandshake },
  {
    key: "Community",
    path: "/Community",
    label: "Community",
    icon: faBuilding,
  },
  {
    key: "Payment Report",
    path: "/payment-reports",
    label: "Payment Reports",
    icon: faMoneyBillWave,
  },
  { key: "Reports", path: "/reports", label: "Reports", icon: faChartLine },
];

const Sidebar = () => {
  const users = JSON.parse(localStorage.getItem("user"));
  const userRoles = users?.roles || {};

  const dispatch = useDispatch();
  const { activeTab, isSidebarCollapsed } = useSelector((state) => state.ui);

  return (
    <ProSidebar collapsed={isSidebarCollapsed} className="sidebar">
      {/* Header */}
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
        {menuConfig.map(
          (item) =>
            userRoles[item.key] && (
              <MenuItem
                key={item.key}
                className={`pro-menu-item ${
                  activeTab === item.path ? "active" : ""
                }`}
                component={<NavLink to={item.path} />}
                onClick={() => dispatch(setActiveTab(item.path))}
              >
                <FontAwesomeIcon icon={item.icon} className="menu-icon" />
                {!isSidebarCollapsed && (
                  <span className="menu-text">{item.label}</span>
                )}
              </MenuItem>
            )
        )}
      </Menu>
    </ProSidebar>
  );
};

export default Sidebar;
