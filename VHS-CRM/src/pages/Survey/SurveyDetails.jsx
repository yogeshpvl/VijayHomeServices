import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SurveyDetails = () => {
  const navigate = useNavigate();
  const [sendWhatsApp, setSendWhatsApp] = useState("yes");
  const [assignTo, setAssignTo] = useState("executive");
  const [formData, setFormData] = useState({
    enquiryDate: "2025-03-23",
    enquiryTime: "6:24:39 pm",
    appointmentDate: "2025-03-26",
    appointmentTime: "",
    vendor: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="mx-auto p-6 bg-white shadow-lg rounded-2xl font-poppins">
      {/* Header Actions */}
      <div className="flex justify-end gap-3 mb-4">
        <button className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition">
          Edit Details
        </button>
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700 transition"
          onClick={() => navigate("/Quote/quoteDetails/1")}
        >
          Quotation
        </button>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm bg-white p-6 rounded-xl shadow">
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Customer Name:</span> Gayatri
          </p>
          <p>
            <span className="font-semibold">Contact1:</span> 9880110584 ✅
          </p>
          <p>
            <span className="font-semibold">Address:</span> Crescent Luxuria
            Apartment, Bangalore
          </p>
          <p>
            <span className="font-semibold">Executive:</span>{" "}
            <span className="text-gray-500">-</span>
          </p>
        </div>
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Contact2:</span>{" "}
            <span className="text-gray-500">-</span>
          </p>
          <p>
            <span className="font-semibold">Customer Type:</span> Other
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            <span className="text-gray-500">-</span>
          </p>
          <p>
            <span className="font-semibold">Desc:</span> Exterior paint with all
            cleaning, water tank clean, patch filling from basement to 5th floor
          </p>
        </div>
      </div>

      {/* Job Information */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Job Information</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block mb-1 font-medium">Enquiry Date</label>
            <input
              type="date"
              name="enquiryDate"
              value={formData.enquiryDate}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Enquiry Time</label>
            <input
              type="text"
              name="enquiryTime"
              value={formData.enquiryTime}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Appointment Date</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Appointment Time</label>
            <select
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">--select--</option>
              <option value="10AM">10 AM</option>
              <option value="2PM">2 PM</option>
              <option value="4PM">4 PM</option>
            </select>
          </div>
        </div>
      </div>

      {/* Service Assignment */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">
          Service and Repair Information
        </h2>
        <div className="flex items-center gap-6 mb-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="executive"
              checked={assignTo === "executive"}
              onChange={(e) => setAssignTo(e.target.value)}
            />
            Executive Name
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="vendor"
              checked={assignTo === "vendor"}
              onChange={(e) => setAssignTo(e.target.value)}
            />
            Vendor
          </label>
        </div>

        {assignTo === "vendor" && (
          <div className="mb-4">
            <label className="block mb-1 font-medium text-sm">
              Vendor Name
            </label>
            <select
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-select-</option>
              <option value="Vendor A">Vendor A</option>
              <option value="Vendor B">Vendor B</option>
            </select>
          </div>
        )}
      </div>

      {/* WhatsApp Template */}
      <div className="mt-6">
        <label className="block font-medium text-sm mb-1">
          Send WhatsApp Template
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="yes"
              checked={sendWhatsApp === "yes"}
              onChange={(e) => setSendWhatsApp(e.target.value)}
            />{" "}
            YES
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="no"
              checked={sendWhatsApp === "no"}
              onChange={(e) => setSendWhatsApp(e.target.value)}
            />{" "}
            NO
          </label>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <button className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition text-sm">
          Save
        </button>
        <button className="bg-gray-400 text-white px-5 py-2 rounded-md hover:bg-gray-500 transition text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SurveyDetails;
