import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TableReuse = ({
  data,
  columns,
  itemsPerPage = 25,
  onFilterChange,
  onPageChange,
  Totalpages,
}) => {
  const navigate = useNavigate();
  const [searchFilters, setSearchFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // const totalPages = Math.ceil(data.length / itemsPerPage);

  // Handle search filter change
  const handleFilterChange = (e, accessor) => {
    setSearchFilters((prevFilters) => ({
      ...prevFilters,
      [accessor]: e.target.value,
    }));
  };

  // Handle Enter key press to trigger API call
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onFilterChange(searchFilters); // Send updated filters to the parent only on Enter
    }
  };

  // Handle page change and pass it to the parent component
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    onPageChange(newPage); // Send updated page to the parent
  };

  const handleRowClick = (id, rowData) => {
    navigate(`/Survey/surveyDetails/${id}`, { state: { rowData } });
  };

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table className="min-w-full border-collapse text-sm">
        {/* Table Header */}
        <thead className="bg-red-100 text-black text-xs">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className="px-4 py-3 text-left font-semibold border-b border-gray-300"
              >
                {col.label}
                {col.type === "dropdown" ? (
                  <select
                    className="mt-2 block w-full px-2 py-1 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-red-300"
                    value={searchFilters[col.accessor] || ""}
                    onChange={(e) => {
                      handleFilterChange(e, col.accessor);
                      onFilterChange({
                        ...searchFilters,
                        [col.accessor]: e.target.value,
                      });
                    }}
                  >
                    <option value="">All</option>
                    {col.options.map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : col.type === "status" ? (
                  <select
                    className="mt-2 block w-full px-2 py-1 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-red-300"
                    value={searchFilters[col.accessor] || ""}
                    onChange={(e) => {
                      handleFilterChange(e, col.accessor);
                      onFilterChange({
                        ...searchFilters,
                        [col.accessor]: e.target.value,
                      });
                    }}
                  >
                    <option value="">All</option>
                    <option value="NOT ASSIGNED">NOT ASSIGNED</option>
                    <option value="ASSIGNED FOR SURVEY">
                      ASSIGNED FOR SURVEY
                    </option>
                    <option value="QUOTE GENERATE">QUOTE GENERATE</option>
                    <option value="QUOTE SHARED">QUOTE SHARED</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    className="mt-2 block w-full px-2 py-1 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-red-300"
                    value={searchFilters[col.accessor] || ""}
                    onChange={(e) => handleFilterChange(e, col.accessor)}
                    onKeyPress={handleKeyPress}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.enquiryId}
              onClick={() => handleRowClick(row.enquiryId, row)}
              className="border-b border-gray-300 even:bg-gray-50 hover:bg-red-50 cursor-pointer transition text-xs"
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  {col.accessor === "response" ? (
                    <span
                      className={`px-2 py-1 rounded-md text-white text-xs ${
                        row.response === "Confirmed"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {row[col.accessor]}
                    </span>
                  ) : (
                    row[col.accessor]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 p-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {Totalpages}
        </span>
        <button
          disabled={currentPage === Totalpages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableReuse;
