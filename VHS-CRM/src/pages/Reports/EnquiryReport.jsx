import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { config } from "../../services/config";

function EnquiryReport() {
  const users = JSON.parse(localStorage.getItem("user"));
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [EnquiryData, setEnquiryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [executive, setExecutive] = useState("");
  const [jobType, setJobType] = useState("");
  const [reference, setReference] = useState("");
  const [followupresponse, setfollwupresponse] = useState("");
  const [UTMSource, setUTMSource] = useState("");
  const [UTMContent, setUTMContent] = useState("");
  const [tag, setTag] = useState("");

  const [referenceData, setReferenceData] = useState([]);
  const [serviceDetails, setserviceDetails] = useState([]);
  const [userdata, setUserdata] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(0);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = EnquiryData?.slice(startIndex, endIndex);

  const columns = [
    { label: "Sr.No." },
    { label: "Date" },
    { label: "Time" },
    { label: "Category" },
    { label: "Name" },
    { label: "Contact No." },
    { label: "City" },
    { label: "Address" },
    { label: "Reference1" },
    { label: "UTM Source" },
    { label: "UTM Campaign" },
    { label: "UTM Content" },
    { label: "Tag" },
    { label: "Interested For" },
    { label: "Comment" },
    { label: "Executive" },
    { label: "Lead Status" },
  ];

  useEffect(() => {
    fetchReference();
    getUser();
  }, []);

  const fetchReference = async () => {
    const response = await fetch(`${config.API_BASE_URL}/reference`);
    const data = await response.json();
    setReferenceData(data);
  };

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

  useEffect(() => {
    if (category) {
      getServicebyCategory();
    }
  }, [category]);

  const getServicebyCategory = async () => {
    try {
      const res = await axios.post(
        `https://vijayhomeservicebangalore.in/api/userapp/getservicebycategory/`,
        { category }
      );
      if (res.status === 200 && Array.isArray(res.data?.serviceData)) {
        setserviceDetails(res.data.serviceData);
      } else {
        setserviceDetails([]);
      }
    } catch (error) {
      console.warn(
        "Silent API error (category fetch)",
        error?.message || error
      );
      setserviceDetails([]);
    }
  };

  const handleShow = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/enquiries/getEnquiriesFoReporPage`,
        {
          params: {
            fromdate: fromDate,
            todate: toDate,
            city,
            category,
            executive,
            followupresponse,
            jobType,
            reference,
            UTMSource,
            UTMContent,
            tag,
            page: currentPage,
            limit: itemsPerPage,
          },
        }
      );
      console.log(
        "response.data?.totalPages",
        response.data.pagination.totalPages
      );
      setTotalPages(response.data?.pagination.totalPages);
      setEnquiryData(response.data?.enquiries);
      setShowTable(true);
    } catch (err) {
      console.error("Error fetching Enquiry Data:", err);
    } finally {
      setLoading(false);
    }
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
      UTMSource,
      UTMContent,
      tag,
    });

    const response = await fetch(
      `${config.API_BASE_URL}/enquiries/getEnquiriesFoReporPageDownload?${params}`
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Enquiry_Report_${fromDate}_to_${toDate}.xlsx`;
    a.click();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  useEffect(() => {
    handleShow();
  }, [currentPage]);
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="mx-auto bg-white p-6 rounded-lg shadow">
        <div className="bg-white max-w-4xl mx-auto p-6">
          <div className="bg-white max-w-4xl mx-auto p-6">
            <h2 className="text-xl font-bold text-red-800 text-center mb-6">
              Enquiry Report – Filter
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* From Date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                />
              </div>
              {/* To Date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  To Date
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
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
                <label className="block text-sm font-medium mb-1">
                  Reference
                </label>
                <select
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                >
                  <option>-- Select --</option>
                  {referenceData.map((item) => (
                    <option value={item.reference}>{item.reference}</option>
                  ))}
                </select>
              </div>
              {/* Reference */}
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={followupresponse}
                  onChange={(e) => setfollwupresponse(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                >
                  <option>-- Select --</option>

                  <option value="New">New </option>
                  <option value="Call Later">Call Later </option>
                  <option value="Survey">Survey </option>
                  <option value="Not Intrested">Not Intrested </option>
                  <option value="Confirmed">Confirmed </option>
                  <option value="Quote">Quote </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  UTM Source
                </label>
                <input
                  type="text"
                  value={UTMSource}
                  onChange={(e) => setUTMSource(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  UTM Content
                </label>
                <input
                  type="text"
                  value={UTMContent}
                  onChange={(e) => setUTMContent(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                />
              </div>{" "}
              <div>
                <label className="block text-sm font-medium mb-1">Tag</label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleShow}
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
        </div>

        {/* Data Table */}
        {showTable && (
          <div className="overflow-x-auto mt-8">
            <table className="min-w-full bg-white border border-gray-200 text-sm shadow-sm">
              <thead className="bg-gray-50 text-gray-800">
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="border border-gray-200 px-4 py-3 text-xs font-semibold text-left bg-gray-100 text-gray-800"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EnquiryData?.map((row, index) => (
                  <tr key={row.id}>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {index + 1}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.date}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.time}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.category}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.name}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.mobile}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.city}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.address}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.reference1}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.utm_source}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.utm_campaign}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.utm_content}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.tag}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.interested_for}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.comment}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.executive}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.followup_response}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 p-4">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnquiryReport;
