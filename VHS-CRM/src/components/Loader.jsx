import React from "react";
import { useSelector } from "react-redux";

const Loader = () => {
  const loading = useSelector((state) => state.loader.loading);

  if (!loading) return null; // Hide loader if not loading

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="w-16 h-16 border-t-4 border-white rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
