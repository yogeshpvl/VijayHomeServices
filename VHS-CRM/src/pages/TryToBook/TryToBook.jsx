import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { saveAs } from "file-saver";

const TryToBook = ({ itemsPerPage = 5 }) => {
  const navigate = useNavigate();

  // Sample Data
  const data = [
    {
      id: 1,
      createDate: "02-08-2025 1:38:34 PM",
      customerName: "Vedant",
      email: "vedant@example.com",
      contact: "9425746962",
      tryToBook: "Purva Heights Block A, Bengaluru",
      reference: "Bangalore",
      executive: "Customer Care",
      remarks: "Cockroach Pest Control",
      action: "Pooja",
    },
  ];

  // Table Columns
  const columns = [
    { label: "#", accessor: "id" },
    { label: "Create Date", accessor: "createDate" },
    { label: "Customer Name", accessor: "customerName" },
    { label: "Email", accessor: "email" },
    { label: "Contact", accessor: "contact" },
    { label: "Address", accessor: "tryToBook" },
    { label: "Reference", accessor: "reference" },
    { label: "Executive", accessor: "executive" },
    { label: "Remarks", accessor: "remarks" },
    { label: "Action", accessor: "action" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Handle export to CSV
  const handleExport = () => {
    const csvData = [
      columns.map((col) => col.label).join(","),
      ...data.map((row) =>
        columns.map((col) => row[col.accessor] || "").join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    // saveAs(blob, "TryToBookData.csv");
  };

  // Filtered and paginated data
  const filteredData = data.filter((row) =>
    columns.some((col) =>
      String(row[col.accessor]).toLowerCase().includes(searchTerm)
    )
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Redirect to Enquiry Details
  const handleRowClick = (id) => {
    navigate(`/DSR/DSRDetails/${id}`);
  };

  return (
    <div
      className="mt-5 bg-white shadow-md p-4 rounded-md"
      style={{ background: "#f5eceab8" }}
    >
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border px-4 py-2 rounded-md w-1/3"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button
          onClick={handleExport}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Export to CSV
        </button>
      </div>

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
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row.id)}
                className="border-b border-gray-300 bg-white hover:bg-pink-50 cursor-pointer transition"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-xs">
                    {row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TryToBook;
