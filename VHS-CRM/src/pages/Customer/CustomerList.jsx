import React, { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../../services/config"; // Update with your config if necessary
import * as XLSX from "xlsx"; // Import xlsx library

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState(""); // For the search filter
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [totalItems, setTotalItems] = useState(0); // Total number of customers
  const [loading, setLoading] = useState(false); // For loading state

  // Fetch customers from the API
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.API_BASE_URL}/customers`, {
        params: {
          search,
          page,
          limit: 25, // Fixed limit of 25 per page
        },
      });

      setCustomers(response.data.customers);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to the first page when the search query changes
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Export to Excel functionality using xlsx
  const exportToExcel = () => {
    const customerData = customers.map((customer) => ({
      "Customer Name": customer.customerName,
      "Contact Person": customer.contactPerson,
      "Main Contact": customer.mainContact,
      City: customer.city,
      // Add any additional fields here as needed
    }));

    // Create a new worksheet from the customer data
    const ws = XLSX.utils.json_to_sheet(customerData);

    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");

    // Export the workbook to a file (Excel)
    XLSX.writeFile(wb, "customers.xlsx"); // Filename for the download
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search customer name"
            className="border px-2 py-1 rounded-md text-sm"
          />
        </div>
        <div>
          <button
            onClick={exportToExcel}
            className="bg-orange-500 text-white px-4 py-2 rounded-md"
          >
            Export to Excel
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && <div>Loading...</div>}

      {/* Customer List Table */}
      {!loading && (
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-red-800 border-b border-red-100">
            <tr>
              <th className="border border-gray-50 px-2 text-white py-1">#</th>
              <th className="border border-gray-50 px-2 py-1 text-white">
                Customer Name
              </th>
              <th className="border border-gray-50 px-2 py-1 text-white">
                Contact Person
              </th>
              <th className="border border-gray-50 px-2 py-1 text-white">
                Main Contact
              </th>
              <th className="border border-gray-50 px-2 py-1 text-white">
                City
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={customer.id}>
                <td className="border border-gray-50 px-2 py-1 text-center">
                  {(page - 1) * 25 + index + 1}
                </td>
                <td className="border border-gray-50 px-2 py-1">
                  {customer.customerName}
                </td>
                <td className="border border-gray-50 px-2 py-1">
                  {customer.contactPerson}
                </td>
                <td className="border border-gray-50 px-2 py-1">
                  {customer.mainContact}
                </td>
                <td className="border border-gray-50 px-2 py-1">
                  {customer.city}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md bg-gray-200 text-sm"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-md bg-gray-200 text-sm"
          >
            Next
          </button>
        </div>
      )}

      {/* No results found message */}
      {!loading && customers.length === 0 && (
        <div className="mt-4 text-sm">No customers found.</div>
      )}
    </div>
  );
}

export default CustomerList;
