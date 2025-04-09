import React, { useEffect, useState } from "react";
import axios from "axios";
import EnquiryService from "../../services/enquiryService";
import { useNavigate } from "react-router-dom";

const EnquirySearch = () => {
  const users = JSON.parse(localStorage.getItem("user"));
  const [filters, setFilters] = useState({
    name: "",
    mobile: "",
    fromDate: "",
    toDate: "",
    city: "",
    executive: "",
  });

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userdata, setUserdata] = useState([]);

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await EnquiryService.searchEnquiry(filters);

      console.log("response", response);

      if (response && response.success && response.enquiries) {
        setEnquiries(response.enquiries);
      } else {
        console.error(
          "Error: Unexpected response format",
          JSON.stringify(response, null, 2)
        );
        setEnquiries([]);
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Reset
  const handleReset = () => {
    setFilters({
      name: "",
      mobile: "",
      fromDate: "",
      toDate: "",
      city: "",
      executive: "",
    });
    setEnquiries([]);
  };
  const navigate = useNavigate();
  const handleRowClick = (id) => {
    navigate(`/enquiry/enquiry-details/${id}`);
  };

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
  const columns = [
    { label: "Sr.No." },
    { label: "Date" },
    { label: "Time" },
    { label: "Category" },
    { label: "Name" },
    { label: "Contact No." },
    { label: "City" },
    { label: "Address" },

    { label: "Interested For" },
    { label: "Comment" },
    { label: "Executive" },
  ];
  return (
    <div className="mx-auto">
      <h2 className="text-lg font-semibold text-gray-700 mb-6">
        Enquiry Search :
      </h2>

      {/* Search Form */}
      <div className="grid grid-cols-3 gap-6">
        {/* Name */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* From Date */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">
            From Date
          </label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">
            To Date
          </label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* mobile */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">
            mobile *
          </label>
          <input
            type="text"
            name="mobile"
            value={filters.mobile}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">
            City
          </label>
          <select
            name="city"
            value={filters.city}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:ring-2 focus:ring-blue-400"
          >
            <option value="">--select--</option>
            {users?.city?.map((city, index) => (
              <option value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>

        {/* Executive */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Executive
          </label>
          <select
            name="executive"
            value={filters.executive}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:ring-2 focus:ring-blue-400"
          >
            <option value="">--select--</option>
            {userdata.map((item) => (
              <option value={item.displayname}>{item.displayname}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search & Cancel Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleSearch}
          className="bg-red-800 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600"
        >
          Search
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>

      {/* Results Table */}
      <div className="mt-6">
        {loading ? (
          <p className="text-center text-gray-700">Loading...</p>
        ) : enquiries.length > 0 ? (
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
                {enquiries?.map((row, index) => (
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(row.enquiryId)}
                  >
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
                      {row.interested_for}
                    </td>

                    <td className="border border-gray-200 px-3 py-2 text-xs">
                      {row.executive}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-700 mt-4">No records found</p>
        )}
      </div>
    </div>
  );
};

export default EnquirySearch;
