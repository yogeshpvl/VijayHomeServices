// components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const hasAccess = allowedRoles.some((role) => user?.roles?.[role]);

  return hasAccess ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
