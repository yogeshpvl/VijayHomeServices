import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DSRList = ({ itemsPerPage = 5 }) => {
  const navigate = useNavigate();

  // Sample Data
  const data = [
    {
      id: 1,
      category: "Pest Control",
      date: "02-08-2025 1:38:34 PM",
      name: "Vedant",
      contact: "9425746962",
      address: "Purva Heights Block A, Bengaluru",
      city: "Bangalore",
      reference: "Customer Care",
      interested: "Cockroach Pest Control",
      executive: "Pooja",
      response: "Confirmed",
      description: "Kitchen PC",
    },
    {
      id: 2,
      category: "Cleaning",
      date: "02-08-2025 1:30:39 PM",
      name: "Ritu Maheshwari",
      contact: "9741944403",
      address: "0, Kudlu Gate, Bangalore",
      city: "Bangalore",
      reference: "Customer Care",
      interested: "Vacant Flat Cleaning - Premium",
      executive: "Siva N",
      response: "Confirmed",
      description: "Vacant Flat Cleaning - Premium",
    },
    {
      id: 3,
      category: "Cleaning",
      date: "02-08-2025",
      name: "Niks",
      contact: "8511776300",
      address: "T504 Ajmera Avenue, Electronic City",
      city: "Bangalore",
      reference: "Customer",
      interested: "Fabric Sofa",
      executive: "Jayashree",
      response: "Confirmed",
      description: "Fabric Sofa",
    },
  ];

  // Table Columns
  const columns = [
    { label: "#", accessor: "id" },
    { label: "Category", accessor: "category", filter: "category" },
    { label: "Date & Time", accessor: "date" },
    { label: "Name", accessor: "name" },
    { label: "Contact", accessor: "contact" },
    { label: "Address", accessor: "address" },
    { label: "City", accessor: "city", filter: "city" },
    { label: "Reference", accessor: "reference" },
    { label: "Interested", accessor: "interested" },
    { label: "Executive", accessor: "executive" },
    { label: "Response", accessor: "response" },
    { label: "Description", accessor: "description" },
  ];

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

  // Redirect to Enquiry Details
  const handleRowClick = (id) => {
    navigate(`/DSR/DSRDetails/${id}`);
  };

  return (
    <div className=" rounded-lg shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-red-100 text-pink-800">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left font-semibold border-b border-gray-300"
                >
                  {col.label}
                  {col.filter === "category" && (
                    <select
                      className="mt-2 block w-full px-2 py-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
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
                      className="mt-2 block w-full px-2 py-1 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
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
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData
              .filter(
                (row) =>
                  (selectedCategory === "" ||
                    row.category === selectedCategory) &&
                  (selectedCity === "" || row.city === selectedCity)
              )
              .map((row, index) => (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.id)}
                  className="border-b border-gray-300 bg-white hover:bg-pink-50 cursor-pointer transition"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-4 py-3 text-xs">
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

      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-400 transition"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-400 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DSRList;
