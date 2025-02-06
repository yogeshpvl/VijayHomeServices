import React from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
// import "react-pro-sidebar/dist/css/styles.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Sidebar = () => {
  // const { isAuthenticated } = useSelector((state) => state.auth);

  // if (!isAuthenticated) return null; // Hide sidebar if not logged in

  return (
    <ProSidebar>
      <Menu iconShape="square">
        <MenuItem>
          <Link to="/home">Home</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/master">Master</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/customer">Customer</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/enquiry">Enquiry</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/quote">Quote</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/payment-reports">Payment Reports</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/reports">Reports</Link>
        </MenuItem>
      </Menu>
    </ProSidebar>
  );
};

export default Sidebar;
