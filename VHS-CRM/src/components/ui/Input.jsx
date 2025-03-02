export const Input = ({
  placeholder,
  value,
  onChange = () => {}, // Ensuring `onChange` is always present
  type = "text",
  className = "",
  name = "",
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange} // Ensure this is defined
      placeholder={placeholder}
      className={`w-full border border-gray-300 px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500 ${className}`}
    />
  );
};
