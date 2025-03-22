import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../../services/config";
import { Button } from "../../components/ui/Button";

function QuotationFormat() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectionType, setSelectionType] = useState(""); // "format" or "content"
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await fetch(`${config.API_BASE_URL}/categories`);
    const data = await response.json();
    setCategories(data);
  };

  const handleNext = () => {
    if (!selectedCategory || !selectionType)
      return alert("Please select both category and type");
    localStorage.setItem("selectedCategory", selectedCategory);
    localStorage.setItem("selectionType", selectionType);
    navigate("/master/quotation-format-content");
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Select Category</h2>
      <select
        className="border rounded-md px-2 py-1 mb-4 w-50 sm:w-1/4"
        onChange={(e) => setSelectedCategory(e.target.value)}
        value={selectedCategory}
      >
        <option value="">--select--</option>
        {categories.map((cat) => (
          <option key={cat.category_id} value={cat.category_name}>
            {cat.category_name}
          </option>
        ))}
      </select>

      {selectedCategory && (
        <div className="mb-4">
          <p className="font-medium mb-1">Select Mode:</p>
          <label className="mr-4">
            <input
              type="radio"
              name="selectionType"
              value="format"
              checked={selectionType === "format"}
              onChange={(e) => setSelectionType(e.target.value)}
            />{" "}
            Format
          </label>
          <label>
            <input
              type="radio"
              name="selectionType"
              value="content"
              checked={selectionType === "content"}
              onChange={(e) => setSelectionType(e.target.value)}
            />{" "}
            Content
          </label>
        </div>
      )}

      <div className="mt-2">
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
}

export default QuotationFormat;
