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

function QuoteList() {
  const [quoteData, setQuoteData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([
    "NOT SHARED",
    "QUOTE SHARED",
    "CONFIRMED",
    "OVERDUE",
    "30HR",
  ]);

  console.log("quoteData", quoteData);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    category: "",
    city: "",
    type: "",
    name: "",
    mobile: "",
    service: "",
    executive: "",
    booked_by: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [page, filters]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/quotation/quotations`,
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

  const getRowColorClass = (row) => {
    const type = row.type;
    const quotationDateTime = new Date(
      `${row.quotation_date}T${row.quotation_time}`
    );
    const now = new Date();
    const hoursDiff = (now - quotationDateTime) / (1000 * 60 * 60);

    if (type === "OVERDUE" || hoursDiff > 240) return "bg-red-200"; // More than 10 days
    if (type === "30HR" || (hoursDiff > 30 && hoursDiff <= 240))
      return "bg-red-500 text-white";

    return statusColors[type] || "";
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Quotation List</h2>

      <div className="mt-4 mb-6 text-sm flex flex-wrap gap-4">
        <p>
          <span className="inline-block w-4 h-4 bg-gray-200 mr-2"></span>NOT
          SHARED
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-green-200 mr-2"></span>QUOTE
          SHARED
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-orange-200 mr-2"></span>
          CONFIRMED
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-red-200 mr-2"></span>More
          than 10 days overdue
        </p>
        <p>
          <span className="inline-block w-4 h-4 bg-red-500 mr-2"></span>30hr
          quotation creation
        </p>
      </div>
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
      <table className="min-w-full bg-white border border-gray-200 text-sm shadow-sm">
        <thead className="bg-gray-0 text-gray-700">
          <tr>
            {[
              { key: "#", filter: false },
              {
                key: "Category",
                filter: "category",
                type: "select",
                options: categories,
              },
              { key: "QId", filter: false },
              { key: "Q Dt-Tm", filter: false },
              { key: "Name", filter: "name", type: "input" },
              { key: "Contact", filter: "mobile", type: "input" },
              { key: "Address", filter: false },
              { key: "City", filter: "city", type: "select", options: cities },
              { key: "Service", filter: "service", type: "input" },
              { key: "QAmt", filter: false },
              { key: "Executive", filter: "executive", type: "input" },
              { key: "Booked By", filter: "booked_by", type: "input" },
              { key: "Last F/W Dt", filter: false },
              { key: "Next F/W Dt", filter: false },
              { key: "Desc", filter: false },

              { key: "Type", filter: "type", type: "select", options: types },
            ].map(({ key, filter, type, options }, idx) => (
              <th key={idx} className="border border-gray-200 px-3 py-2">
                {filter ? (
                  type === "select" ? (
                    <select
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                      value={filters[filter]}
                      onChange={(e) => updateFilter(filter, e.target.value)}
                    >
                      <option value="">All</option>
                      {options?.map((opt, i) => (
                        <option key={i} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={filters[filter]}
                      onChange={(e) => updateFilter(filter, e.target.value)}
                      placeholder={key}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  )
                ) : (
                  <span className="text-xs font-medium">{key}</span>
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
                className={`cursor-pointer hover:opacity-90 ${getRowColorClass(
                  row
                )}`}
                onClick={() => handleRowClick(row.enquiry?.enquiryId)}
              >
                <td className="border border-gray-200 px-3 py-2">
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row?.enquiry?.category}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.quotation_id}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.quotation_date} | {row.quotation_time}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.enquiry.name}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.enquiry.mobile}
                </td>
                <td className="border border-gray-200 px-3 py-2 whitespace-pre-line max-w-xs">
                  {row.enquiry.address}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.enquiry.city}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.enquiry.interested_for}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.grand_total}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.enquiry.executive}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.booked_by}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.QuoteFollowups[0]?.foll_date}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.QuoteFollowups[0]?.nxtfoll}
                </td>
                <td className="border border-gray-200 px-3 py-2">
                  {row.QuoteFollowups[0]?.description}
                </td>
                <td className="border border-gray-200 px-3 py-2 font-semibold text-xs text-center">
                  {row.type}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuoteList;
