import React from "react";

const EnquiryForm = () => {
  return (
    <div className=" mx-auto ">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">New Enquiry</h2>

      {/* Form Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Enquiry ID */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Enquiry ID:
          </label>
          <input
            type="text"
            value="99624"
            disabled
            className="w-full px-3 py-1 bg-gray-200 rounded-md"
          />
        </div>

        {/* Enquiry Date */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Enquiry Date:
          </label>
          <input
            type="text"
            value="02-12-2025"
            disabled
            className="w-full px-3 py-1 bg-gray-200 rounded-md"
          />
        </div>

        {/* Executive */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Executive *
          </label>
          <input
            type="text"
            value="Pankaj"
            disabled
            className="w-full px-3 py-1 bg-gray-200 rounded-md"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Name *
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 px-3 py-1 rounded-md focus:ring-red-600 focus:border-red-600"
          />
        </div>

        {/* Email ID */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Email ID *
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 px-3 py-1 rounded-md focus:ring-red-600 focus:border-red-600"
          />
        </div>

        {/* Contact 1 */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Contact 1 *
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 px-3 py-1 rounded-md focus:ring-red-600 focus:border-red-600"
          />
        </div>

        {/* Contact 2 */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Contact 2
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 px-3 py-1 rounded-md focus:ring-red-600 focus:border-red-600"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Address
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 px-3 py-1 rounded-md focus:ring-red-600 focus:border-red-600"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            City *
          </label>
          <select className="w-full border border-gray-300 px-3 py-1 rounded-md focus:ring-red-600 focus:border-red-600">
            <option>--Select--</option>
            <option>Bangalore</option>
            <option>Mumbai</option>
            <option>Delhi</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Category *
          </label>
          <select className="w-full border border-gray-300 px-3 py-1 rounded-md focus:ring-red-600 focus:border-red-600">
            <option>--Select--</option>
            <option>Pest Control</option>
            <option>Cleaning</option>
          </select>
        </div>

        {/* Reference */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Reference *
          </label>
          <select className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-red-600 focus:border-red-600">
            <option>--Select--</option>
            <option>Customer Care</option>
            <option>Website</option>
          </select>
        </div>

        {/* Reference 2 */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Reference 2
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 px-3 py-1.5 mt-1 rounded-md focus:ring-red-600 focus:border-red-600"
          />
        </div>

        {/* Reference 3 */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Reference 3
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 px-3 py-1 rounded-md focus:ring-red-600 focus:border-red-600"
          />
        </div>

        {/* Interested For */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Interested For *
          </label>
          <select className="w-full border border-gray-300 px-3 py-1 rounded-md focus:ring-red-600 focus:border-red-600">
            <option>--SELECT--</option>
            <option>Product 1</option>
            <option>Product 2</option>
          </select>
        </div>

        {/* Comment */}
        <div className="col-span-3">
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Comment
          </label>
          <textarea
            className="w-full border border-gray-300 px-3 py-1 rounded-md focus:ring-red-600 focus:border-red-600"
            rows="2"
          ></textarea>
        </div>
      </div>

      {/* Save & Cancel Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button className="bg-red-800 text-white px-6 py-2 rounded-md shadow-md hover:bg-red-900 transition">
          Save
        </button>
        <button className="bg-gray-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-600 transition">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EnquiryForm;
