import React, { useState } from "react";

const EnquirySearch = () => {
  const [filters, setFilters] = useState({
    name: "",
    contact: "",
    fromDate: "",
    toDate: "",
    city: "",
    executive: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    console.log("Searching with filters:", filters);
  };

  return (
    <div className=" mx-auto">
      <h2 className="text-lg font-semibold text-gray-300mb-6">
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
            className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
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
            className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
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
            className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
          />
        </div>

        {/* Contact */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Contact *
          </label>
          <input
            type="text"
            name="contact"
            value={filters.contact}
            onChange={handleChange}
            className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
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
            className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
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
            className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
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
          className="bg-red-800 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-300transition"
        >
          Search
        </button>
        <button
          onClick={() =>
            setFilters({
              name: "",
              contact: "",
              fromDate: "",
              toDate: "",
              city: "",
              executive: "",
            })
          }
          className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </div>

      {/* Placeholder for Results */}
      <div className="mt-6 text-center text-gray-700 text-sm">
        There are no records to display
      </div>
    </div>
  );
};

export default EnquirySearch;
