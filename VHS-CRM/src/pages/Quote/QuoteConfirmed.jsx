import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../../services/config";

const statusColors = {
  "NOT SHARED": "bg-gray-200 text-gray-800",
  "QUOTE SHARED": "bg-green-200 text-green-900",
  CONFIRMED: "bg-orange-200 text-orange-900",
  OVERDUE: "bg-red-200 text-red-900",
  "30HR": "bg-red-500 text-white",
};

function QuoteConfimed() {
  const [quoteData, setQuoteData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    category: "",
    city: "",
    name: "",
    mobile: "",
    service: "",
    executive: "",
    bookedby: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [page, filters]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/quote-followups/confirmedquotations`,
        {
          params: {
            page,
            limit,
            ...filters,
          },
        }
      );
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setQuoteData(data);
      setTotalCount(response.data.totalCount || 0);

      const uniqueCategories = [
        ...new Set(data.map((item) => item.enquiry?.category).filter(Boolean)),
      ];
      const uniqueCities = [
        ...new Set(data.map((item) => item.enquiry?.city).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
      setCities(uniqueCities);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleRowClick = (enquiryId) => {
    if (enquiryId) navigate(`/Quote/quoteDetails/${enquiryId}`);
  };

  const totalPages = Math.ceil(totalCount / limit);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Confirmed Quotations</h2>

      <table className="min-w-full bg-white border border-gray-200 text-sm shadow-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            {[
              "#",
              "Category",
              "QId",
              "Q Dt-Tm",
              "Name",
              "Contact",
              "Address",
              "City",
              "Service",
              "QAmt",
              "Executive",
              "Booked By",
              "Foll Date",
              "Next Foll",
              "Desc",
              "Type",
            ].map((header, idx) => (
              <th key={idx} className="border border-gray-200 px-3 py-2">
                {header === "Category" ? (
                  <select
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                    value={filters.category}
                    onChange={(e) => updateFilter("category", e.target.value)}
                  >
                    <option value="">All</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                ) : header === "City" ? (
                  <select
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                    value={filters.city}
                    onChange={(e) => updateFilter("city", e.target.value)}
                  >
                    <option value="">All</option>
                    {cities.map((city, i) => (
                      <option key={i} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                ) : header === "Name" ? (
                  <input
                    type="text"
                    value={filters.name}
                    onChange={(e) => updateFilter("name", e.target.value)}
                    placeholder="Name"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                ) : header === "Contact" ? (
                  <input
                    type="text"
                    value={filters.mobile}
                    onChange={(e) => updateFilter("mobile", e.target.value)}
                    placeholder="Mobile"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                ) : header === "Service" ? (
                  <input
                    type="text"
                    value={filters.service}
                    onChange={(e) => updateFilter("service", e.target.value)}
                    placeholder="Service"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                ) : header === "Executive" ? (
                  <input
                    type="text"
                    value={filters.executive}
                    onChange={(e) => updateFilter("executive", e.target.value)}
                    placeholder="Executive"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                ) : header === "Booked By" ? (
                  <input
                    type="text"
                    value={filters.bookedby}
                    onChange={(e) => updateFilter("bookedby", e.target.value)}
                    placeholder="Booked By"
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                ) : (
                  <span className="text-xs font-medium">{header}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(quoteData) &&
            quoteData.map((row, index) => (
              <tr
                key={index}
                className="bg-orange-200 cursor-pointer"
                onClick={() => handleRowClick(row.enquiry?.enquiryId)}
              >
                <td className="border border-gray-200 px-3 py-2">
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row?.enquiry?.category}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row?.enquiry?.quotations?.[0]?.quotation_id || "-"}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row?.enquiry?.quotations?.[0]?.quotation_date || "-"} |{" "}
                  {row?.enquiry?.quotations?.[0]?.quotation_time || "-"}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.enquiry?.name}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.enquiry?.mobile}
                </td>
                <td className="border border-gray-200 px-3 py-2 whitespace-pre-line max-w-xs">
                  {row.enquiry?.address}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.enquiry?.city}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.enquiry?.interested_for}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.enquiry?.quotations?.[0]?.grand_total || "-"}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.enquiry?.executive}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.enquiry?.quotations?.[0]?.booked_by || "-"}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.foll_date || "-"}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.nxtfoll || "-"}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.description}
                </td>
                <td
                  className={`border border-gray-200 px-3 py-2 font-semibold text-xs text-center rounded ${
                    statusColors[row?.enquiry?.quotations?.[0]?.type] ||
                    "bg-gray-100"
                  }`}
                >
                  {row?.enquiry?.quotations?.[0]?.type}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-1 border border-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-1 border border-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default QuoteConfimed;
