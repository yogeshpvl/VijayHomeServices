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
      String(row[col.accessor]).toLowerCase().includes(searchTerm)
    )
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div
      className="mt-5 bg-white shadow-md p-4 rounded-md"
      style={{ background: "#f5eceab8" }}
    >
      <div className="p-4 bg-white shadow-md rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
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
      </div>
    </div>
  );
};

export default RunningProjects;
