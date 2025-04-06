import React, { useState } from "react";
import axios from "axios";
import EnquiryService from "../../services/enquiryService";
import { useNavigate } from "react-router-dom";

const EnquirySearch = () => {
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
            <option value="Bangalore">Bangalore</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
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
            <option value="Pankaj">Pankaj</option>
            <option value="Siva N">Siva N</option>
            <option value="Jayashree">Jayashree</option>
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
          <table className="min-w-full bg-white border border-gray-200 text-sm shadow-sm">
            <thead className="bg-gray-0 text-gray-700">
              <tr className="bg-gray-200">
                <th className="border border-gray-200 px-3 py-2">Enquiry ID</th>
                <th className="border border-gray-200 px-3 py-2">Date</th>
                <th className="border border-gray-200 px-3 py-2">Time</th>
                <th className="border border-gray-200 px-3 py-2">Executive</th>
                <th className="border border-gray-200 px-3 py-2">Name</th>
                <th className="border border-gray-200 px-3 py-2">Mobile</th>
                <th className="border border-gray-200 px-3 py-2">City</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry) => (
                <tr
                  key={enquiry.enquiryId}
                  className="text-center cursor-pointer"
                  onClick={() => handleRowClick(enquiry.enquiryId)}
                >
                  <td className="border border-gray-200 px-3 py-2">
                    {enquiry.enquiryId}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {enquiry.date}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {enquiry.time}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {enquiry.executive}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {enquiry.name}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {enquiry.mobile}
                  </td>
                  <td className="border border-gray-200 px-3 py-2">
                    {enquiry.city}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-700 mt-4">No records found</p>
        )}
      </div>
    </div>
  );
};

export default EnquirySearch;
