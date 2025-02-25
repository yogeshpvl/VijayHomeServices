import React from "react";

export const Input = ({
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500 ${className}`}
    />
  );
};
