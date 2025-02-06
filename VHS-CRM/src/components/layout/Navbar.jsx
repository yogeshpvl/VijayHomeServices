import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav>
      <h2>Vijay Home Services CRM</h2>
      {isAuthenticated && <button onClick={handleLogout}>Logout</button>}
    </nav>
  );
};

export default Navbar;
