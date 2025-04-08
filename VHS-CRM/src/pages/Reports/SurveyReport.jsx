import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { config } from "../../services/config";

function SurveyReport() {
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

  const [referenceData, setReferenceData] = useState([]);
  const [serviceDetails, setserviceDetails] = useState([]);
  const [userdata, setUserdata] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [totalPages, setTotalPages] = useState(0);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = EnquiryData?.slice(startIndex, endIndex);

  const columns = [
    { label: "Sr.No." },
    { label: "Enquiry Date" },
    { label: "Time" },
    { label: "Category" },
    { label: "Name" },
    { label: "Contact No." },
    { label: "City" },
    { label: "Address" },
    { label: "Reference1" },
    { label: "Back officer" },
    { label: "Interested For" },
    { label: "Executive" },
    { label: "Appo Date Time" },
    { label: "Decription" },

    { label: "Comment" },

    { label: "Type" },
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

  const handleShow = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${config.API_BASE_URL}/followups/getSurveyReportpage`,
        {
          params: {
            fromdate: fromDate,
            todate: toDate,
            city,
            category,
            executive,
            jobType,
            reference,
            executive_name: followupresponse,
            page: currentPage, // Pass currentPage as query parameter
            limit: itemsPerPage, // Limit per page
          },
        }
      );
      console.log("response.data?", response.data);
      setEnquiryData(response.data?.followups);
      setTotalPages(response.data?.pagination.totalPages); // Set total pages for pagination
      setShowTable(true); // Assuming you show the table after data is loaded
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
    });

    const response = await fetch(
      `${config.API_BASE_URL}/followups/getSurveyReportpageDownload?${params}`
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Survey_Report_${fromDate}_to_${toDate}.xlsx`;
    a.click();
  };

  console.log("currentPage", currentPage);
  const handlePageChange = (newPage) => {
    console.log("Changing page to:", newPage);
    setCurrentPage(newPage); // Update the current page state
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
              Survey Report – Filter
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* From Date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Next Followup Date (From Date)
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
                  Next Followup Date (To Date)
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
                <label className="block text-sm font-medium mb-1">
                  Executive
                </label>
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
                      {row.Enquiry?.date}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.Enquiry?.time}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.Enquiry?.category}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.Enquiry?.name}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.Enquiry?.mobile}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.Enquiry?.city}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.Enquiry?.address}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.Enquiry?.reference1}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.Enquiry?.executive}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.Enquiry?.interested_for}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.executive_name}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.next_followup_date} {row.appo_time}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.description}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.Enquiry?.comment}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.status}
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

export default SurveyReport;
