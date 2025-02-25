import React from "react";
import {
  Select as RadixSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectViewport,
} from "@radix-ui/react-select";

export { SelectTrigger, SelectValue, SelectContent, SelectItem };

export const Select = ({
  options = [],
  placeholder = "Select",
  value,
  onValueChange,
  className = "",
}) => {
  return (
    <RadixSelect value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={`w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500 ${className}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectViewport>
          {options.map((option, index) => (
            <SelectItem key={index} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectViewport>
      </SelectContent>
    </RadixSelect>
  );
};
