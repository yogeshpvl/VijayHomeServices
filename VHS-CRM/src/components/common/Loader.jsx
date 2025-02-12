import React from "react";
import { useSelector } from "react-redux";
import "./Loader.css";

const Loader = () => {
  const { isLoading } = useSelector((state) => state.ui);

  if (!isLoading) return null;

  return (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
