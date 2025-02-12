import React, { useState } from "react";

const TableReuse = ({ data, columns, itemsPerPage = 5 }) => {
  const [searchFilters, setSearchFilters] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Handle search filter change
  const handleFilterChange = (e) => {
    setSearchFilters({ ...searchFilters, [e.target.name]: e.target.value });
  };

  // Pagination controls
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <div className="">
      {/* Table */}
      <div className="overflow-x-auto">
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
                  {col.filter === "category" && (
                    <select
                      className="mt-2 block w-full px-2 py-1 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-red-300"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {[...new Set(data.map((row) => row.category))].map(
                        (cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        )
                      )}
                    </select>
                  )}
                  {col.filter === "city" && (
                    <select
                      className="mt-2 block w-full px-2 py-1 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-red-300"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                    >
                      <option value="">All Cities</option>
                      {[...new Set(data.map((row) => row.city))].map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  )}
                  {col.filter &&
                    col.filter !== "category" &&
                    col.filter !== "city" && (
                      <input
                        type="text"
                        name={col.accessor}
                        className="mt-2 block w-full px-2 py-1 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring focus:ring-red-300"
                        value={searchFilters[col.accessor] || ""}
                        onChange={handleFilterChange}
                      />
                    )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {paginatedData
              .filter(
                (row) =>
                  (selectedCategory === "" ||
                    row.category === selectedCategory) &&
                  (selectedCity === "" || row.city === selectedCity) &&
                  Object.entries(searchFilters).every(
                    ([key, value]) =>
                      value === "" ||
                      (row[key] &&
                        row[key]
                          .toString()
                          .toLowerCase()
                          .includes(value.toLowerCase()))
                  )
              )
              .map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-300 even:bg-gray-50 hover:bg-red-50 transition text-xs"
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
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableReuse;
