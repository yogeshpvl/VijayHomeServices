import React, { useState } from "react";
import axios from "axios";
import { config } from "../../services/config";

function Search() {
  const [customerName, setCustomerName] = useState("");
  const [mainContact, setMainContact] = useState("");
  const [city, setCity] = useState("");
  const [customerType, setCustomerType] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false); // ❌ typo fixed
  const [noData, setNoData] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = async (pageNum = 1) => {
    if (!customerName && !mainContact && !city && !customerType) {
      alert("Input at least 1 filter for quick search");
      return;
    }

    setLoading(true);
    setNoData(false);
    setResults([]);

    try {
      const res = await axios.get(`${config.API_BASE_URL}/customers/search`, {
        params: {
          customerName,
          mainContact,
          city,
          customerType,
          page: pageNum,
        },
      });

      const data = res.data.customers || [];
      setResults(data);
      setPage(pageNum);
      setTotalPages(res.data.totalPages || 1);

      if (data.length === 0) {
        setNoData(true);
      }
    } catch (error) {
      console.error("Search error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h4 className="text-lg font-bold mb-3">Customer Search:</h4>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <div>
          <label className="text-sm">Customer Name</label>
          <input
            className="w-full border border-gray-300 px-2 py-1 text-sm rounded"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm">Mobile Number</label>
          <input
            className="w-full border border-gray-300 px-2 py-1 text-sm rounded"
            value={mainContact}
            onChange={(e) => setMainContact(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm">City</label>
          <select
            className="w-full border border-gray-300 px-2 py-1 text-sm rounded"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">-select-</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Chennai">Chennai</option>
          </select>
        </div>
        <div>
          <label className="text-sm">Customer Type</label>
          <input
            className="w-full border border-gray-300 px-2 py-1 text-sm rounded"
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={() => handleSearch(1)}
          className="bg-red-800 text-white px-4 py-1.5 text-sm rounded"
        >
          Search
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-500 text-white px-4 py-1.5 text-sm rounded"
        >
          Cancel
        </button>
      </div>

      {/* Loader / No Data / Table */}
      {loading ? (
        <div className="text-center text-blue-500 mt-4">Loading...</div>
      ) : noData ? (
        <div className="text-center text-red-500 mt-4">No data found.</div>
      ) : results.length > 0 ? (
        <div className="mt-4 text-sm">
          <h5 className="font-semibold mb-2">Results:</h5>
          <table className="w-full border text-sm">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="border border-gray-200  text-center px-2 py-1">
                  Card No
                </th>
                <th className="border border-gray-200  text-center px-2 py-1">
                  Customer Name
                </th>
                <th className="border border-gray-200  text-center px-2 py-1">
                  Contact person
                </th>

                <th className="border border-gray-200  text-center px-2 py-1">
                  Mobile
                </th>
                <th className="border border-gray-200  text-center px-2 py-1">
                  Address
                </th>

                <th className="border border-gray-200  text-center px-2 py-1">
                  City
                </th>
                <th className="border border-gray-200  text-center px-2 py-1">
                  Customer Type
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((cust) => (
                <tr
                  key={cust.id}
                  onClick={() => {
                    const queryString = new URLSearchParams({
                      rowData: JSON.stringify(cust),
                    }).toString();
                    window.open(
                      `/customer/customerDetails/${cust.id}?${queryString}`,
                      "_blank"
                    );
                  }}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td className="border border-gray-200  text-center px-2 py-1">
                    {cust.cardNo}
                  </td>
                  <td className="border border-gray-200  text-center px-2 py-1">
                    {cust.customerName}
                  </td>
                  <td className="border border-gray-200  text-center px-2 py-1">
                    {cust.contactPerson}
                  </td>
                  <td className="border border-gray-200  text-center px-2 py-1">
                    {cust.mainContact}
                  </td>
                  <td className="border border-gray-200  text-center px-2 py-1">
                    {cust.lnf}
                  </td>
                  <td className="border border-gray-200  text-center px-2 py-1">
                    {cust.city}
                  </td>
                  <td className="border border-gray-200  text-center px-2 py-1">
                    {cust.customerType}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-4">
            <button
              onClick={() => handleSearch(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 text-sm bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handleSearch(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Search;
