import React from "react";

export const Button = ({
  variant = "default",
  children,
  onClick,
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-semibold transition duration-200 ";
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-gray-500 text-gray-700 hover:bg-gray-100",
    cancel: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    whatsapp:
      "bg-green-600 text-white flex items-center gap-2 hover:bg-green-700",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
