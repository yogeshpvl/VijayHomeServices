import React, { useState } from "react";

const RunningProjects = ({ itemsPerPage = 10 }) => {
  // Sample Data
  const data = [
    {
      id: 1,
      crDate: "02-08-2025",
      category: "Cleaning",
      projectManager: "John Doe",
      salesExecutive: "Jane Smith",
      customer: "Vedant",
      contactNo: "9425746962",
      address: "Purva Heights Block A, Bengaluru",
      city: "Bangalore",
      quoteNo: "Q12345",
      projectType: "Deep Cleaning",
      daysToComplete: "5",
      worker: "Ram Kumar",
      vendorAmount: "5000",
      vendorPayment: "Paid",
      quoteValue: "7000",
      customerPayment: "Received",
      manPower: "4",
      workDetails: "Full House Cleaning",
      type: "Job Start",
      deepCleanDetails: "Includes Kitchen, Bathroom, and Living Area",
    },
  ];

  // Table Columns
  const columns = [
    { label: "Sr.No", accessor: "id" },
    { label: "Cr.Date", accessor: "crDate" },
    { label: "Category", accessor: "category" },
    { label: "Project Manager", accessor: "projectManager" },
    { label: "Sales Executive", accessor: "salesExecutive" },
    { label: "Customer", accessor: "customer" },
    { label: "Contact No.", accessor: "contactNo" },
    { label: "Address", accessor: "address" },
    { label: "City", accessor: "city" },
    { label: "Quote No.", accessor: "quoteNo" },
    { label: "Project Type", accessor: "projectType" },
    { label: "Day To Complete", accessor: "daysToComplete" },
    { label: "Worker", accessor: "worker" },
    { label: "Vendor Amount", accessor: "vendorAmount" },
    { label: "Vendor Payment", accessor: "vendorPayment" },
    { label: "Quote Value", accessor: "quoteValue" },
    { label: "Customer Payment", accessor: "customerPayment" },
    { label: "Man Power", accessor: "manPower" },
    { label: "Work Details", accessor: "workDetails" },
    { label: "TYPE", accessor: "type" },
    { label: "Deep Clean Details", accessor: "deepCleanDetails" },
    { label: "Action", accessor: "action" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Filtered and paginated data
  const filteredData = data.filter((row) =>
    columns.some((col) =>
      String(row[col.accessor]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Handle pagination
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="mt-5 bg-white shadow-md p-4 rounded-md">
      <div className="p-4 bg-white shadow-md rounded-md">
        <h2>Running Projects</h2>
        <div className="mb-4">
          {/* Search Input */}
          <input
            type="text"
            className="px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Search in table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table with scrollable columns */}
        <div className="overflow-x-auto max-w-full  border border-red-100 rounded-md">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-200">
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className="px-4 py-2 text-left border-b font-medium text-gray-700"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-100">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-4 py-2">
                      {row[col.accessor]}
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
            onClick={handlePrev}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RunningProjects;
