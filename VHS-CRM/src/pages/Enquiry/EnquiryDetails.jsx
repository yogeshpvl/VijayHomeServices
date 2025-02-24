import React from "react";

const EnquiryDetail = () => {
  return (
    <div className=" min-h-screen  grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Section - Enquiry Details */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Enquiry Detail
        </h2>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gray-200 text-gray-700 text-sm px-4 py-2 font-semibold flex justify-between">
            <span>Modify | Delete</span>
          </div>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <tbody>
              <DetailRow label="Enquiry ID" value="100501" />
              <DetailRow label="Category" value="Pest Control" />
              <DetailRow label="Enquiry Date" value="02-16-2025" />
              <DetailRow label="Executive" value="Navya" />
              <DetailRow label="Name" value="Sid" />
              <DetailRow label="Contact 1" value="8618380332" isWhatsApp />
              <DetailRow label="Contact 2" value="-" />
              <DetailRow label="Email Id" value="-" />
              <DetailRow
                label="Address"
                value="22, Annasandrapalya Extension, Vinayaka Nagar, Vimanapura, Bengaluru, Karnataka 560017"
              />
              <DetailRow label="Reference" value="Customer Care" />
              <DetailRow label="Reference 2" value="-" />
              <DetailRow
                label="Interested For"
                value="Cockroach Pest Control"
              />
              <DetailRow label="Comment" value="-" />
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Section - Follow-Up Details */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Follow-Up Detail
        </h2>
        <table className="w-full mt-2 border border-gray-50 text-sm">
          <thead className="bg-gray-200">
            <tr className="border-b">
              <th className="p-2">Sr</th>
              <th className="p-2">Date</th>
              <th className="p-2">Staff</th>
              <th className="p-2">Response</th>
              <th className="p-2">Description</th>
              <th className="p-2">Value</th>
              <th className="p-2">Next Follow-up</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border border-gray-300  text-center">
              <td className="p-2">1</td>
              <td className="p-2">Sun, Feb 16, 2025 10:18 AM</td>
              <td className="p-2">Navya</td>
              <td className="p-2 text-green-600">Confirmed</td>
              <td className="p-2">Cockroach Pest Control</td>
              <td className="p-2 font-semibold">₹999</td>
              <td className="p-2 text-red-500">00/00/0000</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Staff Name" value="Pankaj" disabled />
            <InputField
              label="Follow-Up Date"
              value="Sun, Feb 16, 2025 10:26 AM"
              disabled
            />
            <TextArea label="Description" required />
            <SelectField label="Response" required />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, isWhatsApp }) => (
  <tr className="border-b border-gray-300">
    <td className="w-1/3 bg-gray-100 px-4 py-2 font-medium">{label}</td>
    <td className="w-2/3 px-4 py-2 flex items-center">
      {value} {isWhatsApp && <span className="ml-2">📱</span>}
    </td>
  </tr>
);

const InputField = ({ label, value, disabled }) => (
  <div>
    <label className="block text-gray-700 text-sm font-medium mb-1">
      {label}
    </label>
    <input
      type="text"
      value={value}
      disabled={disabled}
      className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"
    />
  </div>
);

const TextArea = ({ label, required }) => (
  <div>
    <label className="block text-gray-700 text-sm font-medium mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500"></textarea>
  </div>
);

const SelectField = ({ label, required }) => (
  <div>
    <label className="block text-gray-700 text-sm font-medium mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select className="w-full border bg-white border-gray-300 px-2 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder-gray-500">
      <option value="">-- Select --</option>
      <option value="Confirmed">Confirmed</option>
      <option value="Pending">Pending</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  </div>
);

export default EnquiryDetail;
