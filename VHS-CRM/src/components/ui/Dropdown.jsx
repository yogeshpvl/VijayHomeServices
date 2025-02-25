import React from "react";

const Dropdown = ({
  label = "Select",
  options = [],
  value,
  onChange,
  placeholder = "-select-",
  className = "",
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border bg-white border-gray-300 px-1 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
