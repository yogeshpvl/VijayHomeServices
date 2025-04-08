import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { config } from "../../services/config";
import moment from "moment";

const statusColors = {
  "NOT SHARED": "bg-gray-200 text-gray-800",
  "QUOTE SHARED": "bg-green-200 text-green-900",
  CONFIRMED: "bg-orange-200 text-orange-900",
  OVERDUE: "bg-red-200 text-red-900",
  "30HR": "bg-red-500 text-white",
};

function QuoteReport() {
  const users = JSON.parse(localStorage.getItem("user"));
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [type, settype] = useState("");
  const [EnquiryData, setEnquiryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [executive, setExecutive] = useState("");
  const [jobType, setJobType] = useState("");
  const [reference, setReference] = useState("");
  const [followupresponse, setfollwupresponse] = useState("");

  const [serviceDetails, setserviceDetails] = useState([]);
  const [userdata, setUserdata] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = EnquiryData?.slice(startIndex, endIndex);
  const [quoteData, setQuoteData] = useState([]);
  const [categories, setCategories] = useState([]);

  const [types, setTypes] = useState([
    "NOT SHARED",
    "QUOTE SHARED",
    "CONFIRMED",
    "OVERDUE",
    "30HR",
  ]);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/auth/users`);
      if (res.status === 200) {
        setUserdata(res.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const [vendorData, setvendorData] = useState([]);
  useEffect(() => {
    const fetchVendors = async () => {
      if (city && category) {
        try {
          const response = await axios.get(
            `${config.API_BASE_URL}/vendors/filter/?city=${city}&category=${category}&type=Executive`
          );
          setvendorData(response.data);
        } catch (error) {
          console.error("Error fetching details", error);
        }
      } else {
        console.log("Missing city, category, or vendorType data.");
      }
    };

    fetchVendors();
  }, [city, category]);

  const fetchData = async () => {
    // Log the current filter values
    console.log(
      "Fetching data with filters:",
      city,
      category,
      executive,
      jobType,
      reference
    );

    try {
      // Create the request parameters dynamically based on which filters are provided
      const params = {
        fromdate: fromDate,
        todate: toDate,
        city: city || undefined, // Only pass if it's not empty
        category: category || undefined,
        executive: executive || undefined,
        jobType: jobType || undefined,
        reference: reference || undefined,
        executive_name: followupresponse || undefined,
        type,
        page,
        limit,
      };

      // Remove undefined parameters from params to avoid sending empty values
      Object.keys(params).forEach((key) =>
        params[key] === undefined ? delete params[key] : null
      );

      const response = await axios.get(
        `${config.API_BASE_URL}/quotation/fetchQuotationsReport`,
        {
          params: params,
        }
      );

      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      setQuoteData(data);
      setTotalCount(response.data.totalCount || 0);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleRowClick = (enquiryId) => {
    if (enquiryId) navigate(`/Quote/quoteDetails/${enquiryId}`);
  };

  const totalPages = Math.ceil(totalCount / limit);

  const getRowColorClass = (row) => {
    const type = row.type;
    const quotationDateTime = new Date(
      `${row.quotation_date}T${row.quotation_time}`
    );
    const now = new Date();
    const hoursDiff = (now - quotationDateTime) / (1000 * 60 * 60);
    if (type === "CONFIRMED" || hoursDiff > 240)
      return "bg-orange-200 text-orange-900"; // More than 10 days

    if (type === "OVERDUE" || hoursDiff > 240) return "bg-red-200"; // More than 10 days
    if (type === "30HR" || (hoursDiff > 30 && hoursDiff <= 240))
      return "bg-red-500 text-white";

    return statusColors[type] || "";
  };

  const handleExport = async () => {
    const params = new URLSearchParams({
      fromdate: fromDate,
      todate: toDate,
      city,
      category,
      executive,
      followupresponse,
      jobType,
      reference,
    });

    const response = await fetch(
      `${config.API_BASE_URL}/quotation/fetchQuotationsReportDownload?${params}`
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Quote_Report_${fromDate}_to_${toDate}.xlsx`;
    a.click();
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="bg-white max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-bold text-red-800 text-center mb-6">
          Quote Report – Filter
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* From Date */}
          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            />
          </div>
          {/* To Date */}
          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            />
          </div>
          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            >
              <option value="">-- Select --</option>
              {users?.city?.map((city, index) => (
                <option value={city.name}>{city.name}</option>
              ))}
            </select>
          </div>
          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            >
              <option value="">-- Select --</option>
              {users?.category?.map((category, index) => (
                <option value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Intrested for
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            >
              <option value="">-- Select --</option>
              {serviceDetails.map((item) => (
                <option value={item.serviceName}>{item.serviceName}</option>
              ))}
            </select>
          </div>
          {/* Backoffice Executive (Dropdown) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Backoffice Executive
            </label>
            <select
              value={executive}
              onChange={(e) => setExecutive(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            >
              <option>-- Select --</option>
              {userdata.map((item) => (
                <option value={item.displayname}>{item.displayname}</option>
              ))}
            </select>
          </div>

          {/* Reference */}
          <div>
            <label className="block text-sm font-medium mb-1">Executive</label>
            <select
              value={followupresponse}
              onChange={(e) => setfollwupresponse(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            >
              <option>-- Select --</option>

              {vendorData.map((item) => (
                <option value={item?.vhsname}>{item?.vhsname} </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => settype(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
            >
              <option>-- Select --</option>

              <option value="NOT SHARED">NOT SHARED </option>
              <option value="QUOTE SHARED">QUOTE SHARED </option>
              <option value="CONFIRMED">CONFIRMED </option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={fetchData}
            className="bg-green-600 text-white px-6 py-2 rounded-md text-sm hover:bg-green-700"
          >
            🔍 Show
          </button>
          <button
            onClick={handleExport}
            className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700"
          >
            📥 Export
          </button>
        </div>
      </div>

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
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            {[
              { key: "#", filter: false },
              {
                key: "Category",

                filter: false,
              },
              { key: "QId", filter: false },
              { key: "Q Dt-Tm", filter: false },
              { key: "Name", filter: false },
              { key: "Contact", filter: false },
              { key: "Address", filter: false },
              { key: "City", filter: false },
              { key: "Service", filter: false },
              { key: "QAmt", filter: false },
              { key: "Executive", filter: false },
              { key: "Booked By", filter: false },
              { key: "Last F/W Dt", filter: false },
              { key: "Next F/W Dt", filter: false },
              { key: "Desc", filter: false },

              { key: "Type", filter: "type", type: "select", options: types },
            ].map(({ key, filter, type, options }, idx) => (
              <th key={idx} className="border border-gray-200 px-3 py-2">
                <span className="text-xs font-medium">{key}</span>
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
                  {row.enquiry.intrested_for}
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

export default QuoteReport;
