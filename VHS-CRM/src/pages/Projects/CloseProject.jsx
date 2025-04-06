import React, { useState } from "react";

const ClosedProject = ({ itemsPerPage = 10 }) => {
  // Sample Data
  const data = [
    {
      id: 1,
      crDate: "02-08-2025 1:38:34 PM",
      projectManager: "John Doe",
      salesExecutive: "Jane Smith",
      customer: "Vedant",
      contactNo: "9425746962",
      address: "Purva Heights Block A, Bengaluru",
      city: "Bangalore",
      status: "Closed",
    },
    // Add more rows as needed
  ];

  // Table Columns
  const columns = [
    { label: "Sr.No", accessor: "id" },
    { label: "Cr.Date", accessor: "crDate" },
    { label: "Project Manager", accessor: "projectManager" },
    { label: "Sales Executive", accessor: "salesExecutive" },
    { label: "Customer", accessor: "customer" },
    { label: "Contact No.", accessor: "contactNo" },
    { label: "Address", accessor: "address" },
    { label: "City", accessor: "city" },
    { label: "Status", accessor: "status" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered Data
  const filteredData = data.filter((row) =>
    columns.some((col) =>
      String(row[col.accessor]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="mt-5 bg-white shadow-md p-4 rounded-md">
      <h2 className="text-lg font-semibold mb-4">Closed Projects</h2>

      {/* 🔍 Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to page 1 on search
          }}
          className="px-3 py-2 border rounded w-50 text-sm border-gray-100"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm shadow-sm">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="border border-gray-200 px-4 py-3 text-xs font-semibold text-left"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr key={row.id} className="border-b hover:bg-gray-100">
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="border border-gray-200 px-3 py-2 text-xs"
                    >
                      {row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-sm text-gray-500"
                >
                  No closed projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-400"
        >
          Previous
        </button>
        <span className="text-gray-700 text-sm">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ClosedProject;
